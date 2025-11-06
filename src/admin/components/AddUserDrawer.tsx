import React, { useState } from "react";
import type { User } from "../type/User";

interface AddUserDrawerProps {
  open: boolean;
  onClose: () => void;
  onAdd: (user: Omit<User, "id">) => void;
}

export const AddUserDrawer: React.FC<AddUserDrawerProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [form, setForm] = useState<Omit<User, "id">>({
    fullName: "",
    email: "",
    password: "",
    role: "user",
    status: "active",
  });

  if (!open) return null;

  const handleSubmit = () => {
    if (!form.fullName || !form.email || !form.password) {
      alert("Please fill all required fields!");
      return;
    }
    onAdd(form);
    setForm({ fullName: "", email: "", password: "", role: "user", status: "active" });
  };

  return (
    <>
      {/* Backdrop - only show on larger screens */}
      <div className="hidden sm:block fixed inset-0 z-40" onClick={onClose}></div>
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out">
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Add New User</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                placeholder="Enter full name"
                className="border border-gray-300 w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                placeholder="Enter email address"
                type="email"
                className="border border-gray-300 w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                placeholder="Enter password"
                type="password"
                className="border border-gray-300 w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                className="border border-gray-300 w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value as "admin" | "user" })
                }
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};