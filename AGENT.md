# certibyt-landing — Agent Guide

## Project
React 19 + Vite landing page for Certibyt. No backend, no routing — single-page scroll.

## Stack
- **React 19** (JSX, no TypeScript)
- **Vite 6** — dev server on default port 5173
- **Tailwind CSS v3** — utility classes, configured in `tailwind.config.js`
- **GSAP 3** — ScrollTrigger for pinned/scroll-driven sections
- **Framer Motion 12** — supplemental animations
- **lucide-react** — icons

## Commands
```bash
npm run dev      # Start dev server (Vite, port 5173)
npm run build    # Production build → dist/
npm run preview  # Preview production build
```

## Structure
```
src/
├── App.jsx                        # Root — composes all sections top-to-bottom
├── main.jsx                       # React 19 createRoot entry
├── index.css                      # Global styles + Tailwind directives
├── contexts/
│   └── ThemeContext.jsx            # Dark/light theme (CSS class on <html>)
└── components/landing/
    ├── HeroSection.jsx             # Hero + animated headline
    ├── TrustedSection.jsx          # Logo trust bar
    ├── ProblemSection.jsx          # Horizontal scroll card carousel (GSAP pin)
    ├── SolutionSection.jsx         # Solution feature cards
    └── InteractiveShowcase.jsx     # 8-chapter sticky scroll storytelling (GSAP pin)
```

## Key Conventions
- **No TypeScript** — plain `.jsx` files only
- **No routing** — single page, anchor scroll only
- **GSAP ScrollTrigger** — always call `ScrollTrigger.refresh()` after layout changes; clean up triggers in `useEffect` return
- **Theme** — read from `useTheme()` hook; `theme === 'dark'` drives class/style conditionals
- **CSS** — Tailwind utilities preferred; inline `style={{}}` used only for dynamic/computed values
- **No styled-components** — Tailwind + inline style for dynamic values only

## GSAP Pattern
```jsx
useEffect(() => {
  const ctx = gsap.context(() => {
    ScrollTrigger.create({ ... })
  }, containerRef)
  return () => ctx.revert()
}, [])
```

## Sections (render order)
1. `HeroSection` — above fold
2. `TrustedSection` — logo strip
3. `ProblemSection` — GSAP horizontal pin
4. `SolutionSection` — feature grid
5. `InteractiveShowcase` — GSAP sticky 8-chapter scroll
