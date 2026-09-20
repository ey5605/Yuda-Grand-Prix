# Yuda Grand Prix

A retro arcade-style racing game built with React, TypeScript, and Tailwind CSS. Dodge incoming traffic, navigate oil slicks and road barriers, pick up bonuses, and race against changing day-to-night cycles.

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Preview the production build locally:
   ```bash
   npm run preview
   ```

## Deploying to GitHub Pages

This project is configured with relative asset paths (`base: './'`) in `vite.config.ts`, ensuring it runs on GitHub Pages repositories without broken links or blank screens.

To enable automated deployment:
1. Go to your repository on GitHub.
2. Click **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. Push to `main` (or run the workflow manually under the **Actions** tab). Your game will deploy automatically.
