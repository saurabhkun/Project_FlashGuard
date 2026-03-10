import { useState, useEffect } from 'react'
import { C, riskColor, riskBg, riskLabel, statusColor, statusBg } from '../styles/tokens'
import { TXN_LIST, WEEKLY_CHART, PIE_DATA, SPEND_CAT, CURRENCIES, DEVICES } from '../data/mockData'
import { fraudEngine } from '../services/fraudEngine'
import { Hdr, Chip, Pill, Btn, Inp, Card, Divider, Toggle, ToggleRow, Gauge, MiniGauge } from '../components/ui'
import StatusBar from '../components/StatusBar'
import {
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

const LoginScreen = ({onLogin}) => {
  const [email,setEmail] = useState("arjun@fraudguard.in");
  const [pass,setPass]   = useState("••••••••");
  const [loading,setLoading] = useState(false);
  const [bio,setBio] = useState(false);

  const go = () => { setLoading(true); setTimeout(()=>{setLoading(false);onLogin();},1800); };

  return (
    <div className="fade-in" style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column"}}>
      {/* Hero */}
      <div style={{background:`linear-gradient(160deg,${C.blue} 0%,#1045B5 100%)`,padding:"52px 28px 40px",borderRadius:"0 0 36px 36px"}}>
        <StatusBar light/>
        <div style={{textAlign:"center",marginTop:8}}>
          <div style={{
            width:68,height:68,borderRadius:22,background:"rgba(255,255,255,.18)",
            border:"1.5px solid rgba(255,255,255,.35)",backdropFilter:"blur(8px)",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,
            margin:"0 auto 14px",boxShadow:"0 8px 32px rgba(0,0,0,.18)"
          }}>🛡️</div>
          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:26,color:"#fff",letterSpacing:"-.5px"}}>FraudGuard</div>
          <div style={{color:"rgba(255,255,255,.75)",fontSize:13,marginTop:4,fontWeight:500}}>Your smart money protector</div>
        </div>
      </div>

      <div style={{padding:"28px 22px",flex:1}}>
        {/* Trust strip */}
        <div style={{background:C.greenLt,border:`1px solid ${C.green}33`,borderRadius:14,
          padding:"11px 14px",display:"flex",alignItems:"center",gap:10,marginBottom:22}}>
          <span style={{fontSize:18}}>✅</span>
          <div>
            <div style={{color:C.green,fontWeight:700,fontSize:13}}>You're in safe hands</div>
            <div style={{color:C.textSm,fontSize:11}}>AI fraud shield • Bank-grade encryption</div>
          </div>
        </div>

        <div style={{color:C.text,fontWeight:700,fontSize:18,marginBottom:4,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Welcome back! 👋</div>
        <div style={{color:C.textMd,fontSize:13,marginBottom:20}}>Sign in to protect your money today.</div>

        <Inp label="Email" value={email} onChange={setEmail} placeholder="you@example.com" icon="📧"/>
        <Inp label="Password" type="password" value={pass} onChange={setPass} placeholder="Enter your password" icon="🔐"/>

        <div style={{display:"flex",gap:10,marginBottom:20}}>
          {[["👆","Touch ID"],["👁️","Face ID"]].map(([ic,lb])=>(
            <button key={lb} onClick={()=>{setBio(true);go();}} style={{
              flex:1,padding:"11px 8px",background:bio?C.blueLt:"#fff",
              border:`1.5px solid ${bio?C.blue:C.border}`,borderRadius:13,
              color:bio?C.blue:C.textMd,fontSize:12,fontWeight:600,cursor:"pointer",
              fontFamily:"'Plus Jakarta Sans',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:6
            }}><span>{ic}</span>{lb}</button>
          ))}
        </div>

        <Btn onClick={go} disabled={loading}>
          {loading
            ? <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
                <span className="spin" style={{display:"inline-block",width:16,height:16,border:"2.5px solid #fff",borderTopColor:"transparent",borderRadius:"50%"}}/>
                Verifying you securely…
              </span>
            : "Sign In →"}
        </Btn>

        <div style={{textAlign:"center",marginTop:14}}>
          <span style={{color:C.blue,fontSize:13,cursor:"pointer",fontWeight:600}}>Forgot password?</span>
        </div>
        <div style={{textAlign:"center",marginTop:20,color:C.textSm,fontSize:11,lineHeight:1.6}}>
          Protected by FraudGuard AI Engine v4.2<br/>
          <span style={{color:C.blue}}>●</span> 2.4M transactions secured today
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   SCREEN 2 — HOME
═══════════════════════════════════════════════════════ */

export default LoginScreen
