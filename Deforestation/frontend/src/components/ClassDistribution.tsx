import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';

interface ClassDistributionProps {
  classPercentages: Record<string, number>;
  originalSize: number[];
  predictionSize: number[];
}

const ClassDistribution: React.FC<ClassDistributionProps> = ({
  classPercentages,
  originalSize,
  predictionSize,
}) => {
  const [chartType, setChartType] = React.useState<'bar' | 'pie'>('bar');

  // Convert percentages to chart data
  const chartData = Object.entries(classPercentages)
    .map(([class_name, percentage]) => ({
      class: class_name.charAt(0).toUpperCase() + class_name.slice(1),
      percentage: percentage,
      color: getClassColor(class_name)
    }))
    .sort((a, b) => b.percentage - a.percentage);

  const colors = [
    '#06B6D4', // cyan for urban
    '#3B82F6', // blue for water
    '#10B981', // green for forest
    '#F59E0B', // yellow for agriculture
    '#8B5CF6'  // purple for road
  ];

  function getClassColor(className: string): string {
    const colorMap: Record<string, string> = {
      'urban': '#06B6D4',
      'water': '#3B82F6',
      'forest': '#10B981',
      'agriculture': '#F59E0B',
      'road': '#8B5CF6'
    };
    return colorMap[className] || '#6B7280';
  }

  const totalPixels = originalSize[0] * originalSize[1];
  const predictionPixels = predictionSize[0] * predictionSize[1];

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2" />
            Land Cover Distribution
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                chartType === 'bar'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType('pie')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                chartType === 'pie'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <PieChartIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Chart */}
        <div className="h-80 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="class" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(2)}%`, 'Percentage']}
                  labelFormatter={(label) => `Class: ${label}`}
                />
                <Bar dataKey="percentage" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ class: className, percentage }) => `${className}: ${percentage.toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="percentage"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value.toFixed(2)}%`, 'Percentage']} />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Class Percentages */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Class Breakdown</h4>
            <div className="space-y-3">
              {chartData.map((item, index) => (
                <div key={item.class} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">
                      {item.class}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Image Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Image Information</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Original Size:</span>
                <span className="text-sm font-medium text-gray-900">
                  {originalSize[0]} × {originalSize[1]}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Analysis Size:</span>
                <span className="text-sm font-medium text-gray-900">
                  {predictionSize[0]} × {predictionSize[1]}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Pixels:</span>
                <span className="text-sm font-medium text-gray-900">
                  {totalPixels.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Summary</h4>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-800">Forest Coverage</span>
                </div>
                <div className="text-lg font-bold text-green-900 mt-1">
                  {classPercentages.forest?.toFixed(1) || 0}%
                </div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-yellow-800">Agriculture</span>
                </div>
                <div className="text-lg font-bold text-yellow-900 mt-1">
                  {classPercentages.agriculture?.toFixed(1) || 0}%
                </div>
              </div>
              <div className="p-3 bg-cyan-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                  <span className="text-sm font-medium text-cyan-800">Urban Area</span>
                </div>
                <div className="text-lg font-bold text-cyan-900 mt-1">
                  {classPercentages.urban?.toFixed(1) || 0}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDistribution;
