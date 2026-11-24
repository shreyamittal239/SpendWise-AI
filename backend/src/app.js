
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { corsOptions } = require("./config/cors");

const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const splitExpenseRoutes = require("./routes/splitExpenseRoutes")
const budgetRoutes = require("./routes/budgetRoutes");
const groupRoutes = require("./routes/groupRoutes");
const groupExpenseRoutes = require("./routes/groupExpenseRoutes");
const settlementRoutes = require("./routes/settlementRoutes");
const aiRoutes  = require ("./routes/aiRoutes")

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
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