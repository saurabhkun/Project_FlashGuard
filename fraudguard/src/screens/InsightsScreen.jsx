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

const InsightsScreen = ({setScreen}) => (
  <div className="up" style={{flex:1,overflowY:"auto",paddingBottom:8}}>
    <div style={{background:`linear-gradient(160deg,${C.blue},#1045B5)`,padding:"0 20px 22px",borderRadius:"0 0 28px 28px"}}>
      <StatusBar light/>
      <Hdr light title="Fraud Insights"/>
    </div>
    <div style={{padding:"18px 18px 0"}}>
      <div style={{background:C.blueLt,border:`1px solid ${C.blue}22`,borderRadius:14,padding:12,marginBottom:16,display:"flex",gap:10,alignItems:"flex-start"}}>
        <span style={{fontSize:18}}>🤖</span>
        <div>
          <div style={{color:C.blue,fontWeight:700,fontSize:13}}>Here's what our AI found this week</div>
          <div style={{color:C.textMd,fontSize:12,marginTop:2}}>We blocked ₹62,000 in fraudulent transactions and kept your account safe.</div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
        {[["Fraud Rate","10.2%",C.red],["Blocked Today","₹62,000",C.yellow],["AI Accuracy","98.7%",C.green],["Alerts Sent","7",C.blue]].map(([l,v,c])=>(
          <Card key={l} style={{padding:14}}>
            <div style={{color:C.textSm,fontSize:11,marginBottom:4}}>{l}</div>
            <div style={{color:c,fontSize:22,fontWeight:800,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{v}</div>
          </Card>
        ))}
      </div>

      <Card style={{marginBottom:14}}>
        <div style={{fontWeight:700,fontSize:13,color:C.textMd,marginBottom:12}}>📅 This Week's Breakdown</div>
        <ResponsiveContainer width="100%" height={155}>
          <BarChart data={WEEKLY} margin={{top:0,right:0,bottom:0,left:-28}}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
            <XAxis dataKey="d" tick={{fill:C.textSm,fontSize:10}}/>
            <YAxis tick={{fill:C.textSm,fontSize:10}}/>
            <Tooltip contentStyle={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:10,fontSize:12}}/>
            <Bar dataKey="safe"  name="Safe"  fill={C.green}  radius={[4,4,0,0]}/>
            <Bar dataKey="risky" name="Risky" fill={C.yellow} radius={[4,4,0,0]}/>
            <Bar dataKey="fraud" name="Fraud" fill={C.red}    radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card style={{marginBottom:14,display:"flex",alignItems:"center",gap:14}}>
        <div>
          <div style={{fontWeight:700,fontSize:13,color:C.textMd,marginBottom:8}}>Transaction Split</div>
          <PieChart width={130} height={130}>
            <Pie data={PIE_DATA} cx={60} cy={60} innerRadius={34} outerRadius={58} paddingAngle={3} dataKey="value">
              {PIE_DATA.map((e,i)=><Cell key={i} fill={e.color}/>)}
            </Pie>
          </PieChart>
        </div>
        <div style={{flex:1}}>
          {PIE_DATA.map(e=>(
            <div key={e.name} style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <div style={{width:10,height:10,borderRadius:3,background:e.color,flexShrink:0}}/>
              <div style={{flex:1,color:C.textMd,fontSize:12}}>{e.name}</div>
              <div style={{color:e.color,fontWeight:700,fontSize:14}}>{e.value}%</div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div style={{fontWeight:700,fontSize:13,color:C.textMd,marginBottom:12}}>📈 Fraud Score Trend</div>
        <ResponsiveContainer width="100%" height={110}>
          <AreaChart data={[{v:20},{v:35},{v:28},{v:82},{v:45},{v:18},{v:62},{v:30}]}>
            <defs>
              <linearGradient id="grd" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={C.red} stopOpacity={0.18}/>
                <stop offset="95%" stopColor={C.red} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
            <XAxis hide/><YAxis hide/>
            <Tooltip contentStyle={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:10,fontSize:12}}/>
            <Area type="monotone" dataKey="v" stroke={C.red} strokeWidth={2} fill="url(#grd)"/>
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════
   SCREEN 7 — QR SCANNER
═══════════════════════════════════════════════════════ */

export default InsightsScreen
