# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Deploy to Render

This repository is configured as a single Render Web Service. The Express backend serves the Vite production build, so React Router routes work on direct page refreshes.

1. Push this project to GitHub.
2. In Render, choose **New → Blueprint** and select the repository containing `render.yaml`.
3. Add the environment variables requested by the Blueprint: `MONGODB_URI`, `JWT_SECRET`, `OPENAI_API_KEY`, `EMAIL_USER`, and `EMAIL_APP_PASSWORD`.
4. Deploy. Render uses the `PORT` value automatically and the health check is `/api/health`.

### Local development

- Frontend: `npm run dev`
- Backend: `npm --prefix backend start`
- Optional: create `backend/.env` from `backend/.env.example`.

Never commit real API keys, database passwords, JWT secrets, or email app passwords.
