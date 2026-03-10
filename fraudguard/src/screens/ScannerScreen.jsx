import { useState, useEffect } from 'react'
import { C } from '../styles/tokens'
import { Hdr, Chip, Btn, Card, Toggle } from '../components/ui'
import StatusBar from '../components/StatusBar'

const ScannerScreen = ({setScreen}) => {

  const [scanning,setScanning]  = useState(true)
  const [scanned,setScanned]    = useState(false)
  const [torch,setTorch]        = useState(false)

  useEffect(()=>{
    if(scanning){
      const t=setTimeout(()=>{
        setScanned(true)
        setScanning(false)
      },3000)

      return()=>clearTimeout(t)
    }
  },[scanning])

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",background:"#0F172A"}}>

      <StatusBar light/>

      <Hdr light title="Scan to Pay" onBack={()=>setScreen("home")}/>

      <div style={{
        flex:1,
        position:"relative",
        overflow:"hidden",
        minHeight:320,
        display:"flex",
        alignItems:"center",
        justifyContent:"center"
      }}>

        <div style={{
          width:220,
          height:220,
          borderRadius:24,
          position:"relative",
          background:"rgba(255,255,255,.04)",
          border:"2px solid rgba(255,255,255,.1)"
        }}>

          {/* Corner ticks */}
          {[[0,0],[0,1],[1,0],[1,1]].map(([r,c],i)=>(
            <div key={i} style={{
              position:"absolute",
              top:r===0?-2:"auto",
              bottom:r===1?-2:"auto",
              left:c===0?-2:"auto",
              right:c===1?-2:"auto",
              width:26,
              height:26,
              borderTop:r===0?`3px solid ${C.blue}`:"none",
              borderBottom:r===1?`3px solid ${C.blue}`:"none",
              borderLeft:c===0?`3px solid ${C.blue}`:"none",
              borderRight:c===1?`3px solid ${C.blue}`:"none",
            }}/>
          ))}

          {/* Scan laser */}
          {scanning && (
            <div className="scan" style={{
              position:"absolute",
              left:12,
              right:12,
              height:2,
              background:`linear-gradient(90deg,transparent,${C.blue},transparent)`,
              boxShadow:`0 0 8px ${C.blue}`,
              borderRadius:2
            }}/>
          )}

          {/* Mock QR */}
          <div style={{
            position:"absolute",
            inset:30,
            display:"grid",
            gridTemplateColumns:"repeat(6,1fr)",
            gap:3,
            opacity:.3
          }}>
            {Array(36).fill(0).map((_,i)=>(
              <div key={i} style={{
                background:[0,1,5,6,7,11,18,24,25,29,30,31,35].includes(i)?"#fff":"transparent",
                borderRadius:2
              }}/>
            ))}
          </div>

          {/* Success overlay */}
          {scanned && (
            <div style={{
              position:"absolute",
              inset:0,
              background:"rgba(12,155,110,.18)",
              borderRadius:22,
              display:"flex",
              flexDirection:"column",
              alignItems:"center",
              justifyContent:"center"
            }}>
              <div style={{fontSize:40}}>✅</div>
              <div style={{
                color:C.green,
                fontWeight:800,
                fontSize:16,
                marginTop:6
              }}>
                Code Detected!
              </div>
            </div>
          )}

        </div>

        <div style={{
          position:"absolute",
          bottom:20,
          left:0,
          right:0,
          textAlign:"center",
          color:"rgba(255,255,255,.5)",
          fontSize:13
        }}>
          {scanning?"Searching for a QR code…":"Tap below to pay"}
        </div>

      </div>

      <div style={{padding:"16px 20px 24px",background:C.bg}}>

        {!scanned ? (

          <div style={{display:"flex",gap:10}}>
            <Btn variant="ghost" style={{flex:1}} onClick={()=>setTorch(!torch)}>
              {torch?"🔦 Torch On":"🔦 Torch Off"}
            </Btn>

            <Btn
              variant="ghost"
              style={{flex:1}}
              onClick={()=>{
                setScanning(true)
                setScanned(false)
              }}
            >
              🔄 Try Again
            </Btn>
          </div>

        ) : (

          <div>

            <Card style={{marginBottom:12,padding:14}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>

                <div style={{
                  width:42,
                  height:42,
                  background:C.blueLt,
                  borderRadius:14,
                  display:"flex",
                  alignItems:"center",
                  justifyContent:"center",
                  fontSize:18
                }}>
                  💳
                </div>

                <div style={{flex:1}}>
                  <div style={{color:C.text,fontWeight:700}}>
                    Priya Sharma
                  </div>

                  <div style={{color:C.textSm,fontSize:12}}>
                    UPI: priya@fraudguard · Trust Score 94%
                  </div>
                </div>

                <Chip color={C.green} bg={C.greenLt}>
                  Verified
                </Chip>

              </div>
            </Card>

            <Btn onClick={()=>setScreen("send")}>
              Pay Now →
            </Btn>

          </div>

        )}

      </div>

    </div>
  )
}

export default ScannerScreen