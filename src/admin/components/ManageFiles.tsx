

import React, { useState } from "react";
import { FaPlus, FaFileAlt, FaEdit, FaTrash } from "react-icons/fa";

interface FileItem {
  id: number;
  name: string;
  type: "A" | "B";
  uploadedAt: string;
}

type Category = "A" | "B";

const ManageFiles: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Category>("A");
  const [files, setFiles] = useState<FileItem[]>([
    { id: 1, name: "Report_Q1.pdf", type: "A", uploadedAt: "2025-11-05" },
    { id: 2, name: "Invoice_102.pdf", type: "A", uploadedAt: "2025-11-04" },
    { id: 3, name: "Design_v2.fig", type: "B", uploadedAt: "2025-11-03" },
  ]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [fileType, setFileType] = useState<"A" | "B">("A");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const filteredFiles = files.filter((f) => f.type === activeTab);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const newFile: FileItem = {
      id: Date.now(),
      name: selectedFile.name,
      type: fileType,
      uploadedAt: new Date().toISOString().split("T")[0],
    };

    setFiles((prev) => [...prev, newFile]);
    setIsDrawerOpen(false);
    setSelectedFile(null);
    (e.target as HTMLFormElement).reset();
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      setFiles((prev) => prev.filter((f) => f.id !== id));
    }
  };

  return (
    <>
      {/* Container */}
      <div className="w-full bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl shadow-2xl p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaFileAlt className="text-indigo-600" /> Manage Files
          </h2>

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transform hover:scale-105 transition"
            title="Add File"
          >
            <FaPlus className="text-xl" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b-2 border-gray-300 mb-8 gap-4">
          {(["A", "B"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-6 text-lg font-semibold rounded-t-lg transition-colors ${activeTab === tab
                ? "text-indigo-600 border-b-4 border-indigo-600"
                : "text-gray-500 hover:text-indigo-500"
                }`}
            >
              Category {tab}
            </button>
          ))}
        </div>


        {/* File Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFiles.length === 0 ? (
            <p className="col-span-full text-center text-gray-400 py-20">
              No files in Category {activeTab}
            </p>
          ) : (
            filteredFiles.map((file) => (
              <div
                key={file.id}
                className="bg-white rounded-3xl p-6 shadow-md hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 relative"
              >
                <span className={`absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full text-white ${file.type === "A" ? "bg-indigo-600" : "bg-green-500"}`}>
                  Type {file.type}
                </span>

                {/* File Name */}
                <h3 className="font-semibold text-gray-800 text-lg truncate mb-2">
                  {file.name}
                </h3>

                {/* Uploaded Date */}
                <p className="text-sm text-gray-500">{file.uploadedAt}</p>

                {/* Action Buttons */}
                <div className="mt-4 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                    <FaEdit className="text-sm" />
                  </button>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-opacity-30 backdrop-blur-sm transition-opacity">
          <div className="bg-white w-full max-w-lg h-full shadow-2xl p-8 overflow-y-auto transform transition-transform duration-300 ease-in-out translate-x-0 rounded-l-3xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Add New File
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File Type
                </label>
                <select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value as "A" | "B")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                  <option value="A">Type A</option>
                  <option value="B">Type B</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    required
                  />
                  <label
                    htmlFor="file-upload"
                    className="text-indigo-600 font-medium block"
                  >
                    {selectedFile ? selectedFile.name : "Click to upload"}
                  </label>
                  {!selectedFile && (
                    <p className="text-xs text-gray-400 mt-1">
                      PDF, DOC, FIG, etc.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={!selectedFile}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white py-3 rounded-xl font-semibold transition-all"
                >
                  Add File
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    setSelectedFile(null);
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl font-semibold transition-all"
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
