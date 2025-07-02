'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  ChevronDown, 
  Save, 
  Check, 
  X, 
  UserPlus,
  Users,
  Star,
  MapPin,
  DollarSign,
  Instagram,
  MessageCircle
} from 'lucide-react';

const ProjectTalentSelection = ({ project, onClose, onTalentAssigned, currentUser }) => {
  const [talents, setTalents] = useState([]);
  const [selectedTalent, setSelectedTalent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [rateRange, setRateRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchTalents();
    fetchExistingSelections();
  }, []);

  const fetchTalents = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching talent from Supabase...');
      
      // Fetch real talent data from Supabase
      const { data: talentData, error } = await supabase
        .from('talent_profiles')
        .select('*')
        .order('full_name', { ascending: true });

      if (error) {
        console.error('❌ Error fetching talent:', error);
        throw error;
      }

      console.log('✅ Fetched talent data:', talentData);

      // Transform data to match the expected format
      const transformedTalents = talentData.map(talent => ({
        id: talent.id,
        name: talent.full_name || 'Unknown Talent',
        category: talent.category || 'Not specified',
        location: talent.location || 'Location not specified',
        rate: talent.daily_rate || 0,
        bio: talent.bio || '',
        rating: 4.5, // Mock rating
        tags: ['Professional', 'Reliable'], // Mock tags
        socials: {
          instagram: { 
            followers: talent.socials?.instagram?.followers || 0,
            handle: talent.socials?.instagram?.handle || ''
          },
          tiktok: { 
            followers: talent.socials?.tiktok?.followers || 0,
            handle: talent.socials?.tiktok?.handle || ''
          }
        },
        photos: talent.photos || [],
        videos: talent.videos || []
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
      const { data: existingSelections, error } = await supabase
        .from('project_talent')
        .select('talent_profile_id')
        .eq('project_id', project.id)
        .eq('status', 'selected');

      if (error) {
        console.error('Error fetching existing selections:', error);
        return;
      }

      const selectedIds = existingSelections.map(selection => selection.talent_profile_id);
      setSelectedTalent(selectedIds);
    } catch (error) {
      console.error('Error fetching existing selections:', error);
    }
  };

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
    console.log('🎯 Save talent selection triggered!');
    console.log('📝 Selected talent:', selectedTalent);
    console.log('📋 Project:', project);
    
    if (selectedTalent.length === 0) {
      setSaveMessage({ type: 'error', text: 'Please select at least one talent' });
      return;
    }

    setSaving(true);
    setSaveMessage({ type: '', text: '' });

    try {
      // Get current user ID
      console.log('🔍 Getting current user...');
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('❌ User error:', userError);
        throw userError;
      }
      
      const currentUserId = user?.id || currentUser?.id || 'admin-user';
      console.log('👤 Current user ID:', currentUserId);

      // First, delete any existing selections for this project
      console.log('🗑️ Deleting existing selections for project:', project.id);
      const { error: deleteError } = await supabase
        .from('project_talent')
        .delete()
        .eq('project_id', project.id);

      if (deleteError) {
        console.error('❌ Delete error:', deleteError);
        throw deleteError;
      }
      console.log('✅ Existing selections deleted');

      // Then, insert new selections
      if (selectedTalent.length > 0) {
        const selections = selectedTalent.map(talentId => ({
          project_id: project.id,
          talent_profile_id: talentId,
          status: 'selected',
          admin_notes: `Selected by admin on ${new Date().toLocaleDateString()}`
        }));

        console.log('💾 Inserting selections:', selections);
        const { data: insertData, error: insertError } = await supabase
          .from('project_talent')
          .insert(selections)
          .select();

        if (insertError) {
          console.error('❌ Insert error:', insertError);
          console.error('❌ Insert error details:', insertError.details);
          console.error('❌ Insert error hint:', insertError.hint);
          throw insertError;
        }
        console.log('✅ Selections inserted successfully:', insertData);
      }

      // Update project status to 'talent_assigned'
      console.log('🔄 Updating project status to talent_assigned');
      const { data: updateData, error: updateError } = await supabase
        .from('projects')
        .update({ 
          status: 'talent_assigned',
          updated_at: new Date().toISOString()
        })
        .eq('id', project.id)
        .select();

      if (updateError) {
        console.error('❌ Update error:', updateError);
        console.error('❌ Update error details:', updateError.details);
        throw updateError;
      }
      console.log('✅ Project status updated successfully:', updateData);

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
      console.error('❌ Error saving talent selection:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error code:', error.code);
      setSaveMessage({ type: 'error', text: `Failed to save talent selection: ${error.message}` });
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

  // Filter and sort talents
  const filteredAndSortedTalents = talents
    .filter(talent => {
      const matchesSearch = talent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           talent.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           talent.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || talent.category === selectedCategory;
      const matchesLocation = selectedLocation === 'all' || talent.location === selectedLocation;
      
      const matchesRate = (!rateRange.min || talent.rate >= parseInt(rateRange.min)) &&
                         (!rateRange.max || talent.rate <= parseInt(rateRange.max));
      
      return matchesSearch && matchesCategory && matchesLocation && matchesRate;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'rate':
          comparison = a.rate - b.rate;
          break;
        case 'followers':
          const aFollowers = a.socials.instagram.followers + a.socials.tiktok.followers;
          const bFollowers = b.socials.instagram.followers + b.socials.tiktok.followers;
          comparison = aFollowers - bFollowers;
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Get unique categories and locations for filters
  const categories = ['all', ...new Set(talents.map(t => t.category).filter(Boolean))];
  const locations = ['all', ...new Set(talents.map(t => t.location).filter(Boolean))];

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

        {/* Instructions */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">How to select talent:</h3>
              <p className="text-sm text-blue-700 mt-1">
                Click the checkbox on any talent card to select them, or click anywhere on the card. Selected talent will show a green checkmark.
              </p>
            </div>
          </div>
        </div>

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
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
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
                  {locations.map(location => (
                    <option key={location} value={location}>
                      {location === 'all' ? 'All Locations' : location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rate Range</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={rateRange.min}
                    onChange={(e) => setRateRange(prev => ({ ...prev, min: e.target.value }))}
                    className="input flex-1"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={rateRange.max}
                    onChange={(e) => setRateRange(prev => ({ ...prev, max: e.target.value }))}
                    className="input flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input"
                >
                  <option value="name">Name</option>
                  <option value="rate">Rate</option>
                  <option value="followers">Followers</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Talent Grid */}
        <div className="flex-1 overflow-y-auto">
          {filteredAndSortedTalents.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No talent found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedTalents.map((talent) => (
                <div
                  key={talent.id}
                  className={`bg-background border-2 rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                    selectedTalent.includes(talent.id)
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleSelectTalent(talent.id)}
                >
                  {/* Selection Checkbox */}
                  <div className="absolute top-2 left-2 z-10">
                    <input
                      type="checkbox"
                      checked={selectedTalent.includes(talent.id)}
                      onChange={() => handleSelectTalent(talent.id)}
                      className="w-5 h-5 text-primary bg-white border-2 border-gray-300 rounded focus:ring-primary focus:ring-2"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  {/* Talent Image */}
                  <div className="relative mb-4">
                    <img
                      src={talent.photos && talent.photos.length > 0 ? talent.photos[0] : 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=400&fit=crop'}
                      alt={talent.name}
                      className="w-full h-48 object-cover bg-gray-100"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=400&fit=crop';
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                      {talent.category}
                    </div>
                    {selectedTalent.includes(talent.id) && (
                      <div className="absolute top-2 left-12 bg-primary text-white p-1 rounded-full">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>

                  {/* Talent Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-foreground">{talent.name}</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{talent.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{talent.location}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <DollarSign className="h-3 w-3 mr-1" />
                      <span>{formatRate(talent.rate)}</span>
                    </div>

                    {/* Social Stats */}
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                      {talent.socials.instagram.followers > 0 && (
                        <div className="flex items-center">
                          <Instagram className="h-3 w-3 mr-1" />
                          <span>{formatFollowers(talent.socials.instagram.followers)}</span>
                        </div>
                      )}
                      {talent.socials.tiktok.followers > 0 && (
                        <div className="flex items-center">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          <span>{formatFollowers(talent.socials.tiktok.followers)}</span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {talent.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
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