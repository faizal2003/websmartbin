import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Leaf, Recycle, Trash2, AlertCircle, RefreshCw } from 'lucide-react';

interface BinData {
  organic: number;
  inorganic: number;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<BinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reference to the main_bin document in the bins collection
    const binRef = doc(db, 'bins', 'main_bin');

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      binRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setData(docSnap.data() as BinData);
          setError(null);
        } else {
          setError("Document 'bins/main_bin' does not exist in Firestore.");
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching bin data:", err);
        setError("Failed to connect to Firebase. Please check your configuration and Firestore rules.");
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Connecting to Smart Bin...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 bg-red-50 rounded-xl border border-red-100">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-red-700 mb-2">Connection Error</h2>
        <p className="text-red-600 text-center max-w-md">{error}</p>
        <p className="mt-4 text-sm text-red-500 italic">Make sure your Firebase Config in src/firebase.ts is correct.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="text-center">
        <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
          <Trash2 className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Smart Bin Dashboard</h1>
        <p className="mt-2 text-lg text-gray-600">Real-time waste monitoring system</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Organic Bin Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100 transform transition-all hover:scale-[1.02]">
          <div className="bg-green-600 p-4 flex items-center justify-between">
            <h2 className="text-white font-bold text-xl uppercase tracking-wider">Organic Waste</h2>
            <Leaf className="text-green-100 w-8 h-8" />
          </div>
          <div className="p-8 text-center">
            <span className="text-7xl font-black text-green-700 tabular-nums">
              {data?.organic ?? 0}
            </span>
            <p className="text-gray-500 mt-2 font-medium uppercase text-sm tracking-widest">Total Count</p>
          </div>
          <div className="bg-green-50 px-6 py-3 border-t border-green-100">
            <div className="flex items-center text-green-700 text-sm font-semibold">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></div>
              Live Monitoring Active
            </div>
          </div>
        </div>

        {/* Inorganic Bin Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100 transform transition-all hover:scale-[1.02]">
          <div className="bg-blue-600 p-4 flex items-center justify-between">
            <h2 className="text-white font-bold text-xl uppercase tracking-wider">Inorganic Waste</h2>
            <Recycle className="text-blue-100 w-8 h-8" />
          </div>
          <div className="p-8 text-center">
            <span className="text-7xl font-black text-blue-700 tabular-nums">
              {data?.inorganic ?? 0}
            </span>
            <p className="text-gray-500 mt-2 font-medium uppercase text-sm tracking-widest">Total Count</p>
          </div>
          <div className="bg-blue-50 px-6 py-3 border-t border-blue-100">
            <div className="flex items-center text-blue-700 text-sm font-semibold">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse mr-2"></div>
              Live Monitoring Active
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">System Status</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            <span className="text-xs font-medium text-gray-700">ESP32 Connected</span>
          </div>
          <div className="flex items-center bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            <span className="text-xs font-medium text-gray-700">Firestore Sync</span>
          </div>
          <div className="flex items-center bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
            <span className="text-xs font-medium text-gray-400">Last update: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
