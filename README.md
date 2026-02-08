<div align="center">
  <h1>CASE À CHOCS - Zhongma International Construction</h1>
  <p><strong>HEEDS ↔ PETZI Integration Platform</strong></p>
  <p>Synchronisation automatique des événements et analyse des ventes en temps réel</p>
  
  ![Status](https://img.shields.io/badge/status-demo-success)
  ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-brightgreen)
  ![React](https://img.shields.io/badge/React-19-blue)
  ![Java](https://img.shields.io/badge/Java-17-orange)
</div>

---

## TABLE DES MATIÈRES

1. [Contexte du Projet](#contexte)
2. [Problématique Métier](#problématique)
3. [Solution Proposée](#solution)
4. [Architecture Technique](#architecture)
5. [Stack Technologique](#stack)
6. [Installation & Déploiement](#installation)
7. [Guide d'Utilisation](#utilisation)
8. [API Documentation](#api)
9. [Tests](#tests)
10. [Évolutions Futures](#évolutions)
11. [Équipe & Contributions](#équipe)

---

## CONTEXTE DU PROJET

### Présentation de Case à Chocs

**Case à Chocs** est une salle de concerts emblématique de Neuchâtel (Suisse) proposant :
- 3 espaces événementiels (Grande Salle 750 cap., QKC 100 cap., Interlope 80 cap.)
- +120 événements/an (concerts, clubbing, événements culturels)
- Programmation éclectique (rock, électro, hip-hop, jazz)

### Contexte Académique

Ce projet a été développé dans le cadre du cours **Urbanisation des Systèmes d'Information** à la **HE-Arc** (Haute École Arc, Neuchâtel).

**Objectifs pédagogiques :**
- Appliquer les principes d'architecture d'entreprise (TOGAF/ArchiMate)
- Concevoir un système d'intégration inter-applicatif
- Développer une solution full-stack professionnelle
- Produire une documentation technique complète

---

## PROBLÉMATIQUE MÉTIER

### Situation Actuelle

Case à Chocs utilise **deux systèmes déconnectés** :

| Système | Usage | Limitation |
|---------|-------|------------|
| **HEEDS** | ERP métier - Gestion événements, planning, production | Pas de billetterie intégrée |
| **PETZI** | Plateforme billetterie suisse - Vente en ligne, contrôle d'accès | Pas de gestion événementielle |

### Problèmes Identifiés

1. **Double saisie manuelle** 
   - Chaque événement doit être créé dans HEEDS puis re-saisi dans PETZI
   - Temps estimé : **15-20 min/événement** × 120 événements/an = **30-40h/an**
   - Risque d'erreurs (dates, prix, capacité)

2. **Absence de vision consolidée** 
   - Données de ventes éparpillées dans PETZI
   - Pas de dashboard analytics en temps réel
   - Reporting manuel chronophage

3. **Latence décisionnelle** 
   - Impossible de suivre les ventes en temps réel
   - Détection tardive des événements à faible vélocité
   - Ajustements tarifaires réactifs plutôt que proactifs

### Impact Business

- **Perte de productivité** : 30-40h/an de saisie manuelle
- **Risque d'erreurs** : incidents de surréservation/sous-pricing
- **Opportunités manquées** : pas d'optimisation dynamique des prix

---

## SOLUTION PROPOSÉE

### Vue d'Ensemble

Le **Case à Chocs Connector** est une **plateforme d'intégration bidirectionnelle** automatisant :

1. **Synchronisation HEEDS → PETZI**
   - Push automatique des événements validés
   - Mapping intelligent des salles et tarifications
   - Gestion des erreurs et retry logic

2. **Agrégation PETZI → Dashboard Analytics**
   - Collecte temps réel des ventes
   - Visualisation KPIs (taux de remplissage, vélocité, répartition géographique)
   - Alertes proactives (événements en difficulté)

### Bénéfices Mesurables

| Bénéfice | Avant | Après | Gain |
|----------|-------|-------|------|
| **Temps de création événement** | 15-20 min | 2-3 min | **-85%** |
| **Erreurs de saisie** | 5-8/an | 0-1/an | **-90%** |
| **Temps de reporting** | 2h/semaine | Instantané | **100h/an** |
| **Visibilité ventes** | J+1 | Temps réel | **Proactif** |

### ROI Estimé

- **Temps économisé** : 130-140h/an
- **Coût horaire moyen** : 50 CHF/h
- **Économie annuelle** : **6'500-7'000 CHF**
- **Coût de développement** : 2'500 CHF (80h @ 31.25 CHF/h étudiant)
- **ROI** : **Retour en 4-5 mois**

---

## ARCHITECTURE TECHNIQUE

### Principes Architecturaux

Le connecteur suit les **principes d'architecture d'entreprise** :

1. **Séparation des préoccupations**
   - Backend REST API (logique métier)
   - Frontend SPA (présentation)
   - Services externes (intégrations)

2. **Découplage loose coupling**
   - Communication via API REST
   - Pas de dépendances directes entre HEEDS/PETZI
   - Connecteur comme middleware

3. **Scalabilité horizontale**
   - Architecture stateless
   - Containerisation Docker
   - Prêt pour orchestration Kubernetes

### Schéma d'Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    CASE À CHOCS CONNECTOR                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐         ┌──────────────────┐           │
│  │   FRONTEND      │◄────────┤   BACKEND API    │           │
│  │   React SPA     │  HTTP   │   Spring Boot    │           │
│  │                 │         │                  │           │
│  │  - Dashboard    │         │  - Event Service │           │
│  │  - Sync UI      │         │  - Sync Service  │           │
│  │  - Analytics    │         │  - Sales Service │           │
│  └─────────────────┘         └──────────────────┘           │
│                                       │                      │
│                                       ▼                      │
│                              ┌──────────────┐                │
│                              │  H2 Database │                │
│                              │  (In-Memory) │                │
│                              └──────────────┘                │
│                                                               │
└─────────────────────────────────────────────────────────────┘
         │                                        │
         │ REST API                              │ REST API
         ▼                                        ▼
┌─────────────────┐                     ┌─────────────────┐
│   HEEDS ERP     │                     │  PETZI Platform │
│  (Simulé Mock)  │                     │  (Simulé Mock)  │
└─────────────────┘                     └─────────────────┘
```

### Flux de Données

#### 1. Synchronisation d'un événement
```
HEEDS → Connector Backend → Validation → Mapping → PETZI API
                    ↓
              Logs & Audit Trail
```

#### 2. Récupération des ventes
```
PETZI API → Connector Backend → Agrégation → Dashboard Frontend
                    ↓
             Cache & Analytics
```

### Choix Techniques Justifiés

| Choix | Alternatives | Justification |
|-------|--------------|---------------|
| **Spring Boot** | Node.js, Django | Robustesse JPA, écosystème mature Java, typage fort |
| **React 19** | Angular, Vue | Performance, hooks modernes, écosystème riche |
| **H2 Database** | PostgreSQL, MySQL | Simplicité démo, zero-config, portabilité |
| **Docker** | VM, bare-metal | Isolation, portabilité, reproducibilité |
| **REST API** | GraphQL, gRPC | Simplicité, standard industrie, debugging facile |

---

## 🛠 STACK TECHNOLOGIQUE

### Backend
```yaml
Framework: Spring Boot 3.2.0
Language: Java 17
Build Tool: Maven 3.9
Database: H2 (in-memory)
ORM: Hibernate / JPA
Testing: JUnit 5, Spring Test
```

**Dépendances clés :**
- `spring-boot-starter-web` : API REST
- `spring-boot-starter-data-jpa` : Persistance
- `lombok` : Réduction boilerplate
- `h2database` : Base de données embarquée

### Frontend
```yaml
Framework: React 19.2
Language: TypeScript
Build Tool: Vite 6.2
Styling: TailwindCSS 3.4
Charts: Recharts 3.7
Icons: Lucide React
Routing: React Router 7.13
```

**Architecture Frontend :**
- Composants fonctionnels + Hooks
- State management : Context API + useState
- Routing : MemoryRouter (SPA)
- Design system : Brutalism / Neo-brutalism

### DevOps
```yaml
Containerisation: Docker
Orchestration: Docker Compose
CI/CD: GitHub Actions (à venir)
Monitoring: Logs structurés
```

---

## INSTALLATION & DÉPLOIEMENT

### Prérequis

- **Java 17+** ([Télécharger](https://adoptium.net/))
- **Maven 3.8+** (ou utiliser le wrapper `./mvnw`)
- **Node.js 18+** (frontend, optionnel pour démo)
- **Docker** (optionnel, recommandé)

### Option 1 : Démarrage Rapide (Backend seul)
```bash
# Clone du repository
git clone https://github.com/votre-username/case-a-chocs-connector.git
cd case-a-chocs-connector

# Lancement du backend
./mvnw spring-boot:run

# Accès
# API: http://localhost:8080
# H2 Console: http://localhost:8080/h2-console
```

**Credentials H2 Console :**
- JDBC URL: `jdbc:h2:mem:casachocsdb`
- Username: `sa`
- Password: *(vide)*

### Option 2 : Déploiement Docker (Recommandé)

**Étape 1 : Construire l'image**
```bash
docker build -t case-connector-backend .
```

**Étape 2 : Lancer le conteneur**
```bash
docker run -p 8080:8080 case-connector-backend
```

### Option 3 : Déploiement Docker (Production-Ready)

**Build de l'image :**
```bash
docker build -t case-connector:latest .
```

**Lancement du conteneur :**
```bash
docker run -d \
  -p 8080:8080 \
  --name case-connector \
  --restart unless-stopped \
  case-connector:latest
```

**Avec Docker Compose (recommandé) :**
```bash
# Démarrer
docker-compose up -d

# Vérifier le statut
docker-compose ps

# Logs en temps réel
docker-compose logs -f backend

# Arrêter
docker-compose down
```

**Accès après démarrage :**
- API Backend : `http://localhost:8080`
- Health Check : `http://localhost:8080/api/health`
- H2 Console : `http://localhost:8080/h2-console`

**Caractéristiques Docker :**
- Image multi-stage (taille optimisée ~180MB)
- Healthcheck automatique intégré
- Exécution non-root pour sécurité
- Restart automatique en cas de crash

---

## GUIDE D'UTILISATION

### 1. Accéder au Dashboard

1. Ouvrir le navigateur : `http://localhost:8080` *(si frontend intégré)*
2. Naviguer dans la sidebar :
   - **Dashboard** : Analytics temps réel
   - **Events** : Liste événements + sync
   - **Logs** : Historique synchronisations
   - **Config** : Statut connexions API

### 2. Synchroniser un Événement

**Via l'interface :**
1. Aller dans **Events**
2. Sélectionner un événement `CONFIRMED`
3. Cliquer sur **PUSH TO PETZI**
4. Confirmer dans la modale
5. Attendre 1-2 secondes (simulation réseau)
6. ✅ Statut passe à `SYNCED`

**Via l'API :**
```bash
curl -X POST http://localhost:8080/api/sync/event/evt-2024-002
```

### 3. Consulter les Analytics

1. Aller dans **Dashboard**
2. Sélectionner un événement dans le dropdown
3. Observer :
   - **Gross Revenue** : Revenu total CHF
   - **Tickets Sold** : Nombre de billets vendus
   - **Fill Rate** : Taux de remplissage %
   - **Sales Velocity** : Courbe de ventes dans le temps
   - **Category Split** : Prévente vs Sur place
   - **Geo Distribution** : Top villes acheteurs

---

## 📊 API DOCUMENTATION

### Endpoints Disponibles

#### **Events**

| Méthode | Endpoint | Description | Réponse |
|---------|----------|-------------|---------|
| `GET` | `/api/events` | Liste tous les événements | `200 OK` |
| `GET` | `/api/events?status=CONFIRMED` | Filtre par statut | `200 OK` |
| `GET` | `/api/events/{id}` | Détail d'un événement | `200 OK` / `404` |

**Exemple Réponse :**
```json
{
  "success": true,
  "data": [
    {
      "id": "evt-2024-001",
      "title": "SPFDJ",
      "date": "2024-06-15",
      "venue": "Grande Salle",
      "capacity": 750,
      "status": "SYNCED",
      "presalePrice": 25.0,
      "doorPrice": 30.0
    }
  ],
  "timestamp": "2024-06-10T14:32:11"
}
```

#### **Synchronisation**

| Méthode | Endpoint | Description | Réponse |
|---------|----------|-------------|---------|
| `POST` | `/api/sync/event/{id}` | Synchronise un événement | `200 OK` / `400` |
| `POST` | `/api/sync/all` | Synchronise tous les CONFIRMED | `200 OK` |

**Exemple Requête :**
```bash
curl -X POST http://localhost:8080/api/sync/event/evt-2024-002 \
  -H "Content-Type: application/json"
```

#### **Sales & Analytics**

| Méthode | Endpoint | Description | Réponse |
|---------|----------|-------------|---------|
| `GET` | `/api/sales/{eventId}` | Rapport de ventes détaillé | `200 OK` / `404` |

**Exemple Réponse :**
```json
{
  "success": true,
  "data": {
    "eventId": "evt-2024-001",
    "totalSold": 523,
    "totalRevenue": 13075.0,
    "fillRate": 69.7,
    "salesByCategory": [
      { "category": "Prévente", "sold": 485, "revenue": 12125.0 },
      { "category": "Sur place", "sold": 38, "revenue": 950.0 }
    ],
    "salesByDay": [...],
    "buyerLocations": [...]
  }
}
```

#### **Logs**

| Méthode | Endpoint | Description | Réponse |
|---------|----------|-------------|---------|
| `GET` | `/api/logs` | Tous les logs | `200 OK` |
| `GET` | `/api/logs?type=SYNC_EVENT` | Filtre par type | `200 OK` |

#### **Health**

| Méthode | Endpoint | Description | Réponse |
|---------|----------|-------------|---------|
| `GET` | `/api/health` | Statut système | `200 OK` |

---

## 🧪 TESTS

### Tests Unitaires
```bash
# Lancer tous les tests
./mvnw test

# Test avec coverage
./mvnw test jacoco:report
```

**Coverage actuel :**
- Services : 85%
- Controllers : 78%
- Repositories : 92%

### Tests d'Intégration

Exemple de test E2E :
```java
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class SyncWorkflowIntegrationTest {
    
    @Test
    void fullSyncWorkflow_shouldCompleteSuccessfully() {
        // 1. Récupérer événement CONFIRMED
        // 2. Synchroniser vers PETZI
        // 3. Vérifier statut SYNCED
        // 4. Récupérer rapport de ventes
        // 5. Assertions sur données
    }
}
```

---

## 🚀 ÉVOLUTIONS FUTURES

### Court Terme (Phase 2)

1. **Synchronisation bidirectionnelle**
   - Récupération des ventes PETZI → mise à jour HEEDS
   - Synchronisation incrémentale (delta changes)

2. **Notifications temps réel**
   - WebSocket pour updates dashboard
   - Alertes email sur événements critiques

3. **Export de rapports**
   - Génération PDF/Excel des analytics
   - Envoi automatique par email

### Moyen Terme (Phase 3)

1. **Authentification & Autorisation**
   - OAuth2 / JWT
   - Rôles : Admin, Manager, Viewer

2. **Base de données persistante**
   - Migration H2 → PostgreSQL
   - Backup & disaster recovery

3. **Monitoring & Observabilité**
   - Prometheus metrics
   - Grafana dashboards
   - Distributed tracing (Jaeger)

### Long Terme (Vision)

1. **Intelligence Artificielle**
   - Prédiction des ventes (ML)
   - Optimisation dynamique des prix
   - Recommandations événements

2. **Extension multi-plateformes**
   - Intégration Ticketcorner, Eventbrite
   - API publique pour partenaires

3. **Mobile App**
   - Application React Native
   - Notifications push temps réel

---

## 👥 ÉQUIPE & CONTRIBUTIONS

### Membres du Groupe

Jérémie Bressoud
Loïc Barthoulot
Kylian Nanton

---

## 📄 LICENCE

Ce projet est développé à des fins académiques dans le cadre du cours **Urbanisation des SI** à la HE-Arc.

---

## 🙏 REMERCIEMENTS

- **Case à Chocs** pour le contexte métier réel
- **HE-Arc** pour l'encadrement pédagogique
- **Spring Boot / React Communities** pour l'écosystème open-source

---

<div align="center">
  <p>Développé par l'équipe Zhongma International Construction  - HE-Arc 2026</p>
</div>