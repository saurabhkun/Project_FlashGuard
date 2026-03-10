I am building a project for a hackathon called CHAKRAVYUH 2.0.
The problem statement is Fraud Prevention in Online Transactions.

I want to design a modern AI-powered fraud detection dashboard with a UI prototype and frontend implementation.

Tech Stack

UI Prototype: Figma

Frontend: React.js

Styling: Tailwind CSS or Bootstrap

Charts: Recharts / Chart.js

Icons: Lucide or Heroicons

Core Concept

The platform analyzes transaction patterns in real time to detect suspicious activity and classify transactions as Safe, Suspicious, or Fraudulent using machine learning.

UI Pages Required
1. Dashboard Overview

Show analytics cards such as:

Total Transactions

Fraudulent Transactions

Suspicious Transactions

Fraud Detection Rate

Include charts:

Fraud vs Legitimate transactions (Pie Chart)

Fraud detection trend over time (Line Chart)

Fraud by location (Map or Bar Chart)

2. Transaction Input Form (Main Feature)

Create a React form where the user enters transaction details to check fraud probability.

Required Inputs:

Transaction Amount

Transaction Time

Device Score (risk score from device fingerprinting)

Location (country / city)

IP Address Risk Score

User Account Age

Transaction Frequency (last 24h)

Merchant Category

Payment Method (UPI / Card / Wallet / Netbanking)

Failed Login Attempts

After submission:

Show output:

Fraud Probability %

Risk Level

Recommendation (Allow / Review / Block)

Display results using colored indicators

Green → Safe
Yellow → Suspicious
Red → Fraudulent

3. Real-Time Transaction Monitoring

Create a table showing:

Transaction ID

User ID

Amount

Location

Risk Score

Status (Safe / Suspicious / Fraud)

Action Taken

Add filters:

Date range

Risk level

Location

4. Fraud Alerts Panel

Show suspicious activities such as:

Multiple transactions in short time

Transactions from unusual locations

High-risk device fingerprints

Display alerts with:

Alert severity

Timestamp

Suggested action

5. User Behavior Analysis

Visualizations:

Transaction frequency heatmap

Location change tracking

Spending pattern chart

6. Admin Panel

Admin can:

View flagged transactions

Manually approve or block transactions

Update fraud threshold

UI Design Requirements

The design should be:

Clean fintech style

Dark and light mode

Modern cards and graphs

Responsive layout

Sidebar navigation:

Dashboard

Transactions

Fraud Detection

Alerts

Analytics

Admin

Output I Want

Figma UI layout structure

React component structure

Folder architecture

Tailwind UI code snippets

Example transaction dataset

Mock API response

The dashboard should look like a modern fintech fraud monitoring platform used by banks or payment gateways.

Extra Features (Judges LOVE these in Hackathons)

You can add these quickly:

1️⃣ Fraud Risk Meter

A speedometer style gauge showing risk score.

2️⃣ Geo Fraud Map

Map showing suspicious transaction clusters globally.

3️⃣ Behavioral Biometrics

Detect fraud using:

typing speed

mouse movement

device switching

4️⃣ AI Explanation Panel

Explain why the transaction was flagged.

Example:

Fraud detected because:

Unusual location

High transaction amount

Multiple attempts in short time

5️⃣ Fraud Simulation Mode

Allow users to simulate fraudulent transactions.

Example Transaction Inputs (Use in your UI)
Transaction Amount: 12000
Transaction Time: 02:13 AM
Device Score: 82
Location: Russia
IP Risk Score: 75
Account Age: 3 days
Transaction Frequency: 12 in last hour
Merchant Category: Electronics
Payment Method: Credit Card
Failed Login Attempts: 4

Output:

Fraud Probability: 91%
Risk Level: HIGH
Recommendation: BLOCK
Suggested Folder Structure (React)
src
 ├── components
 │    ├── Navbar.jsx
 │    ├── Sidebar.jsx
 │    ├── FraudGauge.jsx
 │    ├── TransactionTable.jsx
 │    ├── AlertPanel.jsx
 │
 ├── pages
 │    ├── Dashboard.jsx
 │    ├── Transactions.jsx
 │    ├── FraudCheck.jsx
 │    ├── Analytics.jsx
 │
 ├── services
 │    ├── fraudAPI.js
 │
 ├── data
 │    ├── mockTransactions.js