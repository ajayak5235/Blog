const cors = require("cors");

const corsOptions = {
  origin: "https://ai-content-livid.vercel.app", // Allow frontend origin
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow cookies/auth headers
  optionsSuccessStatus: 204, // Fix preflight request issues
};

module.exports = cors(corsOptions);
