import { 
  Calendar, 
  MessageSquare, 
  Sparkles,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

const LeadCard = ({ lead }) => {
  const priorityColors = {
    High: 'bg-red-100 text-red-800 border-red-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Low: 'bg-green-100 text-green-800 border-green-200'
  };

  const statusColors = {
    New: 'bg-blue-100 text-blue-800 border-blue-200',
    Contacted: 'bg-purple-100 text-purple-800 border-purple-200'
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
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <MessageSquare className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">{lead.source}</h3>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(lead.createdAt)}
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${priorityColors[lead.priority]}`}>
              {priorityIcons[lead.priority]} {lead.priority}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[lead.status]}`}>
              {lead.status === 'New' ? <AlertCircle className="h-3 w-3 inline mr-1" /> : <CheckCircle2 className="h-3 w-3 inline mr-1" />}
              {lead.status}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Original Content */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
            Original Message
          </label>
          <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
            {lead.originalContent}
          </p>
        </div>

        {/* AI Summary */}
        {lead.aiSummary && (
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block flex items-center">
              <Sparkles className="h-4 w-4 mr-1 text-indigo-600" />
              AI Summary
            </label>
            <p className="text-gray-700 text-sm leading-relaxed bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-100">
              {lead.aiSummary}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 group-hover:shadow-md">
          <CheckCircle2 className="h-4 w-4" />
          <span>Mark as Contacted</span>
        </button>
      </div>
    </div>
  );
};

export default LeadCard;
