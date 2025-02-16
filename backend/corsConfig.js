const cors = require("cors");

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = ["https://ai-content-livid.vercel.app"]; // Add your frontend URL

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow cookies and authentication headers
};

module.exports = cors(corsOptions);

