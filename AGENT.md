# certibyt-landing — Agent Guide

## Project
React 19 + Vite landing page for **CertiByt** — enterprise exam & certification platform (`app.certibyt.io`). No backend. Single scrolling page with a few router-driven routes.

## Stack
| Tool | Version | Role |
|------|---------|------|
| React | 19 | UI |
| Vite | 6 | Dev/build |
| Tailwind CSS | v3 | Utility classes — `darkMode: 'class'` |
| GSAP | 3 | ScrollTrigger pin/scroll sections |
| Framer Motion | 12 | Scroll-reveal, hover, entry animations |
| react-router-dom | 7 | CTA navigation (`/register`, `/contact`) |
| lucide-react | — | Icons |

## Commands
```bash
npm run dev      # Vite dev server (default port 5173)
npm run build    # Production build → dist/
npm run preview  # Preview production build
```

## Structure
```
src/
├── App.jsx                          # Root: composes all sections + ThemeToggle
├── main.jsx                         # React 19 createRoot entry
├── index.css                        # Global styles + Tailwind directives + CSS vars
├── contexts/
│   └── ThemeContext.jsx              # Dark/light theme — persists to localStorage
└── components/landing/
    ├── HeroSection.jsx               # Hero: char-stagger headline, dashboard mockup, parallax mouse
    ├── TrustedSection.jsx            # Infinite logo marquee + animated stat cards
    ├── ProblemSection.jsx            # GSAP horizontal-pin problem card carousel
    ├── SolutionSection.jsx           # Feature grid (6 solution cards)
    └── InteractiveShowcase.jsx       # GSAP sticky 8-chapter scroll with AnimatePresence panel swap
```

## Key Conventions

### CSS Variables (`cv` helper)
Every component defines a local helper:
```js
const cv = (n, op = 1) =>
  op < 1 ? `rgb(var(--c-dark-${n}) / ${op})` : `rgb(var(--c-dark-${n}))`
```
`--c-dark-NNN` vars are space-separated RGB triplets defined in `index.css`. Use `cv()` for all glassmorphism / semi-transparent surfaces — never hardcode `rgba` for theme-sensitive colors.

### Tailwind Color Scales
`dark-50` → `dark-950` and `primary-300` → `primary-700` are registered in `tailwind.config.js` backed by the same CSS vars. Both `cv()` inline and Tailwind classes (`text-dark-400`, `bg-dark-900`) are valid — pick whichever fits.

### Theme
- `ThemeContext` stores `'dark'` | `'light'` in `localStorage`, default `'dark'`
- Applies `html.classList.add/remove('dark')` — Tailwind picks it up
- Read in components: `const { theme } = useTheme(); const isDark = theme === 'dark'`
- Use `isDark` to branch inline styles for glassmorphism values; Tailwind handles class-based variants

### Animation Patterns
```jsx
// Entry on mount (HeroSection)
<motion.div initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }} />

// Scroll-reveal (all other sections) — once: true
<motion.div
  initial={{ opacity:0, y:24 }}
  whileInView={{ opacity:1, y:0 }}
  viewport={{ once:true, margin:'-40px' }}
/>

// Hover lift
<motion.div whileHover={{ y:-4, scale:1.03 }} />
```

### Reduced Motion
All components call `const reduced = useReducedMotion()` and skip decorative animations when true. Do the same in new components.

### GSAP / ScrollTrigger
```jsx
// Register at module level — safe if imported multiple times
gsap.registerPlugin(ScrollTrigger)

// Cleanup pattern in useEffect
useEffect(() => {
  const ctx = gsap.context(() => {
    ScrollTrigger.create({ ... })
  }, containerRef)
  return () => ctx.revert()
}, [])
```

### Routing
`react-router-dom` v7 is installed. `HeroSection` CTAs navigate to `/register` and `/contact` via `useNavigate`. App is wrapped in `<BrowserRouter>` in `main.jsx`.

### No TypeScript
Plain `.jsx` only. No type annotations.

### Inline styles vs Tailwind
- Tailwind for layout, spacing, typography, static colors
- Inline `style={{}}` for computed/dynamic values (glassmorphism borders, glow shadows, CSS-var expressions, motion values)
- Never hardcode `rgba` for theme-sensitive surfaces — use `cv()` instead

## Sections (render order)
| # | Component | Notes |
|---|-----------|-------|
| 1 | `HeroSection` | Full-height, parallax mouse on mockup, char-by-char headline stagger |
| 2 | `TrustedSection` | Infinite CSS marquee (pauses on hover) + 4 stat cards with in-view counters |
| 3 | `ProblemSection` | GSAP horizontal pin — cards scroll into view on vertical scroll |
| 4 | `SolutionSection` | 6 feature cards, `whileInView` fade-up, no GSAP |
| 5 | `InteractiveShowcase` | GSAP sticky pin, 8 chapters, `AnimatePresence` swaps panel content |

## Shared Patterns Across Components
- `EASE = [0.25, 0.4, 0.25, 1]` — consistent cubic-bezier
- `gradInnerStyle` — animated gradient text: `WebkitBackgroundClip: 'text'` + `backgroundPosition` keyframe
- Glassmorphism card: `backdropFilter: 'blur(Npx)'` + `cv(900, 0.75)` background + `cv(700, 0.18)` border
- Decorative backgrounds: grid lines, radial orbs, floating particles — all `aria-hidden="true"` and `pointer-events-none`
