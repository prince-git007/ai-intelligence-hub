import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, color, index = 0 }) => {
  const colorVariants = {
    blue: {
      gradient: 'from-blue-500 to-indigo-600',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      glow: 'shadow-blue-900/50'
    },
    yellow: {
      gradient: 'from-yellow-500 to-orange-600',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400',
      glow: 'shadow-yellow-900/50'
    },
    green: {
      gradient: 'from-green-500 to-emerald-600',
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'text-green-400',
      glow: 'shadow-green-900/50'
    },
    red: {
      gradient: 'from-red-500 to-pink-600',
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      glow: 'shadow-red-900/50'
    }
  };

  const colors = colorVariants[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.05, 
        transition: { duration: 0.2 }
      }}
      className="relative glass-dark rounded-3xl overflow-hidden border border-zinc-800 group"
    >
      {/* Subtle glow on hover */}
      <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}>
        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${colors.gradient} blur-2xl opacity-20`}></div>
      </div>

      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-2">{title}</p>
            <motion.p 
              className="text-5xl font-bold text-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 10,
                delay: index * 0.1 + 0.3
              }}
            >
              {value}
            </motion.p>
          </div>
          <motion.div 
            className={`${colors.bg} ${colors.border} border p-4 rounded-2xl ${colors.glow} shadow-lg`}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <div className={`bg-gradient-to-br ${colors.gradient} p-2.5 rounded-xl shadow-lg`}>
              <Icon className="h-7 w-7 text-white" />
            </div>
          </motion.div>
        </div>
        
        {/* Decorative line at bottom */}
        <div className="mt-4 pt-4 border-t border-zinc-800">
          <div className={`h-1 w-16 bg-gradient-to-r ${colors.gradient} rounded-full`}></div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
