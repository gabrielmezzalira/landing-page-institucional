// Proxy do click tracker: recebe os params do CTA do email, dispara o Apps Script
// que registra o clique + envia o email de engajamento, e redireciona o lead pro
// destino via HTTP 302. Elimina a tarja "Este aplicativo foi criado…" e a URL
// script.google.com que apareciam quando o lead clicava direto no Apps Script.

const APPS_SCRIPT_URL =
  process.env.APPS_SCRIPT_URL ||
  "https://script.google.com/macros/s/AKfycbxZ75Vd597lr8GN9fZ2_8YURG1STrkeeqhue0jb2A53V_u38MZgTlHVCBdcKhHu4NXvUg/exec";

module.exports = async function handler(req, res) {
  const { email = "", nome = "", frente = "", email_numero = "", destino = "" } = req.query;

  if (!email || !destino) {
    res.status(400).send("Link invalido ou parametros ausentes.");
    return;
  }
  if (!/^https?:\/\//i.test(destino)) {
    res.status(400).send("Destino invalido.");
    return;
  }

  const params = new URLSearchParams({ email, nome, frente, email_numero, destino });
  const trackerUrl = `${APPS_SCRIPT_URL}?${params.toString()}`;

  // Espera o Apps Script processar (registrar clique + disparar engajamento),
  // mas com timeout curto pra nao segurar o lead se o Google engasgar.
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    await fetch(trackerUrl, { signal: controller.signal, redirect: "manual" });
    clearTimeout(timeout);
  } catch (err) {
    // Mesmo que a chamada expire aqui, o Apps Script na Google ja recebeu o
    // request e continua executando ate o fim. Nao bloqueamos o redirect.
    console.error("Tracker call failed:", err && err.message);
  }

  res.redirect(302, destino);
};
