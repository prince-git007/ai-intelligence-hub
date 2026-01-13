import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  RefreshCw, 
  TrendingUp,
  Users,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import LeadCard from './LeadCard';
import StatsCard from './StatsCard';

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:5000/api';

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/leads`);
      if (!response.ok) {
        throw new Error('Failed to fetch leads');
      }
      const data = await response.json();
      setLeads(data.data || []);
    } catch (err) {
      setError(err.message);
      // Mock data for demonstration if API is not available
      setLeads([
        {
          _id: '1',
          source: 'Website Contact Form',
          originalContent: 'Hi, I am interested in your AI solutions for our enterprise.',
          aiSummary: 'Enterprise client interested in AI solutions. High potential for conversion.',
          priority: 'High',
          status: 'New',
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          source: 'LinkedIn Message',
          originalContent: 'Can we schedule a demo call next week?',
          aiSummary: 'Interested prospect requesting product demo.',
          priority: 'Medium',
          status: 'New',
          createdAt: new Date().toISOString()
        },
        {
          _id: '3',
          source: 'Email Inquiry',
          originalContent: 'Looking for pricing information on your services.',
          aiSummary: 'Price inquiry from potential customer.',
          priority: 'Medium',
          status: 'Contacted',
          createdAt: new Date().toISOString()
        },
        {
          _id: '4',
          source: 'Twitter DM',
          originalContent: 'Just browsing, might be interested later.',
          aiSummary: 'Low urgency lead, follow up in future.',
          priority: 'Low',
          status: 'New',
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'New').length,
    contacted: leads.filter(l => l.status === 'Contacted').length,
    high: leads.filter(l => l.priority === 'High').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl">
                <LayoutDashboard className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">AI Intelligence Hub</h1>
                <p className="text-sm text-gray-500 mt-1">Manage and track your leads</p>
              </div>
            </div>
            <button
              onClick={fetchLeads}
              disabled={loading}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Leads"
            value={stats.total}
            icon={Users}
            color="blue"
          />
          <StatsCard
            title="New Leads"
            value={stats.new}
            icon={AlertCircle}
            color="yellow"
          />
          <StatsCard
            title="Contacted"
            value={stats.contacted}
            icon={CheckCircle2}
            color="green"
          />
          <StatsCard
            title="High Priority"
            value={stats.high}
            icon={TrendingUp}
            color="red"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
              <div>
                <p className="text-sm text-yellow-700">
                  Could not connect to API. Showing demo data.
                </p>
                <p className="text-xs text-yellow-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Leads Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Leads</h2>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : leads.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No leads yet</h3>
              <p className="text-gray-500">Start receiving leads through your n8n webhook</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {leads.map((lead) => (
                <LeadCard key={lead._id} lead={lead} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
