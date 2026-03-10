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

const FraudAnalysisScreen = ({result,setScreen}) => {
  const [stage,setStage] = useState(0);
  const STAGES = ["High Amount Spike","Late Night Activity","Velocity Spike","Location Anomaly","Round Amount","Merchant Risk","Device Mismatch","IP Risk Detected","Low Trust Score","Failed Login History","Behavioral Anomaly"];

  useEffect(()=>{
    let i=0; const t=setInterval(()=>{ i++; setStage(i); if(i>=STAGES.length) clearInterval(t); },200);
    return ()=>clearInterval(t);
  },[]);

  if(!result) return null;
  const {fraudProbability:fp,recommendation:rec,riskLevel:rl,reasons} = result;
  const color = riskColor(fp);
  const recMsg = rec==="ALLOW"?"✅ Looks good — approved!":rec==="REVIEW"?"⚠️ Needs a closer look":rec==="BLOCK"?"🚫 We stopped this for you":"";
  const recSub = rec==="ALLOW"?"Your transaction passed all security checks.":rec==="REVIEW"?"We flagged a few things. Please verify before proceeding.":"We blocked this to keep your money safe.";

  return (
    <div className="up" style={{flex:1,overflowY:"auto",paddingBottom:16}}>
      <div style={{background:rec==="BLOCK"?`linear-gradient(160deg,${C.red},#B91C1C)`:rec==="REVIEW"?`linear-gradient(160deg,#D97706,#B45309)`:`linear-gradient(160deg,${C.green},#047857)`,padding:"0 20px 28px",borderRadius:"0 0 28px 28px"}}>
        <StatusBar light/>
        <Hdr light title="Fraud Analysis" onBack={()=>setScreen("home")}/>
        <div style={{textAlign:"center",paddingBottom:8}}>
          <Gauge score={fp} size={160}/>
          <div style={{color:"#fff",fontWeight:800,fontSize:20,marginTop:12,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{recMsg}</div>
          <div style={{color:"rgba(255,255,255,.8)",fontSize:13,marginTop:4}}>{recSub}</div>
        </div>
      </div>

      <div style={{padding:"18px 18px 0"}}>
        {/* Risk summary */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
          {[["Risk Level",rl,color],["Score",`${fp}%`,color],["Decision",rec,rec==="BLOCK"?C.red:rec==="REVIEW"?C.yellow:C.green]].map(([l,v,c])=>(
            <Card key={l} style={{textAlign:"center",padding:14}}>
              <div style={{color:C.textSm,fontSize:10,marginBottom:4,fontWeight:600}}>{l}</div>
              <div style={{color:c,fontWeight:800,fontSize:15,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{v}</div>
            </Card>
          ))}
        </div>

        {/* Pipeline */}
        <Card style={{marginBottom:14}}>
          <div style={{fontWeight:700,fontSize:13,color:C.textMd,marginBottom:12}}>🔍 What we checked</div>
          {STAGES.map((s,i)=>{
            const flagged=reasons.includes(s), done=i<stage;
            return (
              <div key={s} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",
                borderBottom:i<STAGES.length-1?`1px solid ${C.border}`:"none",
                opacity:done?1:.3,transition:"opacity .3s"}}>
                <div style={{
                  width:26,height:26,borderRadius:8,fontSize:11,flexShrink:0,
                  background:!done?C.border:flagged?C.redLt:C.greenLt,
                  border:`1px solid ${!done?C.border:flagged?C.red+"44":C.green+"44"}`,
                  display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,
                  color:!done?C.textSm:flagged?C.red:C.green
                }}>{done?(flagged?"✗":"✓"):<span style={{color:C.textSm}}>{i+1}</span>}</div>
                <span style={{color:done?C.text:C.textSm,fontSize:13,flex:1}}>{s}</span>
                {done&&<Chip color={flagged?C.red:C.green} bg={flagged?C.redLt:C.greenLt}>{flagged?"Flagged":"Passed"}</Chip>}
              </div>
            );
          })}
        </Card>

        {reasons.length>0&&(
          <Card style={{marginBottom:14}}>
            <div style={{fontWeight:700,fontSize:13,color:C.textMd,marginBottom:12}}>🚩 Why we flagged this</div>
            {reasons.map((r,i)=>(
              <div key={r} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{color:C.text,fontSize:13}}>• {r}</span>
                  <span style={{color:C.red,fontSize:12,fontWeight:700}}>{15+i*8}%</span>
                </div>
                <div style={{height:6,background:C.border,borderRadius:4,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${Math.min(15+i*8,95)}%`,background:`linear-gradient(90deg,${C.yellow},${C.red})`,borderRadius:4,transition:"width 1s ease"}}/>
                </div>
              </div>
            ))}
          </Card>
        )}

        <div style={{display:"flex",gap:10}}>
          <Btn variant={rec==="ALLOW"?"success":"danger"} style={{flex:1}} onClick={()=>setScreen("insights")}>View Insights</Btn>
          <Btn variant="ghost" style={{flex:1}} onClick={()=>setScreen("home")}>Back Home</Btn>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   SCREEN 5 — TRANSACTION HISTORY
═══════════════════════════════════════════════════════ */

export default FraudAnalysisScreen
