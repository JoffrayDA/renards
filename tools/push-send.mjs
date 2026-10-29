// Envoie les notifications du refuge. Lancé toutes les 30 min par .github/workflows/push.yml (node tools/push-send.mjs).
// Chaque téléphone a sa fiche push/{uid} dans Firestore (écrite par js/push.js) : sub = abonnement Web Push,
// fox / inco / arr = heures prévues en ms (0 = rien), tz = décalage horaire du téléphone en minutes.
// Le script y note ce qu'il a envoyé (s_fox, s_inco, s_arr, last). Une notification par jour au plus, entre 9 h et 21 h.
// Secrets GitHub : FIREBASE_SA (le fichier JSON du compte de service), VAPID_PRIVATE. --dry : affiche sans rien envoyer.
import crypto from "node:crypto";

const DRY = process.argv.includes("--dry");
// les erreurs s'affichent aussi en annotation sur la page du lancement (::error::), sans ouvrir le journal
const fail = (...a) => { console.log("::error::" + a.map(x => typeof x === "string" ? x : JSON.stringify(x)).join(" ")); process.exit(1); };
process.on("uncaughtException", e => fail("Erreur :", e.message));
process.on("unhandledRejection", e => fail("Erreur :", e && e.message || String(e)));
if (!process.env.FIREBASE_SA || !process.env.VAPID_PRIVATE) { console.log("Notifications pas encore configurées."); process.exit(0); }
const { default: webpush } = await import("web-push");
let SA;
try { SA = JSON.parse(process.env.FIREBASE_SA); } catch (e) { fail("FIREBASE_SA n'est pas le fichier JSON entier (il doit commencer par { et finir par }) :", e.message); }
if (!SA.private_key || !SA.client_email) fail("FIREBASE_SA : il manque private_key ou client_email. Champs trouvés :", Object.keys(SA).join(", "));
const now = Date.now();
const VAPID_PUBLIC = "BAsAHBBOqsx2X4nrMCzkZcItxnTZ50AJZr2HuVy5U6HM-Y8HhnsBF0b9GPfEJ9DYCDNEEEl6G8Nq4VplgD90YFI";
// la clé collée dans le secret peut garder un retour à la ligne, des espaces ou des guillemets
const VAPID_PRIVATE = process.env.VAPID_PRIVATE.replace(/[\s"']/g, "");
if (!/^[A-Za-z0-9_-]{43}$/.test(VAPID_PRIVATE)) fail(`VAPID_PRIVATE ne ressemble pas à la clé : ${VAPID_PRIVATE.length} caractères au lieu de 43 (elle commence par « ${VAPID_PRIVATE.slice(0, 3)} »).`);
webpush.setVapidDetails("https://joffrayda.github.io/renards/", VAPID_PUBLIC, VAPID_PRIVATE);

const MSG = {
  fox: { t: "Quelqu'un t'attend", b: "Un renard vient d'arriver à la Clairière. Il a une histoire à te raconter." },
  inco: { t: "Quelqu'un est passé à la gamelle", b: "Il a laissé une photo. Viens voir qui c'est !" },
  arr: { t: "Un nouveau renard au refuge", b: "Un client du Café vient s'installer à la Clairière." }
};

// jeton d'accès du compte de service (JWT signé, sans bibliothèque)
const b64 = o => Buffer.from(JSON.stringify(o)).toString("base64url");
const iat = Math.floor(now / 1000);
const jwt = b64({ alg: "RS256", typ: "JWT" }) + "." + b64({ iss: SA.client_email, scope: "https://www.googleapis.com/auth/datastore", aud: "https://oauth2.googleapis.com/token", iat, exp: iat + 3600 });
const signed = jwt + "." + crypto.sign("RSA-SHA256", Buffer.from(jwt), SA.private_key).toString("base64url");
const tok = await (await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: "grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=" + signed })).json();
if (!tok.access_token) fail("Google refuse la clé du compte de service :", tok.error, tok.error_description);
const H = { Authorization: "Bearer " + tok.access_token, "Content-Type": "application/json" };
const BASE = `https://firestore.googleapis.com/v1/projects/${SA.project_id}/databases/(default)/documents`;
const val = f => f.integerValue != null ? +f.integerValue : f.stringValue;

let page = "", sent = 0, seen = 0;
do {
  const r = await (await fetch(`${BASE}/push?pageSize=300${page ? "&pageToken=" + page : ""}`, { headers: H })).json();
  if (r.error) fail("Firestore refuse la lecture :", r.error.status, r.error.message);
  for (const doc of r.documents || []) {
    seen++;
    const d = Object.fromEntries(Object.entries(doc.fields || {}).map(([k, v]) => [k, val(v)]));
    const hour = new Date(now - (d.tz || 0) * 6e4).getUTCHours();
    if (hour < 9 || hour >= 21 || now - (d.last || 0) < 20 * 36e5 || !d.sub) continue;
    const k = ["fox", "inco", "arr"].find(k => d[k] && d[k] <= now && d[k] > (d["s_" + k] || 0));
    if (!k) continue;
    if (DRY) { console.log("enverrait", k, "à", doc.name.split("/").pop()); continue; }
    try { await webpush.sendNotification(JSON.parse(d.sub), JSON.stringify({ ...MSG[k], k, u: "clairiere.html" }), { TTL: 6 * 3600 }); }
    catch (e) {
      // abonnement périmé (app désinstallée, notifications coupées) : on oublie la fiche
      if (e.statusCode === 404 || e.statusCode === 410) await fetch(`https://firestore.googleapis.com/v1/${doc.name}`, { method: "DELETE", headers: H });
      else console.error("échec", e.statusCode, e.body);
      continue;
    }
    const fields = { ["s_" + k]: { integerValue: String(d[k]) }, last: { integerValue: String(now) } };
    await fetch(`https://firestore.googleapis.com/v1/${doc.name}?updateMask.fieldPaths=s_${k}&updateMask.fieldPaths=last`, { method: "PATCH", headers: H, body: JSON.stringify({ fields }) });
    sent++;
  }
  page = r.nextPageToken || "";
} while (page);
console.log(`${seen} téléphone(s), ${sent} notification(s) envoyée(s).`);
