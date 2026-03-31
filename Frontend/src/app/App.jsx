import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Toaster, toast } from "react-hot-toast";

export default function App() {
  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws/alerts");
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.decision === "BLOCK") {
          toast.error(`🚨 HIGH RISK BLOCKED: Transaction ${data.transaction_id}`, {
            duration: 6000,
            style: { border: '1px solid #ef4444', padding: '16px', color: '#7f1d1d' },
          });
        }
      } catch (err) {
        console.error("WS error:", err);
      }
    };
    
    return () => ws.close();
  }, []);

  return (
    <>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </>
  );
}