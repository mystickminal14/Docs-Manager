import React, { useState } from "react";

interface ChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
  userId: number | null;
  onChange: (newPassword: string) => void;
}

export const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({
  open,
  onClose,
  userId,
  onChange,
}) => {
  const [password, setPassword] = useState("");

  if (!open || !userId) return null;

  const handleSave = () => {
    if (!password.trim()) {
      alert("Password cannot be empty!");
      return;
    }
    onChange(password);
    setPassword("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
        <input
          type="password"
          placeholder="Enter new password"
          className="border w-full px-4 py-2 rounded-lg mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
