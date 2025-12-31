# Celtis POS System

A modern, frontend-only Point of Sale (POS) interface focused on user experience, flow design, and UI clarity.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- pnpm (or npm/yarn)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

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

## 📋 Features

### Core Functionality (MVP)

- ✅ **Product Grid** - Browse and search products with category filtering
- ✅ **Shopping Cart** - Add, remove, and adjust quantities
- ✅ **Totals Calculation** - Automatic subtotal, tax (10%), and total calculation
- ✅ **Complete Sale** - Process sales with multiple payment methods (cash, card, digital)
- ✅ **Sales History** - View and search completed transactions

### Extended Features

- ✅ **Draft Sales** - Save incomplete sales and load them later
- ✅ **Real-time Stats** - View total revenue, today's sales, and more
- ✅ **Search & Filter** - Find products and sales quickly
- ✅ **Persistent Storage** - All data saved to localStorage (survives page refresh)
- ✅ **Responsive Design** - Modern POS layout with product grid + cart sidebar

### Future Enhancements (Not Yet Implemented)

- Quotes with lifecycle management
- Refunds as transaction states
- Delivery tracking
- Advanced reporting
- Staff/session management
- Keyboard shortcuts for power users

## 🎨 Design Philosophy

### Quality Over Quantity

This project demonstrates **thoughtful feature integration** over feature count. Each implemented feature is complete, polished, and considers real-world usage.

### Modern POS Design

- **Orange color scheme** (primary brand color)
- **Calm, readable interface** designed for all-day use
- **Clear information hierarchy**
- **Generous spacing and sizing** for easy interaction

### User Journey Focus

- **Minimized click count** for common operations
- **Clear navigation** between POS and History views
- **Graceful error handling** and edge cases
- **Page refresh recovery** - no data loss

## 🏗️ Architecture

### Tech Stack

- **React** 19 + **TypeScript** - Modern React with strict typing
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling with custom orange theme
- **Context API** - Simple, predictable state management
- **localStorage** - Data persistence without backend

### Project Structure

```
src/
├── components/
│   ├── Layout/
│   │   └── Header.tsx        # Navigation header
│   ├── POS/
│   │   ├── POSView.tsx       # Main POS layout
│   │   ├── ProductGrid.tsx   # Product browsing
│   │   └── CartSidebar.tsx   # Cart & checkout
│   └── History/
│       └── SalesHistory.tsx  # Sales history view
├── context/
│   └── POSContext.tsx        # Global state management
├── data/
│   └── mockProducts.ts       # Mock product data
├── types/
│   └── index.ts              # TypeScript interfaces
├── utils/
│   └── formatters.ts         # Currency & date formatting
└── App.tsx                   # Root component
```

### Data Model

Clean, logical data structures with TypeScript interfaces for:

- **Product** - Product information, pricing, stock
- **Cart** - Current cart state with items and totals
- **Sale** - Completed transaction records
- **CartItem** - Individual items in cart with quantities
- **Payment Methods** - Cash, card, digital

### State Management

Uses React Context API for global state:

- Cart operations (add, remove, update quantity, clear)
- Sales management (complete sale, view history)
- Draft sales (save, load, delete)
- View navigation (POS ↔ History)

All state persists to localStorage automatically.

## 💡 Key Design Decisions

### 1. **State-First Thinking**

Rather than just building screens, the system is designed around **sale states**:

- Active cart (in progress)
- Draft (parked for later)
- Completed (finalized)
- Refunded (future)

### 2. **Cashier Ergonomics**

- One-click product addition
- Clear quantity controls
- Prominent totals display
- Quick payment method selection
- Draft sales for interruption recovery

### 3. **Real-World Scenarios**

- **Page refresh**: All data persists via localStorage
- **Interrupted flows**: Save as draft and resume later
- **Quick search**: Find products by name or SKU instantly
- **Clear feedback**: Visual confirmation for all actions

### 4. **No Over-Engineering**

- No external state management libraries
- No routing (simple view switching)
- No backend/API complexity
- Mock data is sufficient for demonstration

## 🎯 Assumptions & Simplifications

### Intentional Simplifications

1. **Fixed tax rate** (10%) - would be configurable in production
2. **Mock product data** - would connect to inventory system
3. **No user authentication** - as per requirements
4. **Single currency** (USD) - would support multiple currencies
5. **Basic discount handling** - structure in place for future expansion

### Production Considerations

For a real production system, you'd want to add:

- Backend API integration
- Database persistence
- User authentication & authorization
- Receipt printing
- Barcode scanning
- Advanced inventory management
- Multi-store support
- Reporting & analytics
- Audit logs

## 🧪 Testing the Application

### Key Workflows to Test

1. **Basic Sale Flow**

   - Add products to cart
   - Adjust quantities
   - Complete sale with payment method
   - View in sales history

2. **Draft Sales**

   - Add items to cart
   - Save as draft
   - Clear current cart
   - Load draft to resume

3. **Search & Filter**

   - Search products by name/SKU
   - Filter by category
   - Search sales history

4. **Page Refresh Recovery**
   - Make a sale
   - Refresh the page
   - Verify sale appears in history

## 🎨 Design Details

### Color Palette

- Primary: Orange (#f97316 and variations)
- Neutral: Grays for text and backgrounds
- Semantic: Green for success, Red for errors

### Typography

- System fonts for optimal readability
- Clear hierarchy with consistent sizing
- Generous line heights for scanning

### Layout

- **Product Grid**: Responsive grid (1-4 columns based on screen size)
- **Cart Sidebar**: Fixed 384px width on desktop
- **Full-height layout**: Maximizes vertical space

## 📝 Development Notes

### Code Style

- Functional components with hooks
- TypeScript strict mode
- Tailwind utility classes only (no custom CSS files)
- Clear component separation
- Descriptive naming conventions

### Performance Considerations

- Minimal re-renders with proper state structure
- Efficient filtering with memoization opportunities
- Lazy loading ready (not implemented yet)

## 🚧 Future Enhancements

Planned features that would add value:

1. **Keyboard Shortcuts**

   - Quick number pad for quantities
   - F-keys for common actions
   - Search focus hotkey

2. **Advanced Filtering**

   - Date range for sales history
   - Product categories
   - Payment method filtering

3. **Receipt Generation**

   - Print/PDF receipts
   - Email receipts

4. **Inventory Alerts**

   - Low stock warnings
   - Out of stock handling

5. **Batch Operations**
   - Bulk product import
   - Batch sale processing

## 📄 License

This project is for demonstration purposes as part of the Celtis Australis frontend engineer assessment.

## 🙋‍♂️ Questions or Feedback?

For any questions about implementation decisions or clarifications, please reach out!
