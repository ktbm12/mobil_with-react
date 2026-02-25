import axios from 'axios';
import { Platform } from 'react-native';

// ----- EXPLICATION POUR VOTRE APPRENTISSAGE -----
// En développement local avec React Native :
// - Si vous utilisez l'émulateur Android, "localhost" ou "127.0.0.1" pointe vers l'émulateur lui-même.
//   Pour accéder au serveur de développement Django (qui tourne sur votre machine physique),
//   il faut utiliser l'adresse spéciale "10.0.2.2".
// - Si vous testez sur un appareil physique ou sur le web, il faut l'IP réseau de votre ordinateur ou localhost.
//
// Ici on configure automatiquement l'URL de base selon la plateforme.
// --------------------------------------------------

const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000/api'; // Adresse magique d'Android vers le localhost de la machine hôte
  }
  // Pour iOS, Web, ou si on utilise un vrai device (il faudrait alors mettre votre vraie IP locale Ex: 192.168.x.x)
  return 'http://127.0.0.1:8000/api'; 
};

// Création de l'instance Axios
// Axios est la bibliothèque standard de l'industrie pour faire des appels HTTP (plus robuste que fetch)
const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 5000, // Annule la requête si le serveur ne répond pas après 5 secondes
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Facultatif: Intercepteurs pour faciliter le débogage
// Ce code s'exécutera à chaque requête envoyée, parfait pour voir ce qui se passe dans la console.
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    // Si la requête réussit, on renvoie directement les données (response.data)
    return response;
  },
  (error) => {
    console.error('[API Error]', error?.response?.status, error?.message);
    return Promise.reject(error);
  }
);

export default apiClient;
