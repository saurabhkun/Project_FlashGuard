import { useState, useEffect } from 'react'
import { C, riskColor, riskBg, riskLabel, statusColor, statusBg } from '../styles/tokens'
import { WEEKLY_CHART, PIE_DATA, SPEND_CAT, CURRENCIES, DEVICES } from '../data/mockData'
import { fraudEngine } from '../services/fraudEngine'
import { checkTransaction } from '../services/transactionAPI'
import { Hdr, Chip, Pill, Btn, Inp, Card, Divider, Toggle, ToggleRow, Gauge, MiniGauge } from '../components/ui'
import StatusBar from '../components/StatusBar'
import {
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

const SendMoneyScreen = ({setScreen,setAnalysisResult,setCurrentTxn}) => {
  const [receiver,setReceiver] = useState("");
  const [amount,setAmount]     = useState("");
  const [cat,setCat]           = useState("food");
  const [loc,setLoc]           = useState("Mumbai, IN");
  const [analyzing,setAnalyzing] = useState(false);
  const [warn,setWarn]           = useState(null);

  const cats = ["food","shopping","transport","entertainment","crypto","gambling","medical","utilities"];

  const send = () => {
    if(!receiver||!amount) return;
    setAnalyzing(true); setWarn(null);
    const d = {sender:"Arjun Mehta",receiver,amount:parseFloat(amount),location:loc,merchantCategory:cat,
               deviceScore:72,ipRiskScore:20,accountTrust:75,behaviorScore:68,failedLoginAttempts:0,txnCount:2,
               nameOrig:"USER001",nameDest:receiver,oldbalanceOrg:50000,newbalanceOrig:50000-parseFloat(amount),
               oldbalanceDest:10000,newbalanceDest:10000+parseFloat(amount),type:"TRANSFER"};
    
    // Call backend API for fraud detection
    checkTransaction(d).then(r => {
      if(r.fraudProbability>40){ setWarn(r); }
      else {
        const t={...d,...r,id:"T"+Date.now(),time:"Just now",status:r.recommendation==="BLOCK"?"Fraud":r.recommendation==="REVIEW"?"Suspicious":"Safe",icon:"💸"};
        setCurrentTxn(t); setAnalysisResult(r); setScreen("fraudAnalysis");
      }
      setAnalyzing(false);
    }).catch(err => {
      console.error('API Error, falling back to client:', err);
      // Fallback to client-side engine
      const r = fraudEngine(d);
      if(r.fraudProbability>40){ setWarn(r); }
      else {
        const t={...d,...r,id:"T"+Date.now(),time:"Just now",status:r.recommendation==="BLOCK"?"Fraud":r.recommendation==="REVIEW"?"Suspicious":"Safe",icon:"💸"};
        setCurrentTxn(t); setAnalysisResult(r); setScreen("fraudAnalysis");
      }
      setAnalyzing(false);
    });
  };

  const proceed = () => {
    const d={sender:"Arjun Mehta",receiver,amount:parseFloat(amount),location:loc,merchantCategory:cat,
             deviceScore:72,ipRiskScore:20,accountTrust:75,behaviorScore:68,failedLoginAttempts:0,txnCount:2};
    const r=fraudEngine(d);
    setAnalysisResult(r);
    setCurrentTxn({...d,...r,id:"T"+Date.now(),time:"Just now",status:r.recommendation==="BLOCK"?"Fraud":"Suspicious",icon:"💸"});
    setScreen("fraudAnalysis");
  };

  return (
    <div className="up" style={{flex:1,overflowY:"auto",paddingBottom:16}}>
      <div style={{background:`linear-gradient(160deg,${C.blue},#1045B5)`,padding:"0 20px 24px",borderRadius:"0 0 28px 28px"}}>
        <StatusBar light/>
        <Hdr light title="Send Money" onBack={()=>setScreen("home")}/>
      </div>
      <div style={{padding:"18px 18px 0"}}>
        {warn&&(
          <div className="pop" style={{background:C.redLt,border:`1.5px solid ${C.red}44`,borderRadius:16,padding:14,marginBottom:16}}>
            <div style={{color:C.red,fontWeight:800,fontSize:14,marginBottom:4}}>⚠️ Hold on — something looks off</div>
            <div style={{color:"#7F1D1D",fontSize:12,marginBottom:8}}>
              Our AI flagged this transaction with a <b>{warn.fraudProbability}% fraud risk</b>. Here's why:
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
              {warn.reasons.map(r=><Chip key={r} color={C.red} bg={C.redLt}>{r}</Chip>)}
            </div>
            <div style={{display:"flex",gap:8}}>
              <Btn variant="danger" style={{flex:1}} onClick={proceed}>See Full Analysis</Btn>
              <Btn variant="ghost"  style={{flex:1}} onClick={()=>setWarn(null)}>Cancel</Btn>
            </div>
          </div>
        )}

        <Inp label="Who are you sending to?" value={receiver} onChange={setReceiver} placeholder="Name, phone, or UPI ID" icon="👤" hint="Start typing to search your contacts"/>
        <Inp label="Amount (₹)" type="number" value={amount} onChange={setAmount} placeholder="0.00" icon="₹"/>

        <div style={{display:"flex",gap:8,marginBottom:16}}>
          {[500,1000,5000,10000].map(a=>(
            <button key={a} onClick={()=>setAmount(String(a))} style={{
              flex:1,padding:"8px 4px",background:amount==a?C.blueLt:"#fff",
              border:`1.5px solid ${amount==a?C.blue:C.border}`,borderRadius:10,
              color:amount==a?C.blue:C.textMd,fontSize:12,fontWeight:700,cursor:"pointer",
              fontFamily:"'Plus Jakarta Sans',sans-serif"
            }}>₹{a>=1000?`${a/1000}K`:a}</button>
          ))}
        </div>

        <div style={{marginBottom:14}}>
          <div style={{color:C.textMd,fontSize:12,marginBottom:6,fontWeight:600}}>What's this payment for?</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {cats.map(c=>(
              <button key={c} onClick={()=>setCat(c)} style={{
                padding:"6px 14px",borderRadius:20,cursor:"pointer",
                background:cat===c?C.blue:"#fff",
                border:`1.5px solid ${cat===c?C.blue:C.border}`,
                color:cat===c?"#fff":C.textMd,
                fontSize:12,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif",
                textTransform:"capitalize"
              }}>{c}</button>
            ))}
          </div>
        </div>

        <Inp label="Sending from" value={loc} onChange={setLoc} placeholder="Your location" icon="📍"/>

        <div style={{background:C.blueLt,border:`1px solid ${C.blue}22`,borderRadius:14,padding:12,marginBottom:16,display:"flex",gap:10,alignItems:"center"}}>
          <span style={{fontSize:20}}>🤖</span>
          <div>
            <div style={{color:C.blue,fontSize:12,fontWeight:700}}>FraudGuard AI is checking this</div>
            <div style={{color:C.textSm,fontSize:11}}>We'll scan through 11 security layers before it goes out</div>
          </div>
        </div>

        <Btn onClick={send} disabled={analyzing||!receiver||!amount}>
          {analyzing
            ? <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
                <span className="spin" style={{display:"inline-block",width:16,height:16,border:"2.5px solid #fff",borderTopColor:"transparent",borderRadius:"50%"}}/>
                Running fraud check…
              </span>
            : `Send ₹${amount?parseFloat(amount).toLocaleString():"0"} securely →`}
        </Btn>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   SCREEN 4 — FRAUD ANALYSIS
═══════════════════════════════════════════════════════ */

export default SendMoneyScreen
