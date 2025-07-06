import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function UploadFile() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate()
  const handleUpload = async () => {
    if (!file) {
      setError("Please Select a File");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true);
      const res = await api.post("/upload/file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/your-data-insights",{state:res.data.data})
    } catch (error: unknown) {
  if (error instanceof Error) {
    setError(error.message);
    console.log("Error:", error.message);
  } else {
    setError("An unknown error occurred.");
    console.log("Unknown Error:", error);
  }
}finally{
  setIsLoading(false);
}

  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex items-center mb-8">
          <div className="bg-indigo-600 p-3 rounded-lg mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              InsightGenie
            </h1>
            <p className="text-gray-400">
              Upload your data and let the magic happen
            </p>
          </div>
        </header>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mt-0.5 mr-2 text-red-400 flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-red-300">{error}</div>
          </div>
        )}

        {/* Upload Section */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Upload your data file
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".csv, .xlsx"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-600 file:text-white
                hover:file:bg-indigo-500
                file:transition file:duration-150
                file:cursor-pointer
                bg-gray-800/50 border border-gray-700 rounded-lg"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Supports CSV and Excel files
              </p>
            </div>

            <button
              onClick={handleUpload}
              disabled={!file}
              className={`px-6 py-2.5 rounded-lg font-medium flex items-center transition duration-200 ${
                file
                  ? "bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20"
                  : "bg-gray-700 cursor-not-allowed"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              {isLoading ? "Please Wait" : "Upload & Parse"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadFile;
