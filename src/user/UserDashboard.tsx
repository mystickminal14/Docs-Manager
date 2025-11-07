import { useState, useEffect } from "react";
import { FaFileAlt, FaDownload, FaClock, FaChevronLeft, FaChevronRight, FaExclamationTriangle, FaExternalLinkAlt } from "react-icons/fa";
import { useGetFiles } from "../admin/hooks/useAllFiles";
import type { FileModel, PaginationParams } from "../admin/type/User";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../constants";

type Category = "CategoryA" | "CategoryB" | "CategoryC" | "CategoryD" | "CategoryE";

const categories: Category[] = ["CategoryA", "CategoryB", "CategoryC", "CategoryD", "CategoryE"];

const UserDashboard = () => {
  const { category: urlCategory } = useParams<{ category: string }>();
  const navigate = useNavigate();
  
  // Check if category is valid
  const isValidCategory = urlCategory && categories.includes(urlCategory as Category);
  
  // Set initial category from URL or default to CategoryA
  const initialCategory = isValidCategory ? urlCategory as Category : "CategoryA";

  const [selectedCategory, setSelectedCategory] = useState<Category>(initialCategory);
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: 9,
    category: initialCategory,
  });

  const { data, isLoading, isError } = useGetFiles(pagination);
  const files: FileModel[] = data?.data || [];
  const totalPages = data?.info?.lastPage || 1;

  // Update category when URL parameter changes
  useEffect(() => {
    if (urlCategory && categories.includes(urlCategory as Category)) {
      setSelectedCategory(urlCategory as Category);
      setPagination(prev => ({ ...prev, category: urlCategory as Category, page: 1 }));
    }
  }, [urlCategory]);

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewFile = (fileShareId: string, ) => {
    const pdfUrl = `/api/files/shared-file/${fileShareId}`;
    window.open(pdfUrl, '_blank');
  };

  const handleDownloadFile = (fileShareId: string, fileName: string) => {
    // Force download using the same endpoint
    const downloadUrl = `${BASE_URL}/api/files/shared-file/${fileShareId}`;
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName || 'document.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Show access denied if no valid category in URL
  if (!urlCategory || !isValidCategory) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="text-6xl mb-4 text-red-500">
            <FaExclamationTriangle className="mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You are not allowed to visit this page without a valid category parameter.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading files...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center text-red-500">
          <p className="text-lg font-semibold">Failed to load files</p>
          <p className="text-sm mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">📁 My Files</h1>
            <p className="text-gray-600">
              Files in <span className="font-semibold text-blue-600">{selectedCategory.replace("Category", "Category ")}</span>
            </p>
          </div>
        </div>

        {/* File Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {files.map((file) => (
            <div 
              key={file.id} 
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col h-full border border-gray-100"
            >
              {/* File Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-xl flex-shrink-0">
                  <FaFileAlt size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-lg text-gray-800 truncate" title={file.displayName || file.name}>
                    {file.displayName || file.name}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">{file.category.replace("Category", "Category ")}</p>
                </div>
              </div>

              {/* File Info */}
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                <FaClock size={14} className="flex-shrink-0" />
                <span>Uploaded {new Date(file.uploadedAt || file.createdAt).toLocaleDateString()}</span>
              </div>

              {/* File Name */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">File Name</p>
                <p className="text-sm text-gray-700 truncate" title={file.fileName}>
                  {file.fileName || "No file name"}
                </p>
              </div>

              {/* File Type */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">File Type</p>
                <p className="text-sm text-gray-700">PDF Document</p>
              </div>

              {/* Actions */}
              <div className="mt-auto pt-4 border-t border-gray-200">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      file.accessType === "Public" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {file.accessType}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex-1 justify-center"
                      onClick={() => file.fileShareId && handleViewFile(file.fileShareId)}
                    >
                      <FaExternalLinkAlt size={14} />
                      View PDF
                    </button>
                    <button
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex-1 justify-center"
                      onClick={() => file.fileShareId && handleDownloadFile(file.fileShareId, file.fileName || file.displayName || 'document.pdf')}
                    >
                      <FaDownload size={14} />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Files State */}
        {files.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No files found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              There are no files available in the <span className="font-semibold">{selectedCategory.replace("Category", "Category ")}</span> category.
            </p>
          </div>
        )}

        {/* Pagination */}
        {files.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                pagination.page === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white text-blue-600 hover:bg-blue-50 border border-gray-300"
              }`}
            >
              <FaChevronLeft size={14} />
              Previous
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Page <span className="font-semibold">{pagination.page}</span> of <span className="font-semibold">{totalPages}</span>
              </span>
            </div>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= totalPages}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                pagination.page >= totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white text-blue-600 hover:bg-blue-50 border border-gray-300"
              }`}
            >
              Next
              <FaChevronRight size={14} />
            </button>
          </div>
        )}

        {/* Files Count */}
        {files.length > 0 && (
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
              {Math.min(pagination.page * pagination.pageSize, (data?.info?.total || 0))} of{" "}
              {data?.info?.total || 0} files
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;