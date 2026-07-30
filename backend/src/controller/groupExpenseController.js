const GroupExpense = require("../models/groupExpense")
const User  = require("../models/User")
const Group = require("../models/group")
const Settlement = require("../models/settlement");


const addGroupExpense = async(req , res) =>{
        try {

        const {
            groupId,
            title,
            amount,
            paidBy,
            participants,
            description,
        } = req.body;

        // Validate input
        if (
            !groupId ||
            !title ||
            !amount ||
            !paidBy ||
            !participants ||
            participants.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields.",
            });
        }

        // Check if group exists
        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({
                success: false,
                message: "Group not found.",
            });
        }

        // Logged-in user must belong to this group
        if (!group.members.includes(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: "You are not a member of this group.",
            });
        }

        // Everyone in participants must belong to the group
        const allMembers = participants.every((memberId) =>
            group.members.some(
                (member) => member.toString() === memberId.toString()
            )
        );

        if (!allMembers) {
            return res.status(400).json({
                success: false,
                message: "Some selected participants are not group members.",
            });
        }

        const expense = await GroupExpense.create({
            group: groupId,
            title,
            amount,
            paidBy,
            participants,
            description,
        });

        req.io.emit("groupExpenseAdded", {
    title: expense.title,
    amount: expense.amount,
    paidBy: expense.paidBy,
});

        res.status(201).json({
            success: true,
            message: "Expense added successfully.",
            expense,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

    
};

const getGroupExpenses = async (req, res) => {

    try {

        const group = await Group.findById(req.params.groupId);

        if (!group) {
            return res.status(404).json({
                success: false,
                message: "Group not found.",
            });
        }

        if (!group.members.includes(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized.",
            });
        }

        const expenses = await GroupExpense.find({
            group: req.params.groupId,
        })
            .populate("paidBy", "name profileImage")
            .populate("participants", "name profileImage")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            expenses,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

}

const deleteGroupExpense = async (req, res) => {

    try {

        const expense = await GroupExpense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found.",
            });
        }

        if (expense.paidBy.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Only the payer can delete this expense.",
            });
        }

        await expense.deleteOne();

        req.io.emit("groupExpenseDeleted", {
      title: expense.title,
      deletedBy: req.user.name,
  
});

        res.status(200).json({
            success: true,
            message: "Expense deleted successfully.",
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

const getGroupBalances = async (req, res) => {
    try {
        const settlementRecords = await Settlement.find({
        group: req.params.groupId,
});


        const group = await Group.findById(req.params.groupId)
            .populate("members", "name email");



        if (!group) {
            return res.status(404).json({
                success: false,
                message: "Group not found",
            });
        }

        const isMember = group.members.some(
            member => member._id.toString() === req.user.id
        );

        console.log("Is Member:", isMember);

        if (!isMember) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        // ---------------------------------------
        // Fetch Expenses
        // ---------------------------------------

        const expenses = await GroupExpense.find({
            group: req.params.groupId,
        })
            .populate("paidBy", "name profileImage")
            .populate("participants", "name profileImage");

        console.log("Expenses Count:", expenses.length);
        console.log("Expenses:", expenses);

        const balances = {};

        // ---------------------------------------
        // Calculate Balances
        // ---------------------------------------

        for (const expense of expenses) {

           
            const share =
                expense.amount / expense.participants.length;

            console.log("Share:", share);

            const payerId = expense.paidBy._id.toString();

            balances[payerId] =
                (balances[payerId] || 0) + expense.amount;

            expense.participants.forEach(member => {

                const memberId = member._id.toString();

                balances[memberId] =
                    (balances[memberId] || 0) - share;

            });


        }
      
     for (const settlement of settlementRecords) {

     const fromId = settlement.from.toString();
 
      const toId = settlement.to.toString();

    console.log(
        `${fromId} paid ${toId} ₹${settlement.amount}`
    );

    // Debtor paid money
    balances[fromId] =
        (balances[fromId] || 0) + settlement.amount;

    // Creditor received money
    balances[toId] =
        (balances[toId] || 0) - settlement.amount;

}
       
        // ---------------------------------------
        // Creditors & Debtors
        // ---------------------------------------

        const creditors = [];
        const debtors = [];

        for (const userId in balances) {

        balances[userId] = Number(
        balances[userId].toFixed(2)
    );

            if (balances[userId] > 0.01) {

                creditors.push({

                    userId,

                    amount: balances[userId],

                });

            }

            else if (balances[userId] < -0.01) {

                debtors.push({

                    userId,

                    amount: Math.abs(balances[userId]),

                });

            }

        }

       

        // ---------------------------------------
        // Settlements
        // ---------------------------------------

        const settlements = [];

        let i = 0;
        let j = 0;

        while (i < debtors.length && j < creditors.length) {


            const amount = Math.min(
                debtors[i].amount,
                creditors[j].amount
            );

            console.log("Settlement Amount:", amount);

            const fromUser = await User.findById(
                debtors[i].userId
            ).select("name profileImage");

            const toUser = await User.findById(
                creditors[j].userId
            ).select("name profileImage");

            console.log("From User:", fromUser);
            console.log("To User:", toUser);

            settlements.push({

                from: fromUser,

                to: toUser,

                amount,

            });

            debtors[i].amount -= amount;
            creditors[j].amount -= amount;

            console.log("Updated Debtor:", debtors[i]);
            console.log("Updated Creditor:", creditors[j]);

            if (debtors[i].amount <= 0.01) {
                i++;
            }

            if (creditors[j].amount <= 0.01) {
                j++;
            }

        }

        console.log("===============================");
        console.log("Final Settlements:");
        console.log(settlements);

        return res.status(200).json({

            success: true,

            balances,

            settlements,

        });

    } catch (error) {

        console.log("ERROR OCCURRED");
        console.log(error);

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }
};

const updateGroupExpense = async (req , res) => {
    try {

        const  {
            title,
            amount,
            paidBy,
            participants,
            description,
        } = req.body;

         const expense = await GroupExpense.findById(req.params.id);

        if (!expense) {

            return res.status(404).json({
                success: false,
                message: "Expense not found.",
            });
    }  

    if ( expense.paidBy.toString() !== req.user.id){
        return res.status(403).json ( {
            success : false ,
            message : "Only the payer can update this expense." ,
        })
    }

    const updatedExpense = await GroupExpense.findByIdAndUpdate(req.params.id,
        {
        title ,
        amount,
        paidBy,
        participants,
        description,
        } ,
        {
            new:true,
            runValidators: true,
        }
    )

    if (
    !title ||
    !amount ||
    !paidBy ||
    !participants ||
    participants.length === 0
) {
    return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
    });
}

  req.io.emit("groupExpenseUpdated", {
    title: expense.title,
    updatedBy: req.user.name,
});
return res.status(200).json({
    success: true,
    message: "Expense updated successfully.",
    expense: updatedExpense,
});

    
} catch
(error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
}

module.exports = {
    addGroupExpense,
    getGroupExpenses,
    deleteGroupExpense,
    getGroupBalances,
    updateGroupExpense
};