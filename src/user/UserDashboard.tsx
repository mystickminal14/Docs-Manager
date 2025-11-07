import React, { useState, useEffect } from "react";
import { FaFileAlt, FaDownload, FaTrashAlt, FaClock } from "react-icons/fa";

const dummyFiles = [
  { id: 1, name: "ProjectReport.pdf", type: "PDF", size: "2.3 MB", uploadedAt: "2025-11-05", category: "A", url: "#" },
  { id: 2, name: "DesignMockup.png", type: "Image", size: "1.1 MB", uploadedAt: "2025-11-03", category: "B", url: "#" },
  { id: 3, name: "CodeSnippet.js", type: "JavaScript", size: "600 KB", uploadedAt: "2025-11-01", category: "A", url: "#" },
  { id: 4, name: "Presentation.pptx", type: "PPT", size: "3.4 MB", uploadedAt: "2025-10-28", category: "C", url: "#" },
];

const categories = ["A", "B", "C", "D", "E"];

const UserDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("A");
  const [files, setFiles] = useState(dummyFiles.filter(f => f.category === "A"));

  useEffect(() => {
    const filtered = dummyFiles.filter(f => f.category === selectedCategory);
    setFiles(filtered);
  }, [selectedCategory]);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">📁 My Files</h1>

      {/* Category Tabs */}
      <div className="flex gap-3 mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-full font-medium transition ${selectedCategory === cat
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            onClick={() => setSelectedCategory(cat)}
          >
            Category {cat}
          </button>
        ))}
      </div>

      {/* File Cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {files.map(file => (
          <div key={file.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                  <FaFileAlt size={22} />
                </div>
                <div>
                  <h2 className="font-semibold text-lg text-gray-800 truncate">{file.name}</h2>
                  <p className="text-sm text-gray-500">{file.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                <FaClock size={14} />
                <span>Uploaded on {file.uploadedAt}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-500">{file.size}</span>
              <div className="flex gap-3">
                <button className="text-blue-600 hover:text-blue-800 transition" title="Download" onClick={() => window.open(file.url, "_blank")}>
                  <FaDownload size={16} />
                </button>
                <button className="text-red-500 hover:text-red-700 transition" title="Delete" onClick={() => setFiles(files.filter(f => f.id !== file.id))}>
                  <FaTrashAlt size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {files.length === 0 && (
        <div className="text-center mt-20 text-gray-500">
          <p>No files available for this category 😢</p>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
