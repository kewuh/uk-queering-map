# Placemarked

Placemarked is a community-based platform where individuals share their immigration experiences and stories across the UK on an interactive map. It connects personal narratives to political action, helping document the human impact of immigration policies and enabling advocacy for change.

## 🗺️ About Placemarked

Placemarked serves multiple purposes:
- **Personal**: A way for individuals to document and share their immigration experiences
- **Community**: A collective map showing the human impact of immigration policies across the UK
- **Political**: A bridge between personal immigration stories and policy advocacy
- **Historical**: A living archive of immigration experiences and their effects on real people

## 🗺️ Key Features

- **Interactive Map**: Visual representation of immigration experiences across the UK
- **Story Sharing**: Users can pin their immigration experiences to specific locations
- **Location Privacy**: Exact locations are obscured for safety - stories appear in general areas rather than precise coordinates
- **Emoji Feelings**: Categorize emotional responses to immigration experiences (happy, neutral, sad)
- **Filtering System**: Filter stories by emotional tone
- **Political Action**: Direct connection to immigration advocacy tools (Re:Immigration Email Drafter)
- **Community Moderation**: Volunteer-led content review to protect users and ensure anonymity
- **UK-centered map** (London coordinates)
- **Real immigration stories** from the community
- **OpenStreetMap tiles** (no CORS issues)
- **Automatic deployments** from GitHub

## Setup

You have two options for setting up the project: a quick setup for frontend-only work or a full setup with Supabase.

### Option 1: Quick Setup for Frontend-Only Work

This approach is quicker and allows you to work on the frontend without setting up Supabase. Note that popups will not show text if you choose this option.

1. Install dependencies with `npm ci`.
2. Run the seed script to generate mock data: `npm run seed-data`.
3. Copy `.env.example` into `.env`: `cp .env.example .env`.

### Option 2: Full Setup with Supabase

This approach is necessary if you want to work also work on the backend. It takes longer to set up but provides a complete development environment, aligned with what we use in production.

1. Install dependencies with `npm install`.
1. Set up a Supabase (local) project with the [official CLI](https://supabase.com/docs/guides/cli/getting-started).
1. Set the environment variables.
   1. Copy the `.env.example` file to `.env` (manually or with `cp .env.example .env`).
   1. Get your `SUPABASE_URL` and `SUPABASE_ANON_KEY` from the output of `supabase start`.
1. Run the DB migrations locally with `supabase db reset`.
1. Fetch the data from Supabase: `npm run fetch-data`.

## Developing

To start a development server:

```bash
npm run dev
```

## Testing

For testing the database make sure that the `pgTap` extension is enabled in postgres ([more info](https://supabase.com/docs/guides/database/extensions/pgtap)). Afterwards, you can run: `supabase test db`.

## Deploying and Building for production

To use Supabase as a remote backend make sure to link your local development with your remote Supabase project:

1. Make sure you have a Supabase acount and connect it to the supabase cli: `supabase login`
1. Link a specific remote project `supabase link --project-ref <project-ref>` ([more info](https://supabase.com/docs/reference/cli/supabase-link))
1. Run migrations on remote DB `supabase db push` ([more info](https://supabase.com/docs/reference/cli/supabase-db-push))
1. Make sure that the env vars `SUPABASE_URL` and `SUPABASE_ANON_KEY` do point to the correct production project and not the local containers. You can grab them from inside [your Supabase project's dashboard](https://supabase.com/dashboard/project/_/settings/api).

To create a production version of the app:

```bash
npm run build
```

### Set up Captcha Protection

For Captcha protection of the point submissions, we use Cloudflare Turnstile. Once you create a widget there, populate the correct values for the env variables:

```bash
PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY
CLOUDFLARE_TURNSTILE_SECRET
```

For more info, see this guide: https://developers.cloudflare.com/turnstile/get-started/.

# Test automatic deployment - Wed Jul 23 17:56:01 EDT 2025
