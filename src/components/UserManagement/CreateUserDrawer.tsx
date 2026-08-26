import React, { useState } from "react";
import {
    X,
    User,
    AtSign,
    Mail,
    Phone,
    Lock,
    Eye,
    EyeOff,
    ShieldCheck,
    Store,
    Search,
    Check,
    Info,
    Loader2,
    Plus,
} from "lucide-react";
import toast from "react-hot-toast";
import FadeUp from "../FadeUp";

// User Type definition
export interface UserType {
    id: string;
    fullName: string;
    username: string;
    email: string;
    phone: string;
    systemRole: string;
    assignedBranch: string;
    status: "Active" | "Draft";
    createdAt: string;
}

interface CreateUserDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    // Static array modifier callback
    onAddUser: (newUser: UserType) => void;
}

const BRANCHES = [
    "NY Hub 001",
    "MPL Shop 1316",
    "LA Distribution 99",
    "OUL Express 12",
];

const CreateUserDrawer: React.FC<CreateUserDrawerProps> = ({
    isOpen,
    onClose,
    onAddUser,
}) => {
    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        systemRole: "Store Manager",
        assignedBranch: "MPL Shop 1316",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [branchSearch, setBranchSearch] = useState("");

    // Loading States
    const [isSavingDraft, setIsSavingDraft] = useState(false);
    const [isCreatingUser, setIsCreatingUser] = useState(false);

    if (!isOpen) return null;

    const isSubmitting = isSavingDraft || isCreatingUser;

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> ) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Validation Check Function
    const validateForm = () => {
        if (!formData.fullName.trim()) {
            toast.error("Full Name is required!");
            return false;
        }
        if (!formData.username.trim()) {
            toast.error("Username is required!");
            return false;
        }
        if (!formData.email.trim()) {
            toast.error("Email Address is required!");
            return false;
        }
        if (!formData.phone.trim()) {
            toast.error("Phone Number is required!");
            return false;
        }
        if (!formData.password) {
            toast.error("Password is required!");
            return false;
        }
        if (!formData.confirmPassword) {
            toast.error("Confirm Password is required!");
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            return false;
        }
        if (!formData.assignedBranch) {
            toast.error("Please select an assigned branch!");
            return false;
        }
        return true;
    };

    const handleSaveAction = async (actionType: "draft" | "create") => {

        if (!validateForm()) return;

        if (actionType === "draft") {
            setIsSavingDraft(true);
        } else {
            setIsCreatingUser(true);
        }

        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Create user object
            const newUserObj: UserType = {
                id: Date.now().toString(),
                fullName: formData.fullName.trim(),
                username: formData.username.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                systemRole: formData.systemRole,
                assignedBranch: formData.assignedBranch,
                status: actionType === "draft" ? "Draft" : "Active",
                createdAt: new Date().toLocaleDateString(),
            };


            onAddUser(newUserObj);

            // Toast
            if (actionType === "draft") {
                toast.success("User draft saved successfully!");
            } else {
                toast.success("User created successfully!");
            }

            // Reset form
            setFormData({
                fullName: "",
                username: "",
                email: "",
                phone: "",
                password: "",
                confirmPassword: "",
                systemRole: "Store Manager",
                assignedBranch: "MPL Shop 1316",
            });

            onClose();
        } catch (error) {
            console.error("Error creating static user", error);
            toast.error("Something went wrong!");
        } finally {
            setIsSavingDraft(false);
            setIsCreatingUser(false);
        }
    };

    const filteredBranches = BRANCHES.filter((b) =>
        b.toLowerCase().includes(branchSearch.toLowerCase())
    );

    return (
        <FadeUp className="fixed inset-0 z-50 overflow-hidden">
            {/* Background Overlay */}
            <div
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
                onClick={!isSubmitting ? onClose : undefined}
            />

            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
                <div className="w-screen max-w-xl bg-slate-50 text-slate-800 shadow-2xl flex flex-col justify-between transform transition-transform duration-300">

                    {/* Header */}
                    <div className="flex items-start justify-between bg-white border-b border-gray-200 px-6 py-5">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Create New User</h2>
                            <p className="mt-1 text-xs text-slate-500 font-medium">
                                Create a global user account and assign access to one branch.
                            </p>
                        </div>
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={onClose}
                            className="rounded-md p-1 text-slate-400 hover:text-slate-600 disabled:opacity-50 transition-colors cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Form Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-5">

                        {/* 1. Basic Info Section */}
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                            <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm mb-4">
                                <User size={18} className="text-blue-600" />
                                Basic Info
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Full Name <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                        <input
                                            type="text"
                                            name="fullName"
                                            disabled={isSubmitting}
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            placeholder="Jane Doe"
                                            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-xs font-semibold text-slate-700">
                                            Username <span className="text-rose-500">*</span>
                                        </label>
                                        <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5">
                                            <Check size={10} /> Available
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <AtSign className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                        <input
                                            type="text"
                                            name="username"
                                            disabled={isSubmitting}
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            placeholder="janedoe"
                                            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Email Address <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                        <input
                                            type="email"
                                            name="email"
                                            disabled={isSubmitting}
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="jane@techbasket.com"
                                            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Phone Number <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                        <input
                                            type="text"
                                            name="phone"
                                            disabled={isSubmitting}
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Security Section */}
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                            <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm mb-4">
                                <Lock size={18} className="text-blue-600" />
                                Security
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Password <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            disabled={isSubmitting}
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="••••••••"
                                            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-9 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Confirm Password <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            disabled={isSubmitting}
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            placeholder="••••••••"
                                            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-9 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                                        >
                                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3">
                                <div className="grid grid-cols-4 gap-1.5 h-1">
                                    <div className="bg-rose-500 rounded-full h-full"></div>
                                    <div className="bg-amber-800 rounded-full h-full"></div>
                                    <div className="bg-slate-200 rounded-full h-full"></div>
                                    <div className="bg-slate-200 rounded-full h-full"></div>
                                </div>
                                <span className="text-[10px] text-slate-400 block text-right mt-1">Fair</span>
                            </div>
                        </div>

                        {/* 3. Role & Branch */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm mb-3">
                                        <ShieldCheck size={18} className="text-blue-600" />
                                        Access Role
                                    </div>

                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        System Role
                                    </label>
                                    <select
                                        name="systemRole"
                                        disabled={isSubmitting}
                                        value={formData.systemRole}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                                    >
                                        <option value="Store Manager">Store Manager</option>
                                        <option value="System Admin">System Admin</option>
                                        <option value="Inventory Staff">Inventory Staff</option>
                                    </select>
                                </div>

                                <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-600 flex gap-2">
                                    <Info size={16} className="text-slate-400 shrink-0 mt-0.5" />
                                    <span>
                                        Store Managers have full read/write access to assigned branch inventory, staff scheduling, and local RMA processing.
                                    </span>
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                                <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm mb-3">
                                    <Store size={18} className="text-blue-600" />
                                    Assigned Branch
                                </div>

                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Primary Location
                                </label>

                                <div className="relative mb-2">
                                    <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                                    <input
                                        type="text"
                                        placeholder="Search branches..."
                                        value={branchSearch}
                                        disabled={isSubmitting}
                                        onChange={(e) => setBranchSearch(e.target.value)}
                                        className="w-full rounded border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div className="rounded border border-slate-100 overflow-hidden divide-y divide-slate-100">
                                    {filteredBranches.map((branch) => {
                                        const isSelected = formData.assignedBranch === branch;
                                        return (
                                            <button
                                                key={branch}
                                                type="button"
                                                disabled={isSubmitting}
                                                onClick={() => setFormData((p) => ({ ...p, assignedBranch: branch }))}
                                                className={`w-full text-left px-3 py-2 text-xs flex justify-between items-center transition-colors cursor-pointer ${isSelected
                                                    ? "bg-blue-50 text-blue-700 font-medium"
                                                    : "hover:bg-slate-50 text-slate-700"
                                                    }`}
                                            >
                                                {branch}
                                                {isSelected && <Check size={14} className="text-blue-600" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Footer Buttons with Loading Spinners */}
                    <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 bg-white">
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={onClose}
                            className="text-xs font-semibold text-slate-600 hover:text-slate-800 disabled:opacity-50 cursor-pointer"
                        >
                            Cancel
                        </button>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => handleSaveAction("draft")}
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 active:scale-[0.98] disabled:opacity-60 cursor-pointer min-w-[120px]"
                            >
                                {isSavingDraft ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin text-slate-600" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    "Save as Draft"
                                )}
                            </button>

                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => handleSaveAction("create")}
                                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-blue-800 active:scale-[0.98] disabled:opacity-60 cursor-pointer min-w-[130px]"
                            >
                                {isCreatingUser ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin text-white" />
                                        <span>Creating...</span>
                                    </>
                                ) : (
                                    <>
                                        Create User <Plus size={14} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </FadeUp>
    );
};

export default CreateUserDrawer;