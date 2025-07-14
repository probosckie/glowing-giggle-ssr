import React from "react";

export default function PageCSR() {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <h1>Client-Side Page</h1>
      <p>This page is only rendered in the browser.</p>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
    </div>
  );
}
