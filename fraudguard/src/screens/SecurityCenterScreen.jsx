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

const SecurityCenterScreen = ({setScreen}) => {
  const threats = [
    {type:"Device",  msg:"New device login from Russia",    sev:"High",   time:"5 hrs ago",  icon:"📱"},
    {type:"Login",   msg:"3 failed login attempts",         sev:"Medium", time:"12 hrs ago", icon:"🔑"},
    {type:"Network", msg:"VPN / Proxy connection detected", sev:"Low",    time:"Yesterday",  icon:"🌐"},
  ];
  const sevColor = s=>s==="High"?C.red:s==="Medium"?C.yellow:C.blue;
  const sevBg    = s=>s==="High"?C.redLt:s==="Medium"?C.yellowLt:C.blueLt;

  return (
    <div className="up" style={{flex:1,overflowY:"auto",paddingBottom:16}}>
      <div style={{background:`linear-gradient(160deg,${C.blue},#1045B5)`,padding:"0 20px 22px",borderRadius:"0 0 28px 28px"}}>
        <StatusBar light/>
        <Hdr light title="Security Center"/>
      </div>
      <div style={{padding:"18px 18px 0"}}>
        {/* Score */}
        <Card style={{textAlign:"center",padding:26,marginBottom:16,background:`linear-gradient(135deg,${C.blueLt},#fff)`}}>
          <div style={{color:C.textSm,fontSize:12,marginBottom:8,fontWeight:600}}>YOUR SECURITY SCORE</div>
          <div style={{fontSize:52,fontWeight:800,color:C.blue,fontFamily:"'Plus Jakarta Sans',sans-serif",letterSpacing:"-2px"}}>87</div>
          <div style={{color:C.green,fontSize:13,fontWeight:600,marginBottom:14}}>✓ Good standing · 3 tips to improve</div>
          <div style={{display:"flex",gap:8,justifyContent:"center"}}>
            {["2FA Enabled","Biometrics","PIN Set"].map(f=>(
              <Chip key={f} color={C.green} bg={C.greenLt}>{f}</Chip>
            ))}
          </div>
        </Card>

        <div style={{fontWeight:700,fontSize:13,color:C.textMd,marginBottom:10}}>🚨 Recent alerts</div>
        {threats.map(t=>(
          <Card key={t.type} style={{marginBottom:10,padding:14}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:40,height:40,borderRadius:12,fontSize:18,background:sevBg(t.sev),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{t.icon}</div>
              <div style={{flex:1}}>
                <div style={{color:C.text,fontSize:13,fontWeight:700}}>{t.msg}</div>
                <div style={{color:C.textSm,fontSize:11}}>{t.time} · {t.type} Alert</div>
              </div>
              <Chip color={sevColor(t.sev)} bg={sevBg(t.sev)}>{t.sev}</Chip>
            </div>
          </Card>
        ))}

        <div style={{fontWeight:700,fontSize:13,color:C.textMd,margin:"16px 0 10px"}}>💻 Trusted Devices</div>
        {DEVICES.map(d=>(
          <Card key={d.name} style={{marginBottom:10,padding:14}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:22}}>{d.name.includes("Mac")?"💻":d.ok?"📱":"❓"}</span>
              <div style={{flex:1}}>
                <div style={{color:C.text,fontSize:13,fontWeight:700}}>{d.name}</div>
                <div style={{color:C.textSm,fontSize:11}}>{d.loc} · {d.seen}</div>
              </div>
              <Chip color={d.status==="current"?C.green:d.status==="active"?C.blue:C.red}
                    bg={d.status==="current"?C.greenLt:d.status==="active"?C.blueLt:C.redLt}>
                {d.status==="current"?"This device":d.status==="active"?"Active":"Blocked"}
              </Chip>
            </div>
          </Card>
        ))}

        <Card style={{marginTop:4}}>
          <div style={{fontWeight:700,fontSize:13,color:C.textMd,marginBottom:4}}>⚙️ Security Settings</div>
          <ToggleRow label="Two-Factor Authentication" defaultOn={true}  accent={C.green}/>
          <ToggleRow label="Biometric Login"           defaultOn={true}  accent={C.green}/>
          <ToggleRow label="Transaction PIN"           defaultOn={true}  accent={C.green}/>
          <ToggleRow label="Login Notifications"       defaultOn={true}  accent={C.green}/>
          <ToggleRow label="Dark Web Monitoring"       defaultOn={false} accent={C.yellow} warn/>
        </Card>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   SCREEN 12 — SPLIT BILL (EXTRA FEATURE 6)
═══════════════════════════════════════════════════════ */

export default SecurityCenterScreen
