// Import libraries here
const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const { initializeSocket } = require("./socket");
//dotenv.config({ path: './database/config.env' })
dotenv.config({ path: "./.env" });

const app = express();
const server = http.createServer(app);

initializeSocket(server);

app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Cors
const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// Add routes
const auth = require("./routes/auth");
app.use("/auth", auth);

const users = require("./routes/users");
app.use("/users", users);

const chat = require("./routes/chat");
app.use("/chat", chat);

const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error:${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
