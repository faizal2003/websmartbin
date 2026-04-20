import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

interface HistoryData {
  time: string;
  organic: number;
  inorganic: number;
}

const mockHistory: HistoryData[] = [
  { time: '00:00', organic: 12, inorganic: 8 },
  { time: '03:00', organic: 5, inorganic: 3 },
  { time: '06:00', organic: 18, inorganic: 12 },
  { time: '09:00', organic: 35, inorganic: 25 },
  { time: '12:00', organic: 48, inorganic: 38 },
  { time: '15:00', organic: 42, inorganic: 34 },
  { time: '18:00', organic: 55, inorganic: 45 },
  { time: '21:00', organic: 38, inorganic: 28 },
];

const HistoryChart: React.FC = () => {
  const [showOrganic, setShowOrganic] = useState(true);
  const [showInorganic, setShowInorganic] = useState(true);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Hourly Trends</h2>
          <p className="text-sm text-gray-500">24-hour waste activity summary (3h intervals)</p>
        </div>

        <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200">
          <button
            onClick={() => setShowOrganic(!showOrganic)}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              showOrganic 
                ? 'bg-white text-green-700 shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className={`w-2 h-2 rounded-full mr-2 ${showOrganic ? 'bg-green-500' : 'bg-gray-300'}`} />
            Organic
          </button>
          <button
            onClick={() => setShowInorganic(!showInorganic)}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              showInorganic 
                ? 'bg-white text-blue-700 shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className={`w-2 h-2 rounded-full mr-2 ${showInorganic ? 'bg-blue-500' : 'bg-gray-300'}`} />
            Inorganic
          </button>
        </div>
      </div>

      <div className="h-[300px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={mockHistory}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorInorganic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
            />
            <Tooltip 
              cursor={{ stroke: '#f3f4f6', strokeWidth: 2 }}
              contentStyle={{ 
                borderRadius: '16px', 
                border: 'none', 
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                padding: '12px 16px'
              }} 
            />
            {showOrganic && (
              <Area
                type="monotone"
                dataKey="organic"
                name="Organic"
                stroke="#16a34a"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorOrganic)"
                animationDuration={1000}
              />
            )}
            {showInorganic && (
              <Area
                type="monotone"
                dataKey="inorganic"
                name="Inorganic"
                stroke="#2563eb"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorInorganic)"
                animationDuration={1000}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
        
        <AnimatePresence>
          {!showOrganic && !showInorganic && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[2px] rounded-xl"
            >
              <p className="text-gray-500 font-medium bg-white px-6 py-3 rounded-full shadow-lg border border-gray-100">
                Select a category to view data
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default HistoryChart;
