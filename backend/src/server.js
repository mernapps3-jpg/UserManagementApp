const express = require("express");
const cors = require("cors");
const connectDb = require("./config/db");
const env = require("./config/env");
const authRoutes = require("./routes/authRoutes")


// Express App Instance
const app = express();

env.ensureEnv();

// Middleware Function => runs between the request and response
// app.use()

// Basic security/quality middleware setup.
app.use(cors({
    origin: env.clientOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type'],
    optionsSuccessStatus: 204
}));

// JSON => parse incoming JSON - JS Object
app.use(express.json())

app.get("/api/health", (req, res) => {
    res.json({ success: true, message: "API is healthy" })
})

// Setting up or Mounting the Routes
app.use("/api/auth", authRoutes);

// All error will be handled by this error handler Function
// app.use(errorHandler);

// Start server only after DB connection to avoid runtime surprises.
connectDb()
  .then(() => {
    app.listen(env.port, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${env.port}`);
      console.log(`📍 Local: http://localhost:${env.port}`);
      console.log(`🌐 Network: http://0.0.0.0:${env.port}`);
      console.log(`🔗 CORS Origin: ${env.clientOrigin}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  });


