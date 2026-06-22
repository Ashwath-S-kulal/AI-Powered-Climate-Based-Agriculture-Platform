import React, { useState } from "react";
import Header from "../Components/Header";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUserStart, updateUserSuccess, updateUserFailure,
  deleteUserStart, deleteUserSuccess, deleteUserFailure, signOut,
} from "../redux/user/userSlice";
import { NavLink } from "react-router-dom";
import { ShieldCheck, User, Mail, Lock, LogOut, Trash2, Edit3, CheckCircle2, AlertCircle } from "lucide-react";

export default function ProfilePage() {
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {

    console.log(currentUser._id)
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`${import.meta.env.VITE_BASE_URI}/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`${import.meta.env.VITE_BASE_URI}/api/user/delete/${currentUser._id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success === false) { dispatch(deleteUserFailure(data)); return; }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch(`${import.meta.env.VITE_BASE_URI}/api/auth/signout`);
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  };
return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#09090b]">
      <Header />
      <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12">

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Manage your profile and preferences</p>
          </div>
          <div className="flex items-center gap-2">
            {currentUser?.isAdmin && (
              <NavLink to="/profile/adminpanel">
                <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-400 rounded-lg text-sm font-semibold hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors">
                  <ShieldCheck size={15} /> <span className="hidden md:inline">Admin</span>Panel
                </button>
              </NavLink>
            )}
            <button
              onClick={handleSignOut}
              className="hidden md:inline inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
            >
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
              <div className="h-20 bg-gradient-to-r from-emerald-500 to-teal-500" />
              <div className="px-6 pb-6 -mt-10">
                <div className="relative inline-block">
                  <img
                    src={currentUser.profilePicture}
                    alt="Profile"
                    className="w-28 h-28 rounded-xl object-cover border-4 border-white dark:border-zinc-900 shadow-sm"
                  />
                </div>
                <div className="mt-3">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">{currentUser.username}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{currentUser.email}</p>
                  {currentUser?.isAdmin && (
                    <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-400 rounded-full text-xs font-medium">
                      <ShieldCheck size={10} /> Administrator
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed mt-4">
                  Keep your details up to date for a personalized experience on the platform.
                </p>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button
                    onClick={handleSignOut}
                    className="flex flex-col items-center justify-center gap-1 p-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors group text-center"
                  >
                    <LogOut size={16} className="text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200">Logout</span>
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex flex-col items-center justify-center gap-1 p-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900/50 transition-colors group text-center"
                  >
                    <Trash2 size={16} className="text-gray-400 dark:text-gray-500 group-hover:text-red-500" />
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                  <Edit3 size={16} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">Personal Information</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Update your account details</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Username</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-zinc-500" />
                      <input
                        id="username"
                        defaultValue={currentUser.username}
                        onChange={handleChange}
                        placeholder="Username"
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-zinc-500" />
                      <input
                        disabled
                        id="email"
                        defaultValue={currentUser.email}
                        placeholder="Email"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm text-gray-500 dark:text-gray-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-zinc-500" />
                    <input
                      id="password"
                      type="password"
                      onChange={handleChange}
                      placeholder="Leave blank to keep current password"
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-600 dark:text-red-400">Something went wrong. Please try again.</p>
                  </div>
                )}

                {updateSuccess && (
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <p className="text-sm text-emerald-700 dark:text-emerald-400">Profile updated successfully!</p>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold text-sm hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Edit3 size={14} />
                    {loading ? "Saving..." : "Update Profile"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}