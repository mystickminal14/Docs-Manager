import React, { useState, useMemo, useEffect } from "react";
import { FaPlus, FaSearch, FaFile, FaTrash, FaGlobe, FaLock, FaEdit } from "react-icons/fa";
import { useDeleteFile } from "../hooks/useDeleteFile";
import { useChangeAccessType } from "../hooks/useChangeAccessType";
import { useGetFiles } from "../hooks/useAllFiles";
import { AddFileDrawer } from "./AddFileDrawer";
import { ChangeDisplayNameDialog } from "./ChangeDisplayName";

 const ManageFiles: React.FC = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  
  const [confirmAction, setConfirmAction] = useState<{
    type: "delete" | "makePublic" | "makePrivate" | null;
    fileId: string | null;
    fileName?: string;
  }>({ type: null, fileId: null });

  const [filter, setFilter] = useState<"all" | "Public" | "Private">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const categories = ["CategoryA", "CategoryB", "CategoryC", "CategoryD", "CategoryE"];

  const { data: fileData, isLoading, isError, refetch } = useGetFiles(
    useMemo(() => ({
      page:page,
      pageSize:pageSize,
      seed: debouncedSearch.trim() || undefined,
      accessType: filter !== "all" ? filter : undefined,
      category: categoryFilter !== "all" ? categoryFilter : undefined,
    }), [page, debouncedSearch, filter, categoryFilter])
  );

  const deleteFile = useDeleteFile();
  const changeAccessType = useChangeAccessType();

  // Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const handleDeleteFile = (fileId: string) => {
    deleteFile.mutate(
      fileId,
      { onSuccess: () => refetch() }
    );
  };

  const handleChangeAccessType = (fileId: string, accessType: "Public" | "Private") => {
    changeAccessType.mutate(
      { fileShareId: fileId, accessType },
      { onSuccess: () => refetch() }
    );
  };

  const handleChangeDisplayName = (fileId: string, currentName: string) => {
    setSelectedFileId(fileId);
    setSelectedFileName(currentName);
    setDialogOpen(true);
  };

  const handleNextPage = () => {
    if (!isLastPage) setPage(prev => prev + 1);
  };

  const handlePreviousPage = () => setPage(prev => Math.max(prev - 1, 1));

  const isLastPage = fileData?.info?.next ? false : true;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div
          className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"
          aria-label="Loading files data..."
        />
      </div>
    );
  }

  return (
    <div className="font-poppins p-8 min-h-screen bg-gray-100 text-gray-800 transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">File Management</h2>
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all"
        >
          <FaPlus /> Add Files
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
              placeholder="Search files..."
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
            <option value="all">All Access Types</option>
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-auto"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-2xl border border-gray-200 bg-white p-6">
        {isError ? (
          <p className="text-center py-10 text-red-500 italic">
            Failed to load files.
          </p>
        ) : fileData?.data?.length ? (
          <>
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-indigo-100 text-indigo-900 text-xs uppercase tracking-wide rounded-t-2xl">
                <tr>
                  <th className="px-6 py-4">SN</th>
                  <th className="px-6 py-4">File Name</th>
                  <th className="px-6 py-4">Display Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Access Type</th>
                  <th className="px-6 py-4">Uploaded</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fileData.data.map((file, index) => (
                  <tr key={file.fileShareId} className="border-t hover:bg-gray-50 transition-all">
                    <td className="px-6 py-4">{(page - 1) * pageSize + index + 1}</td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <FaFile className="text-indigo-500 flex-shrink-0" />
                      <span className="truncate max-w-[200px]" title={file.filePath}>
                        {file.filePath}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {file.fileName || (
                        <span className="text-gray-400 italic">No display name</span>
                      )}
                    </td>
                    <td className="px-6 py-4">{file.category}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        file.accessType === "Public"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {file.accessType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(file.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center space-x-2">
                      {/* Make Public Button */}
                      {file.accessType !== "Public" && (
                        <div className="relative inline-block group">
                          <button
                            onClick={() => setConfirmAction({ 
                              type: "makePublic", 
                              fileId: file.fileShareId,
                              fileName: file.fileName
                            })}
                            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 text-sm font-medium transition-all"
                          >
                            <FaGlobe />
                            Make Public
                          </button>
                          <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                            Make file public
                          </span>
                        </div>
                      )}

                      {/* Make Private Button */}
                      {file.accessType === "Public" && (
                        <div className="relative inline-block group">
                          <button
                            onClick={() => setConfirmAction({ 
                              type: "makePrivate", 
                              fileId: file.fileShareId,
                              fileName: file.fileName
                            })}
                            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium transition-all"
                          >
                            <FaLock />
                            Make Private
                          </button>
                          <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                            Make file private
                          </span>
                        </div>
                      )}

                      {/* Change Display Name */}
                      <div className="relative inline-block group">
                        <button
                          onClick={() => handleChangeDisplayName(file.fileShareId, file.displayName || file.fileName)}
                          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-sm font-medium transition-all"
                        >
                          <FaEdit />
                          Rename
                        </button>
                        <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                          Change display name
                        </span>
                      </div>

                      {/* Delete Button */}
                      <div className="relative inline-block group">
                        <button
                          onClick={() => setConfirmAction({ 
                            type: "delete", 
                            fileId: file.fileShareId,
                            fileName: file.fileName
                          })}
                          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium transition-all"
                        >
                          <FaTrash />
                          Delete
                        </button>
                        <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                          Delete file
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={handlePreviousPage}
                disabled={page === 1}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${page === 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
              >
                Previous
              </button>

              <span className="text-sm text-gray-600">
                Page {page} of {fileData.info.lastPage || 1}
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
          <p className="text-center py-10 text-gray-500 italic">No files found.</p>
        )}
      </div>

      {/* Add File Drawer */}
      <AddFileDrawer
        open={isDrawerOpen} 
        onClose={() => setDrawerOpen(false)}
        onSuccess={refetch}
      />

      {/* Change Display Name Dialog */}
      <ChangeDisplayNameDialog
        open={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        fileId={selectedFileId}
        currentName={selectedFileName}
        onSuccess={refetch}
      />

      {/* Confirm Dialog for Actions */}
      {confirmAction.type && confirmAction.fileId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-4">
              {confirmAction.type === "delete" && "Delete File"}
              {confirmAction.type === "makePublic" && "Make File Public"}
              {confirmAction.type === "makePrivate" && "Make File Private"}
            </h3>
            <p className="mb-6">
              {confirmAction.type === "delete" && `Are you sure you want to delete "${confirmAction.fileName}"?`}
              {confirmAction.type === "makePublic" && `Are you sure you want to make "${confirmAction.fileName}" public?`}
              {confirmAction.type === "makePrivate" && `Are you sure you want to make "${confirmAction.fileName}" private?`}
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
                onClick={() => setConfirmAction({ type: null, fileId: null })}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-medium text-white ${
                  confirmAction.type === "delete"
                    ? "bg-red-500 hover:bg-red-600"
                    : confirmAction.type === "makePublic"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
                onClick={() => {
                  if (confirmAction.type === "delete") {
                    handleDeleteFile(confirmAction.fileId!);
                  } else if (confirmAction.type === "makePublic") {
                    handleChangeAccessType(confirmAction.fileId!, "Public");
                  } else if (confirmAction.type === "makePrivate") {
                    handleChangeAccessType(confirmAction.fileId!, "Private");
                  }
                  setConfirmAction({ type: null, fileId: null });
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
export default ManageFiles;