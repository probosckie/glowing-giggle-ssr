// server.js
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === "production";

const app = express();

let vite;
let manifest;

if (!isProd) {
  // Dev mode: Vite's dev server in middleware mode
  const { createServer } = await import("vite");
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
  });
  app.use(vite.middlewares);
} else {
  // Prod mode: Serve static assets from dist/client
  manifest = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, "dist/client/.vite/manifest.json"),
      "utf-8"
    )
  );
  app.use(
    express.static(path.resolve(__dirname, "dist/client"), {
      index: false,
    })
  );
}

console.log("Registering wildcard SSR route...");
app.use(/.*/, async (req, res) => {
  const url = req.originalUrl;
  try {
    let template, render;

    if (!isProd) {
      // Dev mode: read + transform template on the fly
      template = fs.readFileSync(
        path.resolve(__dirname, "index.html"),
        "utf-8"
      );
      template = await vite.transformIndexHtml(url, template);
      let temp = await vite.ssrLoadModule("/src/entry-server.tsx");
      render = temp.render;
    } else {
      // Prod mode: read prebuilt files
      template = fs.readFileSync(
        path.resolve(__dirname, "dist/client/index.html"),
        "utf-8"
      );

      const counterIslandSrc = manifest["src/islands/CounterIsland.tsx"].file;
      const islandScript = `<script type="module" src="/${counterIslandSrc}"></script>`;

      // Inject island script before </body>
      template = template.replace("</body>", `${islandScript}</body>`);

      const serverEntry = await import(
        path.resolve(__dirname, "./dist/server/entry-server.js")
      );
      render = serverEntry.render;
    }

    const appHtml = render(url);
    const html = template.replace(`<!--ssr-outlet-->`, appHtml);

    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  } catch (e) {
    vite?.ssrFixStacktrace?.(e);
    console.error(e);
    res.status(500).end(e?.message || "Server error");
  }
});

app.listen(5173, () => {
  console.log(`Server running at http://localhost:5173`);
});
