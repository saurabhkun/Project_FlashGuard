# 🎨 Visual Overview - FraudGuard Dashboard

## Application Screenshots Description

### 1. Dashboard Page (Landing Page)

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│  [Logo] FraudGuard        [Search Bar]    [🌙] [User Profile]  │
├────────────────────────────────────────────────────────────────┤
│ 📊 │                                                            │
│ 💳 │  Dashboard Overview                                       │
│ 🛡️ │                                                            │
│ 🔔 │  [📊 Total: 10]  [⚠️ Fraud: 2]  [⚡ Susp: 3]  [📈 Rate: 20%] │
│ 📈 │                                                            │
│ ⚙️ │  ┌─────────────────┐  ┌───────────────────────────┐     │
│    │  │  Fraud Gauge    │  │    Pie Chart              │     │
│    │  │    24%          │  │  Safe: 50% | Fraud: 20%   │     │
│    │  │   (Green)       │  │  Suspicious: 30%          │     │
│    │  └─────────────────┘  └───────────────────────────┘     │
│    │                                                            │
│    │  ┌───────────────────────────────────────────────────┐   │
│    │  │  Line Chart: Fraud Trend Over Time               │   │
│    │  │  (8 months data showing fraud vs legitimate)     │   │
│    │  └───────────────────────────────────────────────────┘   │
│    │                                                            │
│    │  ┌───────────────────────────────────────────────────┐   │
│    │  │  Bar Chart: Fraud by Location                    │   │
│    │  │  India | USA | UK | China | Russia | Nigeria     │   │
│    │  └───────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

**Key Visual Elements:**
- 4 stats cards with icons and trend indicators
- Large fraud gauge (speedometer style) showing 24%
- Colorful pie chart with legend
- Line chart with two lines (fraudulent/legitimate)
- Stacked bar chart by country
- Recent high-risk transactions list

**Color Scheme:**
- Background: White (light) / Gray-900 (dark)
- Stats cards: Blue icons, white cards
- Gauge: Green (low risk)
- Charts: Blue, Green, Red, Yellow

---

### 2. Fraud Detection Page (⭐ MAIN FEATURE)

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│  Fraud Detection Check                                          │
├────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────┐  ┌──────────────────────────┐   │
│  │ Transaction Details     │  │  Analysis Results        │   │
│  │ [Load Example Data]     │  │                          │   │
│  │                         │  │     ┌────────────┐       │   │
│  │ Amount:      [12000]    │  │     │   Gauge    │       │   │
│  │ Time:        [02:13 AM] │  │     │    91%     │       │   │
│  │ Device:      [82]       │  │     │   (RED)    │       │   │
│  │ Location:    [Russia]   │  │     └────────────┘       │   │
│  │ IP Risk:     [75]       │  │  TXN-ABC123             │   │
│  │ Account Age: [3 days]   │  │                          │   │
│  │ Frequency:   [12]       │  │  ┌────────────────────┐ │   │
│  │ Category:    [Electronics]│ │ 🔴 HIGH RISK        │ │   │
│  │ Payment:     [Credit Card]│ │    BLOCK            │ │   │
│  │ Failed:      [4]        │  │  └────────────────────┘ │   │
│  │                         │  │                          │   │
│  │ [Check Fraud Risk]      │  │  AI Explanation:         │   │
│  │                         │  │  • High-risk location    │   │
│  │                         │  │  • Late night time       │   │
│  │                         │  │  • High amount          │   │
│  │                         │  │  • Multiple transactions │   │
│  └─────────────────────────┘  └──────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

**Key Visual Elements:**
- Left: Form with 10 input fields
- "Load Example Data" link button
- Blue submit button with loading state
- Right: Animated circular gauge (0-100%)
- Color-coded risk badge (RED for HIGH)
- Transaction ID display
- AI explanation panel with bullet points

**Animation:**
- Gauge animates from 0 to final value
- Smooth 1 second transition
- Risk badge fades in

---

### 3. Transactions Page

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│  Transaction Monitoring            [🔄 Refresh] [📥 Export]    │
├────────────────────────────────────────────────────────────────┤
│  [Today: 10]  [Volume: ₹67k]  [Avg: ₹6.7k]  [Blocked: 2]     │
│                                                                 │
│  🔍 Filters:  [All Status ▼]  [All Locations ▼]              │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ ID      │ User   │ Amount │ Location │ Risk │ Status   │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │ TXN-001 │ USR-89 │ ₹12,000│ Russia   │ 91   │ 🔴 Fraud  │ │
│  │ TXN-002 │ USR-45 │ ₹450   │ India    │ 15   │ 🟢 Safe   │ │
│  │ TXN-003 │ USR-78 │ ₹8,500 │ Nigeria  │ 67   │ 🟡 Susp   │ │
│  │ TXN-004 │ USR-34 │ ₹250   │ USA      │ 8    │ 🟢 Safe   │ │
│  │ ...     │ ...    │ ...    │ ...      │ ...  │ ...      │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

**Key Visual Elements:**
- Summary cards at top
- Filter dropdowns
- Sortable table
- Color-coded risk scores
- Status badges with colors
- Hover effects on rows

---

### 4. Alerts Page

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│  Fraud Alerts                                                   │
├────────────────────────────────────────────────────────────────┤
│  [🔴 High: 3]     [🟡 Medium: 2]     [🔵 Low: 1]             │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ 🔴 HIGH | Multiple Transactions in Short Time          │   │
│  │ User USR-8901 made 12 transactions in the last hour    │   │
│  │ 🕐 Mar 9, 02:15 AM | Action: Account Locked           │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ 🟡 MEDIUM | Suspicious Payment Pattern                 │   │
│  │ User USR-7823 changed payment method 3 times          │   │
│  │ 🕐 Mar 9, 08:20 AM | Action: Under Investigation      │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Alert Configuration:                                           │
│  [x] Multiple Transactions Alert     [Toggle ON]              │
│  [x] High-Risk Location Alert        [Toggle ON]              │
│  [x] Device Fingerprint Alert        [Toggle ON]              │
└────────────────────────────────────────────────────────────────┘
```

**Key Visual Elements:**
- Severity counters at top
- Alert cards with color borders
- Icon indicators
- Timestamp and action status
- Toggle switches for configuration

---

### 5. Analytics Page

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│  User Behavior Analytics                                        │
├────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐    │
│  │  Transaction Frequency Heatmap (Area Chart)           │    │
│  │  Peak hours: 12:00 PM - 2:00 PM                      │    │
│  └───────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────┐  ┌──────────────────────────┐       │
│  │ Spending Pattern    │  │  User Behavior Radar     │       │
│  │ (Horizontal Bar)    │  │  (6 metrics)             │       │
│  │ Travel:    ₹56k    │  │  Trust Score: 85         │       │
│  │ Electronics: ₹45k   │  │  Activity: 75            │       │
│  │ Fashion:    ₹34k    │  │  Payment Div: 60         │       │
│  └─────────────────────┘  └──────────────────────────┘       │
│                                                                 │
│  Location Change Tracking:                                      │
│  [USR-8901] Mumbai → Moscow → Beijing (2 hours) 🔴 HIGH RISK  │
│  [USR-4523] Delhi → Mumbai (5 days) 🟢 LOW RISK               │
└────────────────────────────────────────────────────────────────┘
```

**Key Visual Elements:**
- Blue area chart for frequency
- Horizontal bar chart for spending
- Radar chart for behavior metrics
- Location tracking cards

---

### 6. Admin Page

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│  Admin Panel                                                    │
├────────────────────────────────────────────────────────────────┤
│  Fraud Detection Threshold Settings:                            │
│  Fraud Threshold:      [━━━━━━━━━━○] 70%                     │
│  Suspicious Threshold: [━━━━○━━━━━━] 40%                     │
│  [Save Settings]                                               │
│                                                                 │
│  Flagged Transactions - Manual Review:                          │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ 🔴 TXN-001234 | Russia | ₹12,000 | Risk: 91%           │   │
│  │ User: USR-8901 | Electronics | Credit Card             │   │
│  │ [✓ Approve]  [✕ Block]                                 │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Blacklist Management:                                          │
│  Add IP: [192.168.1.1________________] [Add]                  │
│  Current Blacklist:                                             │
│  • 195.22.146.78 [Remove]                                      │
│  • 119.78.45.23 [Remove]                                       │
└────────────────────────────────────────────────────────────────┘
```

**Key Visual Elements:**
- Range sliders for thresholds
- Flagged transaction cards
- Approve/Block buttons
- IP blacklist input
- System statistics

---

## Color Palette

### Light Mode
```
Background:     #FFFFFF (white)
Card:           #FFFFFF with shadow
Border:         #E5E7EB (gray-200)
Text:           #111827 (gray-900)
Sidebar:        #FFFFFF
Primary:        #3B82F6 (blue)
Success:        #10B981 (green)
Warning:        #F59E0B (yellow)
Danger:         #EF4444 (red)
```

### Dark Mode
```
Background:     #111827 (gray-900)
Card:           #1F2937 (gray-800)
Border:         #374151 (gray-700)
Text:           #FFFFFF (white)
Sidebar:        #1F2937 (gray-800)
Primary:        #3B82F6 (blue)
Success:        #10B981 (green)
Warning:        #F59E0B (yellow)
Danger:         #EF4444 (red)
```

---

## Icon Set (Lucide React)

- 🏠 `LayoutDashboard` - Dashboard
- 💳 `CreditCard` - Transactions
- 🛡️ `Shield` - Fraud Detection
- 🔔 `Bell` - Alerts
- 📊 `BarChart3` - Analytics
- ⚙️ `Settings` - Admin
- 🌙 `Moon` - Dark mode
- ☀️ `Sun` - Light mode
- 🔍 `Search` - Search bar
- ✓ `CheckCircle` - Approve
- ✕ `XCircle` - Block
- ⚠️ `AlertTriangle` - Warning
- 📥 `Download` - Export
- 🔄 `RefreshCw` - Refresh

---

## Typography

### Headings
- Page Title: `text-3xl font-bold` (30px)
- Section Title: `text-xl font-semibold` (20px)
- Card Title: `text-sm font-medium` (14px)

### Body
- Regular Text: `text-base` (16px)
- Small Text: `text-sm` (14px)
- Extra Small: `text-xs` (12px)

### Numbers/Stats
- Large Stats: `text-3xl font-bold` (30px)
- Medium Stats: `text-2xl font-bold` (24px)

---

## Responsive Breakpoints

### Mobile (< 768px)
- Single column layout
- Sidebar becomes overlay/drawer
- Charts stack vertically
- Form inputs full width

### Tablet (768px - 1023px)
- 2 column grids
- Sidebar visible
- Charts side by side

### Desktop (>= 1024px)
- 3-4 column grids
- Full sidebar
- Optimal chart sizes

---

## Animation Effects

1. **Fraud Gauge** - Circular fill animation (1 second)
2. **Page Transitions** - Fade in effect
3. **Hover States** - Smooth color transitions
4. **Loading State** - Spinner rotation
5. **Theme Toggle** - Smooth color transition (0.3s)

---

## Chart Specifications

### Pie Chart
- Diameter: ~200px
- Colors: Green (Safe), Yellow (Suspicious), Red (Fraud)
- Labels: Outside with percentage

### Line Chart
- Height: 300px
- Lines: 2 (Fraudulent: red, Legitimate: green)
- Grid: Dotted gray

### Bar Chart
- Height: 300px
- Bars: Stacked (Safe, Suspicious, Fraud)
- Axis: Country names

### Area Chart
- Height: 300px
- Fill: Blue with opacity
- Gradient: Top to bottom

### Radar Chart
- Size: 300x300px
- Fill: Green with opacity
- Points: 6 metrics

---

## Status Badges

```css
Safe:       green-100 background, green-800 text
Suspicious: yellow-100 background, yellow-800 text
Fraud:      red-100 background, red-800 text

Dark Mode:
Safe:       green-900/20 background, green-400 text
Suspicious: yellow-900/20 background, yellow-400 text
Fraud:      red-900/20 background, red-400 text
```

---

This visual guide helps understand the layout and design of each page in the FraudGuard application.
