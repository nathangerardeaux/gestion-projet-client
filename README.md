# Gestion de projet - Client

Client web React de l'application de gestion de projets : connexion, projets, tâches,
statuts, participants et affectation. Test technique pour le poste de mentor
Informatique & Cybersécurité (Ynov Lille).

Dépôt serveur associé (**à démarrer en premier**) :
https://github.com/nathangerardeaux/gestion-projet-api

## Stack technique

- React 19, TypeScript, Vite
- react-router-dom (routage), axios (HTTP)

## Prérequis

- [Node.js](https://nodejs.org) >= 24
- L'API démarrée sur http://localhost:3000 (voir le README du dépôt serveur)

## Installation

```bash
git clone https://github.com/nathangerardeaux/gestion-projet-client.git
cd gestion-projet-client
copy .env.example .env   # macOS/Linux : cp .env.example .env
npm install
npm run dev              # application sur http://localhost:5173
```

Le fichier `.env` contient l'adresse de l'API :

```
VITE_API_URL=http://localhost:3000/api
```

## Comptes de démonstration

| Email            | Mot de passe |
| ---------------- | ------------ |
| demo@exemple.fr  | Demo1234!    |
| alice@exemple.fr | Demo1234!    |
| bob@exemple.fr   | Demo1234!    |

## Structure du projet

```
src/
├── main.tsx        # point d'entrée (React, routeur, contexte d'auth)
├── App.tsx         # routes + en-tête
├── types.ts        # types partagés avec l'API
├── labels.ts       # libellés français des statuts
├── api/            # appels HTTP (axios + jeton + erreurs)
├── auth/           # session (AuthContext, ProtectedRoute)
├── pages/          # Login, Projets, Détail projet
└── components/     # TaskForm, TaskRow, ParticipantsPanel
```

## Fonctionnalités

- **FT1** Authentification (JWT, session restaurée au rechargement)
- **FT2** Gestion des projets (créer, lister, modifier, supprimer)
- **FT3** Gestion des tâches (CRUD par projet)
- **FT4** Statuts (à faire / en cours / terminé) et filtre par statut
- **FT5** Participants (ajout par email, liste)
- **FT6** Affectation des tâches à un participant

## Commandes utiles

| Commande          | Effet                                |
| ----------------- | ------------------------------------ |
| `npm run dev`     | serveur de développement (port 5173) |
| `npm run build`   | build de production dans `dist/`     |
| `npm run preview` | prévisualise le build de production  |
