
export interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  name: string;
}

export interface Location {
  lat: number;
  lon: number;
}

export class WeatherService {
  private cache = new Map<string, { data: WeatherData; timestamp: number }>();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  async getCurrentWeather(location?: Location): Promise<WeatherData> {
    console.log('🌤️ Récupération des données météo...');
    
    // Géolocalisation automatique si pas de coordonnées
    if (!location) {
      location = await this.getUserLocation();
    }
    
    const cacheKey = `${location.lat}-${location.lon}`;
    
    // Vérification du cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      const isExpired = Date.now() - cached.timestamp > this.CACHE_DURATION;
      
      if (!isExpired) {
        console.log('☁️ Données météo récupérées depuis le cache');
        return cached.data;
      }
    }

    try {
      // API météo principale (OpenWeatherMap)
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=demo&units=metric&lang=fr`
      );
      
      if (!response.ok) {
        throw new Error(`API météo indisponible: ${response.status}`);
      }
      
      const weather = await response.json();
      
      // Mise en cache
      this.cache.set(cacheKey, {
        data: weather,
        timestamp: Date.now()
      });
      
      console.log('🌍 Données météo récupérées depuis l\'API');
      return weather;
    } catch (error) {
      console.warn('⚠️ Erreur API météo, utilisation du fallback:', error);
      
      // Fallback avec données mockées réalistes
      return this.getMockWeather(location);
    }
  }

  private async getUserLocation(): Promise<Location> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        console.log('📍 Géolocalisation non supportée, utilisation de Paris par défaut');
        resolve({ lat: 48.8566, lon: 2.3522 }); // Paris par défaut
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('📍 Position utilisateur récupérée');
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.warn('📍 Erreur géolocalisation, utilisation de Paris:', error);
          resolve({ lat: 48.8566, lon: 2.3522 }); // Paris par défaut
        },
        { timeout: 5000 }
      );
    });
  }

  private getMockWeather(location: Location): WeatherData {
    // Génère des données météo réalistes selon la saison
    const month = new Date().getMonth();
    const isWinter = month === 11 || month === 0 || month === 1;
    const isSummer = month >= 5 && month <= 8;
    
    let temp: number;
    let weatherType: string;
    
    if (isWinter) {
      temp = Math.random() * 10 + 2; // 2-12°C
      weatherType = Math.random() > 0.7 ? 'Rain' : 'Clouds';
    } else if (isSummer) {
      temp = Math.random() * 15 + 20; // 20-35°C
      weatherType = Math.random() > 0.8 ? 'Rain' : 'Clear';
    } else {
      temp = Math.random() * 15 + 10; // 10-25°C
      weatherType = Math.random() > 0.6 ? 'Clouds' : 'Clear';
    }

    console.log('🎭 Données météo mockées générées');
    
    return {
      main: {
        temp: Math.round(temp),
        feels_like: Math.round(temp + (Math.random() * 4 - 2)),
        humidity: Math.round(Math.random() * 40 + 40) // 40-80%
      },
      weather: [{
        main: weatherType,
        description: this.getWeatherDescription(weatherType),
        icon: this.getWeatherIcon(weatherType)
      }],
      wind: {
        speed: Math.round(Math.random() * 20) // 0-20 km/h
      },
      name: 'Ville (Mode hors ligne)'
    };
  }

  private getWeatherDescription(type: string): string {
    const descriptions = {
      'Clear': 'ciel dégagé',
      'Clouds': 'nuageux',
      'Rain': 'pluie',
      'Snow': 'neige',
      'Thunderstorm': 'orage'
    };
    return descriptions[type as keyof typeof descriptions] || 'temps variable';
  }

  private getWeatherIcon(type: string): string {
    const icons = {
      'Clear': '01d',
      'Clouds': '03d',
      'Rain': '10d',
      'Snow': '13d',
      'Thunderstorm': '11d'
    };
    return icons[type as keyof typeof icons] || '01d';
  }
}
