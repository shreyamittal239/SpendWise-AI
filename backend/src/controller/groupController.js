const Group = require("../models/group")
const User = require("../models/User");
const GroupExpense = require("../models/groupExpense");
const Settlement = require("../models/settlement");

const createGroup = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Group name is required",
            });
        }

        const group = await Group.create({
            name,
            description,
            createdBy: req.user.id,
            members: [req.user.id], // creator automatically becomes member
        });

        req.io.emit("groupCreated", {
    groupName: group.name,
});

        res.status(201).json({
            success: true,
            message: "Group created successfully",
            group,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getGroups = async (req, res) => {
    try {

        const groups = await Group.find({
            members: req.user.id,
        }).populate("members", "name email profileImage")
        .populate("createdBy", "name");


        res.status(200).json({
            success: true,
            groups,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const getGroup = async (req, res) => {
    try {

        const group = await Group.findById(req.params.id)
            .populate("members", "name email profileImage")
            .populate("createdBy", "name email");
            
        if (!group) {
            return res.status(404).json({
                success: false,
                message: "Group not found",
            });
        }

        res.status(200).json({
            success: true,
            group,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

const addMember = async (req, res) => {
    try {

        const { email } = req.body;

        const group = await Group.findById(req.params.id);

        if (!group) {
            return res.status(404).json({
                success: false,
                message: "Group not found",
            });
        }

        // Only creator can add members
        if (group.createdBy.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Only the group creator can add members.",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Prevent duplicates
        if (group.members.includes(user._id)) {
            return res.status(400).json({
                success: false,
                message: "User is already a member.",
            });
        }

        group.members.push(user._id);


        await group.save();
        req.io.emit("memberJoined", {
         groupId: group._id,
    groupName: group.name,
    memberName: user.name,      // user that was added
    addedBy: req.user.name,     
});

        res.status(200).json({
            success: true,
            message: "Member added successfully.",
            group,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};



const updateGroup = async (req, res) => {
    try {

        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Group name is required.",
            });
        }

        const group = await Group.findById(req.params.id);

        if (!group) {
            return res.status(404).json({
                success: false,
                message: "Group not found.",
            });
        }

        // Only creator can edit
        if (group.createdBy.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Only the group creator can edit this group.",
            });
        }

        group.name = name;
        group.description = description;

        await group.save();

        req.io.emit("groupUpdated", {
            groupId: group._id,
            groupName: group.name,
            updatedBy: req.user.name,
        });

        return res.status(200).json({
            success: true,
            message: "Group updated successfully.",
            group,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const deleteGroup = async (req, res) => {

    try {

        const group = await Group.findById(req.params.id);

        if (!group) {
            return res.status(404).json({
                success: false,
                message: "Group not found.",
            });
        }

        // Only creator can delete
        if (group.createdBy.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Only the group creator can delete this group.",
            });
        }

        await GroupExpense.deleteMany({
            group: group._id,
        });

        await Settlement.deleteMany({
            group: group._id,
        });

        await group.deleteOne();

        req.io.emit("groupDeleted", {
            groupId: group._id,
            groupName: group.name,
            deletedBy: req.user.name,
        });

        return res.status(200).json({
            success: true,
            message: "Group deleted successfully.",
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

module.exports = {
    createGroup,
    getGroups,
    getGroup,
    addMember,
    updateGroup,
    deleteGroup
};