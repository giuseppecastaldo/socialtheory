
# SocialTheory

SocialTheory è un mini social network che consente agli utenti di connettersi, condividere e interagire in tempo reale. Questo README fornisce una panoramica delle funzionalità dell'applicazione, dei passaggi di installazione e delle configurazioni aggiuntive necessarie per eseguirla in locale.

## Funzionalità

- **Registrazione e Login Utente**: Gli utenti possono registrarsi e accedere utilizzando la propria email o l'account Google.
- **Creazione Post**: Gli utenti possono pubblicare post testuali sulla propria bacheca (diario) visibili in tempo reale da tutti gli altri utenti.
- **Aggiornamenti in Tempo Reale**: I post e le attività degli utenti vengono aggiornati in tempo reale utilizzando Pusher.js.
- **Elenco Utenti Online**: Visualizza un elenco di utenti attualmente attivi nella barra laterale sinistra.
- **Impostazioni del Profilo**: Gli utenti possono gestire il proprio profilo con le seguenti azioni:
    - Eliminazione del proprio account
    - Modifica della password
    - Aggiornamento delle informazioni del profilo, inclusi immagine del profilo, nome ed email

## Tecnologie Utilizzate

- **Framework**: Next.js
- **ORM**: Prisma
- **Aggiornamenti in Tempo Reale**: Pusher.js per la comunicazione tramite WebSocket
- **Storage**: Cloudflare R2 (compatibile con lo storage AWS S3) per l'archiviazione delle immagini
- **Database**: Database MySQL

## Installazione e Configurazione in Locale

Per eseguire SocialTheory in locale, seguire questi passaggi:

### Prerequisiti

- Node.js installato (versione 14.x o superiore)
- Un database MySQL in esecuzione in locale o su un server
- Cloudflare R2 (o un servizio compatibile con AWS S3) per l'archiviazione delle immagini del profilo
- Account Pusher per la comunicazione WebSocket in tempo reale

### Procedura Passo-Passo

1. **Clonare il Repository**
   ```bash
   git clone https://github.com/giuseppecastaldo/socialtheory.git
   cd socialtheory
   ```

2. **Installare le Dipendenze**
   ```bash
   npm install
   ```

3. **Configurare le Variabili d'Ambiente**

   Creare un file `.env` nella root del progetto e compilare quanto segue:

   ```env
   DATABASE_URL=
   PUSHER_APP_ID=
   NEXT_PUBLIC_PUSHER_APP_KEY=
   PUSHER_APP_SECRET=
   NEXT_PUBLIC_PUSHER_CLUSTER=
   CLOUD_STORAGE_ACCESS_KEY=
   CLOUD_STORAGE_SECRET_KEY=
   CLOUD_STORAGE_BUCKET=
   CLOUD_STORAGE_ENDPOINT=
   NEXTAUTH_SECRET=
   AUTH_SECRET=
   AUTH_TRUST_HOST=
   NEXTAUTH_URL=
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   R2_PUBLIC_ENDPOINT=
   ```

4. **Configurare il Database**

   Eseguire il seguente comando per migrare lo schema del database:

   ```bash
   npx prisma migrate dev
   ```

5. **Avviare il Server di Sviluppo**

   ```bash
   npm run dev
   ```

   Questo comando avvierà l'applicazione su `http://localhost:3000`.

6. **Accedere all'Applicazione**

   Aprire un browser e andare su `http://localhost:3000`. Dovresti vedere la pagina di accesso di SocialTheory.