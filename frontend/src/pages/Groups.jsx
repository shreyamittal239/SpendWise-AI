import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

const Groups = () => {

    const navigate = useNavigate();

    const [groups, setGroups] = useState([]);

    const [groupName, setGroupName] = useState("");

    const [description, setDescription] = useState("");

    const fetchGroups = async () => {

        try {

            const response = await api.get("/groups");

            setGroups(response.data.groups);

        } catch (error) {

            console.log(error.response?.data);

        }

    };

    const createGroup = async () => {

        if (!groupName) return;

        try {

            await api.post("/groups", {
                name: groupName,
                description,
            });

            setGroupName("");
            setDescription("");

            fetchGroups();

        } catch (error) {

            console.log(error.response?.data);

        }

    };

    useEffect(() => {

        fetchGroups();

    }, []);

    return (

        <DashboardLayout>
         
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">

    <div>

        <h1 className="text-4xl font-bold text-gray-800">

            👥 My Groups

        </h1>

        <p className="text-gray-500 mt-2">

            Manage all your shared expense groups in one place.

        </p>

    </div>
            

                </div>

                <div className="bg-white rounded-3xl shadow-xl p-8 mb-10 border border-gray-100">

    <div className="flex items-center gap-3 mb-6">

        <div className="bg-indigo-100 p-3 rounded-2xl">

            👥

        </div>

        <div>

            <h2 className="text-3xl font-bold text-gray-800">

                Create New Group

            </h2>

            <p className="text-gray-500">

                Create a group to start splitting expenses with friends.

            </p>

        </div>

    </div>

    {/* Group Name */}

    <div className="mb-5">

        <label className="block text-gray-700 font-semibold mb-2">

            Group Name

        </label>

        <input
            type="text"
            placeholder="e.g. Goa Trip"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
        />

    </div>

    {/* Description */}

    <div className="mb-6">

        <label className="block text-gray-700 font-semibold mb-2">

            Description

        </label>

        <textarea
            rows={4}
            placeholder="Describe your group..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-4 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
        />

    </div>

    {/* Button */}

    <div className="flex justify-end">

        <button
            onClick={createGroup}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105"
        >

            ➕ Create Group

        </button>

    </div>

</div>


                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

{groups.map(group=>(

<div
key={group._id}
className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 hover:-translate-y-1"
>

<div className="flex justify-between">

<div>

<h2 className="text-2xl font-bold">

🏖 {group.name}

</h2>

<p className="text-gray-500 mt-2">

{group.description}

</p>



</div>

<div>

<span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm">

Group

</span>

</div>

</div>

<div className="border-t my-6"></div>

<div className="space-y-3">

<div className="flex justify-between">

<span className="text-gray-500">

👥 Members

</span>

<span className="font-bold">

{group.members.length}

</span>

</div>

<div className="flex justify-between">

<span className="text-gray-500">

📅 Created

</span>

<span>

{new Date(group.createdAt).toLocaleDateString()}

</span>

</div>

</div>

<button

onClick={()=>navigate(`/groups/${group._id}`)}

className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"

>

View Group →

</button>

</div>

))}

</div>

                   

            

        </DashboardLayout>

    );

};

export default Groups;