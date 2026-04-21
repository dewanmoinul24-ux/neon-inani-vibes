

## Download project as zip

Package your InaniVibes source code as a downloadable zip you can open in any editor or push to GitHub.

### What's included
- All source: `src/`, `public/`, `supabase/`, `index.html`
- Config: `package.json`, `vite.config.ts`, `tailwind.config.ts`, `tsconfig*.json`, `eslint.config.js`, `postcss.config.js`, `components.json`
- `README.md` with setup instructions
- `.env.example` listing required Lovable Cloud variables (with placeholder values, not real keys)
- `.gitignore`

### What's excluded
- `node_modules/` (run `npm install` to restore)
- `.env` (real keys — replace placeholders in `.env.example` to reconnect)
- `dist/`, `.git/`, lock-only artifacts, OS junk (`.DS_Store`)

### Output
- File: `inanivibes-source.zip` in `/mnt/documents/`
- Delivered as a downloadable artifact in chat

### How to use the zip after download
1. Unzip
2. `npm install`
3. Copy `.env.example` → `.env` and paste your Lovable Cloud keys (still available in this project)
4. `npm run dev`

### Technical steps
1. Create `/tmp/build-zip/` staging folder, copy project files in with `rsync` excluding the items above
2. Generate `.env.example` from the real `.env` (variable names only, placeholder values)
3. `zip -r /mnt/documents/inanivibes-source.zip .` from staging
4. Verify size and emit `<lov-artifact>` tag

