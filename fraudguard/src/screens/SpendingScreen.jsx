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

const SpendingScreen = ({setScreen}) => {
  const [period,setPeriod] = useState("month");
  const total = SPEND_CAT.reduce((a,b)=>a+b.amt,0);

  return (
    <div className="up" style={{flex:1,overflowY:"auto",paddingBottom:16}}>
      <div style={{background:`linear-gradient(160deg,${C.blue},#1045B5)`,padding:"0 20px 22px",borderRadius:"0 0 28px 28px"}}>
        <StatusBar light/>
        <Hdr light title="Spending Analytics" onBack={()=>setScreen("profile")}/>
      </div>
      <div style={{padding:"18px 18px 0"}}>
        <div style={{display:"flex",gap:8,marginBottom:16}}>
          {["week","month","year"].map(p=>(
            <Pill key={p} on={period===p} onClick={()=>setPeriod(p)}>{p.charAt(0).toUpperCase()+p.slice(1)}</Pill>
          ))}
        </div>

        <Card style={{marginBottom:16,padding:20}}>
          <div style={{color:C.textSm,fontSize:12,marginBottom:4}}>TOTAL SPENT THIS {period.toUpperCase()}</div>
          <div style={{fontSize:30,fontWeight:800,color:C.text,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>₹{total.toLocaleString()}</div>
          <div style={{color:C.red,fontSize:12,marginTop:4,fontWeight:600}}>↑ 12.4% compared to last {period}</div>
        </Card>

        {/* AI Nudge */}
        <div style={{background:C.purpleLt,border:`1px solid ${C.purple}22`,borderRadius:14,padding:13,marginBottom:16,display:"flex",gap:10}}>
          <span style={{fontSize:18}}>💡</span>
          <div>
            <div style={{color:C.purple,fontWeight:700,fontSize:13}}>FraudGuard tip for you</div>
            <div style={{color:C.textMd,fontSize:12,marginTop:2}}>You spend 34% more on food on weekends. A simple ₹1,500 weekly cap could save you ₹2,400 this month!</div>
          </div>
        </div>

        <Card style={{marginBottom:14,display:"flex",alignItems:"center",gap:12}}>
          <PieChart width={120} height={120}>
            <Pie data={SPEND_CAT} cx={56} cy={56} innerRadius={26} outerRadius={54} paddingAngle={2} dataKey="amt">
              {SPEND_CAT.map((e,i)=><Cell key={i} fill={e.color}/>)}
            </Pie>
          </PieChart>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:13,color:C.textMd,marginBottom:8}}>Where your money goes</div>
            {SPEND_CAT.map(c=>(
              <div key={c.cat} style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                <div style={{width:7,height:7,borderRadius:2,background:c.color,flexShrink:0}}/>
                <span style={{color:C.textMd,fontSize:11,flex:1}}>{c.icon} {c.cat}</span>
                <span style={{color:c.color,fontWeight:700,fontSize:11}}>{c.pct}%</span>
              </div>
            ))}
          </div>
        </Card>

        {SPEND_CAT.map(c=>(
          <div key={c.cat} style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{color:C.text,fontSize:13}}>{c.icon} {c.cat}</span>
              <span style={{color:c.color,fontWeight:700,fontSize:13}}>₹{c.amt.toLocaleString()}</span>
            </div>
            <div style={{height:8,background:C.border,borderRadius:4,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${c.pct}%`,background:c.color,borderRadius:4,transition:"width 1s ease"}}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   SCREEN 11 — SECURITY CENTER (EXTRA FEATURE 5)
═══════════════════════════════════════════════════════ */

export default SpendingScreen
