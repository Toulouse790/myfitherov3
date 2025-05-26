
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, Mail, Phone, MapPin } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Disclaimer Alert */}
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>⚠️ Document en cours de finalisation - Version provisoire</strong>
            <br />
            Cette politique de confidentialité sera complétée avec les détails spécifiques de l'entreprise. 
            Version actuelle conforme aux exigences RGPD de base.
          </AlertDescription>
        </Alert>

        {/* Header */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              POLITIQUE DE CONFIDENTIALITÉ
            </CardTitle>
            <div className="flex justify-center gap-4 text-sm text-muted-foreground">
              <Badge variant="outline">Version 2024.1</Badge>
              <span>MyFitHero</span>
            </div>
          </CardHeader>
        </Card>

        {/* Section 1 - Informations générales */}
        <Card>
          <CardHeader>
            <CardTitle>1. INFORMATIONS GÉNÉRALES</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold">Responsable de traitement :</h4>
              <div className="ml-4 space-y-1">
                <p><strong>MyFitHero</strong></p>
                <p className="text-muted-foreground">[Adresse complète à remplir]</p>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>dpo@myfithero.app</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span className="text-muted-foreground">[À remplir]</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold">Délégué à la Protection des Données (DPO) :</h4>
              <div className="ml-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>dpo@myfithero.app</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2 - Données collectées */}
        <Card>
          <CardHeader>
            <CardTitle>2. DONNÉES COLLECTÉES</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-blue-700">2.1 Données Personnelles</h4>
              <ul className="list-disc ml-6 space-y-1">
                <li><strong>Identification :</strong> Email, nom, prénom</li>
                <li><strong>Authentification :</strong> Mot de passe (chiffré), identifiants de session</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-red-700">2.2 Données de Santé (Article 9 RGPD)</h4>
              <ul className="list-disc ml-6 space-y-1">
                <li><strong>Données biométriques :</strong> Fréquence cardiaque, pression artérielle, poids, taille</li>
                <li><strong>Activité physique :</strong> Nombre de pas, calories brûlées, distance parcourue</li>
                <li><strong>Sommeil :</strong> Durée, qualité du sommeil, cycles de sommeil</li>
                <li><strong>Nutrition :</strong> Apports caloriques, macronutriments (si renseignés)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-green-700">2.3 Données de Géolocalisation</h4>
              <ul className="list-disc ml-6 space-y-1">
                <li><strong>Position GPS :</strong> Coordonnées précises pour recommandations météo</li>
                <li><strong>Historique de localisation :</strong> Parcours d'activités sportives</li>
                <li><strong>Zones d'activité :</strong> Lieux fréquents pour personnalisation</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700">2.4 Données Techniques</h4>
              <ul className="list-disc ml-6 space-y-1">
                <li><strong>Métadonnées :</strong> Horodatage, type d'appareil, version de l'application</li>
                <li><strong>Logs d'utilisation :</strong> Interactions avec l'interface, durée d'utilisation</li>
                <li><strong>Données de performance :</strong> Temps de réponse, erreurs techniques</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Section 3 - Finalités */}
        <Card>
          <CardHeader>
            <CardTitle>3. FINALITÉS DU TRAITEMENT</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold">3.1 Finalités Principales</h4>
              <ul className="list-disc ml-6 space-y-1">
                <li><strong>Suivi de santé personnalisé :</strong> Analyse de vos données biométriques</li>
                <li><strong>Recommandations personnalisées :</strong> Conseils basés sur vos objectifs et données</li>
                <li><strong>Coaching adaptatif :</strong> Intelligence artificielle pour optimiser votre entraînement</li>
                <li><strong>Intégration météo :</strong> Recommandations d'activités selon conditions météorologiques</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">3.2 Finalités Secondaires (avec consentement spécifique)</h4>
              <ul className="list-disc ml-6 space-y-1">
                <li><strong>Amélioration des services :</strong> Analyses statistiques anonymisées</li>
                <li><strong>Recherche en santé :</strong> Participation à des études (données anonymisées)</li>
                <li><strong>Marketing personnalisé :</strong> Communications ciblées (opt-in uniquement)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Section 4 - Bases légales */}
        <Card>
          <CardHeader>
            <CardTitle>4. BASES LÉGALES DU TRAITEMENT</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold">4.1 Consentement Explicite (Article 6.1.a + 9.2.a RGPD)</h4>
              <ul className="list-disc ml-6 space-y-1">
                <li><strong>Données de santé :</strong> Consentement libre, spécifique, éclairé et univoque</li>
                <li><strong>Géolocalisation :</strong> Consentement révocable à tout moment</li>
                <li><strong>Traitement par IA :</strong> Consentement pour analyse automatisée</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">4.2 Intérêt Légitime (Article 6.1.f RGPD)</h4>
              <ul className="list-disc ml-6 space-y-1">
                <li><strong>Sécurité des données :</strong> Protection contre fraude et accès non autorisés</li>
                <li><strong>Amélioration technique :</strong> Optimisation des performances de l'application</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">4.3 Exécution d'un Contrat (Article 6.1.b RGPD)</h4>
              <ul className="list-disc ml-6 space-y-1">
                <li><strong>Fourniture du service :</strong> Fonctionnalités essentielles de l'application</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Section 8 - Vos droits */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">8. VOS DROITS (Chapitre III RGPD)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold">8.1 Droit d'Accès (Article 15)</h4>
                <ul className="text-sm list-disc ml-4">
                  <li>Demande via email à dpo@myfithero.app</li>
                  <li>Réponse sous 30 jours</li>
                  <li>Format : Copie électronique structurée</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold">8.2 Droit de Rectification (Article 16)</h4>
                <ul className="text-sm list-disc ml-4">
                  <li>Correction des données inexactes</li>
                  <li>Modification directe dans l'application</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold">8.3 Droit à l'Effacement (Article 17)</h4>
                <ul className="text-sm list-disc ml-4">
                  <li>Suppression complète sous 30 jours</li>
                  <li>Exception : Logs de sécurité (obligation légale)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold">8.4 Droit à la Portabilité (Article 20)</h4>
                <ul className="text-sm list-disc ml-4">
                  <li>Export au format JSON structuré</li>
                  <li>Transfert direct vers autre service compatible</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 9 - Sécurité */}
        <Card>
          <CardHeader>
            <CardTitle>9. SÉCURITÉ DES DONNÉES (Article 32 RGPD)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold">9.1 Mesures Techniques</h4>
              <ul className="list-disc ml-6 space-y-1">
                <li><strong>Chiffrement :</strong> AES-256 pour données au repos, TLS 1.3 en transit</li>
                <li><strong>Authentification :</strong> Multi-facteurs disponible</li>
                <li><strong>Contrôles d'accès :</strong> Principe du moindre privilège</li>
                <li><strong>Audit trails :</strong> Traçabilité complète des accès</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">9.2 Mesures Organisationnelles</h4>
              <ul className="list-disc ml-6 space-y-1">
                <li><strong>Formation :</strong> Sensibilisation RGPD de tous les employés</li>
                <li><strong>Procédures :</strong> Plans de réponse aux incidents</li>
                <li><strong>Audits :</strong> Contrôles de sécurité trimestriels</li>
                <li><strong>Certifications :</strong> ISO 27001 (en cours)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Section 15 - Contact */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">15. CONTACT ET RÉCLAMATIONS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold">15.1 Contact DPO</h4>
              <div className="ml-4 space-y-1">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>dpo@myfithero.app</span>
                </div>
                <p className="text-sm text-muted-foreground">Délai de réponse : 30 jours maximum</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold">15.2 Autorité de Contrôle</h4>
              <div className="ml-4 space-y-1">
                <p><strong>CNIL :</strong> Commission Nationale de l'Informatique et des Libertés</p>
                <p><strong>Site web :</strong> www.cnil.fr</p>
                <p><strong>Plainte en ligne :</strong> https://www.cnil.fr/fr/plaintes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="pt-6 text-center text-sm text-muted-foreground">
            <p><strong>Cette politique de confidentialité respecte le RGPD et les exigences HIPAA applicables.</strong></p>
            <p>Elle doit être révisée par un juriste spécialisé avant publication.</p>
            <div className="mt-2 space-y-1">
              <p><strong>Date de dernière révision juridique :</strong> [À compléter]</p>
              <p><strong>Prochaine révision prévue :</strong> [6 mois après publication]</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;
