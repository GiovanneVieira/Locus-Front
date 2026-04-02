# Como Compilar

Basta abrir a pasta do projeto em seu repositório local e digitar:

```bash
docker compose up --build --watch
```

O ```--watch``` serve para que sempre que houver qualquer alteração no código a imagem seja rebuildada e um container suba automaticamente. 




# React + TypeScript + Vite + shadcn/ui

This is a template for a new Vite project with React, TypeScript, and shadcn/ui.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `src/components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button"
```
