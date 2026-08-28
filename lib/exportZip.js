import JSZip from "jszip";

/**
 * Packages the generated React website files into a complete, standalone Vite + React ZIP repository,
 * including Docker containerization, Docker Compose, and CI/CD GitHub Actions workflows.
 */
export async function downloadProjectZip(files, projectTitle = "kriti-project") {
  const zip = new JSZip();

  const appCode = files?.["/App.js"]?.code || files?.["App.js"]?.code || `
import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <h1 className="text-3xl font-bold">Hello from Kriti AI Studio</h1>
    </div>
  );
}
`;

  // 1. package.json
  zip.file("package.json", JSON.stringify({
    name: projectTitle.toLowerCase().replace(/[^a-z0-9]/g, "-"),
    private: true,
    version: "0.1.0",
    type: "module",
    scripts: {
      dev: "vite",
      build: "vite build",
      preview: "vite preview"
    },
    dependencies: {
      "react": "^18.3.1",
      "react-dom": "^18.3.1",
      "lucide-react": "^0.471.2",
      "clsx": "^2.1.1",
      "tailwind-merge": "^2.6.0"
    },
    devDependencies: {
      "@types/react": "^18.3.3",
      "@types/react-dom": "^18.3.0",
      "@vitejs/plugin-react": "^4.3.1",
      "autoprefixer": "^10.4.19",
      "postcss": "^8.4.38",
      "tailwindcss": "^3.4.4",
      "vite": "^5.3.4"
    }
  }, null, 2));

  // 2. vite.config.js
  zip.file("vite.config.js", `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  }
})
`);

  // 3. tailwind.config.js
  zip.file("tailwind.config.js", `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`);

  // 4. postcss.config.js
  zip.file("postcss.config.js", `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`);

  // 5. index.html
  zip.file("index.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectTitle}</title>
  </head>
  <body class="bg-slate-950 text-slate-100 antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`);

  // 6. src/main.jsx
  const src = zip.folder("src");
  src.file("main.jsx", `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`);

  // 7. src/index.css
  src.file("index.css", `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  min-height: 100vh;
}
`);

  // 8. src/App.jsx
  src.file("App.jsx", appCode);

  // 9. Dockerfile (Production Multi-Stage Build)
  zip.file("Dockerfile", `# Multi-stage production build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
`);

  // 10. docker-compose.yml
  zip.file("docker-compose.yml", `version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:80"
    restart: unless-stopped
`);

  // 11. CI/CD GitHub Actions Workflow (.github/workflows/deploy.yml)
  const githubWorkflows = zip.folder(".github").folder("workflows");
  githubWorkflows.file("deploy.yml", `name: Build & Test CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run build
`);

  // 12. README.md
  zip.file("README.md", `# ${projectTitle}

Generated with **Kriti AI Studio** (Powered by Multiple ML Pipelines & DevOps Automation).

## Quick Start

### 1. Local Development
\`\`\`bash
# Install dependencies
npm install

# Run the development server
npm run dev
\`\`\`

### 2. Docker Containerized Run
\`\`\`bash
# Build & start container
docker-compose up --build -d
\`\`\`

### 3. Production Build
\`\`\`bash
npm run build
\`\`\`
`);

  // Generate blob and trigger browser download
  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${projectTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
