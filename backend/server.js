const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connecttoDb = require("./src/db/Config");
const app = express();
const PORT = process.env.PORT;
const cookieParser = require('cookie-parser')
const authRoutes = require('./src/routes/user.route');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

// Basic routes
app.get("/", (req, res) => {
  res.json({ status: "ok", msg: "Its working" });
});

app.use('/auth' , authRoutes);


app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  connecttoDb();
});
