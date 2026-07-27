import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaEdit,
    FaTrash,
    FaPlus,
} from "react-icons/fa";

import {
    Search,
    Wallet,
    Receipt,
    TrendingUp,
    Layers3,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

const categoryColors = {
    Food: "bg-green-100 text-green-700",
    Travel: "bg-blue-100 text-blue-700",
    Shopping: "bg-purple-100 text-purple-700",
    Bills: "bg-yellow-100 text-yellow-700",
    Health: "bg-red-100 text-red-700",
    Entertainment: "bg-pink-100 text-pink-700",
    Education: "bg-indigo-100 text-indigo-700",
    Other: "bg-gray-100 text-gray-700",
};

const Expenses = () => {

    const navigate = useNavigate();

    const [expenses, setExpenses] = useState([]);

    const [search, setSearch] = useState("");

    const [category, setCategory] = useState("All");

    const [loading, setLoading] = useState(true);

    // ================= Fetch =================

    const fetchExpenses = async () => {

        try {

            const response = await api.get("/expenses");

            setExpenses(response.data.expenses);

        } catch (error) {

            console.log(error.response?.data);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchExpenses();

    }, []);

    // ================= Delete =================

    const deleteExpense = async (id) => {

        const confirmDelete = window.confirm(
            "Delete this expense?"
        );

        if (!confirmDelete) return;

        try {

            await api.delete(`/expenses/${id}`);

            fetchExpenses();

        } catch (error) {

            console.log(error.response?.data);

        }

    };

    // ================= Search =================

    const filteredExpenses = expenses.filter((expense) => {

        const matchedSearch = expense.title
            ?.toLowerCase()
            .includes(search.toLowerCase());

        const matchedCategory =
            category === "All" ||
            expense.category === category;

        return matchedSearch && matchedCategory;

    });

    // ================= Summary =================

    const stats = useMemo(() => {

        const totalSpent = expenses.reduce(
            (sum, expense) => sum + expense.amount,
            0
        );

        const highestExpense =
            expenses.length > 0
                ? Math.max(...expenses.map(e => e.amount))
                : 0;

        const categories =
            new Set(expenses.map(e => e.category)).size;

        return {

            totalSpent,

            totalExpenses: expenses.length,

            highestExpense,

            categories,

        };

    }, [expenses]);

    return (

        <DashboardLayout>

            <div className="space-y-8">

                {/* Hero */}

                <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 p-8 shadow-xl text-white">

                    <h1 className="text-3xl sm:text-4xl font-bold">

                        My Expenses

                    </h1>

                    <p className="mt-2 text-green-100">

                        Track, manage and analyze every expense with ease.

                    </p>

                </div>

                {/* Summary */}

                <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">

                    <div className="bg-white rounded-3xl shadow p-6">

                        <Wallet className="text-green-600"/>

                        <p className="text-sm text-gray-500 mt-3">

                            Total Spent

                        </p>

                        <h2 className="text-2xl font-bold mt-2">

                            ₹{stats.totalSpent}

                        </h2>

                    </div>

                    <div className="bg-white rounded-3xl shadow p-6">

                        <Receipt className="text-blue-600"/>

                        <p className="text-sm text-gray-500 mt-3">

                            Expenses

                        </p>

                        <h2 className="text-2xl font-bold mt-2">

                            {stats.totalExpenses}

                        </h2>

                    </div>

                    <div className="bg-white rounded-3xl shadow p-6">

                        <TrendingUp className="text-red-600"/>

                        <p className="text-sm text-gray-500 mt-3">

                            Highest Expense

                        </p>

                        <h2 className="text-2xl font-bold mt-2">

                            ₹{stats.highestExpense}

                        </h2>

                    </div>

                    <div className="bg-white rounded-3xl shadow p-6">

                        <Layers3 className="text-purple-600"/>

                        <p className="text-sm text-gray-500 mt-3">

                            Categories

                        </p>

                        <h2 className="text-2xl font-bold mt-2">

                            {stats.categories}

                        </h2>

                    </div>

                </div>

                {/* Search */}

                <div className="bg-white rounded-3xl shadow-lg p-6">

                    <div className="flex flex-col lg:flex-row gap-4">

                        <div className="relative flex-1">

                            <Search
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search expenses..."
                                className="
                                w-full
                                pl-11
                                pr-4
                                py-3
                                rounded-2xl
                                border
                                border-slate-200
                                bg-slate-50
                                outline-none
                                focus:ring-2
                                focus:ring-green-500
                                "
                            />

                        </div>

                        <select
                            value={category}
                            onChange={(e) =>
                                setCategory(e.target.value)
                            }
                            className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-slate-50
                            px-4
                            py-3
                            outline-none
                            focus:ring-2
                            focus:ring-green-500
                            "
                        >

                            <option value="All">
                                All Categories
                            </option>

                            <option>Food</option>
                            <option>Travel</option>
                            <option>Shopping</option>
                            <option>Bills</option>
                            <option>Health</option>
                            <option>Entertainment</option>
                            <option>Education</option>
                            <option>Other</option>

                        </select>

                        <button
                            onClick={() =>
                                navigate("/add-expense")
                            }
                            className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            rounded-2xl
                            bg-gradient-to-r
                            from-green-600
                            to-emerald-600
                            px-6
                            py-3
                            text-white
                            font-semibold
                            hover:shadow-xl
                            hover:scale-105
                            transition-all
                            "
                        >

                            <FaPlus />

                            Add Expense

                        </button>

                    </div>

                </div>
                                {/* ================= Loading ================= */}

                {loading ? (

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                        {[...Array(6)].map((_, index) => (

                            <div
                                key={index}
                                className="bg-white rounded-3xl p-6 shadow animate-pulse"
                            >

                                <div className="h-6 w-1/2 bg-gray-200 rounded mb-5"></div>

                                <div className="h-4 w-1/3 bg-gray-200 rounded mb-4"></div>

                                <div className="h-5 w-24 bg-gray-200 rounded mb-4"></div>

                                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>

                            </div>

                        ))}

                    </div>

                ) : filteredExpenses.length === 0 ? (

                    /* ================= Empty State ================= */

                    <div className="bg-white rounded-3xl shadow-lg py-20 px-8 text-center">

                        <div className="text-7xl">

                            💸

                        </div>

                        <h2 className="text-3xl font-bold mt-6">

                            No Expenses Found

                        </h2>

                        <p className="text-gray-500 mt-3">

                            Start tracking your expenses to gain better financial insights.

                        </p>

                        <button
                            onClick={() => navigate("/add-expense")}
                            className="
                                mt-8
                                px-8
                                py-4
                                rounded-2xl
                                bg-gradient-to-r
                                from-green-600
                                to-emerald-600
                                text-white
                                font-semibold
                                hover:shadow-xl
                                transition-all
                            "
                        >

                            <FaPlus />

                            <span className="ml-2">

                                Add Your First Expense

                            </span>

                        </button>

                    </div>

                ) : (

                    <>

                        {/* ================= Mobile Cards ================= */}

                        <div className="grid gap-5 lg:hidden">

                            {filteredExpenses.map((expense) => (

                                <div
                                    key={expense._id}
                                    className="
                                        bg-white
                                        rounded-3xl
                                        shadow-lg
                                        p-6
                                        hover:shadow-xl
                                        transition-all
                                    "
                                >

                                    <div className="flex justify-between items-start">

                                        <div>

                                            <h3 className="text-xl font-bold text-slate-800">

                                                {expense.title}

                                            </h3>

                                            <span
                                                className={`
                                                inline-block
                                                mt-3
                                                px-4
                                                py-2
                                                rounded-xl
                                                text-sm
                                                font-semibold
                                                ${categoryColors[expense.category]}
                                            `}
                                            >

                                                {expense.category}

                                            </span>

                                        </div>

                                        <h2 className="text-2xl font-bold text-green-600">

                                            ₹{expense.amount}

                                        </h2>

                                    </div>

                                    <div className="mt-5 flex justify-between items-center">

                                        <p className="text-sm text-gray-500">

                                            {new Date(expense.date).toLocaleDateString()}

                                        </p>

                                        <div className="flex gap-3">

                                            <button
                                                onClick={() =>
                                                    navigate(`/edit-expense/${expense._id}`)
                                                }
                                                className="
                                                    w-11
                                                    h-11
                                                    rounded-xl
                                                    bg-blue-100
                                                    text-blue-600
                                                    hover:bg-blue-600
                                                    hover:text-white
                                                    transition-all
                                                "
                                            >

                                                <FaEdit className="mx-auto" />

                                            </button>

                                            <button
                                                onClick={() =>
                                                    deleteExpense(expense._id)
                                                }
                                                className="
                                                    w-11
                                                    h-11
                                                    rounded-xl
                                                    bg-red-100
                                                    text-red-600
                                                    hover:bg-red-600
                                                    hover:text-white
                                                    transition-all
                                                "
                                            >

                                                <FaTrash className="mx-auto" />

                                            </button>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                        {/* ================= Desktop Table Starts Here ================= */}

                        <div className="hidden lg:block bg-white rounded-3xl shadow-lg overflow-hidden">
                            <table className="w-full">

    <thead className="bg-slate-100">

        <tr className="text-slate-700">

            <th className="text-left px-6 py-5 font-semibold">
                Title
            </th>

            <th className="text-left px-6 py-5 font-semibold">
                Category
            </th>

            <th className="text-left px-6 py-5 font-semibold">
                Amount
            </th>

            <th className="text-left px-6 py-5 font-semibold">
                Date
            </th>

            <th className="text-center px-6 py-5 font-semibold">
                Actions
            </th>

        </tr>

    </thead>

    <tbody>

        {filteredExpenses.map((expense) => (

            <tr
                key={expense._id}
                className="border-t border-slate-100 hover:bg-green-50 transition-all"
            >

                {/* Title */}

                <td className="px-6 py-5">

                    <div>

                        <h3 className="font-semibold text-slate-800">

                            {expense.title}

                        </h3>

                    </div>

                </td>

                {/* Category */}

                <td className="px-6 py-5">

                    <span
                        className={`
                        px-4
                        py-2
                        rounded-xl
                        text-sm
                        font-semibold
                        ${categoryColors[expense.category]}
                    `}
                    >

                        {expense.category}

                    </span>

                </td>

                {/* Amount */}

                <td className="px-6 py-5">

                    <span className="text-lg font-bold text-green-600">

                        ₹{expense.amount}

                    </span>

                </td>

                {/* Date */}

                <td className="px-6 py-5 text-slate-600">

                    {new Date(expense.date).toLocaleDateString()}

                </td>

                {/* Actions */}

                <td className="px-6 py-5">

                    <div className="flex justify-center gap-3">

                        <button
                            onClick={() =>
                                navigate(`/edit-expense/${expense._id}`)
                            }
                            className="
                                w-11
                                h-11
                                rounded-xl
                                bg-blue-100
                                text-blue-600
                                hover:bg-blue-600
                                hover:text-white
                                transition-all
                            "
                        >

                            <FaEdit className="mx-auto" />

                        </button>

                        <button
                            onClick={() =>
                                deleteExpense(expense._id)
                            }
                            className="
                                w-11
                                h-11
                                rounded-xl
                                bg-red-100
                                text-red-600
                                hover:bg-red-600
                                hover:text-white
                                transition-all
                            "
                        >

                            <FaTrash className="mx-auto" />

                        </button>

                    </div>

                </td>

            </tr>

        ))}

    </tbody>

</table>
                        </div>

                    </>

                )}

            </div>

        </DashboardLayout>

    );

};

export default Expenses;