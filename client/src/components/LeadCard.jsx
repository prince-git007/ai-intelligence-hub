import { 
  Calendar, 
  MessageSquare, 
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Reply
} from 'lucide-react';
import { motion } from 'framer-motion';

const LeadCard = ({ lead, index = 0, onReplyClick }) => {
  const priorityColors = {
    High: 'bg-red-500/10 text-red-400 border-red-500/30',
    Medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    Low: 'bg-green-500/10 text-green-400 border-green-500/30'
  };

  const statusColors = {
    New: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    Contacted: 'bg-purple-500/10 text-purple-400 border-purple-500/30'
  };

  const priorityIcons = {
    High: '🔥',
    Medium: '⚡',
    Low: '📝'
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className="relative glass-dark rounded-3xl overflow-hidden border border-zinc-800 group"
    >
      {/* Subtle border gradient on hover */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-xl"></div>
      </div>

      <div className="relative">
        {/* Header */}
        <div className="bg-zinc-800/30 border-b border-zinc-800 px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <motion.div whileHover={{ rotate: 12 }} transition={{ duration: 0.3 }}>
                  <MessageSquare className="h-5 w-5 text-indigo-400" />
                </motion.div>
                <h3 className="text-lg font-semibold text-white">{lead.source}</h3>
              </div>
              <div className="flex items-center text-sm text-zinc-400">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(lead.createdAt)}
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-2">
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${priorityColors[lead.priority]}`}
              >
                {priorityIcons[lead.priority]} {lead.priority}
              </motion.span>
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center space-x-1 ${statusColors[lead.status]}`}
              >
                {lead.status === 'New' ? <AlertCircle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                <span>{lead.status}</span>
              </motion.span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Original Content */}
          <div>
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2 block">
              Original Message
            </label>
            <p className="text-zinc-300 text-sm leading-relaxed bg-zinc-800/30 p-4 rounded-lg border border-zinc-800">
              {lead.originalContent}
            </p>
          </div>

          {/* AI Summary */}
          {lead.aiSummary && (
            <div>
              <label className="text-xs font-semibold text-indigo-400 uppercase tracking-wide mb-2 block flex items-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1.5
                  }}
                >
                  <Sparkles className="h-4 w-4 mr-1.5" />
                </motion.div>
                AI Smart Insight
              </label>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg blur opacity-10"></div>
                <motion.p 
                  whileHover={{ 
                    transition: { duration: 0.3 }
                  }}
                  className="relative text-zinc-200 text-sm leading-relaxed bg-zinc-800/50 p-4 rounded-lg border border-indigo-500/20"
                >
                  {lead.aiSummary}
                </motion.p>
              </div>
            </div>
          )}
        </div>

        {/* Footer with proper flex layout */}
        <div className="px-6 py-4 bg-zinc-800/20 border-t border-zinc-800">
          <div className="flex items-center space-x-3">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-green-900/30"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span className="hidden sm:inline">Mark as Contacted</span>
              <span className="sm:hidden">Contacted</span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onReplyClick(lead)}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-indigo-900/30"
            >
              <Reply className="h-4 w-4" />
              <span>Reply</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LeadCard;
