# certibyt-landing — Agent Guide

## Project
React 19 + Vite **multi-page marketing site** for **CertiByt** — enterprise exam & certification platform (`app.certibyt.io`). No backend. 6 routes, shared Navbar + Footer, GitHub Pages hosted.

## Stack
| Tool | Version | Role |
|------|---------|------|
| React | 19 | UI |
| Vite | 6 | Dev/build (`base: '/potential-pancake/'`) |
| Tailwind CSS | v3 | Utility classes — `darkMode: 'class'` |
| GSAP | 3 | ScrollTrigger pin/scroll sections |
| Framer Motion | 12 | Scroll-reveal, hover, entry animations |
| react-router-dom | 7 | Multi-page routing (6 routes) |
| lucide-react | — | Icons |

## Commands
```bash
npm run dev      # Vite dev server (default port 5173)
npm run build    # Production build → dist/
npm run preview  # Preview production build
```

## Deployment
- **Live URL**: `https://aman-0402.github.io/potential-pancake/`
- **Repo**: `https://github.com/Aman-0402/potential-pancake`
- **Trigger**: push to `main` → `.github/workflows/deploy.yml` → GitHub Pages
- **Base path**: `vite.config.js` `base: '/potential-pancake/'`; `BrowserRouter` uses `basename={import.meta.env.BASE_URL}`
- **SPA routing**: `public/404.html` redirects unknown paths back to root

## Routes
| Path | Page | Description |
|------|------|-------------|
| `/` | `Home` | Landing: Hero → Trusted → Problem → Solution |
| `/platform` | `Platform` | Platform overview |
| `/features` | `Features` | Feature deep-dive |
| `/security` | `Security` | Security analytics section |
| `/pricing` | `Pricing` | Pricing preview + FAQ accordion + conversion CTA |
| `/verify` | `Verify` | Certificate verification tool |

## Structure
```
src/
├── App.jsx                        # Routes + shared Navbar + Footer + ScrollToTop
├── main.jsx                       # React 19 createRoot; BrowserRouter with basename
├── index.css                      # Global styles + Tailwind directives + CSS vars
├── contexts/
│   └── ThemeContext.jsx            # Dark/light theme — persists to localStorage
├── pages/
│   ├── Home.jsx                   # Composes landing section components
│   ├── Platform.jsx
│   ├── Features.jsx
│   ├── Security.jsx
│   ├── Pricing.jsx
│   └── Verify.jsx
└── components/
    ├── ScrollToTop.jsx             # Resets scroll position on route change
    ├── EnterpriseBentoSection.jsx  # Bento grid section (shared/reusable)
    ├── navbar/
    │   ├── Navbar.jsx              # Top nav — desktop + mobile, scroll-aware
    │   ├── navItems.js             # NAV_ITEMS array (6 routes)
    │   ├── Logo.jsx
    │   ├── DesktopMenu.jsx
    │   ├── NavItem.jsx
    │   ├── MobileMenu.jsx
    │   ├── MobileMenuButton.jsx
    │   ├── ThemeToggle.jsx
    │   ├── CTAButton.jsx
    │   └── ScrollProgress.jsx
    ├── footer/
    │   ├── Footer.jsx
    │   ├── FooterBottom.jsx
    │   ├── FooterCTA.jsx
    │   ├── FooterColumn.jsx
    │   ├── FooterColumns.jsx
    │   ├── NewsletterCard.jsx
    │   ├── SocialLinks.jsx
    │   └── AnimatedDivider.jsx
    ├── landing/                    # Home page sections
    │   ├── HeroSection.jsx         # Hero: char-stagger headline, dashboard mockup, parallax mouse
    │   ├── TrustedSection.jsx      # Infinite logo marquee + animated stat cards
    │   ├── ProblemSection.jsx      # GSAP horizontal-pin problem card carousel
    │   └── SolutionSection.jsx     # Feature grid (6 solution cards)
    ├── pricing/
    │   ├── PricingPreview.jsx
    │   ├── FAQAccordion.jsx
    │   ├── ConversionSection.jsx
    │   └── FinalCTA.jsx
    ├── security/
    │   ├── SecurityAnalyticsSection.jsx
    │   ├── SecurityPanel.jsx
    │   ├── AnalyticsDashboard.jsx
    │   ├── AnimatedBackground.jsx
    │   └── SectionHeader.jsx
    └── verify/
        ├── VerifyHero.jsx
        ├── CertificateSearch.jsx
        ├── VerificationResult.jsx
        ├── VerificationTimeline.jsx
        ├── TrustBadges.jsx
        └── VerifyFAQ.jsx
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
`dark-50` → `dark-950` and `primary-300` → `primary-700` are registered in `tailwind.config.js` backed by the same CSS vars. Both `cv()` inline and Tailwind classes (`text-dark-400`, `bg-dark-900`) are valid.

### Theme
- `ThemeContext` stores `'dark'` | `'light'` in `localStorage`, default `'dark'`
- Applies `html.classList.add/remove('dark')` — Tailwind picks it up
- Read: `const { theme } = useTheme(); const isDark = theme === 'dark'`
- Use `isDark` to branch inline styles; Tailwind handles class-based variants

### Animation Patterns
```jsx
// Entry on mount (HeroSection only)
<motion.div initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }} />

// Scroll-reveal (all other sections) — always once: true
<motion.div
  initial={{ opacity:0, y:24 }}
  whileInView={{ opacity:1, y:0 }}
  viewport={{ once:true, margin:'-40px' }}
/>

// Hover lift
<motion.div whileHover={{ y:-4, scale:1.03 }} />
```

### Reduced Motion
All components call `const reduced = useReducedMotion()` and skip decorative animations. Do the same in new components.

### GSAP / ScrollTrigger
```jsx
// Register at module level
gsap.registerPlugin(ScrollTrigger)

// Cleanup in useEffect
useEffect(() => {
  const ctx = gsap.context(() => {
    ScrollTrigger.create({ ... })
  }, containerRef)
  return () => ctx.revert()
}, [])
```

### Routing
`react-router-dom` v7. `BrowserRouter` has `basename={import.meta.env.BASE_URL}` (set by Vite `base` config). Use `<Link>` for internal nav, `useNavigate` for programmatic navigation.

### No TypeScript
Plain `.jsx` only. No type annotations.

### Inline styles vs Tailwind
- Tailwind: layout, spacing, typography, static colors
- Inline `style={{}}`: computed values, glassmorphism, CSS-var expressions, motion values
- Never hardcode `rgba` for theme-sensitive surfaces — use `cv()` instead

## Shared Patterns
- `EASE = [0.25, 0.4, 0.25, 1]` — consistent cubic-bezier across all components
- `gradInnerStyle` — animated gradient text: `WebkitBackgroundClip: 'text'` + `backgroundPosition` keyframe
- Glassmorphism card: `backdropFilter: 'blur(Npx)'` + `cv(900, 0.75)` bg + `cv(700, 0.18)` border
- Decorative backgrounds: grid + orbs + particles — always `aria-hidden="true"` + `pointer-events-none`
- Section dividers: horizontal gradient line using `cv(950)` → accent color → `cv(950)`
