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

const SplitBillScreen = ({setScreen}) => {
  const [total,setTotal] = useState("3600");
  const [people,setPeople] = useState([
    {name:"You",   paid:true, avatar:"👤"},
    {name:"Priya", paid:false,avatar:"👩"},
    {name:"Ravi",  paid:false,avatar:"👨"},
    {name:"Anita", paid:false,avatar:"🧑"},
  ]);
  const pp    = Math.round(parseFloat(total||0)/people.length);
  const paidN = people.filter(p=>p.paid).length;

  return (
    <div className="up" style={{flex:1,overflowY:"auto",paddingBottom:16}}>
      <div style={{background:`linear-gradient(160deg,${C.blue},#1045B5)`,padding:"0 20px 22px",borderRadius:"0 0 28px 28px"}}>
        <StatusBar light/>
        <Hdr light title="Split Bill" onBack={()=>setScreen("home")}/>
      </div>
      <div style={{padding:"18px 18px 0"}}>
        <Card style={{textAlign:"center",padding:24,marginBottom:16}}>
          <div style={{color:C.textSm,fontSize:12,marginBottom:6,fontWeight:600}}>TOTAL BILL AMOUNT</div>
          <input type="number" value={total} onChange={e=>setTotal(e.target.value)} style={{
            fontSize:36,fontWeight:800,color:C.text,background:"transparent",border:"none",
            textAlign:"center",width:"100%",fontFamily:"'Plus Jakarta Sans',sans-serif",outline:"none",letterSpacing:"-1px"
          }}/>
          <div style={{color:C.textSm,fontSize:13,marginTop:4}}>₹{pp.toLocaleString()} per person</div>
        </Card>

        {/* Progress */}
        <div style={{background:C.blueLt,border:`1px solid ${C.blue}22`,borderRadius:14,padding:14,marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <span style={{color:C.blue,fontWeight:700,fontSize:13}}>Collection progress</span>
            <span style={{color:C.blue,fontSize:13,fontWeight:600}}>{paidN}/{people.length} paid</span>
          </div>
          <div style={{height:8,background:"#fff",borderRadius:4,overflow:"hidden",border:`1px solid ${C.border}`}}>
            <div style={{height:"100%",width:`${(paidN/people.length)*100}%`,background:C.blue,borderRadius:4,transition:"width .5s ease"}}/>
          </div>
        </div>

        {people.map((p,i)=>(
          <Card key={i} style={{marginBottom:10,padding:14}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:40,height:40,borderRadius:"50%",background:C.blueLt,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{p.avatar}</div>
              <div style={{flex:1}}>
                <div style={{color:C.text,fontSize:14,fontWeight:700}}>{p.name}</div>
                <div style={{color:p.paid?C.green:C.textSm,fontSize:12,fontWeight:600}}>{p.paid?"✓ Paid":"Pending payment"}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{color:C.text,fontWeight:700,fontSize:15}}>₹{pp.toLocaleString()}</div>
                {!p.paid&&i!==0&&(
                  <button onClick={()=>setPeople(prev=>prev.map((x,j)=>j===i?{...x,paid:true}:x))} style={{
                    background:C.blueLt,border:`1px solid ${C.blue}44`,borderRadius:8,
                    color:C.blue,fontSize:11,fontWeight:700,padding:"3px 8px",cursor:"pointer",
                    fontFamily:"'Plus Jakarta Sans',sans-serif",marginTop:4
                  }}>Remind 👋</button>
                )}
              </div>
            </div>
          </Card>
        ))}

        <Btn onClick={()=>setScreen("send")}>Request ₹{pp*(people.filter(p=>!p.paid).length)} from {people.filter(p=>!p.paid).length} people →</Btn>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   SCREEN 13 — TRANSACTION DETAIL
═══════════════════════════════════════════════════════ */

export default SplitBillScreen
