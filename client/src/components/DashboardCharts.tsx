import React from "react";
import { Bar, Line } from "react-chartjs-2";
import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register required components for chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

// Props interface
interface Props {
  data: any[]; // Array of data objects
  xAxisKey?: string; // Optional: key to use for x-axis labels
  excludeKeys?: string[]; // Optional: keys to ignore for charting
}

const DashboardCharts: React.FC<Props> = ({
  data,
  xAxisKey,
  excludeKeys = [],
}) => {
  const [xAxis, setXAxis] = useState<any>(xAxisKey);
  // Handle empty data
  if (!data || data.length === 0) {
    return <p className="text-yellow-400">No data available</p>;
  }

  // Get all keys from the first data item
  const allKeys = Object.keys(data[0]);

  // Select numeric fields (and remove unwanted keys)
  const numericKeys = allKeys.filter((key) => {
    if (excludeKeys.includes(key)) return false;
    if (key.match(/(id|num|serial)/i)) return false;

    const value = data[0][key];
    const isNumeric =
      typeof value === "number" || (!isNaN(Number(value)) && value !== "");
    return isNumeric;
  });

// if(numericKeys.length >= 100 ){
  console.log("Numeric Keys Length " , numericKeys );
  // return
// }

  if (numericKeys.length === 0) {
    return (
      <p className="text-yellow-400">No numeric data available for charts</p>
    );
  }

  // Choose a key to use for X-axis labels
  const labelKey =
    xAxis ||
    allKeys.find(
      (key) =>
        !numericKeys.includes(key) &&
        !excludeKeys.includes(key) &&
        !key.match(/(id|num|serial)/i)
    ) ||
    numericKeys[0]; // fallback to a numeric key if no label found

  // Create labels (X-axis) using labelKey
  const labels = data.map((item) => {
    const value = item[labelKey];
    return typeof value === "number" ? ` ${xAxis} ${value}` : String(value);
  });

  // Pick up to 3 numeric fields to show in charts
  const chartFields = numericKeys.filter((key) => key !== labelKey).slice(0, 3);

  // Handle case where there's no numeric field to chart
  if (chartFields.length === 0) {
    return <p className="text-yellow-400">No meaningful data to plot</p>;
  }

  // Build chart.js data structure
  const chartData = {
    labels,
    datasets: chartFields.map((field, index) => ({
      label: field,
      data: data.map((item) => Number(item[field])),
      backgroundColor: [
        "rgba(75, 192, 192, 0.5)",
        "rgba(153, 102, 255, 0.5)",
        "rgba(255, 159, 64, 0.5)",
      ][index],
      borderColor: [
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ][index],
      borderWidth: 1,
    })),
  };

  const handleXaxisChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setXAxis(e.target.value);
  };
  // Render the charts
  return (
    <div>
      <div className="p-4">
        <label htmlFor="x-axis" className="block font-semibold mb-2">
          Select X-Axis:
        </label>
        <select
          id="x-axis"
          value={xAxis}
          onChange={handleXaxisChange}
          className="border p-2 rounded w-full"
        >
          {numericKeys.map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>

        <p className="mt-4 text-lg">
          Selected X-Axis: <span className="font-bold">{xAxis}</span>
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 mx-5">
        <div className="bg-gray-900 p-4 rounded-lg shadow-md">
          <h3 className="text-white mb-2">Trend Analysis</h3>
          <Line
            data={chartData}
            options={{
              plugins: {
                title: {
                  display: true,
                  text: `Trend of ${chartFields.join(", ")} by ${labelKey}`,
                },
              },
            }}
          />
        </div>

        <div className="bg-gray-900 p-4 rounded-lg shadow-md">
          <h3 className="text-white mb-2">Comparison</h3>
          <Bar
            data={chartData}
            options={{
              plugins: {
                title: {
                  display: true,
                  text: `Comparison of ${chartFields.join(", ")}`,
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
