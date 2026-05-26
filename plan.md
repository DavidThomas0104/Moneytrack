# 💰 Obsidian Rosette — Money Tracker App Plan & Progress

Obsidian Rosette is a premium, dark-mode glassmorphism personal finance application built using Next.js 14 (App Router), TypeScript, and Firebase. It tracks money usage (expenses), money income, budgets, and recurring transactions with beautiful visual analytics, local/cloud synchronization, and PDF/CSV export.

This document serves as the implementation plan, the current task checklist, and the handoff status tracking what has been built and what remains to be completed.

---

## 🛠️ Technology Stack
* **Framework:** Next.js 14 (App Router, React 18)
* **Language:** TypeScript
* **Styling:** Vanilla CSS & CSS Modules (Dark Glassmorphism Theme)
* **Database & Auth:** Cloud Firestore & Firebase Authentication
* **Charts:** Recharts (Area and Pie/Donut charts)
* **Key Libraries:** `lucide-react` (icons), `date-fns` (date math), `jspdf` (PDF generation), `react-hot-toast` (notifications)

---

## 📊 Database Schema (Firestore NoSQL)
All data is scoped strictly under the authenticated user's ID (`userId`):
* `users/{userId}/profile/settings` — User preferences (`currency`, `displayName`, `createdAt`)
* `users/{userId}/transactions/{transactionId}` — Transaction records (`type: 'income'|'expense'`, `amount`, `category`, `description`, `date`, `recurringId?`, `tags[]`, `createdAt`)
* `users/{userId}/budgets/{budgetId}` — Spending budget limits (`category`, `limit`, `period: 'weekly'|'monthly'|'yearly'`, `createdAt`)
* `users/{userId}/recurring/{recurringId}` — Automated recurring schedules (`type`, `amount`, `category`, `description`, `frequency: 'daily'|'weekly'|'biweekly'|'monthly'|'yearly'`, `startDate`, `endDate?`, `isActive`, `createdAt`)

---

## 📈 Current Project Progress & Status

Here is the exact status of each component and file across the application. 

### 1. Project Setup & Scaffolding
- [x] Install Node.js LTS (v24.16.0) on Windows host
- [x] Scaffold Next.js 14 App Router project in `playground/obsidian-rosette`
- [x] Install dependencies (`firebase`, `recharts`, `lucide-react`, `date-fns`, `jspdf`, `react-hot-toast`)
- [x] Set up `.env.example` structure

### 2. Core Infrastructure & Configuration
- [x] **Core Types** (`src/types/index.ts`): Fully defined interfaces for `Transaction`, `RecurringRule`, `Budget`, `UserSettings`, categories, and currency mapping list.
- [x] **Firebase Config** (`src/lib/firebase.ts`): Initialized Firebase app, auth instance, and Firestore instance.
- [x] **Firestore CRUD Utils** (`src/lib/firestore.ts`): Completed all helper functions for read, write, update, and delete actions for transactions, budgets, recurring transactions, and user settings.
- [x] **Authentication Context** (`src/context/AuthContext.tsx`): Handled user login, registration (creates setting profiles automatically), logout, password reset, and session listeners.
- [x] **Financial Calculations** (`src/utils/calculations.ts`): Helper functions for balance sheet totals, category expense aggregations, budget tracking statuses, monthly trends, and locale-aware currency formatting.

### 3. UI Component Library (Partial)
- [x] **Modal** (`src/components/ui/Modal.tsx`): Glassmorphism modal wrapper with blur, sizes (`sm`, `md`, `lg`), and backdrop close logic.
- [x] **Button** (`src/components/ui/Button.tsx`): Highly styled button supporting gradients, outline, ghost, loading spinners, and sizing variants.
- [x] **Input** (`src/components/ui/Input.tsx`): Custom field input with floating label effects, validations, and custom icon slots.
- [x] **Select** (`src/components/ui/Select.tsx`): Elegant dropdown selection inputs supporting errors and styling consistency.
- [x] **Progress Ring** (`src/components/ui/ProgressRing.tsx`): SVG animated progress circle that changes colors based on threshold values (Green, Amber, Red).
- [x] **Empty State** (`src/components/ui/EmptyState.tsx`): Beautiful placeholder display featuring description and custom call-to-actions.
- [x] **Loading Spinner** (`src/components/ui/LoadingSpinner.tsx`): Multi-size glass-glow spinner.
- [ ] **Category Badge** (`src/components/transactions/CategoryBadge.tsx`): Small pill badges mapping specific icons/colors to financial categories.
- [ ] **Layout Components** (`Sidebar`, `Header`, `AppShell`): Navigation panel, page top context bar, layout wrapper with auth protection redirect.

### 4. Remaining Features to Build
The building of the UI layout shells, pages, and interactive features was interrupted by model quota constraints. The following items must be constructed to finish the application:

#### UI Page Components (Forms & Lists)
- [ ] `src/components/dashboard/`
  - `BalanceCard.tsx`: Glassmorphism header showing Income, Expense, and Net Balance with scroll animation.
  - `SpendingChart.tsx`: Category pie/donut visualizer.
  - `TrendChart.tsx`: 6-month area chart plotting income vs expense trends.
  - `RecentTransactions.tsx`: Grid or list listing the latest 8 transactions.
  - `BudgetOverview.tsx`: List of categories with corresponding budget horizontal progress bars.
- [ ] `src/components/transactions/`
  - `TransactionList.tsx`: Complete sortable, filterable ledger with pagination, date selectors, and quick delete/edit triggers.
  - `TransactionForm.tsx`: Add/edit transaction dialog fields.
- [ ] `src/components/budgets/`
  - `BudgetList.tsx`: Cards featuring circular budget utilization gauges.
  - `BudgetForm.tsx`: Category spending limit configuration modal.
- [ ] `src/components/recurring/`
  - `RecurringList.tsx`: Active/paused subscription lists with instant toggle switches.
  - `RecurringForm.tsx`: Config dialog for daily, weekly, or monthly automated transactions.

#### Main Application Pages & Router Routes
- [ ] `src/app/globals.css`: Overwrite with the dark theme styles (radial mesh backgrounds, glass styling, keyframes for fade-in animations).
- [ ] `src/app/layout.tsx`: Root providers, fonts (`Outfit` for headers, `Inter` for body), toaster wrapper.
- [ ] `src/app/page.tsx`: Landing component that automatically redirects to dashboard.
- [ ] `src/app/(auth)/`
  - `login/page.tsx` & `signup/page.tsx`: Glass card forms mapping authentication context triggers.
- [ ] `src/app/(app)/`
  - `layout.tsx`: App shell wrapping checking for valid session credentials.
  - `dashboard/page.tsx`: Main reporting screen assembling dashboard widgets.
  - `transactions/page.tsx`: Detailed transaction ledger and quick-add controls.
  - `budgets/page.tsx`: Active budget monitoring interface.
  - `recurring/page.tsx`: Automated transaction rule manager.
  - `export/page.tsx`: CSV and PDF generation controls.
  - `settings/page.tsx`: Profile personalization and currency switching center.
- [ ] `src/utils/export.ts`: Client-side data parser producing nicely-designed jsPDF sheets and CSV structures.

---

## 🚀 How to Resume Implementation

Once you have your tokens refilled or wish to proceed:
1. **Prepare your `.env.local`** file in the root of the project with your Firebase configuration values.
2. **Apply global styling** inside `src/app/globals.css` to enable the full premium dark-mode glassmorphism visual system.
3. **Assemble the Layout Shell** (`Sidebar`, `Header`, `AppShell`) inside `src/components/layout/` to enable secure routing.
4. **Create the main dashboard and features** sequentially.

To start the dev server at any time:
```bash
npm run dev
```
