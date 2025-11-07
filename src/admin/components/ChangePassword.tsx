import React, { useState } from "react";
import useChangePassword from "../hooks/useChangePassword";

interface ChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string | null; // match your AdminPage (string)
}

export const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({
  open,
  onClose,
  userId,
}) => {
  const [password, setPassword] = useState("");
  const changePasswordMutation = useChangePassword();

  if (!open || !userId) return null;

  const handleSave = () => {
    if (!password.trim()) {
      alert("Password cannot be empty!");
      return;
    }

    // ✅ Include userId in the mutate call
    changePasswordMutation.mutate(
      { userId, password },
      {
        onSuccess: () => {
          setPassword(""); // reset input
          onClose(); // close dialog
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>

        <input
          type="password"
          placeholder="Enter new password"
          className="border w-full px-4 py-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={changePasswordMutation.isPending}
            className={`px-4 py-2 rounded-lg text-white transition ${
              changePasswordMutation.isPending
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {changePasswordMutation.isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};
