# Development Guidelines & Detailed Documentation

This document contains detailed development workflows, architectural decisions, and guidelines for the Celtis Restaurant POS project.

## 🌿 Git Workflow & Branching Strategy

### Branch Structure

This project follows a **feature branch workflow** with three main branches:

- **`main`** - Production branch (protected, auto-updated from `stg`)
- **`stg`** - Staging branch for pre-production testing
- **`dev`** - Development integration branch
- **`feature/*`** - Feature branches for new development

### Workflow Diagram

```
feature/* → dev → stg → main (auto)
```

### Development Workflow

1. **Create a feature branch from `dev`:**

   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and commit:**

   ```bash
   git add .
   git commit -m "feat: description of changes"
   git push -u origin feature/your-feature-name
   ```

3. **Create Pull Request to `dev`:**

   - CI checks run automatically (linting & build)
   - Get review and merge

4. **Promote to staging:**

   ```bash
   git checkout stg
   git pull origin stg
   git merge dev
   git push origin stg
   ```

5. **Auto-deploy to production:**
   - When `stg` is pushed, CI checks run
   - After passing checks, GitHub Actions auto-merges `stg` → `main`

### Commit Message Convention

Use [Conventional Commits](https://www.conventionalcommits.org/) for clear changelog generation:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - UI/styling changes
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding tests
- `chore:` - Maintenance tasks

**Examples:**

```bash
git commit -m "feat: add Inter font for better readability"
git commit -m "style: increase touch targets to 44px"
git commit -m "fix: align monetary values in sales table"
```

### Automated CI/CD

#### On Pull Requests to `dev` or `stg`:

- ✅ ESLint checks
- ✅ TypeScript compilation
- ✅ Production build verification

#### On Push to `stg`:

- ✅ Full CI checks
- ✅ Auto-merge to `main` after passing tests

### Branch Protection Rules

- **`main`**: Requires passing CI checks, auto-updated from `stg`
- **`stg`**: Requires PR approval and passing CI checks
- **`dev`**: Requires PR and passing CI checks

---

## 🗓️ Upcoming Sprint

- Quote management with lifecycle (Draft → Sent → Accepted → Converted)
- Refund processing as transaction states
- Delivery tracking and management
- Advanced reporting and analytics dashboard
- Enhanced keyboard shortcuts for power users
- Receipt printing/PDF generation

---

## 📋 Assumptions Made

- **No Backend Required** - All data stored in browser's localStorage (frontend-only)
- **Single Location** - System designed for one restaurant/store location
- **Fixed Tax Rate** - 10% tax applied to all orders
- **USD Currency** - All pricing in US dollars
- **No Authentication** - Open system without user login (as per requirements)
- **Mock Data** - Restaurant menu is pre-populated with sample items
- **Modern Browsers** - Assumes ES6+ support and localStorage availability
- **Single Session** - One active cashier/order at a time per browser

---

## 🏗️ Tech Stack & Architecture

### Technologies Used

- **React 19** + **TypeScript** - Component-based UI with strong typing
- **Vite** - Fast development server and build tool
- **Tailwind CSS** - Utility-first styling with custom orange theme
- **Context API** - Global state management (no Redux/Zustand needed)
- **localStorage** - Client-side data persistence
- **ShadCN UI** - Accessible component primitives

### Key Architecture Decisions

**State Management**

- Context API for simplicity and predictability
- State organized by domain (orders, sales, staff)
- Automatic localStorage sync on every state change
- No external state libraries to reduce bundle size

**Component Structure**

- Feature-based organization (Restaurant, History, Layout)
- Reusable UI components in `components/ui/`
- Smart containers separate from presentational components
- TypeScript interfaces for all data structures

**Data Flow**

- Unidirectional data flow (Context → Components)
- localStorage acts as persistence layer
- Mock data for initial menu items
- State persists across page refreshes

**Styling Approach**

- Tailwind utility classes exclusively
- No custom CSS files (except for Tailwind config)
- Consistent spacing scale (p-3/p-4/p-5/p-6)
- Orange theme for brand consistency
- Inter font for professional readability

---

## 🎯 Design Approach

### UI/UX Principles

- **Touch-First Design** - Minimum 44px touch targets for better usability
- **Visual Hierarchy** - Clear typography scale (Inter font, extrabold for prices)
- **Consistent Spacing** - Standardized padding (dense/standard/comfortable)
- **Calm Interface** - Designed for all-day cashier usage
- **Responsive Feedback** - Hover states, transitions, visual confirmations

### State Management Philosophy

- **State-First Thinking** - Designed around order states (Active → Draft → Completed)
- **Predictable Updates** - Single source of truth via Context API
- **Automatic Persistence** - Every state change syncs to localStorage
- **Recovery Friendly** - Page refresh doesn't lose data

### Performance Considerations

- **Minimal Re-renders** - Optimized context structure
- **Fast Filtering** - Client-side search/filter on small datasets
- **Small Bundle Size** - No heavy dependencies (69KB gzipped)
- **Instant Feedback** - No network latency (localStorage)

### Code Quality

- **TypeScript Strict Mode** - No `any` types, full type safety
- **Functional Components** - Modern React hooks throughout
- **Conventional Commits** - Structured commit messages for changelog
- **ESLint Enforced** - Code quality checked in CI/CD

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Restaurant/          # POS view components
│   ├── History/             # Sales history components
│   ├── Layout/              # Header, navigation
│   └── ui/                  # Reusable UI primitives (ShadCN)
├── context/                 # React Context for state
├── data/                    # Mock data (menu, staff)
├── types/                   # TypeScript interfaces
├── utils/                   # Helper functions
└── hooks/                   # Custom React hooks
```

---

## 📝 Development Notes

### Code Style

- Functional components with hooks
- TypeScript strict mode
- Tailwind utility classes only (no custom CSS files)
- Clear component separation
- Descriptive naming conventions

### Data Model

Clean, logical data structures with TypeScript interfaces for:

- **MenuItem** - Product information, pricing, categories
- **Order** - Current order state with items and totals
- **Sale** - Completed transaction records
- **OrderItem** - Individual items with quantities and customizations
- **Staff** - Staff member information
- **Payment Methods** - Cash, card, digital wallet

---

## 🧪 Quick Testing Guide

**Basic Order Flow:**

1. Select a staff member from the header
2. Browse menu and add items to cart
3. Adjust quantities or add customizations
4. Click "Complete Order" and select payment method
5. View completed order in "Order History"

**Draft Orders:**

1. Add items to cart
2. Click "Save Draft"
3. Clear or start a new order
4. Click "Show drafts" to reload saved order

**Page Refresh Test:**

- Complete an order, refresh the page
- Verify order appears in history (data persists)

---

## 🎨 Design Details

### Color Palette

- Primary: Orange (#f97316 and variations)
- Neutral: Grays for text and backgrounds
- Semantic: Green for success, Red for errors

### Typography

- Inter font for professional readability
- Clear hierarchy with consistent sizing (text-sm → text-3xl)
- Font weights: normal (400), medium (500), semibold (600), bold (700), extrabold (800)
- Generous line heights for scanning

### Layout

- **Menu Grid**: Responsive grid (1-4 columns based on screen size)
- **Order Sidebar**: Fixed 384px width on desktop
- **Full-height layout**: Maximizes vertical space
- **Touch targets**: Minimum 44px for buttons and interactive elements

