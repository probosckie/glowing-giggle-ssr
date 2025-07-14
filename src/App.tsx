import React from "react";
import { Routes, Route } from "react-router-dom";
import PageCSR from "./PageCSR";
import PageSSR from "./PageSSR";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<PageSSR />} />
      <Route path="/client" element={<PageCSR />} />
    </Routes>
  );
}

export default App;
