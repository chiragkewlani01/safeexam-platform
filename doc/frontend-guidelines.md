# Frontend Guidelines & Design System — SafeExam

---

## 🧠 Overview

SafeExam frontend is designed with a **clean, minimal, and intuitive UI philosophy**, inspired by Google and Apple design systems.

The goal is:

* Clarity over complexity
* Consistency across all pages
* Smooth and distraction-free user experience

---

# 🎨 1. Design Philosophy

---

## Core Principles

* Minimal UI (no clutter)
* Clear hierarchy (important elements stand out)
* Consistent spacing and alignment
* Fast and responsive interactions
* Accessibility-friendly

---

## Design Style

* Clean SaaS-style interface
* Light-first with optional dark mode
* Soft shadows, subtle borders
* No heavy gradients or flashy effects

---

# 🌗 2. Theme System

---

## Supported Modes

* Light Mode (default)
* Dark Mode (toggle supported)

---

## Color System

### Primary Colors

```css
Primary: #2563EB
```

---

### Background

```css
#FFFFFF (main)
#F9FAFB (secondary)
```

---

### Text

```css
#111827 (primary text)
#6B7280 (secondary text)
#9CA3AF (muted text)
```

---

### Borders

```css
#E5E7EB
```

---

### Status Colors

```css
Success: #22C55E
Error: #EF4444
Warning: #F59E0B
Info: #3B82F6
```

---

## Usage Rules

* Use primary color only for actions (buttons, highlights)
* Avoid overusing colors
* Maintain high contrast for readability

---

# 🔤 3. Typography

---

## Font Stack

```css
Primary: Inter
Fallback: Poppins / Roboto
```

---

## Rules

* Headings → bold
* Body → normal weight
* Avoid too many font sizes

---

## Example Scale

```css
h1 → 24px
h2 → 20px
h3 → 18px
body → 14–16px
small → 12px
```

---

# 📏 4. Spacing System (CRITICAL)

---

## Base Unit → 8px (Industry Standard)

All spacing must follow multiples of 8:

```text
8px → xs
16px → sm
24px → md
32px → lg
40px → xl
```

---

## Rules

* Maintain equal padding across components
* Avoid random spacing values
* Use Tailwind spacing utilities consistently

---

# 🧱 5. Layout System

---

## Layout Type → Mixed Navigation

* Topbar (global navigation)
* Sidebar (dashboard)
* Breadcrumbs for navigation clarity

---

## Structure

```text
Page
 ├── Topbar
 ├── Sidebar (if dashboard)
 └── Content Area
```

---

## Rules

* Keep content centered and readable
* Use max-width containers
* Maintain whitespace

---

# 📱 6. Responsiveness

---

## Approach → Mobile + Desktop (Fully Responsive)

---

## Breakpoints (Tailwind)

```text
sm → mobile
md → tablet
lg → desktop
xl → large screens
```

---

## Rules

* Avoid horizontal scroll
* Stack elements on mobile
* Use flexible grids

---

# 🧩 7. Component System

---

## Tech Stack

* Tailwind CSS
* shadcn/ui components

---

## Component Rules

* Reusable components only
* No inline styles
* Keep components small

---

## Folder Structure

```text
client/src/
├── components/
├── features/
├── layouts/
├── pages/
```

---

## Naming Convention

* `ExamCard.jsx`
* `LoginButton.jsx`
* `DashboardLayout.jsx`

---

# ⚡ 8. State Management

---

## Tool → Zustand

---

## Rules

* Keep global state minimal
* Use local state where possible
* Separate store per feature

---

## Example

```js
useExamStore
useAuthStore
```

---

# 🧪 9. Exam Interface (VERY IMPORTANT)

---

## Mode → Strict + Monitoring

---

## Rules

* Fullscreen enforced
* Minimal UI (no distractions)
* Timer always visible
* Questions clearly readable

---

## Layout

```text
Header → Timer
Body → Question
Sidebar → Navigation (optional)
Footer → Submit
```

---

## Behavior

* Autosave answers
* Warning popup on tab switch
* Limit violations

---

# 🔔 10. Feedback System

---

## Components

* Toast notifications (primary)
* Alerts (critical warnings)

---

## Rules

* Use toast for:

  * success
  * info
* Use alert for:

  * warnings
  * errors

---

# 🎬 11. Animations

---

## Level → Medium

---

## Rules

* Use subtle transitions
* Avoid heavy animations
* Focus on responsiveness

---

## Examples

* Button hover effects
* Smooth page transitions
* Modal animations

---

# 🧠 12. UX Best Practices

---

## Consistency

* Same button styles everywhere
* Same spacing everywhere
* Same color usage everywhere

---

## Clarity

* Clear labels
* Simple navigation
* No confusion

---

## Accessibility

* Proper contrast
* Readable fonts
* Keyboard navigation (future)

---

# ⚠️ 13. Common Mistakes to Avoid

---

❌ Random spacing
❌ Too many colors
❌ Large components
❌ Inconsistent layouts
❌ Over-animations

---

# 🚀 14. Future Enhancements


* Design system tokens (central config)
* Component library expansion
* Theme customization
* Accessibility improvements

---

# 🖼️ Layout System

- `AuthLayout`
- `DashboardLayout`
- `ExamLayout`

# ⏳ Loading + Error States

- Skeleton loaders
- Empty states
- Error fallback UI

---

# 📌 Summary

SafeExam frontend is:

* Clean and minimal
* Fully responsive
* Consistent across all screens
* Built using modern tools (Tailwind + shadcn)

This ensures a smooth, distraction-free, and professional user experience.
