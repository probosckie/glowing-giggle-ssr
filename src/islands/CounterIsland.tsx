import React from "react";
import { createRoot } from "react-dom/client";
import Counter from "../components/Counter";

console.log("💡 CounterIsland script loaded!");

const el = document.getElementById("island-counter");
if (el) {
  createRoot(el).render(<Counter />);
}
