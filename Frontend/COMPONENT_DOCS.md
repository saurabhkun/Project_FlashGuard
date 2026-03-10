CHK-1772903081690-6260# Component Documentation

## Overview
This document provides detailed information about each component in the FraudGuard application.

---

## Core Components

### 1. **StatsCard** (`/src/components/StatsCard.tsx`)

Displays statistical information with an icon and trend indicator.

**Props:**
- `title` (string): The card title
- `value` (string | number): The main value to display
- `change` (string, optional): Percentage change indicator
- `icon` ('shield' | 'alert' | 'trending' | 'activity'): Icon type
- `trend` ('up' | 'down', optional): Trend direction

**Usage:**
```tsx
<StatsCard
  title="Total Transactions"
  value={1234}
  change="+12.5%"
  icon="activity"
  trend="up"
/>
```

---

### 2. **FraudGauge** (`/src/components/FraudGauge.tsx`)

Circular progress gauge showing fraud risk percentage.

**Props:**
- `value` (number): Risk percentage (0-100)
- `size` (number, optional): Diameter in pixels (default: 200)

**Features:**
- Auto-colors based on risk level:
  - Green: 0-39% (Low Risk)
  - Yellow: 40-69% (Medium Risk)
  - Red: 70-100% (High Risk)
- Smooth animation on value change

**Usage:**
```tsx
<FraudGauge value={75} size={250} />
```

---

### 3. **TransactionTable** (`/src/components/TransactionTable.tsx`)

Filterable table displaying transaction data.

**Props:**
- `transactions` (Transaction[]): Array of transaction objects

**Features:**
- Status filter (All, Safe, Suspicious, Fraud)
- Location filter
- Color-coded risk scores
- Status badges with appropriate colors
- Hover effects on rows

**Usage:**
```tsx
import { mockTransactions } from '../data/mockTransactions';

<TransactionTable transactions={mockTransactions} />
```

---

### 4. **AlertPanel** (`/src/components/AlertPanel.tsx`)

Displays fraud alerts with severity levels.

**Props:**
- `alerts` (Alert[]): Array of alert objects

**Features:**
- Color-coded severity (high/medium/low)
- Icon indicators
- Timestamp formatting
- Action status display

**Usage:**
```tsx
import { mockAlerts } from '../data/mockTransactions';

<AlertPanel alerts={mockAlerts} />
```

---

### 5. **Sidebar** (`/src/components/Sidebar.tsx`)

Collapsible navigation sidebar.

**Features:**
- Active route highlighting
- Collapse/expand functionality
- Icon-based navigation
- Smooth transitions
- Dark mode support

**Navigation Items:**
- Dashboard (/)
- Transactions (/transactions)
- Fraud Detection (/fraud-check)
- Alerts (/alerts)
- Analytics (/analytics)
- Admin (/admin)

---

### 6. **Navbar** (`/src/components/Navbar.tsx`)

Top navigation bar with search and theme toggle.

**Features:**
- Search input (UI only)
- Dark/Light mode toggle
- User profile display
- Responsive layout

---

## Page Components

### 1. **Dashboard** (`/src/pages/Dashboard.tsx`)

Main overview page with statistics and charts.

**Includes:**
- 4 stats cards (Total Transactions, Fraudulent, Suspicious, Detection Rate)
- Fraud Risk Gauge
- Pie Chart (Transaction Distribution)
- Line Chart (Fraud Trend Over Time)
- Bar Chart (Fraud by Location)
- Recent High-Risk Transactions feed

**Data Sources:**
- `mockTransactions` from data file
- Calculated aggregations
- Chart data from `fraudTrendData`, `fraudByLocation`

---

### 2. **Transactions** (`/src/pages/Transactions.tsx`)

Transaction monitoring and management page.

**Includes:**
- Summary statistics
- Transaction volume metrics
- Full transaction table with filters
- Export button (UI)
- Refresh button (UI)

---

### 3. **FraudCheck** (`/src/pages/FraudCheck.tsx`)

**Main Feature - Transaction fraud analysis form**

**Form Fields:**
1. Transaction Amount (₹)
2. Transaction Time (datetime)
3. Device Score (0-100)
4. Location (text input)
5. IP Risk Score (0-100)
6. Account Age (days)
7. Transaction Frequency (number)
8. Merchant Category (dropdown)
9. Payment Method (dropdown)
10. Failed Login Attempts (number)

**Features:**
- "Load Example Data" button for quick testing
- Real-time form validation
- Loading state with spinner
- Animated fraud gauge results
- AI explanation panel
- Color-coded recommendations
- Transaction ID generation

**Form Submission:**
```tsx
// Calls fraudAPI.checkFraud()
// Returns: FraudCheckResponse
// - fraudProbability: number
// - riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
// - recommendation: 'ALLOW' | 'REVIEW' | 'BLOCK'
// - reasons: string[]
// - transactionId: string
```

---

### 4. **Alerts** (`/src/pages/Alerts.tsx`)

Fraud alert monitoring and configuration.

**Includes:**
- Alert statistics by severity
- Alert list (using AlertPanel component)
- Alert configuration toggles:
  - Multiple Transactions Alert
  - High-Risk Location Alert
  - Device Fingerprint Alert
  - Failed Login Attempts Alert

---

### 5. **Analytics** (`/src/pages/Analytics.tsx`)

User behavior analysis and patterns.

**Charts:**
1. **Transaction Frequency Heatmap** (Area Chart)
   - Shows 24-hour transaction pattern
   - Identifies peak hours

2. **Spending Pattern by Category** (Horizontal Bar Chart)
   - Total amount by merchant category
   - Sorted by spending

3. **User Behavior Profile** (Radar Chart)
   - 6 metrics: Trust Score, Activity Level, Payment Diversity, 
     Location Consistency, Device Trust, Transaction Pattern

4. **Location Change Tracking**
   - User movement patterns
   - Risk assessment based on location changes
   - Timespan analysis

**Additional Stats:**
- Average Transaction Size
- Most Active Hour
- Top Category

---

### 6. **Admin** (`/src/pages/Admin.tsx`)

Administrative controls and settings.

**Features:**

1. **Threshold Settings**
   - Fraud Threshold slider (50-100%)
   - Suspicious Threshold slider (20-70%)
   - Save settings button

2. **Flagged Transactions Review**
   - List of fraud/suspicious transactions
   - Approve button (green)
   - Block button (red)
   - Detailed transaction info

3. **System Statistics**
   - Total Blocked Today
   - Pending Review count
   - False Positive rate
   - Model accuracy

4. **Blacklist Management**
   - Add IP to blacklist
   - View current blacklist
   - Remove IP from blacklist

---

## Layout Component

### **Layout** (`/src/app/Layout.tsx`)

Wrapper component providing consistent layout structure.

**Structure:**
```tsx
<div className="flex">
  <Sidebar />
  <div className="flex-col">
    <Navbar />
    <main>
      <Outlet /> {/* Child routes render here */}
    </main>
  </div>
</div>
```

---

## Services

### **fraudAPI** (`/src/services/fraudAPI.ts`)

Fraud detection algorithm and API simulation.

**Main Function:**
```typescript
fraudAPI.checkFraud(data: FraudCheckRequest): Promise<FraudCheckResponse>
```

**Algorithm Factors:**
- High-risk countries (+25 points)
- Transaction amount (+20 points if >₹10,000)
- Transaction time (+15 points for 12am-5am)
- Device score (+15 points if <60)
- IP risk score (+20 points if >60)
- Account age (+10 points if <7 days)
- Transaction frequency (+15 points if >8)
- Failed logins (+10 points if >2)
- Payment method (+5 points for credit card)
- Merchant category (+10 points for high-risk)

**Risk Calculation:**
- Score ≥70: HIGH risk → BLOCK
- Score 40-69: MEDIUM risk → REVIEW
- Score <40: LOW risk → ALLOW

---

## Data Models

### **Transaction** Interface
```typescript
interface Transaction {
  id: string;
  userId: string;
  amount: number;
  location: string;
  riskScore: number;
  status: 'Safe' | 'Suspicious' | 'Fraud';
  actionTaken: string;
  timestamp: string;
  paymentMethod: string;
  merchantCategory: string;
  ipAddress: string;
  deviceScore: number;
}
```

### **Alert** Interface
```typescript
interface Alert {
  id: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp: string;
  action: string;
}
```

---

## Theming

### Dark Mode Support

All components support dark mode using Tailwind's `dark:` prefix.

**Toggle Theme:**
```tsx
import { useTheme } from 'next-themes';

const { theme, setTheme } = useTheme();
setTheme(theme === 'dark' ? 'light' : 'dark');
```

**Color Scheme:**
- Light mode: White/Gray backgrounds, dark text
- Dark mode: Gray-800/900 backgrounds, white text
- Consistent border colors with opacity
- Hover states for both modes

---

## Chart Components (Recharts)

### Common Configuration

**Tooltip Style:**
```typescript
contentStyle={{
  backgroundColor: 'rgb(31, 41, 55)',
  border: '1px solid rgb(55, 65, 81)',
  borderRadius: '0.5rem',
  color: 'white',
}}
```

**Chart Types Used:**
1. **PieChart** - Transaction distribution
2. **LineChart** - Trend over time
3. **BarChart** - Location comparison, spending patterns
4. **AreaChart** - Transaction frequency
5. **RadarChart** - User behavior profile

**Responsive Container:**
All charts use `<ResponsiveContainer width="100%" height={300}>` for responsiveness.

---

## Routing

### React Router Configuration

**Routes:** (`/src/app/routes.ts`)
```typescript
- / → Dashboard
- /transactions → Transactions
- /fraud-check → FraudCheck (Main Feature)
- /alerts → Alerts
- /analytics → Analytics
- /admin → Admin
```

**Navigation:**
```tsx
import { Link } from 'react-router';
<Link to="/fraud-check">Fraud Detection</Link>
```

---

## Best Practices

### Component Usage

1. **Always import TypeScript interfaces:**
   ```tsx
   import { Transaction } from '../data/mockTransactions';
   ```

2. **Use proper typing for props:**
   ```tsx
   interface MyComponentProps {
     data: Transaction[];
     onSelect: (id: string) => void;
   }
   ```

3. **Handle loading states:**
   ```tsx
   {loading && <Loader2 className="animate-spin" />}
   ```

4. **Conditional rendering:**
   ```tsx
   {result && <ResultComponent result={result} />}
   ```

5. **Theme-aware styling:**
   ```tsx
   className="bg-white dark:bg-gray-800"
   ```

---

## Testing the Application

### Quick Test Guide

1. **Dashboard:** View all statistics and charts
2. **Transactions:** Filter by status and location
3. **Fraud Check:**
   - Click "Load Example Data"
   - Submit form
   - View animated gauge and results
4. **Alerts:** Review different severity alerts
5. **Analytics:** Explore charts and patterns
6. **Admin:** Adjust thresholds and review flagged items

### Test Data

Use the example transaction data in the README or click "Load Example Data" in the Fraud Check form.

---

## Customization

### Adding New Chart
```tsx
import { LineChart, Line } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={yourData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Line dataKey="value" stroke="#8884d8" />
  </LineChart>
</ResponsiveContainer>
```

### Adding New Route
1. Create page component in `/src/pages/`
2. Add to routes in `/src/app/routes.ts`
3. Add navigation item in `/src/components/Sidebar.tsx`

---

## Performance Tips

1. **Memo expensive calculations:**
   ```tsx
   const stats = useMemo(() => calculateStats(data), [data]);
   ```

2. **Lazy load pages:**
   ```tsx
   const Dashboard = lazy(() => import('../pages/Dashboard'));
   ```

3. **Optimize re-renders:**
   - Use React.memo for pure components
   - Implement proper key props in lists

---

**For questions or issues, refer to the main README.md**
