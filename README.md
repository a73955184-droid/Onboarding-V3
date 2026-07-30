# AaronBux Onboarding V3.1

A structural refactor of V2.4. All user-visible copy and assessment rules come from the supplied V2.4 repository. The assessment uses one reusable screen renderer. Recommendation-only visual refinements are isolated in `assets/css/recommendation.css`.

## Run locally

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

## Verify

```bash
npm test
```
