import { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  RefreshCw, 
  TrendingUp,
  Users,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import LeadCard from './LeadCard';
import StatsCard from './StatsCard';
import ReplyModal from './ReplyModal';

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isPolling, setIsPolling] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const previousLeadCount = useRef(0);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const POLL_INTERVAL = 5000; // 5 seconds

  const fetchLeads = async (silent = false) => {
    if (!silent) {
      setLoading(true);
    }
    setError(null);
    try {
      const response = await fetch(`${API_URL}/v1/leads?sortBy=createdAt&sortOrder=desc&limit=100`);
      if (!response.ok) {
        throw new Error('Failed to fetch leads');
      }
      const result = await response.json();
      const fetchedLeads = result.data || result.success ? (result.data || []) : [];
      
      // Check if we have new leads and show toast notification
      if (previousLeadCount.current > 0 && fetchedLeads.length > previousLeadCount.current) {
        const newLeadsCount = fetchedLeads.length - previousLeadCount.current;
        toast.success(
          `New Lead${newLeadsCount > 1 ? 's' : ''} Received! 🎉`,
          {
            duration: 4000,
            position: 'top-right',
            style: {
              background: '#18181b',
              color: '#fff',
              border: '1px solid rgba(99, 102, 241, 0.3)',
            },
          }
        );
      }
      
      previousLeadCount.current = fetchedLeads.length;
      setLeads(fetchedLeads);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err.message);
      if (leads.length === 0) {
        setLeads([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchLeads();
  }, []);

  // Polling for real-time updates
  useEffect(() => {
    if (!isPolling) return;

    const interval = setInterval(() => {
      fetchLeads(true); // Silent fetch (no loading spinner)
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [isPolling, leads.length]);

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'New').length,
    contacted: leads.filter(l => l.status === 'Contacted').length,
    high: leads.filter(l => l.priority === 'High').length
  };

  const handleOpenReplyModal = (lead) => {
    setSelectedLead(lead);
    setIsReplyModalOpen(true);
  };

  const handleCloseReplyModal = () => {
    setIsReplyModalOpen(false);
    setSelectedLead(null);
    fetchLeads(true); // Refresh leads after closing modal
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-900 overflow-hidden">
      {/* Premium Toast Notifications */}
      <Toaster />
      
      {/* Premium Dark Header - Fixed */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-premium border-b border-zinc-800 shadow-2xl z-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-3 rounded-2xl shadow-lg"
              >
                <LayoutDashboard className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-3xl font-bold text-white tracking-tight">
                    AI Intelligence Hub
                  </h1>
                  {isPolling && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="relative flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 px-3 py-1.5 rounded-full shadow-lg"
                    >
                      <div className="relative">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75 pulse-ring"></span>
                        <span className="relative inline-flex h-2.5 w-2.5 bg-white rounded-full"></span>
                      </div>
                      <span className="text-xs font-bold text-white tracking-wide">LIVE</span>
                    </motion.div>
                  )}
                </div>
                <p className="text-sm text-zinc-400 mt-1 font-medium">
                  AI-powered lead management & insights
                  {lastUpdate && (
                    <span className="ml-2 text-indigo-400">
                      • Updated {lastUpdate.toLocaleTimeString()}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPolling(!isPolling)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg ${
                  isPolling
                    ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                }`}
              >
                {isPolling ? 'Pause Updates' : 'Resume Updates'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fetchLeads()}
                disabled={loading}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content - Scrollable */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Premium Stats Grid with Stagger Animation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Leads"
              value={stats.total}
              icon={Users}
              color="blue"
              index={0}
            />
            <StatsCard
              title="New Leads"
              value={stats.new}
              icon={AlertCircle}
              color="yellow"
              index={1}
            />
            <StatsCard
              title="Contacted"
              value={stats.contacted}
              icon={CheckCircle2}
              color="green"
              index={2}
            />
            <StatsCard
              title="High Priority"
              value={stats.high}
              icon={TrendingUp}
              color="red"
              index={3}
            />
          </div>

          {/* Premium Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-premium border-l-4 border-yellow-500 p-5 rounded-2xl shadow-xl"
              >
                <div className="flex items-start">
                  <AlertCircle className="h-6 w-6 text-yellow-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Could not connect to API
                    </p>
                    <p className="text-xs text-zinc-400 mt-1">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recent Leads Section */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-3 mb-6"
            >
              <div className="h-1 w-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Recent Leads</h2>
            </motion.div>
            
            {loading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 glass-dark rounded-3xl border border-zinc-800"
              >
                <RefreshCw className="h-10 w-10 animate-spin text-indigo-500 mb-3" />
                <p className="text-zinc-400 font-medium">Loading your leads...</p>
              </motion.div>
            ) : leads.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="glass-dark rounded-3xl p-20 text-center shadow-2xl border border-zinc-800"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                >
                  <Users className="h-20 w-20 text-indigo-500 mx-auto mb-6" />
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">No leads yet</h3>
                <p className="text-zinc-400">Start receiving leads through your n8n webhook</p>
              </motion.div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {leads.map((lead, index) => (
                  <motion.div
                    key={lead._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.4,
                      delay: index * 0.1,
                      ease: "easeOut"
                    }}
                  >
                    <LeadCard lead={lead} index={index} onReplyClick={handleOpenReplyModal} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* Reply Modal */}
      {selectedLead && (
        <ReplyModal 
          isOpen={isReplyModalOpen} 
          onClose={handleCloseReplyModal} 
          lead={selectedLead} 
        />
      )}
    </div>
  );
};

export default Dashboard;
