## 2026-03-12 - Icon Button Accessibility
**Learning:** Found multiple icon-only buttons across components (ReelItem, modals, etc.) without ARIA labels, making them inaccessible to screen readers.
**Action:** Always add descriptive `aria-label` attributes or visually hidden text to icon-only buttons to ensure keyboard and screen reader accessibility.
