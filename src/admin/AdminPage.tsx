import React, { useState, useMemo, useEffect } from "react";
import { FaPlus, FaSearch, FaLock, FaUnlock } from "react-icons/fa";
import { AddUserDrawer } from "./components/AddUserDrawer";
import { ChangePasswordDialog } from "./components/ChangePassword";
import { useGetUsers } from "./hooks/useGetUsers";
import { useEnableUser } from "./hooks/useEnableUser";
import { useDisableUser } from "./hooks/useDisableUser";

export const AdminPage: React.FC = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: "enable" | "disable" | null;
    userId: string | null;
  }>({ type: null, userId: null });

  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: userData, isLoading, isError, refetch } = useGetUsers(
    useMemo(() => ({
      page,
      pageSize,
      seed: debouncedSearch.trim() || undefined,
      status: filter !== "all" ? filter : undefined,
    }), [page, debouncedSearch, filter])
  );

  const enableUser = useEnableUser();
  const disableUser = useDisableUser();

  // Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const handleEnableUser = (userId: string) => {
    enableUser.mutate(
      { userId },
      { onSuccess: () => refetch() }
    );
  };

  const handleDisableUser = (userId: string) => {
    disableUser.mutate(
      { userId },
      { onSuccess: () => refetch() }
    );
  };

  const handleChangePassword = (userId: string) => {
    setSelectedUserId(userId);
    setDialogOpen(true);
  };

  const handleNextPage = () => {
    if (!isLastPage) setPage(prev => prev + 1);
  };
  const handlePreviousPage = () => setPage(prev => Math.max(prev - 1, 1));

  const isLastPage = userData?.info?.next ? false : true;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div
          className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"
          aria-label="Loading user data..."
        />
      </div>
    );
  }

  return (
    <div className="font-poppins p-8 min-h-screen bg-gray-100 text-gray-800 transition-all duration-300">
      {/* Header */}
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
              placeholder="Search users..."
              className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value as any);
              setPage(1);
            }}
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
        {isError ? (
          <p className="text-center py-10 text-red-500 italic">
            Failed to load users.
          </p>
        ) : userData?.data?.length ? (
          <>
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-indigo-100 text-indigo-900 text-xs uppercase tracking-wide rounded-t-2xl">
                <tr>
                  <th className="px-6 py-4">SN</th>
                  <th className="px-6 py-4">Full Name</th>
                  <th className="px-6 py-4">Username</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {userData.data.map((user, index) => (
                  <tr key={user.userId} className="border-t hover:bg-gray-50 transition-all">
                    <td className="px-6 py-4">{(page - 1) * pageSize + index + 1}</td>
                    <td className="px-6 py-4">{user.fullName}</td>
                    <td className="px-6 py-4">{user.username}</td>
                    <td className="px-6 py-4">{user.role}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center space-x-2">
                      {/* Enable Button */}
                      {user.status !== "Active" && (
                        <div className="relative inline-block group">
                          <button
                            onClick={() => setConfirmAction({ type: "enable", userId: user.userId??'' })}
                            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 text-sm font-medium transition-all"
                          >
                            <FaUnlock />
                            Enable
                          </button>
                          <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            Enable user
                          </span>
                        </div>
                      )}

                      {/* Disable Button */}
                      {user.status === "Active" && (
                        <div className="relative inline-block group">
                          <button
                            onClick={() => setConfirmAction({ type: "disable", userId: user.userId??'' })}
                            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium transition-all"
                          >
                            <FaLock />
                            Disable
                          </button>
                          <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            Disable user
                          </span>
                        </div>
                      )}

                      {/* Change Password */}
                      <div className="relative inline-block group">
                        <button
                          onClick={() => handleChangePassword(user.userId ?? '')}
                          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-sm font-medium transition-all"
                        >
                          <FaUnlock />
                          Change Password
                        </button>
                        <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          Change Password
                        </span>
                      </div>
                 
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={handlePreviousPage}
                disabled={page === 1}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${page === 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
              >
                Previous
              </button>

              <span className="text-sm text-gray-600">
                Page {page} of {userData.info.lastPage || 1}
              </span>

              <button
                onClick={handleNextPage}
                disabled={isLastPage}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isLastPage ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="text-center py-10 text-gray-500 italic">No users found.</p>
        )}
      </div>

      {/* Add User Drawer */}
      <AddUserDrawer open={isDrawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        userId={selectedUserId}
      />

      {/* Confirm Dialog for Enable/Disable */}
      {confirmAction.type && confirmAction.userId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-4">
              {confirmAction.type === "enable" ? "Enable User" : "Disable User"}
            </h3>
            <p className="mb-6">Are you sure you want to {confirmAction.type} this user?</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
                onClick={() => setConfirmAction({ type: null, userId: null })}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-medium ${
                  confirmAction.type === "enable"
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }`}
                onClick={() => {
                  if (confirmAction.type === "enable") handleEnableUser(confirmAction.userId!);
                  else handleDisableUser(confirmAction.userId!);
                  setConfirmAction({ type: null, userId: null });
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
