# Récoltéo

Mise en relation commerçants / associations pour les dons alimentaires. Déclaration de lots, réservation, validation des collectes, génération CERFA.

## Stack

Next.js App Router · TypeScript · Supabase (Auth + PostgreSQL + Storage) · Tailwind v4 · Motion · Resend · pdf-lib · xlsx · API BAN

## Install

```bash
npm install
cp .env.example .env.local  # remplir les valeurs (voir VARIABLES.md)
npm run dev
```

## Structure

```
src/
├── app/          # Routes Next.js (voir src/app/README.md)
├── components/   # Composants partagés (voir src/components/README.md)
├── lib/          # Logique métier, clients Supabase (voir src/lib/README.md)
└── asset/        # Images, SVG, template CERFA.pdf
middleware.ts     # Auth + rate limiting (10 req/15min/IP)
```

## Règles importantes

**Clients Supabase — lequel utiliser :**
- `createClient()` (server) → Server Components, Actions, API routes — respecte les RLS
- `createClient()` (browser) → `"use client"` uniquement
- `createAdminClient()` → Server Actions uniquement, **toujours après vérification des droits**, contourne les RLS

**Pattern Server Action :**
```
1. createClient() + getUser()
2. vérifier les permissions en base (RLS)
3. createAdminClient() pour l'opération si nécessaire
4. revalidatePath()
```

**Sécurité :**
- Documents chiffrés AES-256-GCM avant stockage (`lib/server/doc-crypto.ts`)
- Headers HTTP sécurisés dans `next.config.ts`
- Husky bloque les commits avec secrets détectés

## Commandes

```bash
npm run dev    # dev
npm run build  # prod build
npm run lint   # ESLint
```
