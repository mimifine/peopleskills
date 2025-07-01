import React, { useState, useEffect } from 'react';
import { Plus, Copy, Edit3, Trash2, Star, Package, Users, DollarSign, Calendar, Search, Filter, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase.js';

const AdminTalentPackages = () => {
  const [packages, setPackages] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [activeTab, setActiveTab] = useState('packages'); // 'packages' or 'templates'

  // Mock data for demonstration
  const mockPackages = [
    {
      id: 1,
      name: 'Fashion Campaign Package',
      description: 'Complete package for fashion brand campaigns',
      talent_count: 3,
      budget_range: '$15,000 - $25,000',
      duration: '2-3 days',
      is_template: false,
      template_name: null,
      created_at: '2025-01-02T10:30:00Z'
    },
    {
      id: 2,
      name: 'Tech Product Launch',
      description: 'Professional tech product launch package',
      talent_count: 2,
      budget_range: '$8,000 - $15,000',
      duration: '1 day',
      is_template: false,
      template_name: null,
      created_at: '2025-01-01T14:20:00Z'
    },
    {
      id: 3,
      name: 'Fitness Brand Commercial',
      description: 'High-energy fitness commercial package',
      talent_count: 5,
      budget_range: '$20,000 - $35,000',
      duration: '3 days',
      is_template: false,
      template_name: null,
      created_at: '2024-12-28T09:15:00Z'
    }
  ];

  const mockTemplates = [
    {
      id: 1,
      name: 'Standard Fashion Package',
      description: 'Reusable template for fashion campaigns',
      talent_count: 3,
      budget_range: '$10,000 - $20,000',
      duration: '2 days',
      is_template: true,
      template_name: 'Standard Fashion Package',
      created_at: '2024-12-01T10:00:00Z'
    },
    {
      id: 2,
      name: 'Tech Product Template',
      description: 'Template for tech product launches',
      talent_count: 2,
      budget_range: '$5,000 - $12,000',
      duration: '1 day',
      is_template: true,
      template_name: 'Tech Product Template',
      created_at: '2024-12-01T11:00:00Z'
    },
    {
      id: 3,
      name: 'Lifestyle Brand Package',
      description: 'Versatile template for lifestyle brands',
      talent_count: 4,
      budget_range: '$15,000 - $30,000',
      duration: '2-3 days',
      is_template: true,
      template_name: 'Lifestyle Brand Package',
      created_at: '2024-12-01T12:00:00Z'
    }
  ];

  useEffect(() => {
    // Load packages and templates
    setPackages(mockPackages);
    setTemplates(mockTemplates);
    setLoading(false);
  }, [mockPackages, mockTemplates]);

  const handleCloneTemplate = (template) => {
    setSelectedTemplate(template);
    setShowCloneModal(true);
  };

  const handleCreateFromTemplate = (templateName) => {
    // Create new package from template
    const newPackage = {
      id: Date.now(),
      name: `${templateName} - ${new Date().toLocaleDateString()}`,
      description: `Created from template: ${templateName}`,
      talent_count: selectedTemplate.talent_count,
      budget_range: selectedTemplate.budget_range,
      duration: selectedTemplate.duration,
      is_template: false,
      template_name: null,
      created_at: new Date().toISOString()
    };
    
    setPackages(prev => [newPackage, ...prev]);
    setShowCloneModal(false);
    setSelectedTemplate(null);
  };

  const filteredPackages = packages.filter(pkg => 
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading packages...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Talent Packages</h2>
          <p className="text-gray-600">Manage packages and templates for talent selection</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Package</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('packages')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'packages'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Active Packages ({packages.length})
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'templates'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Templates ({templates.length})
          </button>
        </nav>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search packages and templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Content */}
      {activeTab === 'packages' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPackages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-lg shadow border overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{pkg.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{pkg.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{pkg.talent_count} talent</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span>{pkg.budget_range}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{pkg.duration}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Created {new Date(pkg.created_at).toLocaleDateString()}
                  </span>
                  <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="bg-white rounded-lg shadow border overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <h3 className="text-xl font-semibold text-gray-900">{template.name}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{template.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleCloneTemplate(template)}
                      className="p-2 text-gray-400 hover:text-purple-600"
                      title="Clone template"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{template.talent_count} talent</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span>{template.budget_range}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{template.duration}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Template created {new Date(template.created_at).toLocaleDateString()}
                  </span>
                  <button 
                    onClick={() => handleCloneTemplate(template)}
                    className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Clone Template Modal */}
      {showCloneModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create Package from Template</h3>
            <p className="text-gray-600 mb-4">
              Create a new package based on &quot;{selectedTemplate.name}&quot; template?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCloneModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCreateFromTemplate(selectedTemplate.name)}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Create Package
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTalentPackages; 