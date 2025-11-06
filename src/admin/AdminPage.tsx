import React, { useState, useMemo } from "react";
import { FaTrash, FaPlus, FaLock, FaEye, FaEyeSlash, FaSearch } from "react-icons/fa";
import type { User } from "./type/User";
import { AddUserDrawer } from "./components/AddUserDrawer";
import { ChangePasswordDialog } from "./components/ChangePassword";

export const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { id: 1, fullName: "Minal Pariyar", email: "minal@example.com", password: "********", role: "admin", status: "active" },
    { id: 2, fullName: "Ravi Sharma", email: "ravi@example.com", password: "********", role: "user", status: "active" },
    { id: 3, fullName: "Sneha Adhikari", email: "sneha@example.com", password: "********", role: "user", status: "inactive" },
  ]);

  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [search, setSearch] = useState("");
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u
      )
    );
  };

  const handleAddUser = (newUser: Omit<User, "id">) => {
    setUsers([...users, { ...newUser, id: users.length + 1 }]);
    setDrawerOpen(false);
  };

  const handleChangePassword = (id: number) => {
    setSelectedUserId(id);
    setDialogOpen(true);
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.fullName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "all" ? true : u.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [users, search, filter]);

  return (
    <div className="font-poppins p-8 min-h-screen bg-gray-100 text-gray-800 transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">User Management</h2>
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all"
        >
          <FaPlus /> Add User
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative flex-1 min-w-[250px] max-w-[400px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search"
              className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-auto"
          >
            <option value="all">All Users</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-2xl border border-gray-200 bg-white p-6">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-indigo-100 text-indigo-900 text-xs uppercase tracking-wide rounded-t-2xl">
            <tr>
              <th className="px-6 py-4">SN</th>
              <th className="px-6 py-4">Full Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr
                key={user.id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } border-b border-gray-200 hover:bg-indigo-50 transition duration-200`}
              >
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4 font-medium">{user.fullName}</td>
                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`capitalize px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === "admin" 
                        ? "bg-purple-100 text-purple-700" 
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`font-semibold px-3 py-1 rounded-full text-xs ${
                      user.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    {/* Change Password Button */}
                    <div className="relative group">
                      <button
                        onClick={() => handleChangePassword(user.id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg transition-all duration-200 flex items-center justify-center"
                      >
                        <FaLock className="text-sm" />
                      </button>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                        Change Password
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                      </div>
                    </div>

                    {/* Toggle Status Button */}
                    <div className="relative group">
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className={`${
                          user.status === "active"
                            ? "bg-gray-500 hover:bg-gray-600"
                            : "bg-green-600 hover:bg-green-700"
                        } text-white p-2 rounded-lg transition-all duration-200 flex items-center justify-center`}
                      >
                        {user.status === "active" ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                      </button>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                        {user.status === "active" ? "Disable User" : "Enable User"}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <div className="relative group">
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-all duration-200 flex items-center justify-center"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                        Delete User
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddUserDrawer open={isDrawerOpen} onClose={() => setDrawerOpen(false)} onAdd={handleAddUser} />
      <ChangePasswordDialog
        open={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        userId={selectedUserId}
        onChange={(newPassword) => {
          setUsers((prev) =>
            prev.map((u) =>
              u.id === selectedUserId ? { ...u, password: newPassword } : u
            )
          );
          setDialogOpen(false);
        }}
      />
    </div>
  );
};