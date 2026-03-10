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

const TxnDetailScreen = ({txn,setScreen}) => {
  if(!txn) return null;
  const sc = txn.fraudScore||txn.fraudProbability||0;
  const humanMsg = sc<35?"Everything checks out! This looks like a safe transaction.":sc<65?"We noticed a couple of things. Worth reviewing before sending more.":"We stopped this transaction to protect your money.";
  return (
    <div className="up" style={{flex:1,overflowY:"auto",paddingBottom:16}}>
      <div style={{background:`linear-gradient(160deg,${C.blue},#1045B5)`,padding:"0 20px 22px",borderRadius:"0 0 28px 28px"}}>
        <StatusBar light/>
        <Hdr light title="Transaction Details" onBack={()=>setScreen("history")}/>
      </div>
      <div style={{padding:"18px 18px 0"}}>
        <Card style={{textAlign:"center",padding:28,marginBottom:14}}>
          <div style={{fontSize:44,marginBottom:12}}>{txn.icon||"💸"}</div>
          <div style={{fontSize:30,fontWeight:800,color:C.text,fontFamily:"'Plus Jakarta Sans',sans-serif",marginBottom:4,letterSpacing:"-1px"}}>
            −₹{(txn.amount||0).toLocaleString()}
          </div>
          <div style={{color:C.textMd,fontSize:14,marginBottom:12}}>{txn.receiver}</div>
          <Chip color={statusColor(txn.status||"Safe")} bg={statusBg(txn.status||"Safe")}>{txn.status||"Unknown"}</Chip>
        </Card>

        <Card style={{marginBottom:14}}>
          {[["Transaction ID",txn.id],["Location",txn.location],["Category",txn.category||"Transfer"],["When",txn.time]].map(([l,v])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
              <span style={{color:C.textSm,fontSize:13}}>{l}</span>
              <span style={{color:C.text,fontSize:13,fontWeight:600}}>{v}</span>
            </div>
          ))}
        </Card>

        <Card>
          <div style={{fontWeight:700,fontSize:13,color:C.textMd,marginBottom:12}}>🔍 Fraud Analysis Result</div>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:12}}>
            <MiniGauge score={sc}/>
            <div>
              <div style={{color:riskColor(sc),fontWeight:800,fontSize:16}}>{riskLabel(sc)} Risk</div>
              <div style={{color:C.textSm,fontSize:12}}>Fraud score: {sc}%</div>
            </div>
          </div>
          <div style={{background:riskBg(sc),border:`1px solid ${riskColor(sc)}22`,borderRadius:12,padding:12,marginBottom:10}}>
            <div style={{color:riskColor(sc),fontSize:13,fontWeight:600}}>{humanMsg}</div>
          </div>
          {txn.reasons&&txn.reasons.map(r=>(
            <div key={r} style={{background:C.redLt,borderRadius:8,padding:"6px 10px",marginBottom:6}}>
              <span style={{color:C.red,fontSize:12}}>• {r}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   SCREEN 14 — PROFILE
═══════════════════════════════════════════════════════ */

export default TxnDetailScreen
