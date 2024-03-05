import { useState } from "react"
import { createRoot } from "react-dom/client"
import { useSharedState } from "./sharedState"
import "./styles.css"
import App from "./App"
import { SharedStateProvider } from "./sharedState"
import { Route } from "react-router-dom"

function Overlay() {
  const { text, desc, price, user } = useSharedState();

  return (
    <>
      <div className="dot" />
      <p className="hovertext">{text}</p>
      <p className="useraddress">✅ {user}</p>
      <App />
    </>
  );
}


createRoot(document.getElementById("root")).render(

  <SharedStateProvider>
    <Overlay />
  </SharedStateProvider>

)
