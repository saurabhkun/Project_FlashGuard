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

const ProfileScreen = ({setScreen,onLogout}) => (
  <div className="up" style={{flex:1,overflowY:"auto",paddingBottom:16}}>
    <div style={{background:`linear-gradient(160deg,${C.blue},#1045B5)`,padding:"0 20px 32px",borderRadius:"0 0 32px 32px"}}>
      <StatusBar light/>
      <Hdr light title="My Profile"/>
      <div style={{textAlign:"center"}}>
        <div style={{
          width:74,height:74,borderRadius:24,background:"rgba(255,255,255,.2)",
          border:"2px solid rgba(255,255,255,.35)",display:"flex",alignItems:"center",
          justifyContent:"center",fontSize:32,margin:"0 auto 12px",backdropFilter:"blur(8px)"
        }}>👤</div>
        <div style={{color:"#fff",fontWeight:800,fontSize:18,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Arjun Mehta</div>
        <div style={{color:"rgba(255,255,255,.7)",fontSize:13,marginTop:2}}>arjun@fraudguard.in · ID #7821</div>
        <div style={{marginTop:10,display:"flex",gap:8,justifyContent:"center"}}>
          <Chip color={C.green}  bg="rgba(255,255,255,.15)">✓ KYC Verified</Chip>
          <Chip color="#93C5FD" bg="rgba(255,255,255,.15)">⭐ Premium</Chip>
        </div>
      </div>
    </div>

    <div style={{padding:"18px 18px 0"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20}}>
        {[["Payments","247",C.blue],["Trust Score","94%",C.green],["Saved","₹8,200",C.yellow]].map(([l,v,c])=>(
          <Card key={l} style={{textAlign:"center",padding:14}}>
            <div style={{color:c,fontSize:20,fontWeight:800}}>{v}</div>
            <div style={{color:C.textSm,fontSize:10,marginTop:2}}>{l}</div>
          </Card>
        ))}
      </div>

      {/* Happy message */}
      <div style={{background:C.blueLt,border:`1px solid ${C.blue}22`,borderRadius:14,padding:13,marginBottom:18,display:"flex",gap:10,alignItems:"center"}}>
        <span style={{fontSize:20}}>🎉</span>
        <div>
          <div style={{color:C.blue,fontWeight:700,fontSize:13}}>You've been fraud-free for 47 days!</div>
          <div style={{color:C.textSm,fontSize:12}}>FraudGuard has saved you ₹62,000 from potential scams.</div>
        </div>
      </div>

      {[
        {icon:"💳",l:"My Card",        sub:"Manage your virtual & physical cards", s:"card"},
        {icon:"📊",l:"Spending Insights",sub:"See where your money really goes",  s:"spending"},
        {icon:"✂️",l:"Split a Bill",   sub:"Split expenses easily with friends",   s:"split"},
        {icon:"🌍",l:"Send Abroad",    sub:"Transfer internationally",              s:"international"},
        {icon:"🛡️",l:"Security Center",sub:"Protect your account",                s:"security"},
        {icon:"🔔",l:"Notifications",  sub:"Alerts & preferences",                 s:null},
      ].map(item=>(
        <button key={item.l} onClick={()=>item.s&&setScreen(item.s)} style={{
          display:"flex",alignItems:"center",gap:14,padding:"13px 14px",
          background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:16,
          marginBottom:8,width:"100%",cursor:"pointer",boxShadow:"0 2px 8px #1D6FEB07",
          transition:"all .2s"
        }}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=C.blue+"44";e.currentTarget.style.boxShadow=`0 4px 16px ${C.blue}14`;}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow="0 2px 8px #1D6FEB07";}}>
          <div style={{width:42,height:42,background:C.blueLt,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{item.icon}</div>
          <div style={{flex:1,textAlign:"left"}}>
            <div style={{color:C.text,fontSize:14,fontWeight:700}}>{item.l}</div>
            <div style={{color:C.textSm,fontSize:11}}>{item.sub}</div>
          </div>
          <span style={{color:C.textSm,fontSize:16}}>›</span>
        </button>
      ))}

      <div style={{marginTop:10}}>
        <Btn variant="outline" onClick={onLogout}>Sign Out</Btn>
      </div>
      <Btn variant="outline" onClick={onLogout}>Sign Out</Btn>
</div>

<div style={{textAlign:"center", color:C.textSm, fontSize:11, marginTop:14}}>
  FraudGuard v4.2 · Made with ❤️ to keep you safe
</div>

</div>
)


export default ProfileScreen
