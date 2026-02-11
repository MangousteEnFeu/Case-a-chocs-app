<div align="center">
  <h1>CASE A CHOCS CONNECTOR</h1>
  <p><strong>HEEDS - PETZI Integration Platform</strong></p>
  <p>Synchronisation automatique des evenements et analyse des ventes en temps reel</p>

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-brightgreen)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED)
![License](https://img.shields.io/badge/license-Academic-yellow)
</div>

---

## TABLE DES MATIERES

1. [Contexte du Projet](#contexte-du-projet)
2. [Problematique Metier](#problematique-metier)
3. [Solution Proposee](#solution-proposee)
4. [Architecture Technique](#architecture-technique)
5. [Stack Technologique](#stack-technologique)
6. [Installation et Demarrage](#installation-et-demarrage)
7. [Guide Utilisation](#guide-utilisation)
8. [API Documentation](#api-documentation)
9. [Tests](#tests)
10. [Equipe et Contributions](#equipe-et-contributions)

---

## CONTEXTE DU PROJET

### Presentation de Case a Chocs

**Case a Chocs** est une salle de concerts emblematique de Neuchatel (Suisse) proposant une programmation culturelle diversifiee depuis plus de 40 ans. Elle dispose de trois espaces evenementiels :

| Salle | Capacite | Type d'evenements |
|-------|----------|-------------------|
| **Grande Salle** | 750 personnes | Concerts rock, electro, hip-hop |
| **QKC** | 100 personnes | Sets intimistes, DJ sets |
| **Interlope** | 80 personnes | Jazz, concerts acoustiques |

### Contexte Academique

Projet developpe dans le cadre du cours **Urbanisation des Systemes d'Information** a la **HE-Arc** (Haute Ecole Arc, Neuchatel) - Semestre de printemps 2026.

Objectifs pedagogiques :
- Appliquer les principes d'architecture d'entreprise (TOGAF/ArchiMate)
- Concevoir un systeme d'integration inter-applicatif
- Developper une solution full-stack professionnelle
- Demontrer la creation de valeur business par l'IT

---

## PROBLEMATIQUE METIER

### Situation Actuelle

Case a Chocs utilise deux systemes informatiques deconnectes :

| Systeme | Usage | Limitation |
|---------|-------|------------|
| **HEEDS** | ERP de gestion evenementielle | Pas de billetterie integree |
| **PETZI** | Billetterie en ligne | Pas de gestion evenementielle |

### Problemes Identifies

1. **Double saisie manuelle** : 15-20 min/evenement x 120 evenements/an = 30-40h/an perdues
2. **Erreurs de saisie** : 5-8 incidents/an (surreservations, prix incorrects)
3. **Absence d'analytics temps reel** : Reporting manuel via exports Excel

### ROI Estime

| Metrique | Avant | Apres | Gain |
|----------|-------|-------|------|
| Temps creation evenement | 15-20 min | 2-3 min | -85% |
| Erreurs de saisie | 5-8/an | 0-1/an | -90% |
| Temps de reporting | 2h/semaine | Instantane | 100h/an |

---

## SOLUTION PROPOSEE

Le **Case a Chocs Connector** est une plateforme d'integration qui :

1. Synchronise automatiquement les evenements HEEDS vers PETZI
2. Agrege les donnees de ventes PETZI pour analytics temps reel
3. Monitore les operations avec logs detailles

```
+---------------+         +-------------------+         +---------------+
|               |         |                   |         |               |
|   HEEDS ERP   | <-----> |   CONNECTOR API   | <-----> |     PETZI     |
|               |         |   + Dashboard     |         |               |
+---------------+         +-------------------+         +---------------+
```

---

## ARCHITECTURE TECHNIQUE

### Vue d'Ensemble

```
+--------------------------------------------------------------------+
|                    CASE A CHOCS CONNECTOR                          |
|                                                                    |
|  +--------------------+           +----------------------+         |
|  |  FRONTEND SPA     |<--HTTP--->|   BACKEND API        |         |
|  |  React 19 + Vite  |   REST    |   Spring Boot 3.2    |         |
|  |  TypeScript 5.8   |           |   Java 17            |         |
|  +--------------------+           +----------+-----------+         |
|                                              |                     |
|                                   +----------v-----------+         |
|                                   |   Supabase (Database)|         |
|                                   +----------------------+         |
+--------------------------------------------------------------------+
```

### Structure du Projet

```
case-a-chocs-connector/
|
+-- src/main/java/ch/casachocs/connector/
|   +-- config/           # Configuration (CORS)
|   +-- controller/       # REST Controllers (5)
|   +-- dto/              # Data Transfer Objects
|   +-- model/            # Entities JPA
|   +-- repository/       # Spring Data Repositories
|   +-- service/          # Logique metier
|
+-- src/main/resources/
|   +-- application.properties
|
+-- src/test/java/        # Tests JUnit
|
+-- [Frontend React]      # Integre via frontend-maven-plugin
|   +-- components/       # Composants reutilisables
|   +-- pages/            # Pages (Dashboard, Events, Logs, Settings)
|   +-- services/         # API client
|   +-- hooks/            # React hooks
|
+-- Dockerfile            # Multi-stage build
+-- docker-compose.yml    # Orchestration
+-- create_table.sql      # Schema 
+-- insert_demo_data.sql  # Peuplement des tables
+-- pom.xml               # Maven config
```

---

## STACK TECHNOLOGIQUE

### Backend

| Technologie       | Version | Usage                 |
|-------------------|---------|-----------------------|
| Java              | 17 LTS  | Langage principal     |
| Spring Boot       | 3.2.0   | Framework             |
| Spring Data JPA   | 3.2.0   | ORM / Persistance     |
| Supabase Database | 19c+    | Base de donnees       |
| PostgreSQL        | -       | PostgreSQL Driver     |
| Lombok            | latest  | Reduction boilerplate |
| JUnit 5           | 5.x     | Tests unitaires       |

### Frontend

| Technologie | Version | Usage |
|-------------|---------|-------|
| React | 19.2 | Framework UI |
| TypeScript | 5.8 | Typage statique |
| Vite | 6.2 | Build tool |
| TailwindCSS | 3.4 | Styling (utility-first) |
| Recharts | 3.7 | Visualisations |
| Lucide React | 0.563 | Icones |
| React Router | 7.13 | Navigation SPA |

### DevOps

| Technologie | Usage |
|-------------|-------|
| Docker | Containerisation |
| Docker Compose | Orchestration |
| Maven Wrapper | Build reproductible |
| frontend-maven-plugin | Integration npm dans Maven |

---

## INSTALLATION ET DEMARRAGE

### Prerequis

| Logiciel          | Version minimale                         |
|-------------------|------------------------------------------|
| Java JDK          | 17+                                      |
| Maven             | 3.8+ (ou utiliser `./mvnw`)              |
| Node.js           | 20+ (installe automatiquement par Maven) |
| Supabase Database | -                                        |
| Docker            | 20+ (optionnel)                          |

### Etape 1 : Cloner le repository

```bash
git clone https://github.com/MangousteEnFeu/case-a-chocs-connector.git
cd case-a-chocs-connector
```

### Etape 2 : Creer le schema 

Automatique lors du lancement du Docker en local

Supabase : se créer un compte et prendre le fichier create_table.sql et insert_demo_data.sql.
Run les fichiers dans Supabase dans SQL Editor.

### Etape 3 : Configurer la connexion base de donnees

Configurer le .env si besoin d'une connexion en base de données externe comme Supabase

Sinon laisser comme ça.

### Etape 4 : Lancer l'application via Docker (BDD locale)

Lancer Docker sur le PC (Comme Docker Desktop)

Lancer la commande dans le terminal 
```bash
docker-compose up -d --build
```
**Acces :** http://localhost:8080

Pour une BDD externe faire pareil mais en remplissant le .env avec les infos de connexion à Supabase.

### Alternative manuelle (BDD externe)

Configurer la base de données externe dans le .env via supabase

Run ConnectorApplication et dans le terminal faire npm run dev

---

## GUIDE UTILISATION

### Navigation

L'interface comprend 4 sections principales :

| Page | Description |
|------|-------------|
| **Dashboard** | Analytics temps reel des ventes par evenement |
| **Events** | Liste des evenements, synchronisation vers PETZI |
| **Logs** | Historique des operations de synchronisation |
| **Config** | Statut des connexions API, parametres |

### Synchroniser un Evenement

1. Aller dans **Events**
2. Filtrer par statut **CONFIRMED**
3. Cliquer sur **PUSH TO PETZI** sur la carte d'evenement
4. Confirmer dans la modale
5. L'evenement passe en statut **SYNCED**

### Consulter les Analytics

1. Aller dans **Dashboard**
2. Selectionner un evenement dans le dropdown
3. Observer :
    - **Gross Revenue** : Chiffre d'affaires total
    - **Tickets Sold** : Nombre de billets + fill rate
    - **Sales Velocity** : Courbe de ventes dans le temps
    - **Geo Distribution** : Provenance des acheteurs

---

## API DOCUMENTATION

### Base URL

```
http://localhost:8080/api
```

### Endpoints

#### Events

| Methode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/events` | Liste tous les evenements |
| GET | `/events/{id}` | Details d'un evenement |
| GET | `/events/upcoming` | Evenements a venir |
| GET | `/events/search?name=xxx` | Recherche par nom |
| POST | `/events` | Creer un evenement |
| PUT | `/events/{id}` | Modifier un evenement |
| DELETE | `/events/{id}` | Supprimer un evenement |

#### Sales

| Methode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/sales` | Toutes les ventes |
| GET | `/sales/event/{eventId}` | Ventes d'un evenement |
| POST | `/sales/record` | Enregistrer une vente |

#### Sync

| Methode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/sync/events` | Synchroniser des evenements vers PETZI |
| GET | `/sync/logs` | Logs de synchronisation |
| GET | `/sync/logs/recent?limit=10` | Logs recents |

#### Webhooks

| Methode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/webhooks/petzi` | Reception des webhooks PETZI |

#### Health

| Methode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/health` | Statut du systeme |
| GET | `/health/heeds` | Connexion HEEDS |
| GET | `/health/petzi` | Connexion PETZI |

### Exemple de Reponse
//GET /api/events/evt-2024-001
```json

{
  "id": "evt-2024-001",
  "name": "SPFDJ",
  "date": "2024-06-15",
  "ticketSold": 523,
  "revenue": 13075.00
}
```

---

## TESTS

### Tester le Webhook PETZI

Un simulateur Python est fourni :

```bash
# Simuler un achat de billet
python petzi_simulator.py http://localhost:8080/api/webhooks/petzi

# Avec un secret personnalise
python petzi_simulator.py http://localhost:8080/api/webhooks/petzi "votre-secret"
```

---

## LICENCE

Projet developpe a des fins academiques dans le cadre du cours d'Urbanisation des SI a la HE-Arc.

Copyright 2026 Equipe Zhongma International Construction - HE-Arc

---

## REMERCIEMENTS

- **Case a Chocs** (Neuchatel) pour le contexte metier reel
- **Professeurs HE-Arc** pour l'encadrement pedagogique

---

<div align="center">
  <p><strong>Developpe par l'equipe Zhongma International Construction - HE-Arc 2026</strong></p>
  <p><em>Urbanisation des Systemes d'Information</em></p>
</div>