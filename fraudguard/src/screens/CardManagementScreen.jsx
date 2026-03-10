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

const CardManagementScreen = ({setScreen}) => {
  const [frozen,setFrozen]   = useState(false);
  const [showNum,setShowNum] = useState(false);
  const [limits,setLimits]   = useState({daily:50000,intl:20000,online:30000});

  return (
    <div className="up" style={{flex:1,overflowY:"auto",paddingBottom:16}}>
      <div style={{background:`linear-gradient(160deg,${C.blue},#1045B5)`,padding:"0 20px 22px",borderRadius:"0 0 28px 28px"}}>
        <StatusBar light/>
        <Hdr light title="My Card" onBack={()=>setScreen("profile")}/>
      </div>
      <div style={{padding:"18px 18px 0"}}>
        {/* Visual Card */}
        <div style={{
          background:frozen?"linear-gradient(135deg,#94A3B8,#64748B)":"linear-gradient(135deg,#1D6FEB,#1045B5)",
          borderRadius:22,padding:24,marginBottom:18,
          boxShadow:frozen?"none":`0 16px 48px ${C.blue}44`,
          transition:"all .4s ease",position:"relative",overflow:"hidden"
        }}>
          <div style={{position:"absolute",right:-30,bottom:-30,width:110,height:110,borderRadius:"50%",background:"rgba(255,255,255,.07)"}}/>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:26}}>
            <div style={{color:"#fff",fontWeight:800,fontSize:17,fontFamily:"'Plus Jakarta Sans',sans-serif",letterSpacing:"-.5px"}}>FraudGuard</div>
            <div style={{display:"flex",gap:-6}}>
              <div style={{width:26,height:26,borderRadius:"50%",background:frozen?"#CBD5E1":"#EF4444",opacity:.85}}/>
              <div style={{width:26,height:26,borderRadius:"50%",background:frozen?"#E2E8F0":"#F59E0B",opacity:.85,marginLeft:-10}}/>
            </div>
          </div>
          <div style={{color:"rgba(255,255,255,.85)",fontSize:16,letterSpacing:4,marginBottom:20,fontFamily:"monospace"}}>
            {showNum?"4532 •••• •••• 7891":"•••• •••• •••• 7891"}
          </div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <div>
              <div style={{color:"rgba(255,255,255,.6)",fontSize:10,letterSpacing:.5}}>CARDHOLDER</div>
              <div style={{color:"#fff",fontWeight:700,marginTop:2}}>ARJUN MEHTA</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{color:"rgba(255,255,255,.6)",fontSize:10,letterSpacing:.5}}>EXPIRES</div>
              <div style={{color:"#fff",fontWeight:700,marginTop:2}}>12 / 28</div>
            </div>
          </div>
          {frozen&&(
            <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.35)",borderRadius:22,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(2px)"}}>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:32}}>🔒</div>
                <div style={{color:"#fff",fontWeight:700,fontSize:15,marginTop:6}}>Card Frozen</div>
                <div style={{color:"rgba(255,255,255,.7)",fontSize:12}}>Tap below to unfreeze</div>
              </div>
            </div>
          )}
        </div>

        <div style={{display:"flex",gap:10,marginBottom:20}}>
          <Btn variant={frozen?"success":"danger"} style={{flex:1}} onClick={()=>setFrozen(!frozen)}>
            {frozen?"🔓 Unfreeze Card":"🔒 Freeze Card"}
          </Btn>
          <Btn variant="outline" style={{flex:1}} onClick={()=>setShowNum(!showNum)}>
            {showNum?"🙈 Hide":"👁 Reveal"} Details
          </Btn>
        </div>

        <Card style={{marginBottom:14}}>
          <div style={{fontWeight:700,fontSize:13,color:C.textMd,marginBottom:14}}>💰 Spending Limits</div>
          {[["Daily Limit","daily"],["International","intl"],["Online Payments","online"]].map(([l,k])=>(
            <div key={k} style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{color:C.text,fontSize:13}}>{l}</span>
                <span style={{color:C.blue,fontWeight:700,fontSize:13}}>₹{limits[k].toLocaleString()}</span>
              </div>
              <input type="range" min={5000} max={100000} step={5000} value={limits[k]}
                onChange={e=>setLimits(p=>({...p,[k]:+e.target.value}))}
                style={{width:"100%",accentColor:C.blue}}/>
            </div>
          ))}
        </Card>

        <Card>
          <div style={{fontWeight:700,fontSize:13,color:C.textMd,marginBottom:4}}>🎛️ Card Controls</div>
          <ToggleRow label="Contactless Payments"        defaultOn={true}/>
          <ToggleRow label="International Transactions"  defaultOn={false}/>
          <ToggleRow label="ATM Withdrawals"             defaultOn={true}/>
          <ToggleRow label="Online Shopping"             defaultOn={true}/>
        </Card>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   SCREEN 9 — INTERNATIONAL TRANSFER (EXTRA FEATURE 3)
═══════════════════════════════════════════════════════ */

export default CardManagementScreen
