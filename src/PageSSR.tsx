import React from "react";

export default function PageSSR() {
  const time = new Date().toISOString();

  return (
    <div>
      <h1>Server-Side Rendered Page</h1>
      <p>This was rendered on the server at: {time}</p>
    </div>
  );
}
