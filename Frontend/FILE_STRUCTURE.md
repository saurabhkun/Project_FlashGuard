# Complete File Structure & Descriptions

## 📁 Project File Listing

### Root Files
```
/README.md                    - Main project documentation
/COMPONENT_DOCS.md           - Detailed component usage guide
/API_DOCUMENTATION.md        - API integration and backend guide
/package.json                - Dependencies and project configuration
```

---

## 📂 `/src/app/` - Application Core

### `/src/app/App.tsx`
**Purpose:** Main application entry point  
**Content:**
- Theme provider setup (dark/light mode)
- Router provider configuration
- Global app wrapper

**Key Features:**
```tsx
- ThemeProvider from next-themes
- RouterProvider from react-router
- Default theme: light
- System theme support enabled
```

---

### `/src/app/Layout.tsx`
**Purpose:** Main layout wrapper for all pages  
**Content:**
- Sidebar component integration
- Navbar component integration
- Main content area with scroll
- Flex layout structure

**Structure:**
```
Sidebar (fixed left) | Navbar (top) + Content (scrollable)
```

---

### `/src/app/routes.ts`
**Purpose:** React Router configuration  
**Routes Defined:**
```typescript
/ → Dashboard (index)
/transactions → Transactions
/fraud-check → FraudCheck (Main Feature)
/alerts → Alerts
/analytics → Analytics
/admin → Admin
```

**Router Type:** Browser Router (createBrowserRouter)

---

## 📂 `/src/pages/` - Page Components

### `/src/pages/Dashboard.tsx`
**Purpose:** Main overview dashboard page  
**Components Used:**
- StatsCard (4x for metrics)
- FraudGauge (risk meter)
- PieChart (transaction distribution)
- LineChart (fraud trend)
- BarChart (fraud by location)

**Key Stats:**
- Total Transactions
- Fraudulent Count
- Suspicious Count
- Detection Rate

**File Size:** ~280 lines  
**Data Sources:** mockTransactions, fraudTrendData, fraudByLocation

---

### `/src/pages/Transactions.tsx`
**Purpose:** Transaction monitoring and management  
**Components Used:**
- TransactionTable
- Stats cards (summary)
- Action buttons (Export, Refresh)

**Features:**
- Filter by status and location
- Transaction volume metrics
- Export functionality (UI)

**File Size:** ~70 lines

---

### `/src/pages/FraudCheck.tsx`
**Purpose:** **MAIN FEATURE** - Transaction fraud detection form  
**Components Used:**
- FraudGauge (results display)
- Form inputs (10 fields)
- Loading spinner
- Alert panels for results

**Form Fields:**
1. Transaction Amount
2. Transaction Time
3. Device Score
4. Location
5. IP Risk Score
6. Account Age
7. Transaction Frequency
8. Merchant Category
9. Payment Method
10. Failed Login Attempts

**Features:**
- Load example data button
- Real-time validation
- Animated result display
- AI explanation panel
- Color-coded recommendations

**File Size:** ~430 lines

---

### `/src/pages/Alerts.tsx`
**Purpose:** Fraud alert monitoring  
**Components Used:**
- AlertPanel
- Stats cards (severity breakdown)
- Toggle switches (alert config)

**Alert Categories:**
- High severity (critical)
- Medium severity (warning)
- Low severity (info)

**File Size:** ~150 lines

---

### `/src/pages/Analytics.tsx`
**Purpose:** User behavior analysis  
**Charts:**
1. Transaction Frequency (Area Chart)
2. Spending Pattern (Horizontal Bar Chart)
3. User Behavior (Radar Chart)
4. Location Tracking (Custom Cards)

**Additional Stats:**
- Average transaction size
- Most active hour
- Top spending category

**File Size:** ~200 lines

---

### `/src/pages/Admin.tsx`
**Purpose:** Administrative controls  
**Features:**
1. Threshold sliders (fraud/suspicious)
2. Flagged transaction review
3. Approve/Block buttons
4. Blacklist management
5. System statistics

**File Size:** ~240 lines

---

## 📂 `/src/components/` - Reusable Components

### `/src/components/StatsCard.tsx`
**Purpose:** Display metric cards with icons  
**Props:**
```typescript
title: string
value: string | number
change?: string
icon: 'shield' | 'alert' | 'trending' | 'activity'
trend?: 'up' | 'down'
```

**Styling:**
- Card with shadow and border
- Icon in colored circle
- Large value text
- Trend indicator with color

**File Size:** ~40 lines

---

### `/src/components/FraudGauge.tsx`
**Purpose:** Circular progress gauge for risk percentage  
**Props:**
```typescript
value: number (0-100)
size?: number (default: 200)
```

**Features:**
- SVG-based circular gauge
- Auto-color based on risk:
  - Green (0-39): Low
  - Yellow (40-69): Medium
  - Red (70-100): High
- Smooth animation
- Center text display

**File Size:** ~65 lines

---

### `/src/components/TransactionTable.tsx`
**Purpose:** Filterable transaction data table  
**Props:**
```typescript
transactions: Transaction[]
```

**Features:**
- Status filter dropdown
- Location filter dropdown
- Color-coded risk scores
- Status badges
- Hover effects
- Empty state message

**Columns:**
- Transaction ID
- User ID
- Amount
- Location
- Risk Score
- Status
- Action

**File Size:** ~150 lines

---

### `/src/components/AlertPanel.tsx`
**Purpose:** Display fraud alerts list  
**Props:**
```typescript
alerts: Alert[]
```

**Features:**
- Severity-based coloring
- Icon indicators
- Timestamp formatting
- Action status display

**File Size:** ~70 lines

---

### `/src/components/Sidebar.tsx`
**Purpose:** Navigation sidebar  
**Features:**
- Collapsible (wide/narrow)
- Active route highlighting
- Logo display
- Icon-only mode when collapsed
- Dark mode support

**Navigation Items:** 6 routes  
**File Size:** ~90 lines

---

### `/src/components/Navbar.tsx`
**Purpose:** Top navigation bar  
**Features:**
- Search input (UI only)
- Dark/Light theme toggle
- User profile display
- Responsive layout

**File Size:** ~60 lines

---

## 📂 `/src/services/` - Business Logic

### `/src/services/fraudAPI.ts`
**Purpose:** Fraud detection algorithm and API simulation  
**Main Function:**
```typescript
fraudAPI.checkFraud(data: FraudCheckRequest): Promise<FraudCheckResponse>
```

**Algorithm:**
- 10 risk factors
- Point-based scoring system
- Risk level determination
- Reason generation

**Delay:** 1.5 seconds (simulated API call)

**File Size:** ~130 lines

**Key Functions:**
- `checkFraud()` - Main algorithm
- `fraudAPI.checkFraud()` - Async wrapper
- `delay()` - Utility function

---

## 📂 `/src/data/` - Mock Data

### `/src/data/mockTransactions.ts`
**Purpose:** Mock data and TypeScript interfaces  
**Content:**

**Interfaces:**
```typescript
- Transaction (main transaction type)
- Alert (fraud alert type)
```

**Mock Data:**
```typescript
- mockTransactions (10 sample transactions)
- mockAlerts (6 sample alerts)
- fraudTrendData (8 months of trend data)
- fraudByLocation (7 countries)
- transactionFrequencyData (12 hours)
- spendingPatternData (7 categories)
```

**File Size:** ~200 lines

**Sample Data Coverage:**
- 3 Safe transactions
- 3 Suspicious transactions
- 2 Fraud transactions
- Mixed locations (India, USA, Russia, Nigeria, etc.)
- Various payment methods
- Different merchant categories

---

## 📂 `/src/styles/` - Styling

### `/src/styles/theme.css`
**Purpose:** Global theme configuration and CSS variables  
**Content:**
- Tailwind base imports
- Custom CSS variables
- Dark mode variables
- Font configurations (if any)

---

## 📦 Package Dependencies

### Production Dependencies (Key Packages)
```json
react: 18.3.1                    - Core React library
react-router: 7.13.0            - Routing
recharts: 2.15.2                - Charts
lucide-react: 0.487.0           - Icons
next-themes: 0.4.6              - Theme management
motion: 12.23.24                - Animations (if needed)
```

### Radix UI Components (Full UI Toolkit)
```json
@radix-ui/react-dialog          - Modals
@radix-ui/react-select          - Dropdowns
@radix-ui/react-switch          - Toggle switches
@radix-ui/react-slider          - Sliders
... and 20+ more UI primitives
```

### Build Tools
```json
vite: 6.3.5                     - Build tool
@vitejs/plugin-react: 4.7.0     - React plugin
tailwindcss: 4.1.12             - CSS framework
```

---

## File Size Summary

| Directory | Files | Total Lines (approx) |
|-----------|-------|---------------------|
| `/src/pages/` | 6 | ~1,370 lines |
| `/src/components/` | 6 | ~475 lines |
| `/src/services/` | 1 | ~130 lines |
| `/src/data/` | 1 | ~200 lines |
| `/src/app/` | 3 | ~50 lines |
| **Total** | **17** | **~2,225 lines** |

---

## Import Structure

### Component Imports
```typescript
// From data
import { mockTransactions, mockAlerts } from '../data/mockTransactions';

// From components
import { FraudGauge } from '../components/FraudGauge';
import { TransactionTable } from '../components/TransactionTable';

// From services
import { fraudAPI } from '../services/fraudAPI';

// From react-router
import { Link, useLocation } from 'react-router';

// From recharts
import { LineChart, Line, BarChart, Bar } from 'recharts';

// From lucide-react
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

// From next-themes
import { useTheme } from 'next-themes';
```

---

## TypeScript Interfaces Location

**All interfaces defined in:** `/src/data/mockTransactions.ts`

```typescript
- Transaction
- Alert
- (FraudCheckRequest in services/fraudAPI.ts)
- (FraudCheckResponse in services/fraudAPI.ts)
```

---

## Color Scheme

### Status Colors
```typescript
Safe:       green (bg-green-100, text-green-800)
Suspicious: yellow (bg-yellow-100, text-yellow-800)
Fraud:      red (bg-red-100, text-red-800)
```

### Theme Colors
```typescript
Primary:    blue (#3b82f6)
Success:    green (#10b981)
Warning:    yellow (#f59e0b)
Danger:     red (#ef4444)
Gray:       Various shades for dark mode
```

---

## Responsive Breakpoints (Tailwind)

```
sm:  640px   - Small devices
md:  768px   - Medium devices
lg:  1024px  - Large devices
xl:  1280px  - Extra large devices
2xl: 1536px  - 2X Extra large devices
```

**Grid Usage:**
```tsx
grid-cols-1           // Mobile (all)
md:grid-cols-2        // Tablet (2 columns)
lg:grid-cols-4        // Desktop (4 columns)
```

---

## Chart Configurations

### Recharts Responsive Setup
```tsx
<ResponsiveContainer width="100%" height={300}>
  <YourChart data={data}>
    {/* Chart content */}
  </YourChart>
</ResponsiveContainer>
```

**Chart Heights:**
- Dashboard charts: 300px
- Analytics charts: 300px
- Gauges: 220-250px (configurable)

---

## Performance Considerations

### Current Implementation
- No lazy loading (all routes preloaded)
- No memoization (can be added for large datasets)
- No virtualization (table not virtualized)

### Recommended Optimizations (for production)
```typescript
// Lazy load pages
const Dashboard = lazy(() => import('../pages/Dashboard'));

// Memo expensive calculations
const stats = useMemo(() => calculateStats(data), [data]);

// Virtualize large tables
import { useVirtual } from 'react-virtual';
```

---

## Browser Support

**Target Browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Required Features:**
- ES6+ JavaScript
- CSS Grid
- CSS Custom Properties
- SVG support

---

## Development Tools

**Recommended VS Code Extensions:**
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

---

## Quick Navigation Index

**Need to modify:**
- Fraud algorithm → `/src/services/fraudAPI.ts`
- Mock data → `/src/data/mockTransactions.ts`
- Routes → `/src/app/routes.ts`
- Sidebar menu → `/src/components/Sidebar.tsx`
- Theme colors → `/src/styles/theme.css`
- Main layout → `/src/app/Layout.tsx`

**Need to add:**
- New page → Create in `/src/pages/`, add to routes.ts, add to Sidebar.tsx
- New component → Create in `/src/components/`
- New chart → Add to existing pages or create new analytics page
- New data → Add to `/src/data/mockTransactions.ts`

---

## Testing Checklist

✅ Dashboard loads with all charts  
✅ Transactions table filters work  
✅ Fraud Check form validates  
✅ Example data loads correctly  
✅ Fraud gauge animates  
✅ Alerts display with colors  
✅ Analytics charts render  
✅ Admin controls function  
✅ Theme toggle works  
✅ Sidebar collapses  
✅ All routes navigate  
✅ Responsive on mobile  

---

## Deployment Checklist

Before deploying:
1. ✅ Build succeeds (`npm run build`)
2. ✅ All TypeScript types are correct
3. ✅ No console errors
4. ✅ All routes work
5. ✅ Images load properly
6. ✅ Theme persists on refresh
7. ✅ Forms validate correctly
8. ✅ Mock data displays
9. ✅ Charts render
10. ✅ Mobile responsive

---

**Complete file structure for CHAKRAVYUH 2.0 Hackathon!**
