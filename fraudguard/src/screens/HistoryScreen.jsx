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

const HistoryScreen = ({setScreen,setCurrentTxn}) => {
  const [filter,setFilter] = useState("All");
  const [search,setSearch] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const txns = await getTransactions();
        setTransactions(txns);
      } catch (error) {
        console.error('Error loading transactions:', error);
        const { TXN_LIST } = await import('../data/mockData');
        setTransactions(TXN_LIST);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const list = transactions.filter(t=>
    (filter==="All"||t.status===filter||(filter==="Fraud"&&t.status==="FRAUD"))&&
    (t.receiver.toLowerCase().includes(search.toLowerCase())||t.location.toLowerCase().includes(search.toLowerCase()))
  );

  const flaggedCount = transactions.filter(t=>t.status==="Suspicious"||t.status==="SUSPICIOUS").length;
  const blockedCount = transactions.filter(t=>t.status==="Fraud"||t.status==="FRAUD").length;

  return (
    <div className="up" style={{flex:1,overflowY:"auto",paddingBottom:8}}>
      <div style={{background:`linear-gradient(160deg,${C.blue},#1045B5)`,padding:"0 20px 22px",borderRadius:"0 0 28px 28px"}}>
        <StatusBar light/>
        <Hdr light title="Your Transactions"/>
      </div>
      <div style={{padding:"18px 18px 0"}}>
        <Inp value={search} onChange={setSearch} placeholder="Search by name or place…" icon="🔍"/>

        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:16}}>
          {[["Total",transactions.length,C.blue],["Flagged",flaggedCount,C.yellow],["Blocked",blockedCount,C.red]].map(([l,v,c])=>(
            <div key={l} style={{background:v===0?"#fff":riskBg(v===transactions.length?0:v===0?0:55),
              border:`1.5px solid ${c}22`,borderRadius:14,padding:"12px 10px",textAlign:"center",
              boxShadow:"0 2px 8px #1D6FEB07"}}>
              <div style={{color:c,fontSize:22,fontWeight:800}}>{v}</div>
              <div style={{color:C.textSm,fontSize:11,marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{display:"flex",gap:8,marginBottom:16,overflowX:"auto",paddingBottom:4}}>
          {["All","Safe","Suspicious","Fraud"].map(f=>(
            <Pill key={f} on={filter===f} onClick={()=>setFilter(f)}>{f}</Pill>
          ))}
        </div>

        {loading ? (
          <div style={{textAlign:"center",padding:20,color:C.textSm}}>Loading transactions...</div>
        ) : (
          list.map(t=>(
            <button key={t.id} onClick={()=>{setCurrentTxn(t);setScreen("txnDetail");}} style={{
              display:"flex",alignItems:"center",gap:12,padding:"13px 14px",
              background:"#fff",border:`1.5px solid ${t.status!=="Safe"?statusColor(t.status)+"33":C.border}`,
              borderRadius:16,marginBottom:8,width:"100%",cursor:"pointer",
              boxShadow:"0 2px 8px #1D6FEB07",transition:"all .2s"
            }}>
              <div style={{width:44,height:44,borderRadius:14,fontSize:22,background:statusBg(t.status),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{t.icon || '💰'}</div>
              <div style={{flex:1,textAlign:"left",minWidth:0}}>
                <div style={{color:C.text,fontWeight:700,fontSize:14}}>{t.receiver}</div>
                <div style={{color:C.textSm,fontSize:11}}>{t.location} · {t.time}</div>
                <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}>
                  <div style={{height:4,width:56,background:C.border,borderRadius:4,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${t.fraudScore}%`,background:riskColor(t.fraudScore),borderRadius:4}}/>
                  </div>
                  <span style={{color:riskColor(t.fraudScore),fontSize:10,fontWeight:700}}>Risk {t.fraudScore}%</span>
                </div>
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
   SCREEN 6 — FRAUD INSIGHTS
═══════════════════════════════════════════════════════ */

export default HistoryScreen
