# Design System - Talent Casting App

A modern, sophisticated design system inspired by Vercel, Linear, and Stripe.

## 🎨 Design Tokens

### Color Palette

#### Grays (Primary)
- `--color-gray-50`: #fafafa (Backgrounds)
- `--color-gray-100`: #f5f5f5 (Secondary backgrounds)
- `--color-gray-200`: #e5e5e5 (Borders)
- `--color-gray-300`: #d4d4d4 (Hover borders)
- `--color-gray-400`: #a3a3a3 (Placeholder text)
- `--color-gray-500`: #737373 (Secondary text)
- `--color-gray-600`: #525252 (Primary text)
- `--color-gray-700`: #404040 (Dark text)
- `--color-gray-800`: #262626 (Very dark text)
- `--color-gray-900`: #171717 (Darkest text)
- `--color-gray-950`: #0a0a0a (Dark mode background)

#### Accent Colors
- **Blue**: Primary actions, links, focus states
- **Purple**: Secondary actions, highlights
- **Green**: Success states, confirmations
- **Red**: Error states, destructive actions
- **Yellow**: Warning states, notifications

#### Semantic Colors
- `--color-primary`: Blue-600 (#2563eb)
- `--color-secondary`: Purple-600 (#9333ea)
- `--color-success`: Green-600 (#16a34a)
- `--color-warning`: Yellow-600 (#ca8a04)
- `--color-error`: Red-600 (#dc2626)

### Typography

#### Font Sizes
- `--font-size-xs`: 0.75rem (12px) - Labels, badges
- `--font-size-sm`: 0.875rem (14px) - Body text, buttons
- `--font-size-base`: 1rem (16px) - Default body
- `--font-size-lg`: 1.125rem (18px) - Large body
- `--font-size-xl`: 1.25rem (20px) - Headings
- `--font-size-2xl`: 1.5rem (24px) - Section headings
- `--font-size-3xl`: 1.875rem (30px) - Page headings
- `--font-size-4xl`: 2.25rem (36px) - Hero headings
- `--font-size-5xl`: 3rem (48px) - Large hero

#### Font Weights
- `--font-weight-normal`: 400
- `--font-weight-medium`: 500
- `--font-weight-semibold`: 600
- `--font-weight-bold`: 700

#### Line Heights
- `--line-height-tight`: 1.25 (Headings)
- `--line-height-normal`: 1.5 (Body text)
- `--line-height-relaxed`: 1.75 (Large text)

### Spacing System

Based on 4px grid:
- `--space-1`: 0.25rem (4px)
- `--space-2`: 0.5rem (8px)
- `--space-3`: 0.75rem (12px)
- `--space-4`: 1rem (16px)
- `--space-5`: 1.25rem (20px)
- `--space-6`: 1.5rem (24px)
- `--space-8`: 2rem (32px)
- `--space-10`: 2.5rem (40px)
- `--space-12`: 3rem (48px)
- `--space-16`: 4rem (64px)
- `--space-20`: 5rem (80px)
- `--space-24`: 6rem (96px)

### Border Radius

- `--radius-sm`: 0.25rem (4px) - Small elements
- `--radius-md`: 0.375rem (6px) - Medium elements
- `--radius-lg`: 0.5rem (8px) - Buttons, inputs
- `--radius-xl`: 0.75rem (12px) - Cards, modals
- `--radius-2xl`: 1rem (16px) - Large cards
- `--radius-full`: 9999px - Pills, avatars

### Shadows

- `--shadow-sm`: Subtle elevation
- `--shadow-md`: Medium elevation
- `--shadow-lg`: High elevation
- `--shadow-xl`: Very high elevation
- `--shadow-2xl`: Maximum elevation

## 🧩 Component Variants

### Buttons

#### Variants
- `.btn-primary`: Primary actions (blue)
- `.btn-secondary`: Secondary actions (purple)
- `.btn-ghost`: Subtle actions (transparent)
- `.btn-danger`: Destructive actions (red)

#### Sizes
- `.btn-sm`: Small (32px height)
- Default: Medium (40px height)
- `.btn-lg`: Large (48px height)

#### Usage
```html
<button class="btn btn-primary">Primary Action</button>
<button class="btn btn-secondary btn-sm">Small Secondary</button>
<button class="btn btn-ghost">Subtle Action</button>
<button class="btn btn-danger">Delete</button>
```

### Cards

#### Variants
- `.card-elevated`: Floating card with shadow
- `.card-bordered`: Card with border
- `.card-flat`: Simple bordered card

#### Usage
```html
<div class="card card-elevated p-6">
  <h3>Elevated Card</h3>
  <p>Content with shadow and hover effects</p>
</div>

<div class="card card-bordered p-4">
  <h3>Bordered Card</h3>
  <p>Content with subtle border</p>
</div>
```

### Inputs

#### States
- Default: Standard input
- `.input-error`: Error state (red border)
- `:focus`: Focus state (blue border + glow)
- `:disabled`: Disabled state (grayed out)

#### Usage
```html
<input type="text" class="input" placeholder="Enter text" />
<input type="email" class="input input-error" placeholder="Invalid email" />
<input type="text" class="input" disabled placeholder="Disabled" />
```

### Navigation

#### Components
- `.nav`: Navigation container
- `.nav-item`: Navigation item
- `.nav-item.active`: Active state
- `.nav-item:hover`: Hover state

#### Usage
```html
<nav class="nav">
  <a href="#" class="nav-item">Dashboard</a>
  <a href="#" class="nav-item active">Projects</a>
  <a href="#" class="nav-item">Talent</a>
</nav>
```

### Badges

#### Variants
- `.badge-primary`: Primary (blue)
- `.badge-success`: Success (green)
- `.badge-warning`: Warning (yellow)
- `.badge-error`: Error (red)

#### Usage
```html
<span class="badge badge-primary">New</span>
<span class="badge badge-success">Completed</span>
<span class="badge badge-warning">Pending</span>
<span class="badge badge-error">Failed</span>
```

### Modals

#### Components
- `.modal-backdrop`: Modal overlay
- `.modal`: Modal container

#### Usage
```html
<div class="modal-backdrop">
  <div class="modal p-6">
    <h2>Modal Title</h2>
    <p>Modal content</p>
  </div>
</div>
```

### Loading States

#### Spinner
```html
<div class="spinner"></div>
```

## 📱 Responsive Design

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 768px
- Desktop: > 768px

### Responsive Utilities
- Grid columns stack on mobile
- Buttons become smaller on mobile
- Modals adjust margins on mobile

## 🎯 Implementation Guidelines

### 1. Use Design Tokens
Always use CSS custom properties instead of hardcoded values:
```css
/* ✅ Good */
color: var(--color-primary);
padding: var(--space-4);

/* ❌ Bad */
color: #2563eb;
padding: 16px;
```

### 2. Component Composition
Combine utility classes for consistent styling:
```html
<!-- ✅ Good -->
<div class="card card-elevated p-6">
  <h3 class="text-xl font-semibold mb-4">Title</h3>
  <p class="text-gray-600">Content</p>
</div>

<!-- ❌ Bad -->
<div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
  <h3 style="font-size: 20px; font-weight: 600; margin-bottom: 16px;">Title</h3>
  <p style="color: #525252;">Content</p>
</div>
```

### 3. Accessibility
- Use semantic HTML elements
- Maintain proper color contrast ratios
- Include focus states for interactive elements
- Provide alt text for images

### 4. Performance
- Use CSS custom properties for theming
- Minimize CSS bundle size
- Use efficient selectors
- Leverage CSS Grid and Flexbox

## 🔄 Dark Mode Support

The design system includes automatic dark mode support using `prefers-color-scheme`. Colors automatically adjust for:
- Background colors
- Text colors
- Border colors
- Component states

## 🚀 Getting Started

1. Include the design system CSS in your project
2. Use the provided utility classes and component styles
3. Follow the implementation guidelines
4. Test across different screen sizes and color schemes

## 📚 Examples

See the main application files for real-world examples of how to implement this design system across different components and pages. 