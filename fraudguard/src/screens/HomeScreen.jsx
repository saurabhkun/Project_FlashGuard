import { useState, useEffect } from 'react'
import { C, riskColor, riskBg, riskLabel, statusColor, statusBg } from '../styles/tokens'
import { WEEKLY_CHART, PIE_DATA, SPEND_CAT, CURRENCIES, DEVICES } from '../data/mockData'
import { fraudEngine } from '../services/fraudEngine'
import { getTransactions } from '../services/transactionAPI'
import { Hdr, Chip, Pill, Btn, Inp, Card, Divider, Toggle, ToggleRow, Gauge, MiniGauge } from '../components/ui'
import StatusBar from '../components/StatusBar'
import {
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

const HomeScreen = ({setScreen,setCurrentTxn}) => {
  const [show,setShow] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch transactions from backend API
    const fetchTransactions = async () => {
      try {
        const txns = await getTransactions();
        setTransactions(txns);
      } catch (error) {
        console.error('Error loading transactions:', error);
        // Fallback to mock data on error
        const { TXN_LIST } = await import('../data/mockData');
        setTransactions(TXN_LIST);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div className="up" style={{flex:1,overflowY:"auto",paddingBottom:8}}>
      {/* Top hero */}
      <div style={{background:`linear-gradient(160deg,${C.blue},#1045B5)`,padding:"0 20px 28px",borderRadius:"0 0 32px 32px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:-40,top:-40,width:180,height:180,borderRadius:"50%",background:"rgba(255,255,255,.06)"}}/>
        <div style={{position:"absolute",right:20,bottom:-60,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,.04)"}}/>
        <StatusBar light/>
        <Hdr light title="" right={
          <button style={{width:36,height:36,background:"rgba(255,255,255,.2)",border:"none",borderRadius:12,cursor:"pointer",fontSize:16}}>🔔</button>
        }/>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <div style={{width:46,height:46,borderRadius:16,background:"rgba(255,255,255,.2)",border:"1.5px solid rgba(255,255,255,.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>👤</div>
          <div>
            <div style={{color:"rgba(255,255,255,.75)",fontSize:12,fontWeight:500}}>Good morning ☀️</div>
            <div style={{color:"#fff",fontWeight:800,fontSize:17,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Arjun Mehta</div>
          </div>
        </div>

        {/* Balance */}
        <div style={{background:"rgba(255,255,255,.12)",border:"1px solid rgba(255,255,255,.22)",borderRadius:20,padding:20,backdropFilter:"blur(12px)"}}>
          <div style={{color:"rgba(255,255,255,.7)",fontSize:12,fontWeight:600,marginBottom:6}}>YOUR BALANCE</div>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
            <div style={{fontSize:30,fontWeight:800,color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",letterSpacing:"-1px"}}>
              {show?"₹84,320.00":"₹ ●●,●●●.●●"}
            </div>
            <button onClick={()=>setShow(!show)} style={{background:"rgba(255,255,255,.2)",border:"none",borderRadius:8,padding:"4px 8px",cursor:"pointer",color:"#fff",fontSize:13}}>
              {show?"🙈":"👁"}
            </button>
          </div>
          <div style={{display:"flex",gap:20}}>
            {[["↑ Money In","₹1,24,500","#86EFAC"],["↓ Money Out","₹40,180","#FCA5A5"]].map(([l,v,c])=>(
              <div key={l}>
                <div style={{color:"rgba(255,255,255,.65)",fontSize:11}}>{l}</div>
                <div style={{color:c,fontWeight:700,fontSize:15}}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{padding:"18px 18px 0"}}>
        {/* Fraud Shield */}
        <div style={{background:C.greenLt,border:`1px solid ${C.green}22`,borderRadius:16,padding:"12px 14px",display:"flex",alignItems:"center",gap:12,marginBottom:18}}>
          <div style={{width:40,height:40,background:`${C.green}18`,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🛡️</div>
          <div style={{flex:1}}>
            <div style={{color:C.green,fontWeight:700,fontSize:13}}>Your money is protected</div>
            <div style={{color:C.textSm,fontSize:11}}>FraudGuard AI is watching 24 / 7</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{color:C.green,fontWeight:800,fontSize:17}}>98.2%</div>
            <div style={{color:C.textSm,fontSize:10}}>accuracy</div>
          </div>
        </div>

        {/* Quick actions */}
        <div style={{fontWeight:700,fontSize:13,color:C.textMd,marginBottom:10,letterSpacing:"-.2px"}}>What would you like to do?</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:22}}>
          {[{l:"Send",i:"⬆️",s:"send"},{l:"Scan QR",i:"📷",s:"scan"},{l:"Split",i:"✂️",s:"split"},{l:"Abroad",i:"🌍",s:"international"}].map(a=>(
            <button key={a.l} onClick={()=>setScreen(a.s)} style={{
              background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:16,
              padding:"14px 6px",cursor:"pointer",textAlign:"center",
              boxShadow:"0 2px 8px #1D6FEB08",transition:"all .2s"
            }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.blue;e.currentTarget.style.transform="translateY(-2px)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="translateY(0)";}}>
              <div style={{fontSize:22}}>{a.i}</div>
              <div style={{color:C.textMd,fontSize:11,marginTop:6,fontWeight:600}}>{a.l}</div>
            </button>
          ))}
        </div>

        {/* Transactions */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontWeight:700,fontSize:14,color:C.text}}>Recent transactions</div>
          <button onClick={()=>setScreen("history")} style={{color:C.blue,fontSize:12,fontWeight:700,background:"none",border:"none",cursor:"pointer"}}>See all</button>
        </div>
        {loading ? (
          <div style={{textAlign:"center",padding:20,color:C.textSm}}>Loading transactions...</div>
        ) : (
          transactions.slice(0,4).map(t=>(
            <button key={t.id} onClick={()=>{setCurrentTxn(t);setScreen("txnDetail");}} style={{
              display:"flex",alignItems:"center",gap:12,padding:"12px 14px",
              background:"#fff",border:`1px solid ${C.border}`,borderRadius:16,
              marginBottom:8,width:"100%",cursor:"pointer",boxShadow:"0 2px 8px #1D6FEB07",
              transition:"box-shadow .2s, border-color .2s"
            }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.blue+"55";e.currentTarget.style.boxShadow=`0 4px 16px ${C.blue}14`;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow="0 2px 8px #1D6FEB07";}}>
              <div style={{
                width:42,height:42,borderRadius:14,fontSize:20,
                background:statusBg(t.status),
                display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0
              }}>{t.icon || '💰'}</div>
              <div style={{flex:1,textAlign:"left",minWidth:0}}>
                <div style={{color:C.text,fontWeight:700,fontSize:14}}>{t.receiver}</div>
                <div style={{color:C.textSm,fontSize:11}}>{t.time} · {t.location}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{color:t.status==="Fraud"||t.status==="FRAUD"?C.red:C.text,fontWeight:700,fontSize:14}}>−₹{t.amount.toLocaleString()}</div>
                <Chip color={statusColor(t.status)} bg={statusBg(t.status)}>{t.status}</Chip>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   SCREEN 3 — SEND MONEY
═══════════════════════════════════════════════════════ */

export default HomeScreen
