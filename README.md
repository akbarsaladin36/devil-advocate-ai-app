# ☠ Devil's Advocate — AI Penguji Keputusan

> AI yang sengaja mencari lubang dari rencanamu — bukan untuk menjatuhkan, tapi agar keputusanmu benar-benar matang.

## Tech Stack
- **Vue 3** (Options API)
- **Vue Router 4**
- **Vite**
- **OpenRouter API** (streaming)
- **Deploy: Vercel**

## Setup Local

### 1. Install dependencies
```bash
npm install
```

### 2. Setup Environment Variables
Copy `.env.example` ke `.env` lalu isi API key:
```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxx
VITE_OPENROUTER_MODEL=deepseek/deepseek-r1
```

> Dapatkan API key di: https://openrouter.ai/keys

### 3. Jalankan dev server
```bash
npm run dev
```

Buka http://localhost:5173

## Deploy ke Vercel

### Cara 1: Via Vercel CLI
```bash
npm install -g vercel
vercel
```

### Cara 2: Via GitHub
1. Push repo ke GitHub
2. Buka vercel.com → New Project → Import repo
3. Add Environment Variables:
   - `VITE_OPENROUTER_API_KEY` = API key kamu
   - `VITE_OPENROUTER_MODEL` = `deepseek/deepseek-r1`
4. Deploy!

## Model yang Direkomendasikan (OpenRouter)
| Model | Kecepatan | Kualitas | Biaya |
|-------|-----------|----------|-------|
| `deepseek/deepseek-r1` | ★★★ | ★★★★★ | Murah |
| `anthropic/claude-3.5-sonnet` | ★★★★ | ★★★★★ | Sedang |
| `openai/gpt-4o` | ★★★★ | ★★★★ | Sedang |
| `meta-llama/llama-3.1-8b-instruct` | ★★★★★ | ★★★ | Gratis |

## Struktur Project
```
src/
├── assets/
│   └── main.css          # Global styles
├── views/
│   ├── HomePage.vue      # Landing page
│   ├── AnalyzePage.vue   # Form input (4 langkah)
│   └── ResultPage.vue    # Hasil analisis + checklist
├── services/
│   └── openrouter.js     # OpenRouter API service
├── App.vue               # Root + navbar + router-view
└── main.js               # Entry point + router setup
```

## Fitur
- ✅ Pilih 6 kategori keputusan
- ✅ Form 4 langkah yang intuitif
- ✅ Analisis dari 5 dimensi (finansial, pasar, skill, timing, motivasi)
- ✅ Skor kesiapan per dimensi + overall
- ✅ Verdict (TIDAK SIAP / PERLU PERBAIKAN / HAMPIR SIAP / SIAP)
- ✅ Checklist PR interaktif
- ✅ Blind spot insight
- ✅ Share hasil ke clipboard
- ✅ Streaming response dari OpenRouter
- ✅ Responsive mobile
- ✅ Dark editorial aesthetic
