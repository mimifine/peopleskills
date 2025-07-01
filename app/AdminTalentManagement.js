import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Users, Star, MapPin, DollarSign, Check, X, Package, Eye, Heart, MessageCircle, Image, ChevronDown, SortAsc, SortDesc } from 'lucide-react';

const AdminTalentManagement = () => {
  // Real talent data from Supabase
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch talent from Supabase on component mount
  useEffect(() => {
    fetchTalents();
  }, []);

  const fetchTalents = async () => {
    try {
      // Mock data for now - replace with your Supabase call
      // When you integrate: const { data, error } = await supabase.from('talent_profiles').select('*');
      
      // Simulated data including Vittoria Ceretti
      const mockData = [
        {
          id: 1,
          full_name: 'Vittoria Ceretti (TESTING)',
          category: 'Model',
          location: 'Milan, Italy',
          bio: 'International fashion model with extensive runway and editorial experience.',
          rates: '$5000',
          social_media: {
            instagram: { followers: 850000, handle: '@vittoria' },
            tiktok: { followers: 120000, handle: '@vittoriaceretti' }
          }
        },
        {
          id: 2,
          full_name: 'Sarah Chen',
          category: 'Model/Influencer',
          location: 'Los Angeles, CA',
          bio: 'Lifestyle influencer and commercial model specializing in beauty and fashion.',
          rates: '$2500',
          social_media: {
            instagram: { followers: 125000, handle: '@sarahchen' },
            tiktok: { followers: 89000, handle: '@sarahchenofficial' }
          }
        }
      ];

      // Transform data to match card format
      const transformedTalents = mockData.map(talent => ({
        id: talent.id,
        name: talent.full_name || talent.name,
        category: talent.category || 'Not specified',
        rate: talent.rates ? parseInt(talent.rates.replace(/[^0-9]/g, '')) : 0,
        location: talent.location || 'Location not specified',
        rating: talent.rating || 4.5,
        image: talent.image_url || '/api/placeholder/300/400',
        bio: talent.bio || '',
        socials: {
          instagram: { 
            followers: talent.social_media?.instagram?.followers || 0,
            handle: talent.social_media?.instagram?.handle || ''
          },
          tiktok: { 
            followers: talent.social_media?.tiktok?.followers || 0,
            handle: talent.social_media?.tiktok?.handle || ''
          }
        },
        votes: { up: [], down: [], userVote: null },
        favorites: [],
        tags: talent.category ? [talent.category.toLowerCase()] : ['talent']
      }));

      setTalents(transformedTalents);
    } catch (error) {
      console.error('Error in fetchTalents:', error);
    } finally {
      setLoading(false);
    }
  };

  // State for search, filters, and selections
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [rateRange, setRateRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedTalent, setSelectedTalent] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

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

  const formatFollowers = (count) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(0) + 'K';
    return count.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Talent Management</h1>
              <p className="text-gray-600 mt-1">Search, filter, and select talent for packages</p>
            </div>
            {selectedTalent.length > 0 && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {selectedTalent.length} selected
                </span>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                  <Package className="h-4 w-4" />
                  <span>Create Package</span>
                </button>
              </div>
            )}
          </div>

          {/* Search and Filter Bar */}
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search talent by name, category, location, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
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
                {/* Results count */}
                <span className="text-sm text-gray-600">
                  {filteredAndSortedTalents.length} of {talents.length} talent
                </span>

                {/* Sort */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="name">Name</option>
                    <option value="rate">Rate</option>
                    <option value="rating">Rating</option>
                    <option value="followers">Followers</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  </button>
                </div>

                {/* Select All */}
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-purple-600 hover:text-purple-700"
                >
                  {selectedTalent.length === filteredAndSortedTalents.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="all">All Locations</option>
                    {locations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Rate</label>
                  <input
                    type="number"
                    placeholder="$0"
                    value={rateRange.min}
                    onChange={(e) => setRateRange(prev => ({ ...prev, min: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Rate</label>
                  <input
                    type="number"
                    placeholder="$10000"
                    value={rateRange.max}
                    onChange={(e) => setRateRange(prev => ({ ...prev, max: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div className="md:col-span-4 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Talent Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-3 text-gray-600">Loading talent profiles...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedTalents.map((talent) => (
              <div key={talent.id} className="bg-white rounded-lg shadow border overflow-hidden relative">
                {/* Selection Checkbox */}
                <div className="absolute top-3 left-3 z-10">
                  <button
                    onClick={() => handleSelectTalent(talent.id)}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                      selectedTalent.includes(talent.id)
                        ? 'bg-purple-600 border-purple-600 text-white'
                        : 'bg-white border-gray-300 hover:border-purple-400'
                    }`}
                  >
                    {selectedTalent.includes(talent.id) && <Check className="h-4 w-4" />}
                  </button>
                </div>

                {/* Talent Image */}
                <div className="relative">
                  <img
                    src={talent.image}
                    alt={talent.name}
                    className="w-full h-64 object-cover bg-gray-200"
                  />
                  <div className="absolute bottom-3 right-3 flex space-x-1">
                    <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                      <Image className="h-3 w-3 inline mr-1" />
                      1
                    </span>
                  </div>
                  {/* Special indicator for test data */}
                  {talent.name.includes('TESTING') && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                      TEST DATA
                    </div>
                  )}
                </div>
                
                {/* Card Content */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold truncate">{talent.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm ml-1">{talent.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{talent.category}</p>
                  <p className="text-sm text-gray-600 mb-3 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {talent.location}
                  </p>
                  
                  {/* Bio Preview */}
                  {talent.bio && (
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                      {talent.bio.length > 80 ? talent.bio.substring(0, 80) + '...' : talent.bio}
                    </p>
                  )}
                  
                  {/* Social Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                    <div className="bg-pink-50 p-2 rounded">
                      <div className="text-pink-600 font-medium">
                        {formatFollowers(talent.socials.instagram.followers)}
                      </div>
                      <div className="text-gray-500">Instagram</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="text-gray-700 font-medium">
                        {formatFollowers(talent.socials.tiktok.followers)}
                      </div>
                      <div className="text-gray-500">TikTok</div>
                    </div>
                  </div>
                  
                  {/* Rate */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-green-600">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-semibold">
                        {talent.rate > 0 ? talent.rate.toLocaleString() : 'Rate TBD'}
                      </span>
                      {talent.rate > 0 && <span className="text-sm text-gray-500 ml-1">/day</span>}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {talent.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs capitalize">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      <Eye className="h-4 w-4 inline mr-1" />
                      View
                    </button>
                    <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 relative">
                      <Heart className="h-4 w-4" />
                      {talent.favorites.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {talent.favorites.length}
                        </span>
                      )}
                    </button>
                    <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 relative">
                      <MessageCircle className="h-4 w-4" />
                      {(talent.votes.up.length + talent.votes.down.length) > 0 && (
                        <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {talent.votes.up.length + talent.votes.down.length}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredAndSortedTalents.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No talent found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-purple-600 hover:text-purple-700"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTalentManagement; 