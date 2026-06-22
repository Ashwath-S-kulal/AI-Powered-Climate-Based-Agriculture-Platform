import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import { FaUserShield, FaUserAlt, FaEnvelope, FaCalendarAlt, FaTrashAlt } from "react-icons/fa";
import { ShieldCheck, Loader2, Users } from "lucide-react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_BASE_URI}/api/admin/getallusers`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Permanent delete?")) {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URI}/api/admin/deleteuser/${userId}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (data.success) {
          setUsers(users.filter((user) => user._id !== userId));
        }
      } catch (error) { console.error(error); }
    }
  };

  const handleRoleChange = async (userId, isAdmin) => {
    if (!window.confirm(`Update Role..?`)) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_BASE_URI}/api/admin/${userId}/role`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) await fetchUsers();
    } catch (error) { console.error(error.message); }
  };

return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] pb-12">
      <Header />
      <div className="max-w-7xl mx-auto px-6 pt-10">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Console</h1>
            <p className="text-slate-500 dark:text-slate-400">Manage platform users and permissions.</p>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
            <Users className="text-emerald-600 dark:text-emerald-400" size={20} />
            <span className="font-semibold text-slate-900 dark:text-zinc-200">{users.length} Active Accounts</span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-emerald-600 dark:text-emerald-400">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="font-medium">Syncing user database...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div key={user._id} className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <img src={user.profilePicture || "/default-avatar.png"} className="w-16 h-16 rounded-full object-cover border-2 border-emerald-100 dark:border-emerald-900" alt={user.username} />
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{user.username}</h3>
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${user.isAdmin ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-400' : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'}`}>
                      {user.isAdmin ? <FaUserShield size={10} /> : <FaUserAlt size={10} />}
                      {user.isAdmin ? "Admin" : "User"}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-6 text-sm text-slate-600 dark:text-zinc-400">
                  <div className="flex items-center gap-2"><FaEnvelope size={14} /> {user.email}</div>
                  <div className="flex items-center gap-2"><FaCalendarAlt size={14} /> Joined {new Date(user.createdAt).toLocaleDateString()}</div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
                  <button onClick={() => handleRoleChange(user._id)} className="flex-1 text-xs font-bold uppercase py-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-950/50 transition">
                    Toggle Role
                  </button>
                  <button onClick={() => handleDeleteUser(user._id)} className="px-3 py-2 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-950/40 transition">
                    <FaTrashAlt size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}