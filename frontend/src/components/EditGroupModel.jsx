import { useState } from "react";
import { X } from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

const EditGroupModal = ({
    group,
    closeModal,
    refreshGroup,
}) => {

    const [formData, setFormData] = useState({
        name: group.name,
        description: group.description || "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            await api.put(
                `/groups/${group._id}`,
                formData
            );

            toast.success("Group updated successfully.");

            await refreshGroup();

            closeModal();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to update group."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div
            className="
                fixed inset-0
                bg-black/50
                flex items-center justify-center
                z-50
            "
        >

            <div
                className="
                    bg-white
                    rounded-2xl
                    shadow-xl
                    w-full
                    max-w-lg
                    p-6
                "
            >

                <div className="flex items-center justify-between mb-6">

                    <h2 className="text-2xl font-bold">
                        Edit Group
                    </h2>

                    <button
                        onClick={closeModal}
                        className="hover:text-red-500"
                    >
                        <X size={22} />
                    </button>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <div>

                        <label className="block mb-2 font-medium">
                            Group Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="
                                w-full
                                border
                                rounded-lg
                                px-4
                                py-3
                                focus:ring-2
                                focus:ring-indigo-500
                                outline-none
                            "
                            required
                        />

                    </div>

                    <div>

                        <label className="block mb-2 font-medium">
                            Description
                        </label>

                        <textarea
                            rows={4}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="
                                w-full
                                border
                                rounded-lg
                                px-4
                                py-3
                                focus:ring-2
                                focus:ring-indigo-500
                                outline-none
                            "
                        />

                    </div>

                    <div className="flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={closeModal}
                            className="
                                px-5
                                py-2
                                rounded-lg
                                border
                                hover:bg-gray-100
                            "
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                px-5
                                py-2
                                rounded-lg
                                bg-indigo-600
                                text-white
                                hover:bg-indigo-700
                                disabled:opacity-50
                            "
                        >
                            {loading
                                ? "Updating..."
                                : "Update Group"}
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

};

export default EditGroupModal;