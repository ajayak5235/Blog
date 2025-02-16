const cors = require("cors");

const corsOptions = {
  origin: [
    "https://ai-content-livid.vercel.app/" // Production frontend
  ],
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true, // Allow cookies and authentication headers
};

module.exports = cors(corsOptions);
