import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Leaf, Recycle, Trash2, AlertCircle, RefreshCw, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HistoryChart from './HistoryChart';

interface BinData {
  organic: number;
  inorganic: number;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<BinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const binRef = doc(db, 'bins', 'main_bin');
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
        setError("Failed to connect to Firebase. Check your configuration.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <RefreshCw className="w-12 h-12 text-blue-500 mb-4" />
        </motion.div>
        <p className="text-gray-600 font-medium">Initializing Smart System...</p>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] p-6 bg-red-50 rounded-2xl border border-red-100 shadow-inner"
      >
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-red-700 mb-2">Connection Error</h2>
        <p className="text-red-600 text-center max-w-md">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
        >
          Retry Connection
        </button>
      </motion.div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12"
    >
      <header className="text-center relative">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl mb-6 shadow-xl shadow-blue-100"
        >
          <Trash2 className="w-10 h-10 text-white" />
        </motion.div>
        <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-2">WebSmartBin</h1>
        <p className="text-lg text-gray-500 font-medium">Advanced Waste Intelligence Dashboard</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Organic Bin Card */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="group bg-white rounded-3xl shadow-2xl shadow-gray-100 overflow-hidden border border-gray-100 flex flex-col"
        >
          <div className="bg-green-600 p-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/30 rounded-xl backdrop-blur-sm">
                <Leaf className="text-white w-6 h-6" />
              </div>
              <h2 className="text-white font-bold text-xl tracking-tight">Organic</h2>
            </div>
          </div>
          <div className="p-10 text-center relative">
            <AnimatePresence mode="wait">
              <motion.span 
                key={data?.organic}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                className="text-8xl font-black text-green-700 block tabular-nums leading-none"
              >
                {data?.organic ?? 0}
              </motion.span>
            </AnimatePresence>
            <p className="text-gray-400 mt-4 font-bold uppercase text-xs tracking-widest">Total Items Detected</p>
          </div>
          <div className="mt-auto bg-green-50/50 px-6 py-4 flex items-center justify-between">
             <div className="flex items-center text-green-700 text-xs font-bold uppercase tracking-wider">
              <span className="relative flex h-2 w-2 mr-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Live Stream
            </div>
            <Info size={14} className="text-green-300 cursor-help" />
          </div>
        </motion.div>

        {/* Inorganic Bin Card */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="group bg-white rounded-3xl shadow-2xl shadow-gray-100 overflow-hidden border border-gray-100 flex flex-col"
        >
          <div className="bg-blue-600 p-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/30 rounded-xl backdrop-blur-sm">
                <Recycle className="text-white w-6 h-6" />
              </div>
              <h2 className="text-white font-bold text-xl tracking-tight">Inorganic</h2>
            </div>
          </div>
          <div className="p-10 text-center relative">
            <AnimatePresence mode="wait">
              <motion.span 
                key={data?.inorganic}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                className="text-8xl font-black text-blue-700 block tabular-nums leading-none"
              >
                {data?.inorganic ?? 0}
              </motion.span>
            </AnimatePresence>
            <p className="text-gray-400 mt-4 font-bold uppercase text-xs tracking-widest">Total Items Detected</p>
          </div>
          <div className="mt-auto bg-blue-50/50 px-6 py-4 flex items-center justify-between">
             <div className="flex items-center text-blue-700 text-xs font-bold uppercase tracking-wider">
              <span className="relative flex h-2 w-2 mr-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Live Stream
            </div>
            <Info size={14} className="text-blue-300 cursor-help" />
          </div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <HistoryChart />
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="bg-gray-900 rounded-3xl p-8 text-white shadow-2xl shadow-blue-900/10 border border-gray-800"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest">Infrastructure Status</h3>
          <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-black uppercase tracking-widest border border-green-500/20">System Optimal</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-2xl border border-white/5">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">IoT Device</p>
              <p className="text-sm font-semibold">ESP32-Node-01</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-2xl border border-white/5">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Data Source</p>
              <p className="text-sm font-semibold">Cloud Firestore</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-2xl border border-white/5">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
               <RefreshCw size={16} className="animate-spin-slow" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Last Sync</p>
              <p className="text-sm font-semibold">{new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
