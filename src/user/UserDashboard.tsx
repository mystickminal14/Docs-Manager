import { useState } from "react";
import { FaFileAlt, FaDownload, FaClock } from "react-icons/fa";
import { useGetFiles } from "../admin/hooks/useAllFiles";
import type { FileModel, PaginationParams } from "../admin/type/User";

type Category = "CategoryA" | "CategoryB" | "CategoryC" | "CategoryD" | "CategoryE";

const categories: Category[] = ["CategoryA", "CategoryB", "CategoryC", "CategoryD", "CategoryE"];

const UserDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>("CategoryA");
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: 10,
    category: selectedCategory,
  });

  const { data, isLoading, isError } = useGetFiles(pagination);
  const files: FileModel[] = data?.data || [];

  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category);
    setPagination({ ...pagination, category, page: 1 });
  };

  if (isLoading) return <div className="p-6 text-center">Loading files...</div>;
  if (isError) return <div className="p-6 text-center text-red-500">Failed to load files.</div>;

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
            onClick={() => handleCategoryChange(cat)}
          >
            {cat.replace("Category", "Category ")}
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
                  <h2 className="font-semibold text-lg text-gray-800 truncate">{file.displayName || file.name}</h2>
                  <p className="text-sm text-gray-500">{file.category.replace("Category", "Category ")}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                <FaClock size={14} />
                <span>Uploaded on {new Date(file.uploadedAt || file.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-500">{file.fileName || "-"}</span>
              <div className="flex gap-3">
                <button
                  className="text-blue-600 hover:text-blue-800 transition"
                  title="Download"
                  onClick={() => window.open(file.filePath || "#", "_blank")}
                >
                  <FaDownload size={16} />
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
