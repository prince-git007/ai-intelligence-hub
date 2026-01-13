const StatsCard = ({ title, value, icon: Icon, color }) => {
  const colorVariants = {
    blue: 'from-blue-500 to-indigo-600',
    yellow: 'from-yellow-500 to-orange-600',
    green: 'from-green-500 to-emerald-600',
    red: 'from-red-500 to-pink-600'
  };

  const bgColorVariants = {
    blue: 'bg-blue-50',
    yellow: 'bg-yellow-50',
    green: 'bg-green-50',
    red: 'bg-red-50'
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`${bgColorVariants[color]} p-4 rounded-xl`}>
            <div className={`bg-gradient-to-br ${colorVariants[color]} p-2 rounded-lg`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
