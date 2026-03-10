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

const InternationalScreen = ({setScreen}) => {
  const [amount,setAmount]     = useState(1000);
  const [currency,setCurrency] = useState(CURRENCIES[0]);
  const converted = (amount*currency.rate).toFixed(2);
  const fee = Math.round(amount*0.005);

  return (
    <div className="up" style={{flex:1,overflowY:"auto",paddingBottom:16}}>
      <div style={{background:`linear-gradient(160deg,${C.blue},#1045B5)`,padding:"0 20px 22px",borderRadius:"0 0 28px 28px"}}>
        <StatusBar light/>
        <Hdr light title="Send Abroad" onBack={()=>setScreen("home")}/>
      </div>
      <div style={{padding:"18px 18px 0"}}>
        <Card style={{marginBottom:16,padding:22}}>
          <div style={{color:C.textSm,fontSize:12,fontWeight:600,marginBottom:6}}>YOU SEND (INR ₹)</div>
          <div style={{fontSize:34,fontWeight:800,color:C.text,fontFamily:"'Plus Jakarta Sans',sans-serif",marginBottom:10}}>₹{amount.toLocaleString()}</div>
          <input type="range" min={100} max={500000} step={100} value={amount} onChange={e=>setAmount(+e.target.value)}
            style={{width:"100%",accentColor:C.blue,marginBottom:14}}/>
          <Divider/>
          <div style={{color:C.textSm,fontSize:12,fontWeight:600,marginTop:12,marginBottom:4}}>THEY RECEIVE</div>
          <div style={{fontSize:26,fontWeight:800,color:C.green,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
            {currency.flag} {converted} {currency.code}
          </div>
          <div style={{color:C.textSm,fontSize:11,marginTop:6}}>
            Rate: 1 INR = {currency.rate} {currency.code} · Fee: ₹{fee}
          </div>
        </Card>

        <div style={{fontWeight:700,fontSize:13,color:C.textMd,marginBottom:10}}>Select currency</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
          {CURRENCIES.map(c=>(
            <button key={c.code} onClick={()=>setCurrency(c)} style={{
              padding:12,background:currency.code===c.code?C.blueLt:"#fff",
              border:`1.5px solid ${currency.code===c.code?C.blue:C.border}`,
              borderRadius:14,cursor:"pointer",textAlign:"left",fontFamily:"'Plus Jakarta Sans',sans-serif",
              transition:"all .2s"
            }}>
              <div style={{fontSize:20,marginBottom:4}}>{c.flag}</div>
              <div style={{color:C.text,fontSize:13,fontWeight:700}}>{c.code}</div>
              <div style={{color:C.textSm,fontSize:11}}>{c.name}</div>
              <div style={{color:C.blue,fontSize:11,fontWeight:600,marginTop:2}}>₹1 = {c.rate} {c.code}</div>
            </button>
          ))}
        </div>

        <Card style={{marginBottom:16}}>
          <div style={{fontWeight:700,fontSize:13,color:C.textMd,marginBottom:10}}>Transfer Summary</div>
          {[["You send",`₹${amount.toLocaleString()}`],["Exchange rate",`1 INR = ${currency.rate} ${currency.code}`],["Fee",`₹${fee}`],["They get",`${currency.flag} ${converted} ${currency.code}`],["Delivery","2–3 business days"]].map(([l,v])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${C.border}`}}>
              <span style={{color:C.textSm,fontSize:13}}>{l}</span>
              <span style={{color:C.text,fontSize:13,fontWeight:700}}>{v}</span>
            </div>
          ))}
        </Card>

        <Btn onClick={()=>setScreen("send")}>Continue →</Btn>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   SCREEN 10 — SPENDING ANALYTICS (EXTRA FEATURE 4)
═══════════════════════════════════════════════════════ */

export default InternationalScreen
