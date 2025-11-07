import React, { useState } from "react";
import { FaPlus, FaTrash, FaFileAlt, FaFile } from "react-icons/fa";
import { useFileUpload } from "../hooks/useUploadFiles";

type Category = "CategoryA" | "CategoryB" | "CategoryC" | "CategoryD" | "CategoryE";

interface FileItem {
  id: number;
  name: string;
  category: Category;
  uploadedAt: string;
  displayName?: string;
}

const ManageFiles: React.FC = () => {
  const categories: Category[] = ["CategoryA", "CategoryB", "CategoryC", "CategoryD", "CategoryE"];
  const [files, setFiles] = useState<FileItem[]>([
    { id: 1, name: "Report_Q1.pdf", category: "CategoryA", uploadedAt: "2025-11-05" },
    { id: 2, name: "Invoice_102.pdf", category: "CategoryA", uploadedAt: "2025-11-04" },
    { id: 3, name: "Design_v2.fig", category: "CategoryB", uploadedAt: "2025-11-03" },
  ]);

  const [filterCategory, setFilterCategory] = useState<Category | "All">("All");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [category, setCategory] = useState<Category>("CategoryA");
  const [displayName, setDisplayName] = useState("");
  const [sharedFiles, setSharedFiles] = useState<File[]>([]);
  const uploadMutation = useFileUpload();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setSharedFiles(Array.from(e.target.files));
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!sharedFiles.length) return;

  const newEntries: FileItem[] = sharedFiles.map((file) => ({
    id: Date.now() + Math.random(),
    name: file.name,
    category,
    uploadedAt: new Date().toISOString().split("T")[0],
    displayName,
  }));

  await uploadMutation.mutateAsync({
    files: sharedFiles,
    category,
    displayName: displayName || undefined,
  });

  setFiles((prev) => [...prev, ...newEntries]);
  resetForm();
};

  const resetForm = () => {
    setIsDrawerOpen(false);
    setSharedFiles([]);
    setDisplayName("");
    setCategory("CategoryA");
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this file?")) {
      setFiles((prev) => prev.filter((f) => f.id !== id));
    }
  };

  const filteredFiles =
    filterCategory === "All" ? files : files.filter((f) => f.category === filterCategory);

  return (
    <>
      <div className="w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <FaFileAlt className="text-indigo-600" /> Manage Files
          </h2>

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-md shadow transition"
          >
            <FaPlus />
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-4 flex items-center gap-3">
          <label className="text-gray-700 text-sm font-medium">Filter by Category:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as Category | "All")}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-800 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">File Name</th>
                <th className="px-6 py-3">Display Name</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Uploaded At</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">
                    No files found
                  </td>
                </tr>
              ) : (
                filteredFiles.map((file) => (
                  <tr key={file.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-3 flex items-center gap-2">
                      <FaFile className="text-indigo-500" />
                      <span>{file.name}</span>
                    </td>
                    <td className="px-6 py-3">{file.displayName || "-"}</td>
                    <td className="px-6 py-3">{file.category}</td>
                    <td className="px-6 py-3">{file.uploadedAt}</td>
                    <td className="px-6 py-3 text-center">
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-8 overflow-y-auto rounded-l-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Add New File</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-indigo-500"
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
                  Display Name (Optional)
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Files</label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-indigo-500 transition">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="text-indigo-600 font-medium cursor-pointer">
                    {sharedFiles.length > 0
                      ? `${sharedFiles.length} file(s) selected`
                      : "Click to upload or drag files"}
                  </label>
                  <p className="text-xs text-gray-400 mt-1">PDF, DOC, FIG, etc.</p>
                </div>

                {sharedFiles.length > 0 && (
                  <ul className="mt-3 space-y-2 bg-gray-50 rounded-md p-3 border border-gray-200">
                    {sharedFiles.map((file, index) => (
                      <li key={index} className="flex justify-between text-sm text-gray-700">
                        <span>{file.name}</span>
                        <span className="text-gray-400 text-xs">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={!sharedFiles.length}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md font-medium transition disabled:bg-gray-300"
                >
                  Add Files
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-md font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageFiles;
