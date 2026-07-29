import { useState } from "react";
import api from "../services/api";

const AddGroupExpenseModal = ({
    group,
    closeModal,
    refreshExpenses,
    refreshBalances
}) => {

    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        paidBy: group.members[0]._id,
        participants: [],
        description: "",
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };

    const handleCheckbox = (memberId) => {

        if (formData.participants.includes(memberId)) {

            setFormData({
                ...formData,
                participants: formData.participants.filter(
                    id => id !== memberId
                ),
            });

        } else {

            setFormData({
                ...formData,
                participants: [
                    ...formData.participants,
                    memberId,
                ],
            });

        }

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await api.post("/group-expenses", {

                groupId: group._id,

                title: formData.title,

                amount: Number(formData.amount),

                paidBy: formData.paidBy,

                participants: formData.participants,

                description: formData.description,

            });

            refreshExpenses();
            refreshBalances();

            closeModal();

        } catch (error) {

            alert(error.response?.data?.message);

        }

    };

    return (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white rounded-2xl w-full max-w-lg p-8">

                <h2 className="text-3xl font-bold mb-6">

                    Add Group Expense

                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* Title */}

                    <div>

                        <label className="font-semibold">

                            Expense Title

                        </label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3 mt-2"
                            required
                        />

                    </div>

                    {/* Amount */}

                    <div>

                        <label className="font-semibold">

                            Amount

                        </label>

                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3 mt-2"
                            required
                        />

                    </div>

                    {/* Paid By */}

                    <div>

                        <label className="font-semibold">

                            Paid By

                        </label>

                        <select
                            name="paidBy"
                            value={formData.paidBy}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3 mt-2"
                        >

                            {group.members.map((member) => (

                                <option
                                    key={member._id}
                                    value={member._id}
                                >

                                    {member.name}

                                </option>

                            ))}

                        </select>

                    </div>

                    {/* Participants */}

                    <div>

                        <label className="font-semibold">

                            Split Between

                        </label>

                        <div className="mt-3 space-y-2">

                            {group.members.map((member) => (

                                <label
                                    key={member._id}
                                    className="flex items-center gap-3"
                                >

                                    <input
                                        type="checkbox"
                                        checked={formData.participants.includes(member._id)}
                                        onChange={() =>
                                            handleCheckbox(member._id)
                                        }
                                    />

                                    {member.name}

                                </label>

                            ))}

                        </div>

                    </div>

                    {/* Description */}

                    <div>

                        <label className="font-semibold">

                            Description

                        </label>

                        <textarea
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3 mt-2"
                        />

                    </div>

                    {/* Buttons */}

                    <div className="flex justify-end gap-4 pt-4">

                        <button
                            type="button"
                            onClick={closeModal}
                            className="border px-5 py-2 rounded-lg"
                        >

                            Cancel

                        </button>

                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                        >

                            Save Expense

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

};

export default AddGroupExpenseModal;