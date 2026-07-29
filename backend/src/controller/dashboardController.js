const Expense = require("../models/expense");
const mongoose = require("mongoose")
const Group = require("../models/group");

const getDashboard = async (req, res) => {
   const expenses = await Expense.find({
    user:req.user.id
   })

   let totalExpense = 0;

        expenses.forEach((expense) => {
            totalExpense += expense.amount;
        });

    

 const categoryWiseExpense = await Expense.aggregate([
    {
        $match: {
            user:  new mongoose.Types.ObjectId(req.user.id)
        }
    },
    {
        $group: {
            _id: "$category",
            total: {
                $sum: "$amount"
            }
        }
    }
]);

const monthlyExpenses = await Expense.aggregate([
    {
        $match: {
            user: new mongoose.Types.ObjectId(req.user.id)
        }
    },
    {
 $group: {
            _id: {
                year: { $year: "$date" },
                month: { $month: "$date" },
            },
            amount: {
                $sum: "$amount",
            },
        },
    },
    {
        $sort: {
            "_id.year": 1,
            "_id.month": 1,
        },
    }
]);

const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

const formattedMonthlyExpenses = monthlyExpenses.map((item) => ({
    month: monthNames[item._id.month - 1],
    amount: item.amount,
}));

console.log(formattedMonthlyExpenses);

formattedMonthlyExpenses.forEach((item) => {
    console.log(item.amount, typeof item.amount);
});
const totalTransactions = expenses.length;

const categoryCount = await Expense.distinct(
    "category",
    { user: req.user.id }
);

const totalGroups = await Group.countDocuments({
    members: req.user.id,
});

    

  const recentExpenses = await Expense.find({
     user:req.user.id
  })
  .sort({createdAt: -1})
  .limit(5);

  res.status(200).json({
            success: true,
            totalExpense,
            totalTransactions,
            recentExpenses,
            categoryWiseExpense,
            totalGroups,
            monthlyExpenses: formattedMonthlyExpenses,
            categoryCount: categoryCount.length
        });

};

module.exports = {
    getDashboard
};