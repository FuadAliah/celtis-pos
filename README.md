# Celtis Restaurant POS

A modern, frontend-only Point of Sale system built with React, TypeScript, and Tailwind CSS.

## 🚀 Running the Project Locally

### Prerequisites

- Node.js v18 or higher
- pnpm (recommended) or npm

### Installation & Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Start development server
pnpm dev

# 3. Open browser at http://localhost:5173
```

## ✨ Features

- Menu browsing with categories and search
- Order management with customizations (sizes, modifiers)
- Multiple payment methods (Cash, Card)
- Draft orders - save and resume later
- Order history with filtering
- Staff tracking and session management
- Real-time revenue stats
- Data persists in localStorage

## 📋 Key Decisions & Approach

**Tech Stack**

- React 19 + TypeScript for type safety
- Vite for fast dev server and builds
- Tailwind CSS for utility-first styling
- Context API for state (no Redux needed)
- localStorage for persistence (no backend)

**Design Choices**

- Touch-first design (44px minimum touch targets)
- State-first architecture (Active → Draft → Completed)
- No authentication (as per requirements)
- Fixed 10% tax rate, JOD currency
- Mock menu data, single location design

**Performance**

- Small bundle size (no heavy dependencies)
- Optimized re-renders with Context API
- Client-side filtering for instant feedback

---

**Project Type:** Frontend-only demonstration for Celtis Australis technical assessment

For detailed Git workflow, architecture decisions, and development guidelines, see [`draft-rules.md`](draft-rules.md).
