// Frontend/src/Components/SampleCSVDisplay.js

import React from 'react';
import sampleCSV from './samplecsv';
import { FaDownload } from 'react-icons/fa';

const SampleCSVDisplay = () => {
  // Function to parse CSV string into headers and rows
  const parseCSV = (csv) => {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',').map(header => header.replace(/"/g, ''));
    const sampleData = lines[1].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(field => field.replace(/^"|"$/g, ''));
    return { headers, sampleData };
  };

  const { headers, sampleData } = parseCSV(sampleCSV);

  // Function to handle CSV download
  const downloadCSV = () => {
    const blob = new Blob([sampleCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sample_agents.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="my-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Sample CSV Structure</h2>
        <button
          onClick={downloadCSV}
          className="flex items-center px-4 py-2 mt-4 sm:mt-0 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <FaDownload className="mr-2" />
          Download Sample CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-slate-700 rounded-lg shadow-md">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 border-b border-gray-200 dark:border-slate-600 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-100 dark:hover:bg-slate-600">
              {sampleData.map((data, index) => (
                <td
                  key={index}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                >
                  {data}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-gray-600 dark:text-slate-400">
        <strong>Note:</strong> 
        - Use commas (`,`) to separate multiple values in array fields like <em>keyFeatures</em>, <em>useCases</em>, <em>tags</em>, <em>gallery</em>, and <em>companyResources_otherResources</em>.<br />
       
      </p>
    </div>
  );
};

export default SampleCSVDisplay;
