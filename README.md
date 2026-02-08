<div align="center">
  <h1>CASE À CHOCS CONNECTOR</h1>
  <p><strong>HEEDS ↔ PETZI Integration Platform</strong></p>
  <p>Synchronisation automatique des événements et analyse des ventes en temps réel</p>
  
  ![Build](https://img.shields.io/badge/build-passing-brightgreen)
  ![Coverage](https://img.shields.io/badge/coverage-85%25-green)
  ![Java](https://img.shields.io/badge/Java-17-orange)
  ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-brightgreen)
  ![React](https://img.shields.io/badge/React-19-blue)
  ![Docker](https://img.shields.io/badge/Docker-ready-2496ED)
  ![License](https://img.shields.io/badge/license-Academic-yellow)
</div>

---

## TABLE DES MATIÈRES

1. [Contexte du Projet](#-contexte-du-projet)
2. [Problématique Métier](#-problématique-métier)
3. [Solution Proposée](#-solution-proposée)
4. [Architecture Technique](#-architecture-technique)
5. [Stack Technologique](#-stack-technologique)
6. [Installation & Déploiement](#-installation--déploiement)
7. [Guide d'Utilisation](#-guide-dutilisation)
8. [API Documentation](#-api-documentation)
9. [Tests](#-tests)
10. [Évolutions Futures](#-évolutions-futures)
11. [Équipe & Contributions](#-équipe--contributions)
12. [Licence](#-licence)

---

## CONTEXTE DU PROJET

### Présentation de Case à Chocs

**Case à Chocs** est une salle de concerts emblématique de Neuchâtel (Suisse) proposant une programmation culturelle diversifiée depuis plus de 40 ans. Véritable institution de la scène musicale suisse romande, elle accueille artistes émergents et têtes d'affiche internationales dans trois espaces événementiels :

| Salle | Capacité | Type d'événements |
|-------|----------|-------------------|
| **Grande Salle** | 750 personnes | Concerts rock, électro, hip-hop |
| **QKC** | 100 personnes | Sets intimistes, DJ sets, performances live |
| **Interlope** | 80 personnes | Jazz, concerts acoustiques, soirées thématiques |

**Chiffres clés :**
- **120+ événements par an** (concerts, clubbing, événements culturels)
- **40'000+ spectateurs annuels**
- **80% de taux de remplissage moyen**
- **Programmation éclectique** : rock, électro, hip-hop, jazz, performances expérimentales

### Contexte Académique

Ce projet a été développé dans le cadre du cours **Urbanisation des Systèmes d'Information** à la **HE-Arc** (Haute École Arc, Neuchâtel) durant le semestre de printemps 2026.

**Objectifs pédagogiques :**
- Appliquer les principes d'**architecture d'entreprise** (TOGAF/ArchiMate)
- Concevoir un **système d'intégration inter-applicatif** répondant à un besoin métier réel
- Développer une **solution full-stack professionnelle** avec technologies modernes
- Produire une **documentation technique complète** de niveau entreprise
- Démontrer la **création de valeur business** par l'IT (calcul ROI)

**Livrables attendus :**
- Application fonctionnelle (frontend + backend)
- Diagrammes ArchiMate (Motivation, Business, Application, Technology, Implementation)
- Rapport technique (ce README.md)
- Présentation orale de 10 minutes

---

## PROBLÉMATIQUE MÉTIER

### Situation Actuelle

Case à Chocs utilise **deux systèmes informatiques déconnectés** pour gérer ses événements :

| Système | Éditeur | Usage principal | Forces | Limitations |
|---------|---------|-----------------|--------|-------------|
| **HEEDS** | Logiciel métier suisse | ERP de gestion événementielle : planning, production, budgets, logistics | - Spécialisé spectacle vivant<br>- Gestion complète production<br>- Suivi budgétaire détaillé | Pas de billetterie intégrée<br> Pas de vente en ligne<br> Pas de contrôle d'accès |
| **PETZI** | Plateforme suisse | Billetterie en ligne : vente, paiement, e-tickets, contrôle d'accès | - Leader billetterie CH<br>- Vente en ligne 24/7<br>- E-tickets + QR codes<br>- Interface public moderne | Pas de gestion événementielle<br> Pas de suivi production<br> Analytics limités |

**Conséquence :** Les deux systèmes ne communiquent pas, créant une **rupture dans la chaîne de valeur**.

### Problèmes Identifiés et Chiffrés

#### 1 **Double saisie manuelle chronophage**

**Processus actuel :**
1. L'équipe crée un événement dans **HEEDS** (infos artistiques, production, budget)
2. Une fois validé, l'événement doit être **re-saisi manuellement** dans **PETZI** (titre, date, lieu, tarifs, capacité)
3. Toute modification nécessite une **double mise à jour**

**Impact chiffré :**
- **Temps par événement** : 15-20 minutes de saisie manuelle
- **Fréquence** : 120 événements/an
- **Temps total perdu** : **30-40 heures/an**
- **Coût** : 30h × 50 CHF/h = **1'500-2'000 CHF/an** en temps de travail

**Risques associés :**
- Erreurs de saisie (mauvais prix, mauvaise capacité) → incidents de surréservation
- Incohérences entre systèmes → confusion équipe/public
- Événements oubliés ou saisis en retard → perte de ventes

#### 2 **Absence de vision consolidée des ventes**

**Situation :**
- Les données de ventes sont **éparpillées** dans PETZI
- Pas de **dashboard analytics en temps réel**
- Reporting manuel via exports Excel chronophages

**Impact :**
- **2 heures/semaine** pour générer rapports manuels = **100h/an**
- Impossibilité de suivre la **vélocité de ventes** en temps réel
- Pas d'**alertes proactives** sur événements en difficulté
- Décisions tarifaires **réactives** au lieu de proactives

#### 3 **Latence décisionnelle**

**Exemples concrets :**
- Un événement se vend mal → détection tardive (J-7 au lieu de J-30)
- Impossibilité d'ajuster dynamiquement les prix (early bird, last minute)
- Pas de ciblage géographique (villes d'où viennent les acheteurs)

**Opportunités manquées :**
- Optimisation tarifaire dynamique
- Campagnes marketing ciblées
- Identification rapide des événements à risque

### Impact Business Global

| Impact | Quantification |
|--------|----------------|
| **Perte de productivité** | 130-140h/an de travail manuel |
| **Coût salarial** | 6'500-7'000 CHF/an |
| **Risque opérationnel** | 5-8 incidents/an (erreurs saisie) |
| **Opportunités manquées** | Non quantifiable (pricing dynamique, marketing ciblé) |

---

## SOLUTION PROPOSÉE

### Vue d'Ensemble

Le **Case à Chocs Connector** est une **plateforme d'intégration bidirectionnelle** qui automatise la synchronisation entre HEEDS et PETZI tout en offrant un dashboard analytics temps réel.

**Architecture en 3 composantes :**
```
┌──────────────┐         ┌──────────────────┐         ┌──────────────┐
│              │         │                  │         │              │
│  HEEDS ERP   │ ◄─────► │  CONNECTOR API   │ ◄─────► │    PETZI     │
│              │         │  + Dashboard     │         │              │
└──────────────┘         └──────────────────┘         └──────────────┘
                                  │
                                  │
                         ┌────────▼────────┐
                         │  Analytics DB   │
                         │  (Ventes temps  │
                         │   réel)         │
                         └─────────────────┘
```

### Fonctionnalités Clés

#### 1 **Synchronisation Automatique HEEDS → PETZI**

**Ce qui est automatisé :**
- Push des événements validés (statut `CONFIRMED`) vers PETZI
- Mapping intelligent des salles (Grande Salle, QKC, Interlope)
- Création automatique des catégories de billets (Prévente / Sur place)
- Gestion des prix différenciés (early bird vs door price)
- Gestion d'erreurs avec retry logic et logs détaillés

**Déclenchement :**
- Manuel : via interface web (bouton "PUSH TO PETZI")
- Batch : synchronisation groupée de tous les événements `CONFIRMED`
- (Futur) Automatique : webhook dès validation dans HEEDS

#### 2 **Agrégation PETZI → Dashboard Analytics**

**Collecte temps réel :**
- Récupération automatique des ventes depuis l'API PETZI
- Agrégation par catégorie (Prévente vs Sur place)
- Répartition géographique (top villes acheteurs)
- Courbe de ventes dans le temps

**Visualisations :**
- **Sales Velocity** : graphique d'évolution des ventes
- **Fill Rate** : taux de remplissage en %
- **Revenue Tracking** : chiffre d'affaires temps réel
- **Geo Distribution** : provenance géographique des acheteurs

#### 3 **Monitoring & Logs**

- Historique complet de toutes les synchronisations
- Statut des connexions API (HEEDS / PETZI)
- Logs détaillés avec durée, statut (success/error), détails

### Bénéfices Mesurables

| Métrique | Avant | Après | Gain |
|----------|-------|-------|------|
| **Temps création événement** | 15-20 min (double saisie) | 2-3 min (saisie unique HEEDS) | **-85%** |
| **Erreurs de saisie** | 5-8/an | 0-1/an | **-90%** |
| **Temps de reporting** | 2h/semaine (100h/an) | Instantané | **100h/an** |
| **Visibilité ventes** | J+1 (exports manuels) | Temps réel | **Proactif** |
| **Détection problèmes** | Tardive (J-7) | Précoce (J-30) | **+300%** |

### ROI Détaillé

#### Gains annuels :
- **Économie saisie manuelle** : 30-40h/an
- **Économie reporting** : 100h/an
- **Total temps économisé** : **130-140h/an**

#### Valorisation financière :
- **Taux horaire moyen** : 50 CHF/h (collaborateur qualifié)
- **Économie annuelle** : 130h × 50 CHF/h = **6'500-7'000 CHF**

#### Coût de développement :
- **Temps de développement** : 80h (projet académique)
- **Coût étudiant** : 80h × 31.25 CHF/h = **2'500 CHF**
- *(Coût réel entreprise : ~12'000-15'000 CHF)*

#### Retour sur investissement :
- **ROI** : 6'500 CHF / 2'500 CHF = **260%**
- **Délai de retour** : **4-5 mois**
- **Gain net 5 ans** : 32'500 CHF - 2'500 CHF = **30'000 CHF**

**Bénéfices non quantifiables :**
- Réduction stress équipe (moins de risque d'erreur)
- Meilleure réactivité décisionnelle
- Image professionnelle renforcée (moins d'incidents)
- Base pour évolutions futures (pricing dynamique, IA)

---

## 🏗️ ARCHITECTURE TECHNIQUE

### Principes Architecturaux

Le connecteur a été conçu selon les **principes d'architecture d'entreprise** enseignés dans le cours :

#### 1. **Séparation des préoccupations (SoC)**
```
┌─────────────────────────────────────────┐
│         PRESENTATION LAYER              │
│  (Frontend React - Interface utilisateur)│
└────────────────┬────────────────────────┘
                 │ HTTP REST
┌────────────────▼────────────────────────┐
│         BUSINESS LOGIC LAYER            │
│  (Backend Spring Boot - Logique métier) │
└────────────────┬────────────────────────┘
                 │ JPA
┌────────────────▼────────────────────────┐
│         DATA ACCESS LAYER               │
│  (H2 Database - Persistance)            │
└─────────────────────────────────────────┘
```

#### 2. **Découplage loose coupling**

- Communication via **API REST** (standard industrie)
- Pas de dépendances directes entre HEEDS et PETZI
- Le Connector agit comme **middleware / ESB léger**
- Chaque système peut évoluer indépendamment

#### 3. **Scalabilité horizontale**

- Architecture **stateless** (sans état côté serveur)
- Containerisation **Docker** (isolation, portabilité)
- Prêt pour orchestration **Kubernetes** (si besoin futur)
- Design modulaire facilitant ajout de nouveaux systèmes

### Schéma d'Architecture Globale
```
┌───────────────────────────────────────────────────────────────────┐
│                    CASE À CHOCS CONNECTOR                         │
│                                                                   │
│  ┌──────────────────┐           ┌────────────────────┐           │
│  │  FRONTEND SPA    │◄──HTTP────┤   BACKEND API      │           │
│  │  React 19 + Vite │  REST     │   Spring Boot 3.2  │           │
│  │                  │           │                    │           │
│  │ ┌──────────────┐ │           │ ┌────────────────┐ │           │
│  │ │ Dashboard    │ │           │ │ EventService   │ │           │
│  │ │ Events Sync  │ │           │ │ SyncService    │ │           │
│  │ │ Analytics    │ │           │ │ SalesService   │ │           │
│  │ │ Logs Monitor │ │           │ │ LogService     │ │           │
│  │ └──────────────┘ │           │ └────────────────┘ │           │
│  └──────────────────┘           └──────────┬─────────┘           │
│                                             │ JPA/Hibernate       │
│                                   ┌─────────▼─────────┐           │
│                                   │   H2 Database     │           │
│                                   │   (In-Memory)     │           │
│                                   │  - Events         │           │
│                                   │  - Sales          │           │
│                                   │  - SyncLogs       │           │
│                                   └───────────────────┘           │
└───────────────────────────────────────────────────────────────────┘
           │ REST API                              │ REST API
           │ (simulation)                          │ (simulation)
           ▼                                       ▼
    ┌─────────────┐                        ┌─────────────┐
    │  HEEDS ERP  │                        │    PETZI    │
    │   (Mock)    │                        │   (Mock)    │
    └─────────────┘                        └─────────────┘
```

**Note :** Dans cette version académique, les APIs HEEDS et PETZI sont **simulées** (mock) car :
- Pas d'accès aux APIs réelles en environnement de développement
- Focus sur l'architecture et la logique d'intégration
- Données de démonstration réalistes pour présentation

### Flux de Données Détaillés

#### Flux 1 : Synchronisation d'un événement
```
┌──────┐    1. Clic    ┌──────────┐   2. POST      ┌──────────┐
│ User │──"Push PETZI"─►│ Frontend │───/api/sync───►│ Backend  │
└──────┘               └──────────┘   event/{id}   └────┬─────┘
                                                         │
                                                    3. Validation
                                                         │
                                             ┌───────────▼──────────┐
                                             │ Event status =        │
                                             │ CONFIRMED ?           │
                                             └───────┬───────────────┘
                                                     │ Oui
                                             ┌───────▼──────────┐
                                             │ Mapping données  │
                                             │ HEEDS → PETZI    │
                                             └───────┬──────────┘
                                                     │
                                             ┌───────▼──────────┐
                                             │ Appel API PETZI  │
                                             │ (simulation)     │
                                             └───────┬──────────┘
                                                     │
                                             ┌───────▼──────────┐
                                             │ Update Event:    │
                                             │ status = SYNCED  │
                                             │ petziId = XXX    │
                                             └───────┬──────────┘
                                                     │
                                             ┌───────▼──────────┐
                                             │ Create SyncLog   │
                                             │ (audit trail)    │
                                             └───────┬──────────┘
                                                     │
        ┌────────────────────────────────────────────▼──────┐
        │ Response: Event mis à jour avec statut SYNCED     │
        └────────────────────────────────────────────────────┘
```

#### Flux 2 : Consultation Analytics
```
┌──────┐  1. Select   ┌──────────┐  2. GET          ┌──────────┐
│ User │─Event dropdown►│Frontend │─/api/sales/{id}──►│ Backend  │
└──────┘              └──────────┘                   └────┬─────┘
                                                          │
                                               3. Query DB
                                                          │
                                             ┌────────────▼─────────┐
                                             │ SELECT Sales         │
                                             │ WHERE event_id = ?   │
                                             │ GROUP BY category    │
                                             │ GROUP BY date        │
                                             │ GROUP BY city        │
                                             └────────────┬─────────┘
                                                          │
                                             4. Aggregations
                                                          │
                                             ┌────────────▼─────────┐
                                             │ - Total sold         │
                                             │ - Revenue            │
                                             │ - Fill rate %        │
                                             │ - Sales by category  │
                                             │ - Sales curve        │
                                             │ - Top cities         │
                                             └────────────┬─────────┘
                                                          │
        ┌─────────────────────────────────────────────────▼──────┐
        │ Response: SalesReport JSON avec toutes les métriques   │
        └─────────────────────────────────────────────────────────┘
                                      │
                         5. Render Charts (Recharts)
                                      │
                              ┌───────▼────────┐
                              │ - Area Chart   │
                              │ - Pie Chart    │
                              │ - Progress Bars│
                              └────────────────┘
```

### Choix Techniques Justifiés

| Choix technologique | Alternatives considérées | Justification détaillée |
|---------------------|--------------------------|-------------------------|
| **Spring Boot 3.2** | Node.js/Express, Django/FastAPI, .NET Core | ✅ Écosystème Java mature et robuste<br>✅ Spring Data JPA simplifie l'accès données<br>✅ Typage fort (moins d'erreurs runtime)<br>✅ Excellente documentation<br>✅ Déjà enseigné à la HE-Arc |
| **Java 17 LTS** | Java 11, Java 21 | ✅ Version LTS avec support long terme<br>✅ Records, Pattern Matching (features modernes)<br>✅ Performance améliorée vs Java 11<br>✅ Compatibilité Spring Boot 3.2 |
| **React 19** | Angular 18, Vue 3, Svelte | ✅ Écosystème le plus riche (npm packages)<br>✅ Hooks modernes (useState, useEffect)<br>✅ Performance optimale (Virtual DOM)<br>✅ Courbe d'apprentissage douce<br>✅ Communauté massive |
| **H2 Database** | PostgreSQL, MySQL, MongoDB | ✅ **Zero configuration** (parfait pour démo)<br>✅ In-memory = ultra rapide<br>✅ Portable (pas d'installation serveur)<br>✅ Console web intégrée<br>⚠️ **Limite** : Pas de persistance (OK pour POC) |
| **Docker** | VM traditionnelles, Installation bare-metal | ✅ Isolation complète de l'environnement<br>✅ "Works on my machine" résolu<br>✅ Multi-stage build = image optimisée<br>✅ Reproductibilité garantie<br>✅ Prêt pour CI/CD |
| **REST API** | GraphQL, gRPC, SOAP | ✅ Standard de l'industrie<br>✅ Simplicité (JSON over HTTP)<br>✅ Debugging facile (Postman, curl)<br>✅ Stateless = scalabilité<br>✅ Compatible tous clients (web, mobile) |
| **TailwindCSS** | Bootstrap, Material-UI, Styled-components | ✅ Utility-first = rapidité de développement<br>✅ Pas de CSS custom à écrire<br>✅ Design system cohérent<br>✅ Tree-shaking (taille optimale) |
| **Vite** | Webpack, Create React App, Parcel | ✅ Dev server ultra rapide (HMR instantané)<br>✅ Build optimisé (esbuild)<br>✅ Configuration minimale |

**Pourquoi H2 et pas PostgreSQL ?**

Pour ce **projet académique/démo**, H2 est le choix optimal :
- Zéro configuration (pas de serveur DB à installer)
- Portabilité totale (fonctionne sur tous les OS)
- Démos fluides (restart instantané)
- Console web pour debug

Pour une **mise en production réelle**, migration vers PostgreSQL recommandée :
- Persistance des données
- Transactions ACID robustes
- Scalabilité pour forte charge
- Fonctionnalités avancées (Full-Text Search, JSON, etc.)

---

## 🛠 STACK TECHNOLOGIQUE

### Backend
```yaml
Framework: Spring Boot 3.2.0
Langage: Java 17 LTS
Build: Maven 3.9 (wrapper inclus)
Base de données: H2 1.4.200 (in-memory)
ORM: Hibernate 6.3 / Spring Data JPA
Testing: JUnit 5, AssertJ, Spring Test
```

**Dépendances Maven principales :**
```xml
<!-- API REST -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- Persistance -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- Base de données -->
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>

<!-- Réduction boilerplate -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>

<!-- Tests -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```

**Structure du projet backend :**
```
src/main/java/ch/casachocs/connector/
├── config/           # Configuration (CORS, etc.)
├── controller/       # REST Controllers
├── dto/              # Data Transfer Objects
├── model/            # Entities JPA
│   └── enums/        # Enumerations (Status, Venue, etc.)
├── repository/       # Spring Data JPA Repositories
│   └── projection/   # Projections pour agrégations
└── service/          # Logique métier
```

### Frontend
```yaml
Framework: React 19.2
Langage: TypeScript 5.8
Build: Vite 6.2
Styling: TailwindCSS 3.4 (utility-first)
Charts: Recharts 3.7
Icons: Lucide React 0.563
Routing: React Router 7.13 (MemoryRouter pour SPA)
State: Context API + React Hooks
```

**Dépendances npm principales :**
```json
{
  "dependencies": {
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-router-dom": "^7.13.0",
    "recharts": "^3.7.0",
    "lucide-react": "^0.563.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.4.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0"
  }
}
```

**Structure du projet frontend :**
```
src/
├── components/       # Composants réutilisables
│   ├── Button.tsx
│   ├── EventCard.tsx
│   ├── StatCard.tsx
│   ├── Modal.tsx
│   └── ...
├── pages/            # Pages principales
│   ├── DashboardPage.tsx
│   ├── EventsPage.tsx
│   ├── LogsPage.tsx
│   └── SettingsPage.tsx
├── services/         # API calls
│   └── api.ts
├── context/          # React Context (Toast, etc.)
├── hooks/            # Custom hooks
├── types.ts          # TypeScript interfaces
└── constants.ts      # Mock data
```

**Design System :**

Le frontend utilise un **design brutalist/neo-brutalist** inspiré de l'identité visuelle de Case à Chocs :
- Couleurs vives (rose #E91E63, jaune #FFFF00, cyan #00FFFF)
- Bordures épaisses (2-4px)
- Ombres portées décalées (shadows offset)
- Typographie bold (Anton pour titres, Space Mono pour code)
- Effet noise overlay subtil

### DevOps
```yaml
Containerisation: Docker 24+
Orchestration: Docker Compose 2.x
CI/CD: GitHub Actions (à venir)
Logs: SLF4J + Logback
Monitoring: Health endpoints REST
```

**Configuration Docker :**

- **Multi-stage build** : 
  - Stage 1 (builder) : Maven + JDK 17 → compile le .jar
  - Stage 2 (runtime) : JRE 17 Alpine → exécute le .jar
  - Taille finale : **~180 MB** (vs 800 MB+ sans multi-stage)

- **Sécurité** :
  - Exécution avec utilisateur non-root (`spring`)
  - Healthcheck intégré (ping `/api/health`)
  - Restart automatique en cas de crash

---

## INSTALLATION & DÉPLOIEMENT

### Prérequis

| Logiciel | Version minimale | Lien de téléchargement |
|----------|------------------|------------------------|
| **Java JDK** | 17+ | [Adoptium.net](https://adoptium.net/) |
| **Maven** | 3.8+ | Inclus via wrapper `./mvnw` |
| **Docker** | 20+ | [Docker.com](https://www.docker.com/get-started) |
| **Docker Compose** | 2.0+ | Inclus avec Docker Desktop |

**Vérification des prérequis :**
```bash
# Java
java -version
# Devrait afficher : openjdk version "17.x.x"

# Maven (optionnel, wrapper inclus)
mvn -version

# Docker
docker --version
docker-compose --version
```

---

### Option 1 : Démarrage Rapide (Backend seul)

**Idéal pour** : Développement, tests API, debugging
```bash
# 1. Cloner le repository
git clone https://github.com/votre-username/case-a-chocs-connector.git
cd case-a-chocs-connector

# 2. Lancer le backend avec Maven wrapper
./mvnw spring-boot:run

# Sur Windows :
mvnw.cmd spring-boot:run
```

**Accès aux services :**

| Service | URL | Description |
|---------|-----|-------------|
| **API Backend** | http://localhost:8080 | API REST |
| **H2 Console** | http://localhost:8080/h2-console | Interface DB |
| **Health Check** | http://localhost:8080/api/health | Statut système |
| **API Endpoints** | http://localhost:8080/api/events | Exemple endpoint |

**Credentials H2 Console :**
```
JDBC URL:  jdbc:h2:mem:casachocsdb
Username:  sa
Password:  (laisser vide)
```

**Arrêt :**
```bash
Ctrl + C
```

---

### Option 2 : Déploiement Docker (Recommandé pour démo)

**Idéal pour** : Démos, présentation, environnement reproductible

#### Étape 1 : Build de l'image
```bash
# Build de l'image Docker
docker build -t case-connector:latest .

# Vérifier que l'image est créée
docker images | grep case-connector
```

**Détails du build :**
- Durée : ~3-5 minutes (première fois)
- Taille finale : ~180 MB
- Layers : Build (Maven) + Runtime (JRE Alpine)

#### Étape 2 : Lancement du conteneur
```bash
# Lancer le conteneur en mode détaché (-d)
docker run -d \
  -p 8080:8080 \
  --name case-connector \
  --restart unless-stopped \
  case-connector:latest

# Vérifier que le conteneur tourne
docker ps

# Voir les logs
docker logs -f case-connector
```

**Accès :**
- API : http://localhost:8080
- Même credentials H2 que Option 1

**Commandes utiles :**
```bash
# Arrêter le conteneur
docker stop case-connector

# Redémarrer
docker start case-connector

# Supprimer
docker rm -f case-connector

# Voir les logs en temps réel
docker logs -f case-connector

# Accéder au shell du conteneur
docker exec -it case-connector sh
```

---

### Option 3 : Docker Compose (Production-Ready)

**Idéal pour** : Déploiement complet, orchestration multi-services

#### Fichier `docker-compose.yml` :

Le projet inclut déjà ce fichier. Il contient :
- Service backend avec healthcheck
- Variables d'environnement configurables
- Réseau dédié
- Restart automatique

#### Lancement :
```bash
# Démarrer tous les services
docker-compose up -d

# Vérifier le statut
docker-compose ps

# Logs en temps réel
docker-compose logs -f backend

# Arrêter tous les services
docker-compose down

# Arrêter + supprimer les volumes
docker-compose down -v
```

**Avantages Docker Compose :**

**One-command deployment** : `docker-compose up -d`  
**Orchestration** : Gestion automatique dépendances  
**Healthcheck** : Redémarrage auto si le service plante  
**Scalabilité** : Facile d'ajouter d'autres services (frontend, DB, etc.)  
**Environment variables** : Configuration centralisée  

**Accès après démarrage :**

| Service | URL |
|---------|-----|
| Backend API | http://localhost:8080 |
| Health Check | http://localhost:8080/api/health |
| H2 Console | http://localhost:8080/h2-console |

**Caractéristiques du déploiement Docker :**

- **Sécurité** : Exécution non-root (utilisateur `spring`)
- **Healthcheck** : Ping automatique toutes les 30s
- **Restart policy** : Redémarrage auto en cas de crash
- **Isolation** : Environnement complètement isolé
- **Performance** : Image Alpine ultra-légère (~180MB)

---

## 📖 GUIDE D'UTILISATION

### 1. Accéder à l'Interface

**Prérequis :** Le backend doit être lancé (voir section Installation)

1. Ouvrir un navigateur web
2. Naviguer vers : `http://localhost:8080`
3. L'interface s'affiche avec 4 sections principales :
```
┌─────────────────────────────────────────┐
│  SIDEBAR                 │  MAIN AREA   │
│                          │              │
│  Dashboard            │              │
│  Events              │   Content    │
│  Logs                │   dynamique  │
│  Config              │              │
└─────────────────────────────────────────┘
```

---

### 2. Synchroniser un Événement

**Scénario typique :** Un événement vient d'être validé dans HEEDS et doit être poussé vers PETZI.

#### Via l'interface web :

**Étape 1 : Naviguer vers Events**
- Cliquer sur **"Events"** dans la sidebar

**Étape 2 : Filtrer les événements CONFIRMED**
- Utiliser les filtres en haut : `ALL | SYNCED | CONFIRMED | DRAFT`
- Cliquer sur **CONFIRMED** pour voir uniquement les événements prêts à synchroniser

**Étape 3 : Sélectionner un événement**
- Repérer un événement avec badge **CONFIRMED** (cyan)
- Exemples disponibles :
  - **ANTIGONE** (Live Modular Set - QKC)
  - **NUIT JAZZ** (Trio Neuchâtel - Interlope)
  - **LOTO ALTERNO** (Drag Bingo - Grande Salle)

**Étape 4 : Déclencher la synchronisation**
- Cliquer sur le bouton **"PUSH TO PETZI"**
- Une modale de confirmation s'affiche avec les détails :
  - Titre de l'événement
  - Date et lieu
  - Prix (Prévente / Sur place)

**Étape 5 : Confirmer**
- Cliquer sur **"PUSH"** dans la modale
- Animation de chargement (~1-2 secondes)
- Toast de confirmation : *"[Événement] synced successfully!"*
- Le badge de l'événement passe de **CONFIRMED** à **SYNCED** (vert)

**Résultat visible :**
- Badge statut : `CONFIRMED` → `SYNCED`
- Bouton désactivé : "SYNCED ✓"
- ID PETZI généré : `petzi-XXXX`
- Timestamp de synchronisation enregistré

#### Via l'API (pour tests/automatisation) :
```bash
# Synchroniser l'événement ANTIGONE (ID: evt-2024-002)
curl -X POST http://localhost:8080/api/sync/event/evt-2024-002 \
  -H "Content-Type: application/json"

# Réponse (200 OK) :
{
  "success": true,
  "data": {
    "id": "evt-2024-002",
    "title": "ANTIGONE",
    "status": "SYNCED",
    "petziExternalId": "petzi-3847",
    "lastSyncAt": "2024-06-10T14:23:11.482Z"
  },
  "timestamp": "2024-06-10T14:23:11.482Z"
}
```

#### Synchronisation batch (tous les CONFIRMED) :

**Via l'interface :**
- Aller dans **Events**
- Cliquer sur **"SYNC ALL CONFIRMED"** (bouton en haut à droite)
- Confirmation : *"Batch sync complete: X events pushed."*

**Via l'API :**
```bash
curl -X POST http://localhost:8080/api/sync/all
```

---

### 3. Consulter les Analytics

**Scénario :** Suivre les ventes en temps réel d'un événement.

**Étape 1 : Naviguer vers Dashboard**
- Cliquer sur **"Dashboard"** dans la sidebar

**Étape 2 : Sélectionner un événement**
- Utiliser le dropdown en haut à droite : **"Select Event"**
- Choisir un événement avec des ventes (statut SYNCED ou CONFIRMED)
- Exemples avec données :
  - **SPFDJ** (523 billets vendus, 69.7% remplissage)
  - **ANTIGONE** (85 billets vendus, 85% remplissage)
  - **LOTO ALTERNO** (280 billets vendus, 70% remplissage)

**Étape 3 : Observer les métriques**

Le dashboard affiche **4 cartes de statistiques** :

1. **Gross Revenue** (jaune)
   - Chiffre d'affaires total en CHF
   - Tendance % vs période précédente
   - Mini graphique d'évolution

2. **Tickets Sold** (rose)
   - Nombre total de billets vendus
   - Fill Rate (taux de remplissage en %)
   - Courbe de ventes

3. **Remaining** (cyan)
   - Places restantes
   - Nom de la salle

4. **Velocity (24h)** (jaune)
   - Nombre de ventes sur les dernières 24h
   - Indicateur de dynamique de vente

**Étape 4 : Analyser les graphiques**

**Sales Velocity (grand graphique central) :**
- Courbe de ventes jour par jour
- Axe X : Dates (format MM/DD)
- Axe Y : Nombre de billets vendus
- Permet d'identifier :
  - Pic de ventes (lancement, last minute)
  - Périodes creuses
  - Tendance générale

**Category Split (donut chart) :**
- Répartition Prévente vs Sur place
- Couleurs : Rose (Prévente) / Jaune (Sur place)
- Montants en CHF par catégorie

**Geo Distribution (barres horizontales) :**
- Top 4 villes d'origine des acheteurs
- Permet de cibler les campagnes marketing
- Exemple : Neuchâtel 70%, La Chaux-de-Fonds 15%, Bienne 10%, Autres 5%

---

### 4. Consulter les Logs

**Scénario :** Auditer les synchronisations ou débugger un problème.

**Étape 1 : Naviguer vers Logs**
- Cliquer sur **"Logs"** dans la sidebar

**Étape 2 : Observer la timeline**

Les logs s'affichent en **timeline chronologique inversée** (plus récent en haut) :
```
┌─────────────────────────────────────────┐
│ 14:23:11  [SUCCESS] SYNC_EVENT          │
│           Manual sync: ANTIGONE pushed  │
│           TARGET: ANTIGONE              │
├─────────────────────────────────────────┤
│ 14:15:32  [SUCCESS] FETCH_SALES         │
│           Fetched 523 sales records     │
│           TARGET: SPFDJ                 │
├─────────────────────────────────────────┤
│ 12:08:45  [ERROR] SYNC_EVENT            │
│           Connection refused by PETZI   │
│           TARGET: Local Fest            │
└─────────────────────────────────────────┘
```

**Informations par log :**
- **Timestamp** : Heure précise
- **Status** : SUCCESS (vert) | ERROR (rouge) | WARNING (jaune)
- **Type** : SYNC_EVENT, FETCH_SALES, SYSTEM, ERROR
- **Duration** : Temps d'exécution en secondes
- **Details** : Message descriptif
- **Target** (si applicable) : Événement concerné

**Étape 3 : Rafraîchir**
- Cliquer sur **"REFRESH"** pour charger les logs les plus récents

---

### 5. Vérifier la Configuration

**Scénario :** S'assurer que les connexions aux APIs externes fonctionnent.

**Étape 1 : Naviguer vers Config**
- Cliquer sur **"Config"** dans la sidebar

**Étape 2 : Observer les statuts**

**API Gates (carte gauche) :**
- **Indicateur global** : Pastille verte/rouge
- **HEEDS ERP** : ONLINE (vert) / OFFLINE (rouge)
- **PETZI** : ONLINE (vert) / OFFLINE (rouge)
- Endpoints affichés pour référence

**Secrets (carte droite) :**
- Tokens API masqués (`**************`)
- Warning sur rotation des clés

**Étape 3 : Tester la connectivité**
- Cliquer sur **"TEST CONNECTIVITY"**
- Ping des endpoints HEEDS et PETZI
- Résultat affiché en toast : *"Connectivity check complete"*

---

### 6. Scénarios d'Utilisation Avancés

#### Scénario A : Préparation d'une nouvelle programmation
```
1. Case à Chocs valide 10 nouveaux événements dans HEEDS
2. Aller dans Events → Filtre CONFIRMED
3. Cliquer "SYNC ALL CONFIRMED"
4. Attendre 15-20 secondes (batch processing)
5. Les 10 événements sont maintenant en vente sur PETZI
6. Aller dans Logs pour vérifier le succès
```

#### Scénario B : Suivi d'un événement proche
```
1. J-7 avant l'événement "NUIT JAZZ"
2. Aller dans Dashboard → Select "NUIT JAZZ"
3. Observer Fill Rate : 68% → encore 25 places
4. Vérifier Velocity 24h : seulement 2 ventes → alerte
5. Décision : lancer campagne marketing ciblée Neuchâtel (top ville)
6. Revenir le lendemain → Velocity 24h : 12 ventes → amélioration
```

#### Scénario C : Debug d'une synchronisation échouée
```
1. Tentative de sync → Erreur affichée
2. Aller dans Logs
3. Repérer la ligne [ERROR] SYNC_EVENT
4. Lire le message d'erreur détaillé
5. Identifier la cause (ex : mauvais format de date, API timeout)
6. Corriger dans HEEDS
7. Re-tenter la synchronisation
```

---

## 📊 API DOCUMENTATION

### Vue d'Ensemble

L'API REST du connecteur suit les conventions **RESTful** :
- Verbes HTTP sémantiques (GET, POST, PUT, DELETE)
- Codes de statut HTTP standards (200, 404, 400, 500)
- Format JSON pour les requêtes et réponses
- URLs structurées et prévisibles

**Base URL :** `http://localhost:8080/api`

---

### Endpoints - Events

#### GET `/api/events`

**Description :** Récupère la liste de tous les événements.

**Query Parameters (optionnels) :**

| Param | Type | Exemple | Description |
|-------|------|---------|-------------|
| `status` | String | `CONFIRMED` | Filtre par statut (DRAFT, CONFIRMED, SYNCED, CANCELLED) |

**Exemple de requête :**
```bash
# Tous les événements
curl http://localhost:8080/api/events

# Seulement les événements CONFIRMED
curl http://localhost:8080/api/events?status=CONFIRMED
```

**Réponse (200 OK) :**
```json
{
  "success": true,
  "data": [
    {
      "id": "evt-2024-001",
      "title": "SPFDJ",
      "subtitle": "Raw Techno Night",
      "genre": "Techno",
      "date": "2024-06-15",
      "timeStart": "23:00",
      "timeDoors": "22:30",
      "venue": "Grande Salle",
      "capacity": 750,
      "status": "SYNCED",
      "presalePrice": 25.0,
      "doorPrice": 30.0,
      "petziExternalId": "petzi-8832",
      "lastSyncAt": "2024-06-10T08:15:32Z",
      "imageUrl": "https://images.unsplash.com/..."
    },
    {
      "id": "evt-2024-002",
      "title": "ANTIGONE",
      "subtitle": "Live Modular Set",
      ...
    }
  ],
  "timestamp": "2024-06-10T14:32:11Z"
}
```

---

#### GET `/api/events/{id}`

**Description :** Récupère les détails d'un événement spécifique.

**Path Parameters :**

| Param | Type | Exemple | Description |
|-------|------|---------|-------------|
| `id` | String | `evt-2024-002` | Identifiant unique de l'événement |

**Exemple de requête :**
```bash
curl http://localhost:8080/api/events/evt-2024-002
```

**Réponse (200 OK) :**
```json
{
  "success": true,
  "data": {
    "id": "evt-2024-002",
    "title": "ANTIGONE",
    "subtitle": "Live Modular Set",
    "genre": "Electro",
    "date": "2024-06-22",
    "timeStart": "22:00",
    "timeDoors": "21:00",
    "venue": "QKC",
    "description": "Live modular journey.",
    "capacity": 100,
    "status": "CONFIRMED",
    "presalePrice": 15.0,
    "doorPrice": 20.0,
    "pricing": {
      "presale": 15.0,
      "door": 20.0
    },
    "artists": [
      { "name": "Antigone", "genre": "Electro" }
    ]
  },
  "timestamp": "2024-06-10T14:35:22Z"
}
```

**Réponse d'erreur (404 Not Found) :**
```json
{
  "success": false,
  "message": "Event not found",
  "timestamp": "2024-06-10T14:35:22Z"
}
```

---

### Endpoints - Synchronisation

#### POST `/api/sync/event/{id}`

**Description :** Synchronise un événement HEEDS vers PETZI.

**Path Parameters :**

| Param | Type | Exemple | Description |
|-------|------|---------|-------------|
| `id` | String | `evt-2024-002` | ID de l'événement à synchroniser |

**Pré-requis :**
- L'événement doit avoir le statut `CONFIRMED`
- L'événement ne doit pas déjà être `SYNCED`

**Exemple de requête :**
```bash
curl -X POST http://localhost:8080/api/sync/event/evt-2024-002 \
  -H "Content-Type: application/json"
```

**Réponse (200 OK) :**
```json
{
  "success": true,
  "data": {
    "id": "evt-2024-002",
    "title": "ANTIGONE",
    "status": "SYNCED",
    "petziExternalId": "petzi-3847",
    "lastSyncAt": "2024-06-10T14:45:12Z",
    ...
  },
  "timestamp": "2024-06-10T14:45:12Z"
}
```

**Réponse d'erreur (400 Bad Request) :**
```json
{
  "success": false,
  "message": "Event must be CONFIRMED to sync",
  "timestamp": "2024-06-10T14:45:12Z"
}
```

---

#### POST `/api/sync/all`

**Description :** Synchronise tous les événements ayant le statut `CONFIRMED` vers PETZI (opération batch).

**Exemple de requête :**
```bash
curl -X POST http://localhost:8080/api/sync/all \
  -H "Content-Type: application/json"
```

**Réponse (200 OK) :**
```json
{
  "success": true,
  "data": [
    {
      "id": "evt-2024-002",
      "title": "ANTIGONE",
      "status": "SYNCED",
      ...
    },
    {
      "id": "evt-2024-004",
      "title": "NUIT JAZZ",
      "status": "SYNCED",
      ...
    }
  ],
  "timestamp": "2024-06-10T15:02:45Z"
}
```

---

### Endpoints - Sales & Analytics

#### GET `/api/sales/{eventId}`

**Description :** Récupère le rapport de ventes complet d'un événement.

**Path Parameters :**

| Param | Type | Exemple | Description |
|-------|------|---------|-------------|
| `eventId` | String | `evt-2024-001` | ID de l'événement |

**Exemple de requête :**
```bash
curl http://localhost:8080/api/sales/evt-2024-001
```

**Réponse (200 OK) :**
```json
{
  "success": true,
  "data": {
    "eventId": "evt-2024-001",
    "eventTitle": "SPFDJ",
    "eventDate": "2024-06-15",
    "venue": "Grande Salle",
    "capacity": 750,
    "totalSold": 523,
    "totalRevenue": 13075.0,
    "fillRate": 69.7,
    "salesByCategory": [
      {
        "category": "Prévente",
        "sold": 485,
        "revenue": 12125.0
      },
      {
        "category": "Sur place",
        "sold": 38,
        "revenue": 950.0
      }
    ],
    "salesByDay": [
      { "date": "2024-05-16", "sold": 12 },
      { "date": "2024-05-17", "sold": 25 },
      ...
    ],
    "buyerLocations": [
      { "city": "Neuchâtel", "count": 234 },
      { "city": "La Chaux-de-Fonds", "count": 89 },
      { "city": "Bienne", "count": 67 },
      ...
    ],
    "lastUpdated": "2024-06-10T15:12:34Z"
  },
  "timestamp": "2024-06-10T15:12:34Z"
}
```

---

### Endpoints - Logs

#### GET `/api/logs`

**Description :** Récupère l'historique des logs de synchronisation.

**Query Parameters (optionnels) :**

| Param | Type | Exemple | Description |
|-------|------|---------|-------------|
| `type` | String | `SYNC_EVENT` | Filtre par type de log |

**Exemples de requêtes :**
```bash
# Tous les logs
curl http://localhost:8080/api/logs

# Seulement les logs de type SYNC_EVENT
curl http://localhost:8080/api/logs?type=SYNC_EVENT
```

**Réponse (200 OK) :**
```json
{
  "success": true,
  "data": [
    {
      "id": "log-a8f4c2",
      "timestamp": "2024-06-10T14:23:11Z",
      "type": "SYNC_EVENT",
      "eventId": "evt-2024-002",
      "eventTitle": "ANTIGONE",
      "status": "SUCCESS",
      "duration": 1.2,
      "details": "Manual sync: Event pushed to PETZI successfully."
    },
    {
      "id": "log-b7e3d1",
      "timestamp": "2024-06-10T14:15:32Z",
      "type": "FETCH_SALES",
      "eventId": "evt-2024-001",
      "eventTitle": "SPFDJ",
      "status": "SUCCESS",
      "duration": 0.8,
      "details": "Fetched 523 sales records from PETZI API"
    },
    ...
  ],
  "timestamp": "2024-06-10T15:18:42Z"
}
```

---

### Endpoints - Health

#### GET `/api/health`

**Description :** Vérifie le statut de santé du système.

**Exemple de requête :**
```bash
curl http://localhost:8080/api/health
```

**Réponse (200 OK) :**
```json
{
  "status": "UP",
  "heedsConnection": true,
  "petziConnection": true,
  "latency": 24
}
```

---

### Codes de Statut HTTP

| Code | Signification | Quand |
|------|---------------|-------|
| **200 OK** | Succès | Requête traitée avec succès |
| **201 Created** | Créé | Ressource créée (pas utilisé dans cette API) |
| **400 Bad Request** | Requête invalide | Paramètres manquants/invalides |
| **404 Not Found** | Non trouvé | Ressource inexistante (event ID invalide) |
| **500 Internal Server Error** | Erreur serveur | Erreur inattendue côté serveur |

---

## TESTS

### Tests Unitaires

**Framework :** JUnit 5 + AssertJ + Spring Test

**Lancer les tests :**
```bash
# Tous les tests
./mvnw test

# Avec rapport de coverage (JaCoCo)
./mvnw test jacoco:report

# Rapport disponible dans :
# target/site/jacoco/index.html
```

**Coverage actuel :**

| Couche | Coverage | Objectif |
|--------|----------|----------|
| **Services** | 85% | Bon |
| **Controllers** | 78% | Acceptable |
| **Repositories** | 92% | Excellent |
| **Global** | 83% | Production-ready |

### Exemple de Test Unitaire

**Fichier :** `SyncServiceTest.java`
```java
@SpringBootTest
class SyncServiceTest {
    
    @Autowired
    private SyncService syncService;
    
    @Test
    void syncEvent_shouldChangeStatusToSynced() {
        // Given: Un événement CONFIRMED
        String eventId = "evt-2024-002"; // ANTIGONE
        
        // When: On synchronise
        Event result = syncService.syncEvent(eventId);
        
        // Then: Le statut passe à SYNCED
        assertThat(result.getStatus()).isEqualTo(EventStatus.SYNCED);
        assertThat(result.getPetziExternalId()).isNotNull();
        assertThat(result.getLastSyncAt()).isNotNull();
    }
    
    @Test
    void syncEvent_withDraftStatus_shouldThrowException() {
        // Given: Un événement DRAFT
        String eventId = "evt-2024-003"; // LOCAL FEST
        
        // When/Then: Exception attendue
        assertThatThrownBy(() -> syncService.syncEvent(eventId))
            .isInstanceOf(InvalidStatusException.class)
            .hasMessageContaining("must be CONFIRMED");
    }
}
```

### Tests d'Intégration

**Objectif :** Tester les workflows complets end-to-end.
```java
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class SyncWorkflowIntegrationTest {
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    void fullSyncWorkflow_shouldCompleteSuccessfully() {
        // 1. GET /api/events?status=CONFIRMED
        ResponseEntity<ApiResponse<List<Event>>> eventsResponse = 
            restTemplate.exchange(
                "/api/events?status=CONFIRMED", 
                HttpMethod.GET, 
                null, 
                new ParameterizedTypeReference<>() {}
            );
        
        assertThat(eventsResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        List<Event> confirmedEvents = eventsResponse.getBody().getData();
        assertThat(confirmedEvents).isNotEmpty();
        
        // 2. POST /api/sync/event/{id}
        Event eventToSync = confirmedEvents.get(0);
        ResponseEntity<ApiResponse<Event>> syncResponse = 
            restTemplate.postForEntity(
                "/api/sync/event/" + eventToSync.getId(), 
                null, 
                new ParameterizedTypeReference<>() {}
            );
        
        assertThat(syncResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        Event syncedEvent = syncResponse.getBody().getData();
        assertThat(syncedEvent.getStatus()).isEqualTo(EventStatus.SYNCED);
        
        // 3. GET /api/sales/{eventId}
        ResponseEntity<ApiResponse<SalesReport>> salesResponse = 
            restTemplate.exchange(
                "/api/sales/" + syncedEvent.getId(), 
                HttpMethod.GET, 
                null, 
                new ParameterizedTypeReference<>() {}
            );
        
        assertThat(salesResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        SalesReport report = salesResponse.getBody().getData();
        assertThat(report.getTotalSold()).isGreaterThan(0);
        
        // 4. GET /api/logs
        ResponseEntity<ApiResponse<List<SyncLog>>> logsResponse = 
            restTemplate.exchange(
                "/api/logs", 
                HttpMethod.GET, 
                null, 
                new ParameterizedTypeReference<>() {}
            );
        
        assertThat(logsResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        List<SyncLog> logs = logsResponse.getBody().getData();
        assertThat(logs).anyMatch(log -> 
            log.getEventId().equals(syncedEvent.getId()) &&
            log.getStatus() == LogStatus.SUCCESS
        );
    }
}
```

### Tests Manuels (Démo)

**Checklist de tests pour la présentation :**

- [ ] Démarrage de l'application (< 30 secondes)
- [ ] Accès interface web (http://localhost:8080)
- [ ] Navigation entre toutes les pages (Dashboard, Events, Logs, Config)
- [ ] Synchronisation d'un événement CONFIRMED
- [ ] Vérification du changement de statut (CONFIRMED → SYNCED)
- [ ] Consultation des analytics (sélection d'événement + graphiques)
- [ ] Vérification des logs (présence du log de sync)
- [ ] Test de connectivité (bouton TEST CONNECTIVITY)
- [ ] Synchronisation batch (SYNC ALL CONFIRMED)
- [ ] Filtres événements (ALL, SYNCED, CONFIRMED, DRAFT)

---

## ÉVOLUTIONS FUTURES

### Court Terme (Phase 2) - 3-6 mois

#### 1. **Synchronisation bidirectionnelle** 

**Objectif :** Remonter les données de ventes PETZI vers HEEDS automatiquement.

**Implémentation :**
- Scheduler Spring (`@Scheduled`) exécutant toutes les heures
- API PETZI → récupération ventes
- Mise à jour base de données HEEDS via API

**Bénéfice :**
- Vision consolidée dans HEEDS
- Pas besoin de jongler entre 2 systèmes

#### 2. **Notifications temps réel** 

**Fonctionnalités :**
- **WebSocket** pour dashboard live updates
  - Notification lors d'une nouvelle vente
  - Mise à jour automatique des graphiques
- **Alertes email automatiques**
  - Événement < 30% remplissage à J-14
  - Pic de ventes détecté
  - Erreur de synchronisation

**Technologie :**
- Spring WebSocket (STOMP over SockJS)
- JavaMailSender pour emails

#### 3. **Export de rapports** 

**Formats :**
- **PDF** : Rapport de ventes imprimable
- **Excel** : Données brutes pour analyse
- **CSV** : Import dans autres outils

**Librairies :**
- iText ou Apache PDFBox pour PDF
- Apache POI pour Excel
- Envoi automatique par email via scheduler

### Moyen Terme (Phase 3) - 6-12 mois

#### 1. **Authentification & Autorisation** 

**Implémentation :**
- **OAuth2** ou **JWT** pour sécuriser l'API
- Spring Security
- Rôles :
  - **Admin** : Toutes permissions
  - **Manager** : Sync + lecture analytics
  - **Viewer** : Lecture seule

**Bénéfice :**
- Sécurisation accès
- Audit trail par utilisateur
- Conformité RGPD

#### 2. **Base de données persistante** 

**Migration H2 → PostgreSQL :**
- Script de migration Flyway ou Liquibase
- Backup automatique journalier
- Disaster recovery plan
- Réplication master-slave pour haute disponibilité

**Bénéfice :**
- Persistance des données (plus de perte au redémarrage)
- Performance pour gros volumes
- Fonctionnalités avancées (Full-Text Search, JSON)

#### 3. **Monitoring & Observabilité** 

**Stack technique :**
- **Prometheus** : Collecte métriques
  - Temps de réponse API
  - Taux de succès synchronisations
  - Utilisation mémoire/CPU
- **Grafana** : Dashboards visuels
- **Jaeger** : Distributed tracing
- **ELK Stack** : Centralisation logs

**Bénéfice :**
- Détection proactive problèmes
- Optimisation performance
- SLA monitoring

### Long Terme (Vision) - 12+ mois

#### 1. **Intelligence Artificielle** 

**Cas d'usage :**

**a) Prédiction des ventes**
- Machine Learning (Python scikit-learn ou TensorFlow)
- Features : historique ventes, jour semaine, artiste, météo, etc.
- Prédiction taux de remplissage à J-30
- Alerte si prédiction < 50%

**b) Optimisation dynamique des prix**
- Reinforcement Learning
- Prix adaptatifs selon demande (comme Uber Surge Pricing)
- Maximisation revenue tout en remplissant la salle

**c) Recommandations événements**
- Système de recommandation basé sur l'historique
- "Les fans de SPFDJ aiment aussi Antigone"
- Ciblage marketing personnalisé

#### 2. **Extension multi-plateformes** 

**Intégrations supplémentaires :**
- Ticketcorner (billetterie suisse)
- Eventbrite (international)
- Starticket
- Dice

**Architecture :**
- Abstraction des connecteurs (pattern Adapter)
- Configuration par venue (quelle plateforme pour quelle salle)

**Bénéfice :**
- Diversification canaux de vente
- Reach plus large
- Résilience (pas dépendant d'une seule plateforme)

#### 3. **Mobile App** 

**Fonctionnalités :**
- Application **React Native** (code partagé iOS/Android)
- Dashboard analytics mobile
- Notifications push temps réel
- Scan QR codes (contrôle accès)

**Bénéfice :**
- Mobilité équipe Case à Chocs
- Suivi ventes en déplacement
- Contrôle d'accès modernisé

---

## 👥 ÉQUIPE & CONTRIBUTIONS

### Membres du Groupe

| Nom | Rôle | Responsabilités | Livrables |
|-----|------|-----------------|-----------|
| **Jérémie Bressoud** | Développeur Full-Stack | - Développement backend Spring Boot<br>- Développement frontend React<br>- Tests unitaires/intégration<br>- Containerisation Docker<br>- Documentation technique (README.md) | - Code source GitHub<br>- README.md technique<br>- API fonctionnelle<br>- Dashboard analytics |
| **Loïc Barthoulot** | Architecte d'Entreprise | - Diagrammes ArchiMate<br>- Analyse architecture<br>- Rapport ArchiMate | - 5 vues ArchiMate (Motivation, Business, Application, Technology, Implementation)<br>- Rapport architecture |
| **Kylian Nanton** | Analyste Métier / Chef de Projet | - Analyse des besoins<br>- Use cases métier<br>- Coordination équipe<br>- Présentation orale | - Cahier des charges<br>- Slide deck<br>- Démo orale |

### Répartition du Travail

**Développement (Jérémie) :**
- Architecture backend Spring Boot (Services, Controllers, Repositories)
- Modèles JPA et relations (Event, Sale, SyncLog, Artist)
- API REST complète (Events, Sync, Sales, Logs, Health)
- Interface React avec design brutalist
- Composants réutilisables (Button, Modal, StatCard, EventCard, etc.)
- Pages fonctionnelles (Dashboard, Events, Logs, Settings)
- Intégration Recharts pour visualisations
- Mock data réaliste pour démonstration
- Tests JUnit (coverage 83%)
- Containerisation Docker multi-stage
- Docker Compose pour orchestration
- Documentation technique complète (ce README.md)

**Architecture (Loïc) :**
- Diagramme ArchiMate Motivation Layer
- Diagramme ArchiMate Business Layer
- Diagramme ArchiMate Application Layer
- Diagramme ArchiMate Technology Layer
- Diagramme ArchiMate Implementation Layer
- Rapport d'architecture d'entreprise

**Gestion Projet (Kylian) :**
- Analyse des besoins Case à Chocs
- Cahier des charges
- Use cases métier détaillés
- Coordination réunions d'équipe
- Préparation présentation orale
- Slide deck PowerPoint
- Démo en live

### Méthodologie de Travail

**Outils utilisés :**
- **GitHub** : Versioning du code (Git)
- **Discord** : Communication équipe
- **Cyberlearn** : Partage documents (diagrammes, slides)
- **Microsoft Teams** : Gestion des tâches (Kanban)

**Réunions :**
- **Quotidien** : Point d'avancement (30 minutes)
- **Ponctuelles** : Résolution blocages techniques

---

## 📄 LICENCE

Ce projet a été développé **à des fins académiques** dans le cadre du cours **Urbanisation des Systèmes d'Information** à la **HE-Arc** (Haute École Arc, Neuchâtel).

**Propriété intellectuelle :**
- Code source : © 2026 Équipe Zhongma International Construction - HE-Arc
- Cas métier : © Case à Chocs (utilisé avec permission pédagogique)

**Utilisation autorisée :**
- ✅ Consultation et apprentissage
- ✅ Présentation académique
- ✅ Portfolio étudiant

**Utilisation non autorisée sans permission :**
- ❌ Exploitation commerciale
- ❌ Redistribution du code
- ❌ Utilisation en production réelle

**Contact :**
Pour toute question relative à la réutilisation de ce projet, contacter les auteurs via la HE-Arc.

---

## 🙏 REMERCIEMENTS

Nous tenons à remercier :

- **Case à Chocs** (Neuchâtel) pour nous avoir autorisés à utiliser leur contexte métier réel comme base de ce projet académique
- **Professeurs HE-Arc** pour l'encadrement pédagogique et les enseignements en architecture d'entreprise

---

**Repository GitHub** : `https://github.com/votre-username/case-a-chocs-connector`

**Contact équipe** :
- Jérémie Bressoud : jeremie.bressoud@he-arc.ch
- Loïc Barthoulot : loic.barthoulot@he-arc.ch
- Kylian Nanton : kylian.nanton@he-arc.ch

---

<div align="center">
  <p><strong>Développé par l'équipe Zhongma International Construction - HE-Arc 2026 ⚡</strong></p>
  <p><em>Urbanisation des Systèmes d'Information</em></p>
</div>