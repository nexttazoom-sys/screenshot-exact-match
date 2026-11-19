import { defineConfig, loadEnv, type Plugin, type Connect } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import fs from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";

function createSmtpMiddleware(): Connect.NextHandleFunction {
  return (req: IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
    const url = (req.url || "").split("?")[0] || "";
    const isSmtpEndpoint =
      url.endsWith("/send-lead.php") ||
      url.endsWith("/api/send-lead-email.php") ||
      url.endsWith("/api/send-lead-email");

    if (!isSmtpEndpoint) {
      next();
      return;
    }

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, apikey");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

    if (req.method === "OPTIONS") {
      res.statusCode = 200;
      res.end();
      return;
    }

    if (req.method !== "POST") {
      res.statusCode = 405;
      res.setHeader("Content-Type", "application/json; charset=UTF-8");
      res.end(JSON.stringify({ success: false, error: "Método no permitido." }));
      return;
    }

    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => {
      void (async () => {
        res.setHeader("Content-Type", "application/json; charset=UTF-8");
        try {
          const rawBody = Buffer.concat(chunks).toString("utf8");
          const payload = JSON.parse(rawBody || "{}");
          const { sendLeadEmailViaSmtp } = await import("./src/lib/smtp-mailer.server");
          const result = await sendLeadEmailViaSmtp(payload);
          res.statusCode = result.success ? 200 : result.code === "MISSING_SMTP_SECRET" ? 503 : 500;
          res.end(JSON.stringify(result));
        } catch (err) {
          res.statusCode = 500;
          res.end(
            JSON.stringify({
              success: false,
              code: "SMTP_CONNECTION_ERROR",
              error:
                err instanceof Error
                  ? err.message
                  : "Error al conectar con el servidor SMTP solu33.tuwebdns.net:465.",
            }),
          );
        }
      })();
    });
  };
}

function smtpLeadEmailPlugin(): Plugin {
  return {
    name: "victoria-yanez-smtp-api",
    configureServer(server) {
      server.middlewares.use(createSmtpMiddleware());
    },
    configurePreviewServer(server) {
      server.middlewares.use(createSmtpMiddleware());
    },
    closeBundle() {
      const smtpPass =
        process.env["SMTP_PASS"] ||
        process.env["SMTP_PASSWORD"] ||
        process.env["VITE_SMTP_PASS"] ||
        "";
      if (!smtpPass) return;

      const distApiDir = path.resolve(__dirname, "dist", "api");
      if (!fs.existsSync(distApiDir)) {
        fs.mkdirSync(distApiDir, { recursive: true });
      }
      const smtpHost = process.env["SMTP_HOST"] || "solu33.tuwebdns.net";
      const smtpPort = process.env["SMTP_PORT"] || "465";
      const smtpUser = process.env["SMTP_USER"] || "notificaciones@vyplanesisapre.cl";

      const envContent = [
        `SMTP_HOST="${smtpHost}"`,
        `SMTP_PORT="${smtpPort}"`,
        `SMTP_USER="${smtpUser}"`,
        `SMTP_PASS="${smtpPass}"`,
      ].join("\n");

      fs.writeFileSync(path.join(distApiDir, ".env"), `${envContent}\n`, "utf8");
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  for (const [k, v] of Object.entries(env)) {
    if (process.env[k] === undefined && v !== "") {
      process.env[k] = v;
    }
  }

  return {
    base: "./",
    plugins: [smtpLeadEmailPlugin(), react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: "dist",
      emptyOutDir: true,
      sourcemap: false,
      chunkSizeWarningLimit: 800,
    },
  };
});
