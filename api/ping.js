// Proxy para pings de bounce/interação vindos da landing page.
// sendBeacon não segue redirects do GAS — esse endpoint recebe no mesmo
// domínio (sem CORS) e encaminha server-side, onde o redirect é transparente.

const GAS_URL =
  process.env.APPS_SCRIPT_URL ||
  "https://script.google.com/macros/s/AKfycbxZ75Vd597lr8GN9fZ2_8YURG1STrkeeqhue0jb2A53V_u38MZgTlHVCBdcKhHu4NXvUg/exec";

module.exports = async function handler(req, res) {
  const { action = "", em = "" } = req.query;

  if (action && em) {
    const url = `${GAS_URL}?action=${encodeURIComponent(action)}&em=${encodeURIComponent(em)}`;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3500);
      await fetch(url, { signal: controller.signal, redirect: "follow" });
      clearTimeout(timeout);
    } catch (err) {
      console.error("Ping to GAS failed:", err && err.message);
    }
  }

  res.status(200).end("ok");
};
