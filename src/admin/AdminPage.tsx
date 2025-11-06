import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

interface User {
  id: number;
  fullName: string;
  email: string;
  password: string;
  role: "admin" | "user";
  status: "active" | "inactive";
}

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      fullName: "Minal Pariyar",
      email: "minal@example.com",
      password: "********",
      role: "admin",
      status: "active",
    },
    {
      id: 2,
      fullName: "Ravi Sharma",
      email: "ravi@example.com",
      password: "********",
      role: "user",
      status: "active",
    },
    {
      id: 3,
      fullName: "Sneha Adhikari",
      email: "sneha@example.com",
      password: "********",
      role: "user",
      status: "inactive",
    },
  ]);

  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  const handleEdit = (id: number) => {
    alert(`Edit user with ID: ${id}`);
  };

  return (
    <div className="font-poppins p-8 min-h-screen bg-gray-100 text-gray-800 transition-all duration-300">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">User Management</h2>

      <div className="overflow-x-auto shadow-lg rounded-2xl border border-gray-200 bg-white p-4">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-indigo-100 text-indigo-900 text-xs uppercase tracking-wide rounded-t-2xl">
            <tr>
              <th className="px-6 py-4">Full Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Password</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } border-b border-gray-200 hover:bg-indigo-50 transition duration-200`}
              >
                <td className="px-6 py-4 font-medium text-gray-900">{user.fullName}</td>
                <td className="px-6 py-4 text-gray-700">{user.email}</td>
                <td className="px-6 py-4 text-gray-500">{user.password}</td>
                <td className="px-6 py-4 capitalize">{user.role}</td>
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
                <td className="px-6 py-4 flex justify-center gap-4">
                  <button
                    onClick={() => handleEdit(user.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all"
                  >
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;
