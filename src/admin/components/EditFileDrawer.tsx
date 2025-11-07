import React, { useState, useEffect } from "react";
import { FaTimes, FaUpload } from "react-icons/fa";
import { useFileUpload } from "../hooks/useUploadFiles";
import { useChangeDisplayName } from "../hooks/useChangeDisplayName"; // 👈 create this hook (explained below)

interface EditFileDrawer {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  isEdit?: boolean;
  initialData?: {
    fileShareId: string;
    displayName: string;
    category: string;
  };
}

const categories = ["CategoryA", "CategoryB", "CategoryC", "CategoryD", "CategoryE"];

export const EditFileDrawer: React.FC<EditFileDrawer> = ({
  open,
  onClose,
  onSuccess,
  isEdit = false,
  initialData,
}) => {
  const [category, setCategory] = useState("CategoryA");
  const [displayName, setDisplayName] = useState("");
  const [sharedFiles, setSharedFiles] = useState<File[]>([]);
  const uploadMutation = useFileUpload();
  const updateMutation = useChangeDisplayName(); // 👈 edit API hook

  // When editing, prefill existing data
  useEffect(() => {
    if (isEdit && initialData) {
      setDisplayName(initialData.displayName || "");
      setCategory(initialData.category || "CategoryA");
    }
  }, [isEdit, initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setSharedFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && initialData) {
        // Update file metadata (displayName, category)
        await updateMutation.mutateAsync({
          fileShareId: initialData.fileShareId,
          displayName,
          category,
        });
      } else {
        // Upload new file
        if (!sharedFiles.length) return;
        await uploadMutation.mutateAsync({
          files: sharedFiles,
          category,
          displayName: displayName || undefined,
        });
      }

      resetForm();
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Operation failed:", error);
    }
  };

  const resetForm = () => {
    setSharedFiles([]);
    setDisplayName("");
    setCategory("CategoryA");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md h-full shadow-2xl p-8 overflow-y-auto rounded-l-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            {isEdit ? "Edit File Details" : "Add New Files"}
          </h3>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter a friendly name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {!isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Files
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="text-indigo-600 font-medium cursor-pointer flex flex-col items-center gap-2">
                  <FaUpload className="text-xl" />
                  {sharedFiles.length > 0
                    ? `${sharedFiles.length} file(s) selected`
                    : "Click to upload or drag files"}
                </label>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={uploadMutation.isPending || updateMutation.isPending}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {(uploadMutation.isPending || updateMutation.isPending)
                ? "Processing..."
                : isEdit
                  ? "Save Changes"
                  : "Add Files"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
