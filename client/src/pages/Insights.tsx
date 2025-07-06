import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import DashboardCharts from "../components/DashboardCharts";
import {RefreshCcw} from 'lucide-react';
export default function Insights() {
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [insights, setInsights] = useState<String | null>(null);
  const [error, setError] = useState<String | null>(null);
  const [activeTab, setActiveTab] = useState<String>("data");
  const [refresh,setrefresh] = useState<Boolean>(false);
  const location = useLocation();
  const data = location.state;
  console.log("Data : ", data);
useEffect(() => {
  const getInsights = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/insights/analyze", {
        jsonData: data,
      });
      setInsights(res.data.insights);
    } catch (err: any) {
      if (err?.response?.status === 413) {
        setError("File is too large");
      } else {
        setError("Failed to generate insights.");
      }
      console.error("Insight error:", err);
    } finally {
      setIsLoading(false);
      setrefresh(false)
    }
  };

  getInsights();
}, [refresh]);


  return (
    <div className="m-0 p-0">
      {/* <NavBar/> */}
      <div className="bg-gray-800 text-white p-2 flex justify-around w-full">
        <div
          onClick={() => setActiveTab("data")}
          className={`cursor-pointer px-4 py-1 rounded ${
            activeTab === "data" ? "bg-green-600" : "hover:bg-gray-600"
          }`}
        >
          Data
        </div>
        <div
          onClick={() => setActiveTab("insights")}
          className={`cursor-pointer px-4 py-1 rounded ${
            activeTab === "insights" ? "bg-green-600" : "hover:bg-gray-600"
          }`}
        >
          Insights
        </div>
        <div
          onClick={() => setActiveTab("graph")}
          className={`cursor-pointer px-4 py-1 rounded ${
            activeTab === "graph" ? "bg-green-600" : "hover:bg-gray-600"
          }`}
        >
          Graph
        </div>
      </div>

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
      {/* Data Display */}
      {Array.isArray(data) && data.length > 0 && (
        <div >
           {activeTab === "data" ? <div>
          <div className="flex snap-start items-center justify-between px-12 mb-4">
            <h2 className="text-2xl mx-auto mt-3 font-semibold flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Your Data
            </h2>
          </div>

          <div className="bg-gray-800/50 border max-w-[80%] max-h-[80%] mx-auto border-gray-700 rounded-xl overflow-scroll scrollbar-hidden">
            <div className="flex justify-between">
              <pre className="p-4 text-sm overflow-x-auto max-h-[500px] scrollbar-hidden">
                {JSON.stringify(data, null, 2)}
              </pre>
              <span className="text-xs h-fit m-2 bg-indigo-900 text-indigo-300 px-2.5 py-1 rounded-full">
                {data.length} records
              </span>
            </div>
          </div>
</div> : activeTab === "insights" ? <div> 
{isLoading && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-t-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-white text-lg font-semibold">Analyzing Insights...</p>
    </div>
  </div>
)}
          {insights && (
             <div
  id="insights"
  className="rounded-2xl shadow-xl p-8 space-y-5 backdrop-blur-sm"
>
  <h2 className="flex justify-between text-3xl font-extrabold flex items-center gap-2">
    <span className="text-indigo-400 ">📊 Your Data Insights</span>
    <span><button onClick={() => setrefresh(true)}><RefreshCcw /></button></span>
  </h2>

  <div className="space-y-4">
    {insights
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line, index) => {
        const isFullyBoldLine = /^\*\*(.+?)\*\*$/.test(line.trim());

        // Bold line as bullet point
        if (isFullyBoldLine) {
          const text = line.trim().replace(/^\*\*(.+?)\*\*$/, "$1");
          return (
            <div
              key={index}
              className="flex items-start gap-3 text-dark-100 group"
            >
              <span className="text-indigo-400 text-lg transition-transform group-hover:scale-125">•</span>
              <p className="text-lg leading-relaxed font-medium">{text}</p>
            </div>
          );
        }
 
        // Inline bold styling
        const formattedLine = line.replace(
          /\*\*(.*?)\*\*/g,
          "<strong class='font-semibold text-indigo-300'>$1</strong>"
        );

        return (
          <div
            key={index}
            className="flex items-start gap-3"
          >
            <p
              className="whitespace-pre-wrap leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formattedLine }}
            />
          </div>
        );
      })}
  </div>
</div>
          )}
        </div> : <DashboardCharts data={data} /> } 


      </div>
      )}
    </div>
  );
}
