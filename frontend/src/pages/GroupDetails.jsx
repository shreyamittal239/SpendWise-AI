import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";
import {
    FaUsers,
    FaEnvelope,
    FaUserPlus,
    FaReceipt,
} from "react-icons/fa";
import AddGroupExpenseModal from "../components/AddGroupExpenseModal";
import SettlementModal from "../components/SettlementModel";
import EditGroupExpense from "../components/EditGroupExpense";

const GroupDetails = () => {

    const { id } = useParams();

    const [group, setGroup] = useState(null);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [balances, setBalances] = useState([]);
    const [showSettlementModal, setShowSettlementModal] = useState(false);
    const [selectedSettlement, setSelectedSettlement] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [settlementHistory, setSettlementHistory] = useState([]);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);


    const fetchGroup = async () => {
        try {

            const response = await api.get(`/groups/${id}`);

            setGroup(response.data.group);

        } catch (error) {

            console.log(error.response?.data);

        } finally {

            setLoading(false);

        }
    };

    const addMember = async () => {

        if (!email) {
            return alert("Please enter an email.");
        }

        try {

            const response = await api.post(
                `/groups/${id}/add-member`,
                {
                    email,
                }
            );

            alert(response.data.message);

            setEmail("");

            fetchGroup();

        } catch (error) {

            alert(error.response?.data?.message);

        }

    };

    const deleteExpense = async (expenseId) => {

         const confirmDelete = window.confirm(
        "Are you sure you want to delete this expense?"
    );

    if (!confirmDelete) return;

    try {

        const response = await api.delete(
            `/group-expenses/${expenseId}`
        );

        alert(response.data.message);

        fetchExpenses();

        fetchBalances();

    } catch (error) {

        alert(error.response?.data?.message);

    }

};

    const fetchExpenses = async () => {

    try {

        const response = await api.get(
            `/group-expenses/${id}`
        );

        setExpenses(response.data.expenses);

    } catch (error) {

        console.log(error.response?.data);

    }

};
const fetchBalances = async () => {

    try {

        const response = await api.get(
            `/group-expenses/balances/${id}`
        );

        setBalances(response.data.settlements);

    } catch (error) {

        console.log(error.response?.data);

    }

};

const openSettlementModal = (item) => {

    setSelectedSettlement(item);

    setShowSettlementModal(true);

};

const openEditModal = (expense) => {

    setEditingExpense(expense);

    setIsEditOpen(true);

};

const fetchSettlementHistory = async () => {

    try {

        const response = await api.get(
            `/settlements/${id}`
        );

        setSettlementHistory(response.data.settlements);

    } catch (error) {

        console.log(error);

    }

};

const closeEditModal = () => {

    setEditingExpense(null);

    setIsEditOpen(false);

};

const totalExpense = expenses.reduce(

    (total, expense) => total + expense.amount,

    0

);

    useEffect(() => {

        fetchGroup();
        fetchExpenses();
        fetchBalances();
        fetchSettlementHistory();

    }, [id]);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="text-center mt-20 text-xl font-semibold">
                    Loading Group...
                </div>
            </DashboardLayout>
        );
    }

    if (!group) {
        return (
            <DashboardLayout>
                <div className="text-center mt-20 text-red-500">
                    Group not found.
                </div>
            </DashboardLayout>
        );
    }

    return (

        <DashboardLayout>

            <div className="max-w-6xl mx-auto p-8">

                {/* Group Header */}

                <div className="mb-8 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-8 shadow-2xl text-white">

    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8">

        {/* Left Side */}

        <div className="flex-1">

            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium mb-5">

                👥 Group Details

            </div>

            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">

                {group.name}

            </h1>

            <p className="mt-3 text-indigo-100 text-lg max-w-2xl">

                {group.description || "No description available."}

            </p>

        </div>

        {/* Right Side */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">

            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-5 text-center border border-white/20">

                <p className="text-sm text-indigo-100">

                    Members

                </p>

                <h2 className="text-3xl font-bold mt-2">

                    {group.members.length}

                </h2>

            </div>

            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-5 text-center border border-white/20">

                <p className="text-sm text-indigo-100">

                    Expenses

                </p>

                <h2 className="text-3xl font-bold mt-2">

                    {expenses.length}

                </h2>

            </div>

            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-5 text-center border border-white/20">

                <p className="text-sm text-indigo-100">

                    Total Spent

                </p>

                <h2 className="text-3xl font-bold mt-2">

                    ₹{totalExpense.toLocaleString()}

                </h2>

            </div>

        </div>

    </div>

</div>

                {/* Members */}

                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">

                    <h2 className="text-2xl font-bold mb-6">

                        Members

                    </h2>
                 
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

{group.members.map(member => (

<div
key={member._id}
className="bg-white rounded-xl shadow p-5 text-center hover:shadow-lg transition"
>

 {
        member.profileImage ?

         <img
           src={member.profileImage}
            className="w-12 h-12 rounded-full object-cover border-2 border-red-300"
         />

               :

          <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">

          {member.name.charAt(0)}

          </div>

          }

<h2 className="mt-3 font-bold">

{member.name}

</h2>

<p className="text-gray-500 text-sm">

{member.email}

</p>

</div>

))}

</div>

                </div>

                {/* Add Member */}

                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">

                    <h2 className="text-2xl font-bold mb-6">

                        Add New Member

                    </h2>

                    <div className="flex gap-4">

                        <div className="relative flex-1">

                            <FaEnvelope className="absolute left-4 top-4 text-gray-400" />

                            <input
                                type="email"
                                placeholder="Enter user's email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                className="w-full border rounded-lg py-3 pl-12 pr-4"
                            />

                        </div>

                        <button
                            onClick={addMember}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg flex items-center gap-2"
                        >

                            <FaUserPlus />

                            Add Member

                        </button>

                    </div>

                </div>

                {/* Shared Expenses */}

                <div className="bg-white rounded-2xl shadow-lg p-6">

                    <div className="flex items-center gap-3 mb-5">

                        <FaReceipt className="text-green-600 text-2xl" />

                        <h2 className="text-2xl font-bold">

                            Shared Expenses

                        </h2>

                        <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg"
    >

        + Add Expense

    </button>

   

                    </div>

                   {expenses.length === 0 ? (

    <div className="text-center py-10 text-gray-500">

        No expenses added yet.

    </div>

) : (

    <div className="space-y-5 mt-8">

    {expenses.map((expense) => (

        <div
            key={expense._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border"
        >

            <div className="flex justify-between items-start">

                <div>

                    <h2 className="text-xl font-bold text-gray-800">

                        🍕 {expense.title}

                    </h2>

                    <p className="text-gray-500 mt-1">

                        {expense.description}

                    </p>

                </div>

                <div className="text-2xl font-bold text-indigo-600">

                    ₹{expense.amount}

                </div>

            </div>

            <div className="mt-5 flex items-center gap-3">

                 {

                                        expense.paidBy.profileImage ?

                                        <img
                                            src={expense.paidBy.profileImage}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-red-300"
                                        />

                                        :

                                        <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">

                                            {expense.paidBy.name.charAt(0)}

                                        </div>

                                    }

                <div>

                    <p className="font-semibold">

                        Paid by

                    </p>

                    <p className="text-gray-500">

                        {expense.paidBy.name}

                    </p>

                </div>

            </div>

            <div className="mt-5">

                <p className="font-semibold mb-3">

                    Participants

                </p>

                <div className="flex flex-wrap gap-3">

                    {expense.participants.map((member) => (

                        <div
                            key={member._id}
                            className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2"
                        >

                            {

                                        member.profileImage ?

                                        <img
                                            src={member.profileImage}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-red-300"
                                        />

                                        :

                                        <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">

                                            {member.name.charAt(0)}

                                        </div>

                                    }

                            <span>

                                {member.name}

                            </span>

                        </div>

                    ))}

                </div>

            </div>

            <div className="flex justify-end gap-3 mt-6">

                <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl"
                >
                    ✏ Edit
                </button>

                <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
                >
                    🗑 Delete
                </button>

            </div>

        </div>

    ))}

</div>

)}
</div>
  <div className="bg-white rounded-3xl shadow-lg p-8 mt-10">

    {/* Heading */}

    <div className="flex justify-between items-center mb-8">

        <div>

            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">

                💸 Pending Settlements

            </h2>

            <p className="text-gray-500 mt-2">

                Members who still need to settle their balances.

            </p>

        </div>

        <div className="bg-red-100 text-red-600 px-5 py-3 rounded-full font-bold">

            {balances.length} Pending

        </div>

    </div>

    {
        balances.length > 0 ?

        <div className="space-y-6">

            {
                balances.map((item, index) => (

                    <div
                        key={index}
                        className="bg-gray-50 rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
                    >

                        {/* Top */}

                        <div className="flex justify-between items-center">

                            {/* From */}

                            <div className="flex items-center gap-4">

                                {
                                    item.from.profileImage ?

                                        <img
                                            src={item.from.profileImage}
                                            alt=""
                                            className="w-14 h-14 rounded-full object-cover border-2 border-red-300"
                                        />

                                        :

                                        <div className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center text-xl font-bold">

                                            {item.from.name.charAt(0)}

                                        </div>
                                }

                                <div>

                                    <h3 className="font-bold text-lg">

                                        {item.from.name}

                                    </h3>

                                    <p className="text-red-500 text-sm">

                                        Owes Money

                                    </p>

                                </div>

                            </div>

                            {/* Arrow */}

                            <div className="text-4xl text-gray-400">

                                →

                            </div>

                            {/* To */}

                            <div className="flex items-center gap-4">

                                {
                                    item.to.profileImage ?

                                        <img
                                            src={item.to.profileImage}
                                            alt=""
                                            className="w-14 h-14 rounded-full object-cover border-2 border-green-300"
                                        />

                                        :

                                        <div className="w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center text-xl font-bold">

                                            {item.to.name.charAt(0)}

                                        </div>
                                }

                                <div>

                                    <h3 className="font-bold text-lg">

                                        {item.to.name}

                                    </h3>

                                    <p className="text-green-600 text-sm">

                                        Gets Money

                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* Divider */}

                        <div className="border-t my-6"></div>

                        {/* Bottom */}

                        <div className="flex justify-between items-center">

                            <div>

                                <p className="text-gray-500">

                                    Amount to Settle

                                </p>

                                <h2 className="text-3xl font-bold text-red-500">

                                    ₹{item.amount.toFixed(2)}

                                </h2>

                            </div>

                            <button
                                onClick={() => openSettlementModal(item)}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition duration-300 shadow"
                            >

                                💸 Settle Up

                            </button>

                        </div>

                    </div>

                ))
            }

        </div>

        :

        <div className="bg-green-50 rounded-2xl p-10 text-center">

            <div className="text-6xl mb-4">

                🎉

            </div>

            <h2 className="text-2xl font-bold text-green-700">

                Everyone is Settled!

            </h2>

            <p className="text-gray-500 mt-2">

                There are no pending settlements in this group.

            </p>

        </div>

    }

</div>


<div className="bg-white rounded-3xl shadow-lg p-8 mt-10">

    {/* Heading */}

    <div className="flex justify-between items-center mb-8">

        <div>

            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">

                📜 Settlement History

            </h2>

            <p className="text-gray-500 mt-2">

                View all completed settlements in this group.

            </p>

        </div>

        <div className="bg-green-100 text-green-700 px-5 py-2 rounded-full font-semibold">

            {settlementHistory.length} Completed

        </div>

    </div>

    {

        settlementHistory.length === 0 ?

        <div className="bg-gray-50 rounded-2xl p-10 text-center">

            <div className="text-6xl mb-4">

                📭

            </div>

            <h3 className="text-2xl font-bold text-gray-700">

                No Settlements Yet

            </h3>

            <p className="text-gray-500 mt-2">

                Completed settlements will appear here.

            </p>

        </div>

        :

        <div className="space-y-5">

            {

                settlementHistory.map((item) => (

                    <div
                        key={item._id}
                        className="bg-gray-50 rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
                    >

                        <div className="flex justify-between items-center">

                            {/* Left */}

                            <div className="flex items-center gap-6">

                                {/* From */}

                                <div className="flex items-center gap-3">

                                    {

                                        item.from.profileImage ?

                                        <img
                                            src={item.from.profileImage}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-red-300"
                                        />

                                        :

                                        <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">

                                            {item.from.name.charAt(0)}

                                        </div>

                                    }

                                    <div>

                                        <h3 className="font-semibold">

                                            {item.from.name}

                                        </h3>

                                        <p className="text-red-500 text-sm">

                                            Paid

                                        </p>

                                    </div>

                                </div>

                                {/* Arrow */}

                                <div className="text-2xl text-gray-400">

                                    →

                                </div>

                                {/* To */}

                                <div className="flex items-center gap-3">

                                    {

                                        item.to.profileImage ?

                                        <img
                                            src={item.to.profileImage}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-green-300"
                                        />

                                        :

                                        <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">

                                            {item.to.name.charAt(0)}

                                        </div>

                                    }

                                    <div>

                                        <h3 className="font-semibold">

                                            {item.to.name}

                                        </h3>

                                        <p className="text-green-600 text-sm">

                                            Received

                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* Right */}

                            <div className="text-right">

                                <h2 className="text-2xl font-bold text-green-600">

                                    ₹{item.amount.toFixed(2)}

                                </h2>

                                <p className="text-sm text-gray-500 mt-1">

                                    {new Date(item.createdAt).toLocaleDateString()} <br />
                                    {new Date(item.createdAt).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>

                            </div>

                        </div>

                    </div>

                ))

            }

        </div>

    }

</div>

            </div>

         

            {showModal && (

    <AddGroupExpenseModal

        group={group}

        closeModal={() => setShowModal(false)}

        refreshExpenses={fetchExpenses}
         refreshBalances={fetchBalances}

    />

)}

{
showSettlementModal && (

<SettlementModal

    settlement={selectedSettlement}

    groupId={id}

    closeModal={() => setShowSettlementModal(false)}

    refreshBalances={fetchBalances}

    refreshHistory={fetchSettlementHistory}

/>

)
}

{
    isEditOpen && (

        <EditGroupExpense

            expense={editingExpense}
             members={group.members}
            onClose={closeEditModal}

            fetchExpenses={fetchExpenses}

            fetchBalances={fetchBalances}

        />

    )
}

        </DashboardLayout>

    );

};

export default GroupDetails;