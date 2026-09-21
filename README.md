# Portail web d'analyse des risques selon ISO 27001

Application web permettant de réaliser une évaluation structurée de la sécurité d'une organisation, d'identifier et d'analyser les risques, de définir des mesures de traitement et de générer un rapport.

> **Projet académique — Université de Kinshasa (UNIKIN)**

---

## 🎯 Présentation du projet

Le **Portail web d'analyse des risques selon ISO 27001** est une application web développée dans le cadre d'un projet académique en informatique.

L'objectif est de démontrer concrètement comment une application web peut intégrer différents mécanismes de sécurité informatique et cryptographiques dans le cadre d'une démarche d'analyse des risques.

Le portail permet notamment de :

* réaliser un questionnaire d'évaluation de la sécurité ;
* enregistrer et analyser les réponses ;
* identifier les risques ;
* calculer leur criticité ;
* définir un plan de traitement ;
* gérer les utilisateurs et leurs permissions ;
* enregistrer les actions dans un journal d'audit ;
* protéger l'intégrité du journal par un mécanisme de signature ;
* générer des rapports ;
* exporter les résultats en PDF.

**Important :** ce portail est un outil d'évaluation et de démonstration. Il ne constitue pas un outil de certification ISO 27001.

---

## 🛡️ Fonctionnalités principales

### 📋 Questionnaire de sécurité

Le portail contient un questionnaire composé de **15 questions** réparties en plusieurs domaines :

* Gestion des accès
* Authentification
* Sauvegardes
* Sécurité réseau
* Gestion des incidents
* Sécurité physique
* Sensibilisation

Les réponses proposées sont :

* **Oui**
* **Partiellement**
* **Non**

Chaque question peut également être accompagnée de précisions ou d'observations.

---

### ⚠️ Analyse des risques

Les résultats de l'évaluation permettent d'identifier des risques potentiels.

Pour chaque risque, le système peut gérer notamment :

* titre ;
* description ;
* vulnérabilité ;
* conséquence ;
* probabilité ;
* impact ;
* criticité ;
* niveau ;
* statut.

La criticité permet de faciliter la classification des risques.

---

### 🛠️ Plan de traitement

Une fois les risques identifiés, des mesures de traitement peuvent être définies.

Une mesure peut notamment contenir :

* type de mesure ;
* description ;
* responsable ;
* priorité ;
* échéance ;
* statut.

Cela permet de passer de l'identification d'un risque à la définition d'une action corrective ou préventive.

---

### 👥 RBAC — Contrôle d'accès basé sur les rôles

Le portail utilise un système de **Role-Based Access Control (RBAC)**.

Les principaux rôles sont :

| Rôle                     | Fonction principale                                      |
| ------------------------ | -------------------------------------------------------- |
| **Administrateur**       | Administration du portail et gestion des utilisateurs    |
| **Responsable sécurité** | Analyse et traitement des risques                        |
| **Auditeur**             | Consultation et vérification des informations autorisées |
| **Utilisateur**          | Participation aux évaluations selon ses permissions      |

Les permissions sont vérifiées côté serveur afin d'empêcher l'accès non autorisé aux fonctionnalités protégées.

---

### 🔐 Authentification et sécurité

Le portail intègre plusieurs mécanismes de sécurité.

#### Hachage des mots de passe

Les mots de passe sont protégés avec **bcrypt** avant leur stockage.

Le mot de passe original n'est donc pas enregistré directement dans la base de données.

#### JWT

Les sessions utilisateurs utilisent des **JSON Web Tokens (JWT)** signés.

Le token permet notamment de conserver l'identité et le rôle de l'utilisateur pendant sa session.

#### Cookies sécurisés

La session est stockée dans un cookie configuré avec des propriétés de sécurité adaptées, notamment `HttpOnly`.

En production, le cookie utilise également `Secure`.

#### HTTPS / TLS

L'application déployée en ligne utilise **HTTPS**, qui s'appuie sur **TLS** pour protéger les communications entre le navigateur et le serveur.

---

## 🔎 Journal d'audit

Le portail dispose d'un journal permettant d'enregistrer les actions importantes réalisées dans l'application.

Les informations enregistrées peuvent notamment comprendre :

* utilisateur ;
* action ;
* description ;
* détails ;
* date ;
* signature.

Le mécanisme de signature cryptographique permet de renforcer l'intégrité des entrées du journal et de détecter certaines modifications non autorisées.

---

## 📄 Génération des rapports

Le portail permet de produire un rapport à partir des résultats de l'évaluation.

Le rapport peut notamment présenter :

* les informations de l'évaluation ;
* les résultats du questionnaire ;
* les risques identifiés ;
* leur criticité ;
* les mesures de traitement ;
* la conclusion.

Les résultats peuvent être exportés au format **PDF**.

---

# 🏗️ Architecture générale

L'architecture simplifiée du portail est la suivante :

```text
                    UTILISATEUR
                         │
                         ▼
              ┌────────────────────┐
              │   Interface Web    │
              │ React / Next.js    │
              └─────────┬──────────┘
                        │
                        ▼
              ┌────────────────────┐
              │   Couche logique  │
              │                    │
              │ Authentification   │
              │ Autorisation/RBAC  │
              │ Questionnaire      │
              │ Risques            │
              │ Traitements        │
              │ Audit              │
              │ Rapports           │
              └─────────┬──────────┘
                        │
                        ▼
              ┌────────────────────┐
              │      Prisma        │
              │       ORM          │
              └─────────┬──────────┘
                        │
                        ▼
              ┌────────────────────┐
              │   MySQL / TiDB     │
              │      Cloud         │
              └────────────────────┘
```

---

# 💻 Technologies utilisées

| Technologie      | Utilisation                                 |
| ---------------- | ------------------------------------------- |
| **Next.js**      | Framework de l'application web              |
| **React**        | Construction des interfaces utilisateur     |
| **TypeScript**   | Langage de développement                    |
| **Tailwind CSS** | Mise en forme et interface responsive       |
| **Prisma**       | ORM et interaction avec la base de données  |
| **MySQL**        | Système de gestion de base de données       |
| **TiDB Cloud**   | Hébergement de la base de données           |
| **bcryptjs**     | Hachage des mots de passe                   |
| **jose**         | Création et vérification des JWT            |
| **jsPDF**        | Génération des documents PDF                |
| **html2canvas**  | Capture/rendu des éléments HTML pour le PDF |
| **Lucide React** | Icônes de l'interface                       |
| **Vercel**       | Déploiement de l'application                |

---

# 🗄️ Modèle de données

Le portail utilise plusieurs modèles principaux.

```text
User
 │
 ├── Evaluation
 │      │
 │      ├── Reponse
 │      ├── Risque
 │      │      └── Mesure
 │      └── Rapport
 │
 └── AuditLog

Question
 │
 ├── Reponse
 ├── EvaluationQuestion
 └── Risque
```

### Principaux modèles

* `User` : utilisateurs du portail
* `Question` : questions du questionnaire
* `Evaluation` : évaluations réalisées
* `Reponse` : réponses aux questions
* `Risque` : risques identifiés
* `Mesure` : mesures de traitement
* `Rapport` : rapports générés
* `AuditLog` : journal des actions

---

# 🔄 Fonctionnement général

Le fonctionnement du portail peut être résumé par le processus suivant :

```text
Connexion
    │
    ▼
Authentification
    │
    ▼
Vérification des permissions
    │
    ▼
Questionnaire
    │
    ▼
Réponses
    │
    ▼
Évaluation
    │
    ▼
Identification des risques
    │
    ▼
Probabilité + Impact
    │
    ▼
Criticité
    │
    ▼
Plan de traitement
    │
    ▼
Journal d'audit
    │
    ▼
Rapport
    │
    ▼
Export PDF
```

---

# 📋 Domaines du questionnaire

Le questionnaire comprend 15 questions réparties comme suit :

| Domaine               | Questions |
| --------------------- | --------: |
| Gestion des accès     |         3 |
| Authentification      |         2 |
| Sauvegardes           |         2 |
| Sécurité réseau       |         2 |
| Gestion des incidents |         2 |
| Sécurité physique     |         2 |
| Sensibilisation       |         2 |
| **Total**             |    **15** |

---

# 🌐 Pages principales

Le portail comprend notamment les espaces suivants :

### Pages publiques

* `/`
* `/aide`
* `/contact`
* `/login`

### Pages protégées

* `/dashboard`
* `/questionnaire`
* `/risques`
* `/traitements`
* `/utilisateurs`
* `/audit`
* `/rapports`
* `/profil`
* `/evaluations`

L'accès aux pages protégées dépend de l'authentification et des permissions de l'utilisateur.

---

# 📱 Interface responsive

L'interface a été conçue pour fonctionner sur différents types d'appareils :

* ordinateurs ;
* ordinateurs portables ;
* tablettes ;
* smartphones.

Le portail peut donc être utilisé depuis un navigateur web sur différents formats d'écran.

---

# 🚀 Installation locale

## 1. Cloner le projet

```bash
git clone https://github.com/d5vc6zyv2h-dot/portail-iso-vercel.git
```

Puis :

```bash
cd portail-iso-vercel
```

---

## 2. Installer les dépendances

```bash
npm install
```

---

## 3. Configurer les variables d'environnement

Créer un fichier :

```text
.env
```

avec les variables nécessaires à l'application.

Exemple :

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:4000/portail_iso27001?sslaccept=strict"
SESSION_SECRET="votre-secret-de-session"
```

**Ne jamais publier le fichier `.env` sur GitHub.**

---

## 4. Générer Prisma Client

```bash
npx prisma generate
```

---

## 5. Vérifier la connexion à la base de données

Selon l'environnement utilisé, synchroniser ou récupérer le schéma Prisma :

```bash
npx prisma db pull
```

---

## 6. Construire l'application

```bash
npm run build
```

---

## 7. Lancer le serveur de développement

```bash
npm run dev
```

L'application sera ensuite accessible localement depuis le navigateur.

---

# 🔑 Variables d'environnement

Les principales variables utilisées sont :

| Variable         | Utilisation                          |
| ---------------- | ------------------------------------ |
| `DATABASE_URL`   | Connexion à la base de données       |
| `SESSION_SECRET` | Secret utilisé pour les sessions JWT |

Les valeurs réelles ne doivent pas être publiées dans le repository.

---

# ☁️ Déploiement

Le projet est conçu pour être déployé sur une plateforme cloud.

L'application web peut être déployée avec **Vercel** tandis que la base de données peut être hébergée sur **TiDB Cloud**.

Architecture de déploiement :

```text
Utilisateur
     │
     │ HTTPS / TLS
     ▼
┌───────────────┐
│    Vercel     │
│  Next.js App  │
└───────┬───────┘
        │
        │ Connexion sécurisée
        ▼
┌───────────────┐
│  TiDB Cloud   │
│    MySQL      │
└───────────────┘
```

---

# 🔒 Bonnes pratiques de sécurité

Pour utiliser le projet correctement :

* ne pas publier le fichier `.env` ;
* utiliser HTTPS en production ;
* utiliser un secret de session suffisamment robuste ;
* protéger les comptes administrateurs ;
* limiter les permissions selon les besoins ;
* effectuer régulièrement des sauvegardes ;
* maintenir les dépendances à jour ;
* ne pas utiliser de données sensibles réelles pour une démonstration académique ;
* vérifier régulièrement les journaux d'audit.

---

# 🎓 Objectif académique

Ce projet a pour objectif de démontrer concrètement l'utilisation de mécanismes de sécurité informatique et cryptographiques dans une application web.

Il permet notamment de mettre en pratique :

* l'authentification ;
* l'autorisation ;
* le RBAC ;
* le hachage des mots de passe ;
* les JWT ;
* HTTPS/TLS ;
* la signature cryptographique ;
* la journalisation ;
* l'analyse des risques ;
* la gestion des traitements ;
* la génération de rapports.

---

# ⚠️ Limites du projet

Ce portail est un **projet académique et démonstratif**.

Il ne doit pas être considéré comme une solution complète de certification ISO 27001.

Le questionnaire de 15 questions constitue une simplification permettant de démontrer le principe d'une évaluation de sécurité.

Une véritable démarche ISO 27001 nécessite une analyse beaucoup plus complète, des preuves, des processus organisationnels, une documentation adaptée et une démarche de management de la sécurité de l'information.

---

# 🔮 Améliorations futures

Plusieurs améliorations peuvent être envisagées :

* [ ] Ajouter davantage de questions d'évaluation
* [ ] Ajouter la gestion des preuves
* [ ] Ajouter des graphiques avancés
* [ ] Ajouter des notifications
* [ ] Ajouter une authentification multifacteur
* [ ] Ajouter une vérification automatique des signatures d'audit
* [ ] Améliorer le suivi des échéances
* [ ] Ajouter des statistiques de sécurité
* [ ] Ajouter des tests automatisés supplémentaires
* [ ] Renforcer les mécanismes de surveillance

---

# 👨‍💻 Auteur

**Mvuezolo Tshitshi Jordan**

Étudiant en informatique
Université de Kinshasa — RDC

Projet académique portant sur l'analyse des risques, la cybersécurité et le développement d'une application web sécurisée.

---

# 📞 Contact

Pour toute question concernant le projet, son fonctionnement ou sa démonstration, veuillez utiliser les coordonnées de contact prévues par le responsable du projet.

---

# 📚 Références

* ISO/IEC 27001 — Systèmes de management de la sécurité de l'information
* ISO/IEC 27002 — Mesures de sécurité de l'information
* Documentation Next.js
* Documentation React
* Documentation TypeScript
* Documentation Prisma
* Documentation Tailwind CSS
* Documentation JSON Web Token
* Documentation bcrypt
* Documentation TiDB Cloud
* Documentation Vercel

---

## 📌 Résumé

**Portail web d'analyse des risques selon ISO 27001**

Une application web permettant de :

**Évaluer → Identifier → Analyser → Traiter → Tracer → Rapporter**

avec une attention particulière portée à la sécurité, au contrôle des accès, à la cryptographie et à la traçabilité.
