# Corporateify
1. cp .env.example .env.local and set ANTHROPIC_API_KEY
2. npm install && npm run dev -> http://localhost:3000
The key is only read server-side (app/api/translate/route.ts). Modes and prompts: lib/modes.ts.
