# Simple Radio Browser

A fast, focused web radio directory for discovering and listening to online radio stations. Browse popular stations, search by name, filter by country or tag, and keep playback available while navigating between pages.

## Features

- Browse the most-voted stations for a selected country.
- Search stations by name and filter them by tag.
- Open a dedicated station page with location, popularity, tags, and homepage details.
- Play live streams from a persistent player shared across page transitions.
- Control playback, volume, and mute state. Volume and mute preferences are persisted locally.
- Discover healthy Radio Browser API servers through DNS with a fallback server and request retries.
- Responsive layout with a mobile navigation drawer.

## Tech Stack

- [Astro](https://astro.build/) 5 with server-side rendering
- [React](https://react.dev/) 19 for interactive components
- [Zustand](https://zustand.docs.pmnd.rs/) for player and UI state
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Radio Browser API](https://www.radio-browser.info/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/) through the Astro Cloudflare adapter

## Requirements

- Node.js 18.17 or newer
- npm, or [Bun](https://bun.sh/) if you prefer using the repository's `bun.lock`

## Getting Started

Clone the repository and install its dependencies:

```bash
git clone <repository-url>
cd simple-radio-browser
npm install
```

Start the development server:

```bash
npm run dev
```

The app is available at [http://localhost:4321/radio](http://localhost:4321/radio). The `/radio` base path is configured in `astro.config.mjs`.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Astro development server. |
| `npm run build` | Build the production Cloudflare Worker output. |
| `npm run preview` | Preview the production build locally. |
| `npm run astro -- <command>` | Run an Astro CLI command. |

## Project Structure

```text
src/
├── components/    Shared Astro and React UI components
├── icons/         Brand and application icons
├── layouts/       Shared page layout, navigation, and player shell
├── lib/           Radio Browser API access and station normalization
├── pages/         Home, station details, and error routes
├── stores/        Zustand stores for player and UI state
├── styles/        Global Tailwind and application styles
└── types/         Shared TypeScript types
```

## Data Source

Station, country, and tag data comes from the public [Radio Browser](https://www.radio-browser.info/) service. The server resolves available API hosts, checks their health, and retries failed requests. No API key or application environment variables are required for local development.

Because station streams are provided by third parties, availability and playback quality may vary between stations.

## Deployment

The project is configured for server output on Cloudflare Workers using `@astrojs/cloudflare`. Build the application first:

```bash
npm run build
```

The generated Worker entry point is `dist/_worker.js/index.js`, and the static assets are emitted to `dist/`. `wrangler.jsonc` contains the Worker configuration, including the `nodejs_compat` compatibility flag and the `/radio` application base path.

To deploy, authenticate with Wrangler and run:

```bash
npx wrangler deploy
```

Update the route or custom domain in `wrangler.jsonc` before deploying to a different Cloudflare project.
