import { useEffect, useState } from "react";
import {
    Camera,
    Calendar,
    Users,
    Wallet,
    Bot,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

const Profile = () => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        profileImage: "",
    });

    const [joinedDate, setJoinedDate] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);

    // Temporary Stats
    const [stats, setStats] = useState({
        groups: 0,
        expenses: 0,
        chats: 0,
    });

    // ================= Fetch Profile =================

    const fetchProfile = async () => {

        try {

            const response = await api.get("/auth/profile");

            setFormData({
                name: response.data.user.name,
                email: response.data.user.email,
                profileImage: response.data.user.profileImage || "",
            });

            setJoinedDate(
                new Date(response.data.user.createdAt).toLocaleDateString()
            );

        } catch (error) {

            console.log(error.response?.data || error.message);

        }

    };
    const fetchProfileStats = async () => {

    try {

        const response = await api.get("/auth/profile-stats");

        setStats({
            groups: response.data.totalGroups,
            expenses: response.data.totalExpenses,
            chats: response.data.totalChats
        });

    } catch (error) {

        console.log(error);

    }

};

    useEffect(() => {

        fetchProfile();
        fetchProfileStats();

    }, []);

    // ================= Form Change =================

    const handleChange = (e) => {

        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));

    };

    // ================= Save Profile =================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await api.put("/auth/profile", formData);

            alert(response.data.message);

            fetchProfile();

        } catch (error) {

            alert(error.response?.data?.message || "Something went wrong");

        }

    };

    // ================= Upload Image =================

    const uploadImage = async () => {

        if (!selectedImage) {

            alert("Please select an image.");

            return;

        }

        try {

            const imageData = new FormData();

            imageData.append("profileImage", selectedImage);

            const response = await api.put(
                "/auth/upload-profile",
                imageData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            alert(response.data.message);

            fetchProfile();

            setSelectedImage(null);

        } catch (error) {

            alert(error.response?.data?.message || "Upload Failed");

        }

    };

    return (

        <DashboardLayout>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* ================= Hero ================= */}

                <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-8 text-white shadow-xl">

                    <h1 className="text-3xl sm:text-4xl font-bold">

                        My Profile

                    </h1>

                    <p className="text-indigo-100 mt-2">

                        Manage your account information and personalize your SpendWise AI experience.

                    </p>

                </div>

                {/* ================= Main Grid ================= */}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">

                    {/* ================= Left Card ================= */}

                    <div className="bg-white rounded-3xl shadow-lg p-8">

                        <div className="flex flex-col items-center">

                            <div className="relative">

                                <img
                                    src={
                                        formData.profileImage
                                            ? formData.profileImage
                                            : `https://ui-avatars.com/api/?name=${formData.name}&background=4f46e5&color=fff&size=256`
                                    }
                                    alt="Profile"
                                    className="w-40 h-40 rounded-full object-cover border-4 border-indigo-500 shadow-lg"
                                />

                                <label
                                    className="
                                        absolute
                                        bottom-2
                                        right-2
                                        w-11
                                        h-11
                                        rounded-full
                                        bg-indigo-600
                                        text-white
                                        flex
                                        items-center
                                        justify-center
                                        cursor-pointer
                                        shadow-lg
                                        hover:bg-indigo-700
                                        transition
                                    "
                                >
                                    <Camera size={18} />

                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) =>
                                            setSelectedImage(e.target.files[0])
                                        }
                                    />

                                </label>

                            </div>

                            <h2 className="text-2xl font-bold mt-6">

                                {formData.name}

                            </h2>

                            <p className="text-gray-500 mt-1">

                                {formData.email}

                            </p>

                            <div className="flex items-center gap-2 mt-4 text-gray-500">

                                <Calendar size={18} />

                                <span>

                                    Joined {joinedDate}

                                </span>

                            </div>

                            <button
                                onClick={uploadImage}
                                className="
                                    mt-6
                                    w-full
                                    py-3
                                    rounded-2xl
                                    bg-gradient-to-r
                                    from-indigo-600
                                    to-purple-600
                                    text-white
                                    font-semibold
                                    hover:shadow-xl
                                    transition-all
                                "
                            >
                                Upload New Photo
                            </button>

                        </div>

                    </div>

                    {/* ================= Right Section ================= */}

                    <div className="lg:col-span-2 space-y-8">

                        {/* ================= Stats ================= */}

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">

                            <div className="bg-white rounded-2xl shadow p-6">

                                <Calendar className="text-indigo-600" />

                                <p className="text-gray-500 mt-3 text-sm">

                                    Member Since

                                </p>

                                <h3 className="font-bold mt-1">

                                    {joinedDate}

                                </h3>

                            </div>

                            <div className="bg-white rounded-2xl shadow p-6">

                                <Users className="text-green-600" />

                                <p className="text-gray-500 mt-3 text-sm">

                                    Groups

                                </p>

                                <h3 className="font-bold mt-1">

                                    {stats.groups}

                                </h3>

                            </div>

                            <div className="bg-white rounded-2xl shadow p-6">

                                <Wallet className="text-purple-600" />

                                <p className="text-gray-500 mt-3 text-sm">

                                    Expenses

                                </p>

                                <h3 className="font-bold mt-1">

                                    {stats.expenses}

                                </h3>

                            </div>

                            <div className="bg-white rounded-2xl shadow p-6">

                                <Bot className="text-pink-600" />

                                <p className="text-gray-500 mt-3 text-sm">

                                    AI Chats

                                </p>

                                <h3 className="font-bold mt-1">

                                    {stats.chats}

                                </h3>

                            </div>

                        </div>

                        {/* PART 2 STARTS HERE */}
                                                {/* ================= Personal Information ================= */}

                        <div className="bg-white rounded-3xl shadow-lg p-8">

                            <h2 className="text-2xl font-bold text-slate-800 mb-2">
                                Personal Information
                            </h2>

                            <p className="text-slate-500 mb-8">
                                Update your personal details to keep your account information accurate.
                            </p>

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-6"
                            >

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* Name */}

                                    <div>

                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Full Name
                                        </label>

                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your name"
                                            className="
                                                w-full
                                                rounded-2xl
                                                border
                                                border-slate-200
                                                bg-slate-50
                                                px-4
                                                py-3
                                                outline-none
                                                focus:border-indigo-500
                                                focus:ring-4
                                                focus:ring-indigo-100
                                                transition
                                            "
                                        />

                                    </div>

                                    {/* Email */}

                                    <div>

                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Email Address
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                            className="
                                                w-full
                                                rounded-2xl
                                                border
                                                border-slate-200
                                                bg-slate-50
                                                px-4
                                                py-3
                                                outline-none
                                                focus:border-indigo-500
                                                focus:ring-4
                                                focus:ring-indigo-100
                                                transition
                                            "
                                        />

                                    </div>

                                </div>

                                {/* Divider */}

                                <div className="border-t border-slate-200 pt-6">

                                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">

                                        <div>

                                            <h3 className="font-semibold text-slate-800">
                                                Save Changes
                                            </h3>

                                            <p className="text-sm text-slate-500 mt-1">
                                                Your profile information will be updated immediately.
                                            </p>

                                        </div>

                                        <button
                                            type="submit"
                                            className="
                                                w-full
                                                sm:w-auto
                                                px-8
                                                py-3
                                                rounded-2xl
                                                bg-gradient-to-r
                                                from-indigo-600
                                                to-purple-600
                                                text-white
                                                font-semibold
                                                shadow-lg
                                                hover:shadow-2xl
                                                hover:scale-105
                                                active:scale-95
                                                transition-all
                                                duration-300
                                            "
                                        >
                                            Save Changes
                                        </button>

                                    </div>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </DashboardLayout>

    );

};

export default Profile;