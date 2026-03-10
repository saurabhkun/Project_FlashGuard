import { useState, useEffect } from 'react'
import './styles/globals.css'

// Layout shells
import PhoneShell from './components/PhoneShell'
import BottomNav from './components/BottomNav'

// All screens
import LoginScreen from './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen'
import SendMoneyScreen from './screens/SendMoneyScreen'
import FraudAnalysisScreen from './screens/FraudAnalysisScreen'
import HistoryScreen from './screens/HistoryScreen'
import InsightsScreen from './screens/InsightsScreen'
import ScannerScreen from './screens/ScannerScreen'
import CardManagementScreen from './screens/CardManagementScreen'
import InternationalScreen from './screens/InternationalScreen'
import SpendingScreen from './screens/SpendingScreen'
import SecurityCenterScreen from './screens/SecurityCenterScreen'
import SplitBillScreen from './screens/SplitBillScreen'
import TxnDetailScreen from './screens/TxnDetailScreen'
import ProfileScreen from './screens/ProfileScreen'

import { C } from './styles/tokens'

// Screens that show bottom navigation
const NAV_SCREENS = ['home', 'scan', 'history', 'security', 'profile']


// ───────────────── Alert Overlay ─────────────────
function AlertOverlay({ alert, onDismiss }) {
  if (!alert) return null

  return (
    <div
      style={{
        position: 'absolute',
        top: 60,
        left: 14,
        right: 14,
        zIndex: 400,
        background: '#fff',
        border: `1.5px solid ${C.red}55`,
        borderRadius: 18,
        padding: 14,
        boxShadow: `0 12px 40px ${C.red}28`
      }}
    >
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{
          width: 40,
          height: 40,
          background: C.redLt,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20
        }}>
          🚨
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ color: C.red, fontWeight: 800 }}>
            Suspicious Transaction Caught!
          </div>

          <div style={{ fontSize: 11, color: C.textMd }}>
            User {alert.user} · {alert.amount} · {alert.loc}
          </div>

          <div style={{ marginTop: 4 }}>
            <span style={{
              background: C.redLt,
              padding: '3px 8px',
              borderRadius: 8,
              fontSize: 11,
              color: C.red,
              fontWeight: 700
            }}>
              Risk {alert.score}
            </span>

            <span style={{
              marginLeft: 6,
              fontSize: 11,
              color: C.green,
              fontWeight: 600
            }}>
              ✓ Blocked by FraudGuard
            </span>
          </div>
        </div>

        <button
          onClick={onDismiss}
          style={{
            border: 'none',
            background: 'none',
            fontSize: 20,
            cursor: 'pointer'
          }}
        >
          ×
        </button>
      </div>
    </div>
  )
}



// ───────────────── MAIN APP ─────────────────
export default function App() {

  const [loggedIn, setLoggedIn] = useState(false)
  const [screen, setScreen] = useState('home')
  const [analysisResult, setAnalysisResult] = useState(null)
  const [currentTxn, setCurrentTxn] = useState(null)
  const [alert, setAlert] = useState(null)

  // Demo fraud alert
  useEffect(() => {
    if (!loggedIn) return

    const t = setTimeout(() => {
      setAlert({
        user: '#7821',
        amount: '₹12,000',
        loc: 'Russia',
        score: '82%'
      })

      setTimeout(() => setAlert(null), 5500)

    }, 4000)

    return () => clearTimeout(t)

  }, [loggedIn])



  // ───────── Screen Router ─────────
  function renderScreen() {

    const props = { setScreen, setAnalysisResult, setCurrentTxn }

    switch (screen) {

      case 'home': return <HomeScreen {...props} />

      case 'send': return <SendMoneyScreen {...props} />

      case 'fraudAnalysis':
        return <FraudAnalysisScreen result={analysisResult} setScreen={setScreen} />

      case 'history': return <HistoryScreen {...props} />

      case 'security':
        return <SecurityCenterScreen setScreen={setScreen} />

      case 'insights':
        return <InsightsScreen setScreen={setScreen} />

      case 'scan':
        return <ScannerScreen setScreen={setScreen} />

      case 'card':
        return <CardManagementScreen setScreen={setScreen} />

      case 'international':
        return <InternationalScreen setScreen={setScreen} />

      case 'spending':
        return <SpendingScreen setScreen={setScreen} />

      case 'split':
        return <SplitBillScreen setScreen={setScreen} />

      case 'txnDetail':
        return <TxnDetailScreen txn={currentTxn} setScreen={setScreen} />

      case 'profile':
        return (
          <ProfileScreen
            setScreen={setScreen}
            onLogout={() => {
              setLoggedIn(false)
              setScreen('home')
            }}
          />
        )

      default:
        return <HomeScreen {...props} />
    }
  }



  return (
    <>

      


      {/* PHONE FRAME */}
      <PhoneShell>

        {loggedIn && (
          <AlertOverlay
            alert={alert}
            onDismiss={() => setAlert(null)}
          />
        )}


        {!loggedIn ? (

          <LoginScreen onLogin={() => setLoggedIn(true)} />

        ) : (

          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>

            <div style={{
              flex: 1,
              overflowY: 'auto'
            }}>
              {renderScreen()}
            </div>

            {NAV_SCREENS.includes(screen) && (
              <BottomNav
                screen={screen}
                setScreen={setScreen}
              />
            )}


            {/* Feature Chips INSIDE PHONE */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
              justifyContent: 'center',
              padding: 12
            }}>

              {[
                '11-Layer AI Engine',
                'QR Scanner',
                'Card Freeze',
                'International FX',
                'Bill Splitter',
                'Security Center',
                'Spending AI',
                'Live Fraud Alerts'
              ].map((f) => (

                <div
                  key={f}
                  style={{
                    background: '#ffffffcc',
                    border: `1px solid ${C.blue}`,
                    borderRadius: 20,
                    padding: '4px 10px',
                    fontSize: 10,
                    color: C.blue,
                    fontWeight: 700
                  }}
                >
                  {f}
                </div>

              ))}

            </div>

          </div>

        )}

      </PhoneShell>

    </>
  )
}