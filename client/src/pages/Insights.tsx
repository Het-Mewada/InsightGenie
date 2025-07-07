import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import DashboardCharts from "../components/DashboardCharts";
import { RefreshCcw } from "lucide-react";
export default function Insights() {
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [insights, setInsights] = useState<String | null>(null);
  const [error, setError] = useState<String | null>(null);
  const [activeTab, setActiveTab] = useState<String>("data");
  const [refresh, setrefresh] = useState<Boolean>(false);
  const [chartError, setChartError] = useState<String | null>(null);
  const location = useLocation();
  const data = location.state;
  console.log("Data : ", data);
  useEffect(() => {
    if (data.length >= 100) {
      setChartError("Data Too Large to Genrate Graph");
    }

    const getInsights = async () => {
      setError("");
      setIsLoading(true);
      try {
        const res = await axios.post(
          "http://localhost:5000/api/insights/analyze",
          {
            jsonData: data,
          }
        );
        setInsights(res.data.insights);
      } catch (err: any) {
        if (err?.response?.status === 413) {
          setError("File is too large");
        } else {
          setError(err.response.message || "Failed to generate insights.");
          setInsights(null)
        }
        console.error("Insight error:", err);
      } finally {
        setIsLoading(false);
        setrefresh(false);
      }
    };

    getInsights();
  }, [refresh, data]);

  return (
    <div className="m-0 p-0">
      {/* <NavBar/> */}
      <div className="bg-gray-800 text-white p-2 flex justify-around w-full">
        <div
          onClick={() => setActiveTab("data")}
          className={`cursor-pointer px-4 py-1 font-medium transition-all duration-200 ${
            activeTab === "data"
              ? "text-green-400 border-b-2 border-green-400"
              : "hover:bg-gray-600 rounded-md"
          }`}
        >
          Data
        </div>
        <div
          onClick={() => setActiveTab("insights")}
          className={`cursor-pointer px-4 py-1 font-medium transition-all duration-200 ${
            activeTab === "insights"
              ? "text-green-400 border-b-2 border-green-400"
              : "hover:bg-gray-600 rounded-md"
          }`}
        >
          Insights
        </div>
        <div
          onClick={() => setActiveTab("graph")}
          className={`cursor-pointer px-4 py-1 font-medium transition-all duration-200 ${
            activeTab === "graph"
              ? "text-green-400 border-b-2 border-green-400"
              : "hover:bg-gray-600 rounded-md"
          }`}
        >
          Graph
        </div>
      </div>
      {/* Data Display */}
      {Array.isArray(data) && data.length > 0 && (
        <div>
          {activeTab === "data" ? (
            <div>
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

              <div  className="bg-gray-800/50 border max-w-[80%] max-h-[80%] mx-auto border-gray-700 rounded-xl overflow-scroll scrollbar-hidden">
                <div  className="flex justify-between">
                  <pre tabIndex={-1} className="p-4 text-sm overflow-x-auto max-h-[500px] scrollbar-hidden">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                  <span className="text-xs h-fit m-2 bg-indigo-900 text-indigo-300 px-2.5 py-1 rounded-full">
                    <div>{data.length} records</div>
                  </span>
                </div>
              </div>
            </div>
          ) : activeTab === "insights" ? (
            <div>
              {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-t-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white text-lg font-semibold">
                      Analyzing Insights...
                    </p>
                  </div>
                </div>
              )}
              {/* Error Message */}
              {error && (
                <div className="flex items-center justify-center min-h-[85vh] text-red-600 font-semibold text-lg">
{error}
                </div>
              )}
              {insights && (
                <div
                  id="insights"
                  className="rounded-2xl shadow-xl p-8 space-y-5 backdrop-blur-sm"
                >
                  <h2 className="flex justify-between text-3xl font-extrabold flex items-center gap-2">
                    <span className="text-indigo-400 ">
                      📊 Your Data Insights
                    </span>
                    <span>
                      <button onClick={() => setrefresh(true)}>
                        <RefreshCcw />
                      </button>
                    </span>
                  </h2>

                  <div className="space-y-4">
                    {insights
                      .split("\n")
                      .filter((line) => line.trim() !== "")
                      .map((line, index) => {
                        const isFullyBoldLine = /^\*\*(.+?)\*\*$/.test(
                          line.trim()
                        );

                        // Bold line as bullet point
                        if (isFullyBoldLine) {
                          const text = line
                            .trim()
                            .replace(/^\*\*(.+?)\*\*$/, "$1");
                          return (
                            <div
                              key={index}
                              className="flex items-start gap-3 text-dark-100 group"
                            >
                              <span className="text-indigo-400 text-lg transition-transform group-hover:scale-125">
                                •
                              </span>
                              <p className="text-lg leading-relaxed font-medium">
                                {text}
                              </p>
                            </div>
                          );
                        }

                        // Inline bold styling
                        const formattedLine = line.replace(
                          /\*\*(.*?)\*\*/g,
                          "<strong class='font-semibold text-indigo-300'>$1</strong>"
                        );

                        return (
                          <div key={index} className="flex items-start gap-3">
                            <p
                              className="whitespace-pre-wrap leading-relaxed"
                              dangerouslySetInnerHTML={{
                                __html: formattedLine,
                              }}
                            />
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              {chartError ? (
                <div className="flex items-center justify-center min-h-[85vh] text-red-600 font-semibold text-lg">
                  {chartError}
                </div>
              ) : (
                <DashboardCharts data={data} />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
