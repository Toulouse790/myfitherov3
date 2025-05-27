
import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Search, Package, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface ScannedProduct {
  barcode: string;
  name: string;
  brand?: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  servingSize: number;
  servingUnit: string;
}

interface BarcodeScannerProps {
  onProductFound: (product: ScannedProduct) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onProductFound }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Mock nutritional database
  const nutritionalDatabase: Record<string, ScannedProduct> = {
    '3017620422003': {
      barcode: '3017620422003',
      name: 'Nutella',
      brand: 'Ferrero',
      calories: 539,
      proteins: 6.3,
      carbs: 57.5,
      fats: 30.9,
      servingSize: 100,
      servingUnit: 'g'
    },
    '8000500037560': {
      barcode: '8000500037560',
      name: 'Pâtes Barilla',
      brand: 'Barilla',
      calories: 359,
      proteins: 13,
      carbs: 72,
      fats: 1.5,
      servingSize: 100,
      servingUnit: 'g'
    },
    '7613031842644': {
      barcode: '7613031842644',
      name: 'Eau Evian',
      brand: 'Evian',
      calories: 0,
      proteins: 0,
      carbs: 0,
      fats: 0,
      servingSize: 500,
      servingUnit: 'ml'
    }
  };

  const startCamera = async () => {
    try {
      setIsScanning(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Erreur accès caméra:', error);
      toast.error('Impossible d\'accéder à la caméra', {
        description: 'Vérifiez les permissions de votre navigateur'
      });
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const searchProduct = async (barcode: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const product = nutritionalDatabase[barcode];
      if (product) {
        onProductFound(product);
        toast.success('Produit trouvé !', {
          description: `${product.name} - ${product.calories} kcal`
        });
        setManualBarcode('');
      } else {
        toast.error('Produit non trouvé', {
          description: 'Code-barres non reconnu dans notre base de données'
        });
      }
    } catch (error) {
      toast.error('Erreur de recherche', {
        description: 'Impossible de rechercher le produit'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSearch = () => {
    if (manualBarcode.trim()) {
      searchProduct(manualBarcode.trim());
    }
  };

  // Simulate barcode detection after 3 seconds of scanning
  React.useEffect(() => {
    if (isScanning) {
      const timer = setTimeout(() => {
        const barcodes = Object.keys(nutritionalDatabase);
        const randomBarcode = barcodes[Math.floor(Math.random() * barcodes.length)];
        searchProduct(randomBarcode);
        stopCamera();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isScanning]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Scanner de code-barres
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isScanning ? (
          <div className="space-y-4">
            <video
              ref={videoRef}
              className="w-full h-48 bg-black rounded-lg object-cover"
              autoPlay
              playsInline
            />
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Dirigez la caméra vers le code-barres
              </p>
              <Button variant="outline" onClick={stopCamera}>
                Arrêter le scan
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Button onClick={startCamera} className="w-full">
              <Camera className="mr-2 h-4 w-4" />
              Scanner avec la caméra
            </Button>
            
            <div className="relative">
              <div className="text-center text-sm text-muted-foreground mb-2">
                ou saisir manuellement
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Code-barres (ex: 3017620422003)"
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
                />
                <Button 
                  onClick={handleManualSearch}
                  disabled={isLoading || !manualBarcode.trim()}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p className="font-medium mb-1">Codes-barres de test :</p>
          <ul className="space-y-1">
            <li>• 3017620422003 (Nutella)</li>
            <li>• 8000500037560 (Pâtes Barilla)</li>
            <li>• 7613031842644 (Eau Evian)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarcodeScanner;
