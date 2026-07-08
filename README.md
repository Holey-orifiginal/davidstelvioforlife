# Stelvio For Life – Flyer & Fundraiser

Personal fundraiser page for the [Stelvio For Life](https://stelvioforlife.nl) charity cycling event (29 augustus 2026). The goal is to raise € 1.533 for cancer research by cycling to the top of the Passo dello Stelvio (2757 m).

## Project structure

```
index.html              # Public-facing flyer (A4-print ready)
admin.html              # Admin page to update the fundraising progress
netlify/
  functions/
    progress.js         # Netlify serverless function – GET/POST fundraising data
netlify.toml            # Netlify build & function configuration
package.json
```

## How it works

- **`index.html`** – Static flyer that fetches live progress from `/api/progress` on load and displays a progress bar and raised-amount stat.
- **`progress.js`** – Netlify function backed by [Netlify Blobs](https://docs.netlify.com/blobs/overview/) for persistent storage.
  - `GET /api/progress` – returns `{ raised, goal, pct }` (no auth required).
  - `POST /api/progress` – updates the raised amount; requires the `X-Admin-Key` header to match the `ADMIN_KEY` environment variable.
- **`admin.html`** – Simple form to POST a new `raised` value to the function using the admin key.

## Local development

```bash
npm install
npx netlify dev
```

The site is then available at `http://localhost:8888`.

## Deployment

Deployed on [Netlify](https://netlify.com). Connect the repository in the Netlify dashboard and set the following environment variable:

| Variable    | Description                              |
|-------------|------------------------------------------|
| `ADMIN_KEY` | Secret key required to update progress  |

## Print

Open `index.html` in a browser and use **Ctrl + P** (or **Cmd + P** on Mac). The page is styled for A4 portrait with 10 mm margins — no further adjustments needed.

## License

[BSD 2-Clause](LICENSE)
