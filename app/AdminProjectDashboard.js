import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Users, DollarSign, MapPin, Clock, Search, Filter, ChevronDown, Eye, UserPlus, CheckCircle, AlertCircle, FileText, Briefcase, Star, SortAsc, SortDesc } from 'lucide-react';
import { supabase } from '../lib/supabase.js';

const AdminProjectDashboard = () => {
  console.log('🚀 AdminProjectDashboard component rendered');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      // For now, let's always use mock data to ensure it shows up
      const mockProjects = [
        {
          id: 1,
          title: 'Summer Fashion Campaign 2025',
          description: 'Looking for diverse models for our sustainable fashion line summer campaign. Focus on natural beauty and authentic lifestyle moments.',
          budget_min: 15000,
          budget_max: 25000,
          deadline: '2025-07-15',
          shoot_start_date: '2025-07-20',
          shoot_end_date: '2025-07-22',
          location: 'Los Angeles, CA',
          usage_rights: 'Digital advertising, social media, website use for 12 months',
          number_of_talent: 3,
          status: 'needs_talent',
          created_at: '2025-01-02T10:30:00Z',
          brand_user_id: 'brand-1',
          company_id: 'sephora-1',
          users: { full_name: 'Emma Davis', email: 'emma@sephora.com', company_name: 'Sephora', position: 'Marketing Director' },
          collaborators: [
            { id: 'user-2', name: 'Sarah Kim', position: 'Creative Director', role: 'collaborator' },
            { id: 'user-3', name: 'Mike Johnson', position: 'Brand Manager', role: 'viewer' }
          ],
          primary_contact: { name: 'Emma Davis', email: 'emma@sephora.com' },
          project_talent: [],
          talent_count: 0
        },
        {
          id: 2,
          title: 'Tech Product Launch',
          description: 'Seeking tech-savvy talent for our new AI product launch. Professional, modern aesthetic with diverse representation.',
          budget_min: 8000,
          budget_max: 15000,
          deadline: '2025-06-30',
          shoot_start_date: '2025-07-05',
          shoot_end_date: '2025-07-05',
          location: 'San Francisco, CA',
          usage_rights: 'All media rights for 6 months including TV commercial',
          number_of_talent: 2,
          status: 'talent_assigned',
          created_at: '2025-01-01T14:20:00Z',
          brand_user_id: 'brand-2',
          company_id: 'apple-1',
          users: { full_name: 'Mike Chen', email: 'mike@apple.com', company_name: 'Apple', position: 'Product Marketing Lead' },
          collaborators: [
            { id: 'user-5', name: 'Jennifer Liu', position: 'Creative Director', role: 'collaborator' }
          ],
          primary_contact: { name: 'Mike Chen', email: 'mike@apple.com' },
          project_talent: [1, 2],
          talent_count: 2
        },
        {
          id: 3,
          title: 'Fitness Brand Commercial',
          description: 'High-energy fitness commercial featuring real athletes and fitness enthusiasts. Authenticity is key.',
          budget_min: 20000,
          budget_max: 35000,
          deadline: '2025-08-01',
          shoot_start_date: '2025-08-10',
          shoot_end_date: '2025-08-12',
          location: 'Miami, FL',
          usage_rights: 'Worldwide rights for 24 months across all platforms',
          number_of_talent: 5,
          status: 'completed',
          created_at: '2024-12-28T09:15:00Z',
          brand_user_id: 'brand-3',
          company_id: 'nike-1',
          users: { full_name: 'Lisa Wang', email: 'lisa@nike.com', company_name: 'Nike', position: 'Global Marketing Lead' },
          collaborators: [
            { id: 'user-7', name: 'James Smith', position: 'Campaign Manager', role: 'collaborator' },
            { id: 'user-8', name: 'Anna Chen', position: 'Junior Coordinator', role: 'viewer' },
            { id: 'user-9', name: 'David Park', position: 'Brand Director', role: 'owner' }
          ],
          primary_contact: { name: 'David Park', email: 'david@nike.com' },
          project_talent: [1, 2, 3, 4, 5],
          talent_count: 5
        },
        {
          id: 4,
          title: 'Beauty Brand Lifestyle Shoot',
          description: 'Natural beauty campaign showcasing our new skincare line in everyday scenarios.',
          budget_min: 12000,
          budget_max: 18000,
          deadline: '2025-07-30',
          shoot_start_date: '2025-08-05',
          shoot_end_date: '2025-08-06',
          location: 'New York, NY',
          usage_rights: 'Digital and print advertising for 18 months',
          number_of_talent: 4,
          status: 'needs_talent',
          created_at: '2025-01-03T16:45:00Z',
          brand_user_id: 'brand-4',
          company_id: 'glossier-1',
          users: { full_name: 'Emma Davis', email: 'emma@glossier.com', company_name: 'Glossier', position: 'Creative Director' },
          collaborators: [],
          primary_contact: { name: 'Emma Davis', email: 'emma@glossier.com' },
          project_talent: [],
          talent_count: 0
        }
      ];
      setProjects(mockProjects);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (project.location && project.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (project.users?.full_name && project.users.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (project.users?.company_name && project.users.company_name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'deadline':
          aValue = new Date(a.deadline);
          bValue = new Date(b.deadline);
          break;
        case 'budget_max':
          aValue = a.budget_max;
          bValue = b.budget_max;
          break;
        case 'created_at':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        default:
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [projects, searchTerm, statusFilter, sortBy, sortOrder]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'needs_talent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'talent_assigned':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'needs_talent':
        return <AlertCircle className="h-4 w-4" />;
      case 'talent_assigned':
        return <Users className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'Not set';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getDaysUntilDeadline = (deadline) => {
    if (!deadline) return 'No deadline';
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Stats
  const stats = {
    total: projects.length,
    needsTalent: projects.filter(p => p.status === 'draft').length, // Using draft as "needs talent"
    talentAssigned: projects.filter(p => p.status === 'active').length, // Using active as "talent assigned"
    completed: projects.filter(p => p.status === 'completed').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Project Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage brand projects and talent assignments</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Projects</p>
                  <p className="text-2xl font-semibold">{stats.total}</p>
                </div>
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Needs Talent</p>
                  <p className="text-2xl font-semibold text-red-600">{stats.needsTalent}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Talent Assigned</p>
                  <p className="text-2xl font-semibold text-yellow-600">{stats.talentAssigned}</p>
                </div>
                <Users className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-semibold text-green-600">{stats.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search projects by title, description, location, or brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                <ChevronDown className={`h-4 w-4 transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {filteredAndSortedProjects.length} of {projects.length} projects
                </span>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="created_at">Created Date</option>
                    <option value="deadline">Deadline</option>
                    <option value="title">Title</option>
                    <option value="budget_max">Budget</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="all">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>



      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAndSortedProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow border overflow-hidden hover:shadow-lg transition-shadow">
              {/* Project Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                      <span className="text-purple-600 font-bold">{project.users?.company_name || 'Unknown Company'}</span>
                      <span className="text-gray-400 mx-2">|</span>
                      <span>{project.title}</span>
                    </h3>
                  </div>
                  <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                    {getStatusIcon(project.status)}
                    <span className="capitalize">{project.status.replace('_', ' ')}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm line-clamp-3 mb-4">{project.description}</p>

                {/* Project Meta */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start text-gray-600">
                    <Users className="h-4 w-4 mr-2 mt-0.5" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{project.users?.full_name || 'Unknown User'}</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          {project.users?.position || 'Brand Manager'}
                        </span>
                      </div>
                      <span className="text-gray-400 block text-xs">{project.users?.company_name || 'Unknown Company'}</span>
                      {project.collaborators && project.collaborators.length > 0 && (
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <span>+{project.collaborators.length} collaborator{project.collaborators.length !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{project.location || 'Location not set'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Deadline: {formatDate(project.deadline)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span>{formatCurrency(project.budget_min)} - {formatCurrency(project.budget_max)}</span>
                  </div>
                </div>

                {/* Collaborators Preview */}
                {project.collaborators && project.collaborators.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-700 mb-2">Team Members</p>
                    <div className="flex flex-wrap gap-2">
                      {project.collaborators.slice(0, 3).map((collaborator, index) => (
                        <div key={index} className="flex items-center space-x-1 text-xs bg-gray-100 rounded-full px-2 py-1">
                          <span className="font-medium">{collaborator.name}</span>
                          <span className="text-gray-500">·</span>
                          <span className="text-gray-500 capitalize">{collaborator.role}</span>
                        </div>
                      ))}
                      {project.collaborators.length > 3 && (
                        <span className="text-xs text-gray-500 px-2 py-1">
                          +{project.collaborators.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Project Details */}
              <div className="p-6 bg-gray-50">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-purple-600">{project.number_of_talent}</p>
                    <p className="text-xs text-gray-500">Talent Needed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-blue-600">{project.talent_count}</p>
                    <p className="text-xs text-gray-500">Talent Assigned</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-2xl font-semibold ${getDaysUntilDeadline(project.deadline) < 7 && getDaysUntilDeadline(project.deadline) !== 'No deadline' ? 'text-red-600' : 'text-green-600'}`}>
                      {getDaysUntilDeadline(project.deadline)}
                    </p>
                    <p className="text-xs text-gray-500">Days Left</p>
                  </div>
                </div>

                {/* Shoot Dates */}
                <div className="mb-4 p-3 bg-white rounded border">
                  <p className="text-xs font-medium text-gray-700 mb-1">Shoot Dates</p>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatDate(project.shoot_start_date)} - {formatDate(project.shoot_end_date)}</span>
                  </div>
                </div>

                {/* Usage Rights */}
                <div className="mb-4 p-3 bg-white rounded border">
                  <p className="text-xs font-medium text-gray-700 mb-1">Usage Rights</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{project.usage_rights || 'Not specified'}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 border-t border-gray-100">
                <div className="flex space-x-3">
                  <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center justify-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                  {project.status === 'draft' && (
                    <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm flex items-center justify-center space-x-2">
                      <UserPlus className="h-4 w-4" />
                      <span>Select Talent</span>
                    </button>
                  )}
                  {project.status === 'active' && (
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center justify-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Manage Talent</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredAndSortedProjects.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProjectDashboard; 