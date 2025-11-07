import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useChangeDisplayName } from "../hooks/useChangeDisplayName";

interface ChangeDisplayNameDialogProps {
  open: boolean;
  onClose: () => void;
  fileId: string | null;
  currentName?: string;
  onSuccess?: () => void;
}

export const ChangeDisplayNameDialog: React.FC<ChangeDisplayNameDialogProps> = ({
  open,
  onClose,
  fileId,
  currentName = "",
  onSuccess,
}) => {
  const [displayName, setDisplayName] = useState("");
  const changeDisplayNameMutation = useChangeDisplayName();

  useEffect(() => {
    if (open) {
      setDisplayName(currentName);
    }
  }, [open, currentName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileId || !displayName.trim()) return;

    try {
      await changeDisplayNameMutation.mutateAsync({
        fileShareId: fileId,
        displayName: displayName.trim(),
      });
      
      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error("Failed to change display name:", error);
    }
  };

  const handleClose = () => {
    setDisplayName("");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Change Display Name</h3>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded transition"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter display name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              minLength={3}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!displayName.trim() || changeDisplayNameMutation.isPending}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {changeDisplayNameMutation.isPending ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};