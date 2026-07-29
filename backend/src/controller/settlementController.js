const Settlement = require("../models/settlement")
const Group = require("../models/group");

const settlePayment = async (req , res ) => {
    try {

        const {
            groupId,
            from,
            to,
            amount,
        } = req.body;

        // Validation
        if (!groupId || !from || !to || !amount) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields.",
            });
        }

        // Check group exists
        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({
                success: false,
                message: "Group not found.",
            });
        }

        // Check users belong to group
        const isFromMember = group.members.some(
            member => member.toString() === from
        );

        const isToMember = group.members.some(
            member => member.toString() === to
        );

        if (!isFromMember || !isToMember) {
            return res.status(400).json({
                success: false,
                message: "Users are not members of this group.",
            });
        }

        if (req.user.id !== from) {
    return res.status(403).json({
        success: false,
        message: "You can only record your own settlements.",
    });
}

        // Create settlement
        const settlement = await Settlement.create({
            group: groupId,
            from,
            to,
            amount,
        });

        

   req.io.emit("settlementCompleted", {
    user: settlement.from,
    amount: settlement.amount,
});

        res.status(201).json({
            success: true,
            message: "Settlement recorded successfully.",
            settlement,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

}

const getSettlementHistory = async (req, res) => {

    try {

        const settlements = await Settlement.find({
            group: req.params.groupId,
        })
        .populate("from", "name profileImage")
        .populate("to", "name profileImage")
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            settlements,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

module.exports = {
    settlePayment,
    getSettlementHistory,
};