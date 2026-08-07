
const express = require("express");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const splitExpenseRoutes = require("./routes/splitExpenseRoutes")
const cors = require("cors")
const budgetRoutes = require("./routes/budgetRoutes");
const groupRoutes = require("./routes/groupRoutes");
const groupExpenseRoutes = require("./routes/groupExpenseRoutes");
const settlementRoutes = require("./routes/settlementRoutes");
const aiRoutes  = require ("./routes/aiRoutes")

const app = express();

const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:[ "http://localhost:5173",
    "https://expense-tracker-mern-zeta-eight.vercel.app", // your frontend (Vite)
    ],
    credentials: true
}));
app.use((req, res, next) => {
    req.io = req.app.get("io");
    next();
});



app.get("/", (req, res) => {
    res.send("Expense Tracker API is running...");
});


app.use("/api/auth", authRoutes);

app.use("/api/expenses", expenseRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/splitExpenses", splitExpenseRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/group-expenses", groupExpenseRoutes);
app.use("/api/settlements", settlementRoutes);
app.use("/api/ai", aiRoutes);

module.exports = app;