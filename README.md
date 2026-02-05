<div align="center">
  <h1>⚡ CASE À CHOCS CONNECTOR</h1>
  <p><strong>HEEDS ↔ PETZI Integration Platform</strong></p>
  <p>Synchronisation automatique des événements et analyse des ventes en temps réel</p>
  
</div>

---

## 🎯 Contexte

Ce projet a été développé dans le cadre du cours **Urbanisation des Systèmes d'Information** à la HE-Arc.

**Case à Chocs** est une salle de concerts à Neuchâtel (CH) qui utilise :
- **HEEDS** : ERP métier pour la gestion des événements
- **PETZI** : Plateforme de billetterie suisse

**Problème identifié** : Double saisie manuelle des événements, pas de dashboard de ventes.

**Solution** : Connecteur automatisant la synchronisation et offrant des analytics en temps réel.

---

## 🚀 Fonctionnalités

### Synchronisation HEEDS → PETZI
- Push automatique des événements
- Mapping des salles (Grande Salle, QKC, Interlope)
- Création des catégories de billets (Prévente / Sur place)
- Logs de synchronisation

### Dashboard Analytics
- Courbe de ventes en temps réel
- Taux de remplissage
- Répartition par catégorie de billets
- Top villes des acheteurs

### Monitoring
- Statut des connexions API
- Historique des synchronisations
- Alertes en cas d'erreur

---

## 🛠 Stack Technique

| Composant | Technologie |
|-----------|-------------|
| **Frontend** | React 19, TypeScript, Tailwind CSS, Recharts |
| **Backend** | Java 17, Spring Boot 3.2 |
| **Build** | Vite (frontend), Maven (backend) |
| **Containerisation** | Docker, Docker Compose |

---

## 📦 Installation

### Prérequis
- Java 17+
- Maven (optional, wrapper included)

### Lancement du Backend

```bash
./mvnw spring-boot:run
```

Le serveur démarrera sur `http://localhost:8080`.

---

## 📊 API Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/events` | Liste des événements |
| GET | `/api/events/{id}` | Détail d'un événement |
| POST | `/api/sync/event/{id}` | Synchroniser un événement |
| GET | `/api/sales/{eventId}` | Rapport de ventes |
| GET | `/api/logs` | Logs de synchronisation |
| GET | `/api/health` | Statut système |

---

## 👥 Équipe

**Cours** : Urbanisation des SI - HE-Arc 2024

---

## 📄 Licence

Ce projet est développé à des fins académiques.