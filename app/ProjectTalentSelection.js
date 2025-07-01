import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Users, Star, MapPin, DollarSign, Check, X, Package, Eye, Heart, MessageCircle, Image, ChevronDown, SortAsc, SortDesc, ArrowLeft, Save, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase.js';

const ProjectTalentSelection = ({ project, onClose, onTalentAssigned }) => {
  // State for talent data and selection
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTalent, setSelectedTalent] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });

  // State for search, filters, and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [rateRange, setRateRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch talent from Supabase on component mount
  useEffect(() => {
    fetchTalents();
    fetchExistingSelections();
  }, [project.id]);

  const fetchTalents = async () => {
    try {
      const { data, error } = await supabase
        .from('talent_profiles')
        .select('*')
        .order('full_name');

      if (error) throw error;

      // Transform data to match card format
      const transformedTalents = data.map(talent => ({
        id: talent.id,
        name: talent.full_name || talent.name,
        category: talent.category || 'Not specified',
        rate: talent.daily_rate ? parseInt(talent.daily_rate) : 0,
        location: talent.location || 'Location not specified',
        rating: talent.rating || 4.5,
        image: talent.image_url || '/api/placeholder/300/400',
        bio: talent.bio || '',
        socials: {
          instagram: { 
            followers: talent.instagram_followers || 0,
            handle: talent.instagram || ''
          },
          tiktok: { 
            followers: talent.tiktok_followers || 0,
            handle: talent.tiktok || ''
          }
        },
        votes: { up: [], down: [], userVote: null },
        favorites: [],
        tags: talent.category ? [talent.category.toLowerCase()] : ['talent']
      }));

      setTalents(transformedTalents);
    } catch (error) {
      console.error('Error fetching talents:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingSelections = async () => {
    try {
      const { data, error } = await supabase
        .from('project_talent')
        .select('talent_id')
        .eq('project_id', project.id);

      if (error) throw error;

      const selectedIds = data.map(item => item.talent_id);
      setSelectedTalent(selectedIds);
    } catch (error) {
      console.error('Error fetching existing selections:', error);
    }
  };

  // Get unique categories and locations for filter dropdowns
  const categories = [...new Set(talents.map(t => t.category))];
  const locations = [...new Set(talents.map(t => t.location))];

  // Filter and sort talents
  const filteredAndSortedTalents = useMemo(() => {
    let filtered = talents.filter(talent => {
      const matchesSearch = talent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           talent.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           talent.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           talent.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || talent.category === selectedCategory;
      const matchesLocation = selectedLocation === 'all' || talent.location === selectedLocation;
      
      const matchesRate = (!rateRange.min || talent.rate >= parseInt(rateRange.min)) &&
                         (!rateRange.max || talent.rate <= parseInt(rateRange.max));
      
      return matchesSearch && matchesCategory && matchesLocation && matchesRate;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'rate':
          aValue = a.rate;
          bValue = b.rate;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'followers':
          aValue = a.socials.instagram.followers + a.socials.tiktok.followers;
          bValue = b.socials.instagram.followers + b.socials.tiktok.followers;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [talents, searchTerm, selectedCategory, selectedLocation, rateRange, sortBy, sortOrder]);

  // Selection handlers
  const handleSelectTalent = (talentId) => {
    setSelectedTalent(prev => 
      prev.includes(talentId) 
        ? prev.filter(id => id !== talentId)
        : [...prev, talentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTalent.length === filteredAndSortedTalents.length) {
      setSelectedTalent([]);
    } else {
      setSelectedTalent(filteredAndSortedTalents.map(t => t.id));
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedLocation('all');
    setRateRange({ min: '', max: '' });
    setSortBy('name');
    setSortOrder('asc');
  };

  const saveTalentSelection = async () => {
    setSaving(true);
    setSaveMessage({ type: '', text: '' });

    try {
      // First, remove existing selections for this project
      const { error: deleteError } = await supabase
        .from('project_talent')
        .delete()
        .eq('project_id', project.id);

      if (deleteError) throw deleteError;

      // Then, insert new selections
      if (selectedTalent.length > 0) {
        const selections = selectedTalent.map(talentId => ({
          project_id: project.id,
          talent_id: talentId,
          selected_by: (await supabase.auth.getUser()).data.user?.id,
          status: 'selected'
        }));

        const { error: insertError } = await supabase
          .from('project_talent')
          .insert(selections);

        if (insertError) throw insertError;
      }

      setSaveMessage({ type: 'success', text: `Successfully assigned ${selectedTalent.length} talent to project` });
      
      // Call callback to update parent component
      if (onTalentAssigned) {
        onTalentAssigned(selectedTalent.length);
      }

      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Error saving talent selection:', error);
      setSaveMessage({ type: 'error', text: 'Failed to save talent selection. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const formatFollowers = (count) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(0) + 'K';
    return count.toString();
  };

  const formatRate = (rate) => {
    if (!rate) return 'Rate not specified';
    return `$${rate.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="modal-backdrop">
        <div className="modal p-8 max-w-4xl w-full">
          <div className="flex items-center justify-center h-64">
            <div className="spinner"></div>
            <span className="ml-3 text-gray-600">Loading talent...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop">
      <div className="modal p-6 max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Select Talent for Project</h2>
              <p className="text-gray-600 mt-1">{project.title}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {selectedTalent.length} talent selected
            </span>
            <button
              onClick={saveTalentSelection}
              disabled={saving}
              className="btn btn-primary flex items-center space-x-2"
            >
              {saving ? (
                <>
                  <div className="spinner"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Selection</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Save Message */}
        {saveMessage.text && (
          <div className={`mb-6 p-4 rounded-lg border-2 ${
            saveMessage.type === 'success' 
              ? 'bg-green-50 text-green-800 border-green-300' 
              : 'bg-red-50 text-red-800 border-red-300'
          }`}>
            <div className="flex items-center">
              {saveMessage.type === 'success' ? (
                <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
              ) : (
                <X className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
              )}
              <span className="font-medium">{saveMessage.text}</span>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-background-secondary rounded-lg p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search talent by name, category, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-ghost btn-sm flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              <button
                onClick={handleSelectAll}
                className="btn btn-ghost btn-sm"
              >
                {selectedTalent.length === filteredAndSortedTalents.length ? 'Deselect All' : 'Select All'}
              </button>
              
              <button
                onClick={clearFilters}
                className="btn btn-ghost btn-sm"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="input"
                >
                  <option value="all">All Locations</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Rate</label>
                <input
                  type="number"
                  placeholder="Min rate"
                  value={rateRange.min}
                  onChange={(e) => setRateRange(prev => ({ ...prev, min: e.target.value }))}
                  className="input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Rate</label>
                <input
                  type="number"
                  placeholder="Max rate"
                  value={rateRange.max}
                  onChange={(e) => setRateRange(prev => ({ ...prev, max: e.target.value }))}
                  className="input"
                />
              </div>
            </div>
          )}
        </div>

        {/* Talent Grid */}
        <div className="overflow-y-auto max-h-[60vh]">
          {filteredAndSortedTalents.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No talent found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedTalents.map((talent) => (
                <div
                  key={talent.id}
                  className={`card card-bordered p-4 cursor-pointer transition-all ${
                    selectedTalent.includes(talent.id) 
                      ? 'ring-2 ring-primary border-primary' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => handleSelectTalent(talent.id)}
                >
                  {/* Selection Checkbox */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedTalent.includes(talent.id)}
                        onChange={() => handleSelectTalent(talent.id)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="text-sm font-medium text-gray-600">Select</span>
                    </div>
                    {selectedTalent.includes(talent.id) && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>

                  {/* Talent Image */}
                  <div className="relative mb-4">
                    <img
                      src={talent.image}
                      alt={talent.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                      {talent.category}
                    </div>
                  </div>

                  {/* Talent Info */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-foreground">{talent.name}</h3>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{talent.location}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <DollarSign className="h-4 w-4" />
                      <span>{formatRate(talent.rate)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{talent.rating}</span>
                    </div>

                    {/* Social Media */}
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      {talent.socials.instagram.followers > 0 && (
                        <span>📸 {formatFollowers(talent.socials.instagram.followers)}</span>
                      )}
                      {talent.socials.tiktok.followers > 0 && (
                        <span>🎵 {formatFollowers(talent.socials.tiktok.followers)}</span>
                      )}
                    </div>

                    {/* Bio */}
                    {talent.bio && (
                      <p className="text-sm text-gray-600 line-clamp-2">{talent.bio}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectTalentSelection; 