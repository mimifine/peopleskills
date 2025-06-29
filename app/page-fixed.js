"use client";

import React, { useState } from 'react';
import { Star, DollarSign, User, Calendar, Send, Plus, FileText, Users, Briefcase, Eye, MapPin, ExternalLink, Upload, X, ThumbsUp, ThumbsDown, Heart, MessageCircle, Calculator, Edit3, Image, Video, Trash2, ChevronLeft, ChevronRight, Play, Check } from 'lucide-react';
import { db } from '../lib/supabase.js';

const PeopleSkillsPlatform = () => {
  // Password protection state
  const [isPasswordProtected, setIsPasswordProtected] = useState(true);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTalentIds, setSelectedTalentIds] = useState([1, 2]);
  const [imageCarouselIndex, setImageCarouselIndex] = useState({});
  const [videoCarouselIndex, setVideoCarouselIndex] = useState({});
  const [editingTalentName, setEditingTalentName] = useState(null);
  const [editingTalentNameValue, setEditingTalentNameValue] = useState('');
  const [showBudgetCalc, setShowBudgetCalc] = useState(false);
  const [showBriefModal, setShowBriefModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    fullName: '',
    companyName: ''
  });

  // Add Talent Form state
  const [addTalentForm, setAddTalentForm] = useState({
    fullName: '',
    category: '',
    location: '',
    height: '',
    bio: '',
    dailyRate: '',
    halfDayRate: '',
    usageFee: '',
    travelAccommodation: '',
    agencyPercent: '',
    instagram: '',
    instagramFollowers: '',
    tiktok: '',
    tiktokFollowers: '',
    status: 'pending'
  });
  
  const [addTalentLoading, setAddTalentLoading] = useState(false);
  const [addTalentMessage, setAddTalentMessage] = useState({ type: '', text: '' });

  // Mock users for authentication
  const mockUsers = [
    {
      email: 'admin@peopleskills.com',
      password: 'admin123',
      role: 'ADMIN',
      name: 'Admin User',
      id: 'admin-1'
    },
    {
      email: 'brand@company.com',
      password: 'brand123',
      role: 'BRAND',
      name: 'Brand Manager',
      id: 'brand-1',
      favorites: [1]
    },
    {
      email: 'talent@model.com',
      password: 'talent123',
      role: 'DIRECT_TALENT',
      name: 'Sarah Chen',
      id: 'talent-1'
    }
  ];

  // Add Talent Form Handlers
  const handleAddTalentFormChange = (field, value) => {
    setAddTalentForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetAddTalentForm = () => {
    setAddTalentForm({
      fullName: '',
      category: '',
      location: '',
      height: '',
      bio: '',
      dailyRate: '',
      halfDayRate: '',
      usageFee: '',
      travelAccommodation: '',
      agencyPercent: '',
      instagram: '',
      instagramFollowers: '',
      tiktok: '',
      tiktokFollowers: '',
      status: 'pending'
    });
    setAddTalentMessage({ type: '', text: '' });
  };

  const handleAddTalentSubmit = async (e) => {
    e.preventDefault();
    
    if (!addTalentForm.fullName.trim()) {
      setAddTalentMessage({ type: 'error', text: 'Full name is required' });
      return;
    }

    setAddTalentLoading(true);
    setAddTalentMessage({ type: '', text: '' });

    try {
      const socials = {};
      if (addTalentForm.instagram) {
        socials.instagram = {
          handle: addTalentForm.instagram,
          url: `https://instagram.com/${addTalentForm.instagram.replace('@', '')}`,
          followers: addTalentForm.instagramFollowers || 0
        };
      }
      if (addTalentForm.tiktok) {
        socials.tiktok = {
          handle: addTalentForm.tiktok,
          url: `https://tiktok.com/@${addTalentForm.tiktok.replace('@', '')}`,
          followers: addTalentForm.tiktokFollowers || 0
        };
      }

      const talentData = {
        full_name: addTalentForm.fullName,
        bio: addTalentForm.bio,
        category: addTalentForm.category,
        location: addTalentForm.location,
        daily_rate: addTalentForm.dailyRate ? parseInt(addTalentForm.dailyRate) : null,
        half_day_rate: addTalentForm.halfDayRate ? parseInt(addTalentForm.halfDayRate) : null,
        usage_fee: addTalentForm.usageFee ? parseInt(addTalentForm.usageFee) : null,
        travel_accommodation: addTalentForm.travelAccommodation ? parseInt(addTalentForm.travelAccommodation) : null,
        agency_percent: addTalentForm.agencyPercent ? parseInt(addTalentForm.agencyPercent) : null,
        height: addTalentForm.height,
        socials: socials,
        status: addTalentForm.status
      };

      const result = await db.talentProfiles.create(talentData);
      
      if (result.error) {
        throw new Error(result.error.message);
      }

      setAddTalentMessage({ type: 'success', text: 'Talent profile created successfully!' });
      resetAddTalentForm();
    } catch (error) {
      console.error('Error creating talent profile:', error);
      setAddTalentMessage({ type: 'error', text: error.message || 'Failed to create talent profile' });
    } finally {
      setAddTalentLoading(false);
    }
  };

  // Authentication handlers
  const handleAuthFormChange = (field, value) => {
    setAuthForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogin = () => {
    const user = mockUsers.find(u => 
      u.email === authForm.email && u.password === authForm.password
    );
    
    if (user) {
      setIsAuthenticated(true);
      setCurrentUserRole(user.role);
      setShowAuthModal(false);
      setAuthForm({ email: '', password: '', fullName: '', companyName: '' });
    } else {
      alert('Invalid email or password');
    }
  };

  const handleSignup = () => {
    // For demo purposes, create a new user
    const newUser = {
      email: authForm.email,
      password: authForm.password,
      role: 'BRAND',
      name: authForm.fullName,
      id: `user-${Date.now()}`
    };
    
    mockUsers.push(newUser);
    setIsAuthenticated(true);
    setCurrentUserRole(newUser.role);
    setShowAuthModal(false);
    setAuthForm({ email: '', password: '', fullName: '', companyName: '' });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUserRole('');
    setActiveTab('dashboard');
  };

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === 'PeopleSkills1977') {
      setIsPasswordProtected(false);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  // Password protection screen
  if (isPasswordProtected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">People Skills</h1>
            <p className="text-gray-600">Enter password to access the platform</p>
          </div>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  passwordError ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter password"
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">Incorrect password</p>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Authentication Modal
  const AuthenticationModal = () => {
    if (!showAuthModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {authMode === 'login' ? 'Sign In' : 'Sign Up'}
            </h2>
            <button
              onClick={() => setShowAuthModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={authForm.email}
                onChange={(e) => handleAuthFormChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={authForm.password}
                onChange={(e) => handleAuthFormChange('password', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            {authMode === 'signup' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={authForm.fullName}
                    onChange={(e) => handleAuthFormChange('fullName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={authForm.companyName}
                    onChange={(e) => handleAuthFormChange('companyName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your company name"
                  />
                </div>
              </>
            )}

            <button
              type="button"
              onClick={authMode === 'login' ? handleLogin : handleSignup}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              {authMode === 'login' ? 'Sign In' : 'Sign Up'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                className="text-purple-600 hover:text-purple-700 text-sm"
              >
                {authMode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthenticationModal />
      
      {!isAuthenticated ? (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">People Skills</h1>
            <p className="text-gray-600 mb-8">The future of talent casting</p>
            <div className="space-x-4">
              <button
                onClick={() => openAuthModal('login')}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuthModal('signup')}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-semibold text-gray-900">People Skills</h1>
                </div>
                
                {/* Role-based Tab Navigation */}
                {isAuthenticated && (
                  <div className="flex items-center space-x-1">
                    {currentUserRole === 'ADMIN' && (
                      <>
                        <button
                          onClick={() => setActiveTab('dashboard')}
                          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === 'dashboard'
                              ? 'bg-purple-100 text-purple-700'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          Dashboard
                        </button>
                        <button
                          onClick={() => setActiveTab('add-talent')}
                          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === 'add-talent'
                              ? 'bg-purple-100 text-purple-700'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          Add Talent
                        </button>
                        <button
                          onClick={() => setActiveTab('talent-packages')}
                          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === 'talent-packages'
                              ? 'bg-purple-100 text-purple-700'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          Talent Packages
                        </button>
                        <button
                          onClick={() => setActiveTab('all-projects')}
                          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === 'all-projects'
                              ? 'bg-purple-100 text-purple-700'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          All Projects
                        </button>
                        <button
                          onClick={() => setActiveTab('manage-users')}
                          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === 'manage-users'
                              ? 'bg-purple-100 text-purple-700'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          Manage Users
                        </button>
                      </>
                    )}
                  </div>
                )}
                
                <div className="flex items-center space-x-4">
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          {currentUserRole === 'ADMIN' && 'Admin'}
                          {currentUserRole === 'BRAND' && 'Brand'}
                          {currentUserRole === 'DIRECT_TALENT' && 'Talent'}
                        </span>
                        <button
                          onClick={handleLogout}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openAuthModal('login')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => openAuthModal('signup')}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Sign Up
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Admin: Add Talent Tab */}
            {activeTab === 'add-talent' && currentUserRole === 'ADMIN' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Add New Talent</h2>
                    <p className="text-sm text-gray-600 mt-1">Manually add talent profiles to the database</p>
                  </div>
                  
                  <div className="p-6">
                    {/* Success/Error Messages */}
                    {addTalentMessage.text && (
                      <div className={`mb-4 p-3 rounded-lg ${
                        addTalentMessage.type === 'success' 
                          ? 'bg-green-100 text-green-700 border border-green-200' 
                          : 'bg-red-100 text-red-700 border border-red-200'
                      }`}>
                        {addTalentMessage.text}
                      </div>
                    )}

                    <form onSubmit={handleAddTalentSubmit} className="space-y-6">
                      {/* Personal Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              value={addTalentForm.fullName}
                              onChange={(e) => handleAddTalentFormChange('fullName', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Enter full name"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Category
                            </label>
                            <select
                              value={addTalentForm.category}
                              onChange={(e) => handleAddTalentFormChange('category', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                              <option value="">Select category</option>
                              <option value="Model">Model</option>
                              <option value="Actor">Actor</option>
                              <option value="Influencer">Influencer</option>
                              <option value="Athlete">Athlete</option>
                              <option value="Musician">Musician</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Location
                            </label>
                            <input
                              type="text"
                              value={addTalentForm.location}
                              onChange={(e) => handleAddTalentFormChange('location', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="City, State"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Height
                            </label>
                            <input
                              type="text"
                              value={addTalentForm.height}
                              onChange={(e) => handleAddTalentFormChange('height', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="5'8&quot;"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bio
                          </label>
                          <textarea
                            value={addTalentForm.bio}
                            onChange={(e) => handleAddTalentFormChange('bio', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Brief description of the talent..."
                          />
                        </div>
                      </div>

                      {/* Rate Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Daily Rate ($)
                            </label>
                            <input
                              type="number"
                              value={addTalentForm.dailyRate}
                              onChange={(e) => handleAddTalentFormChange('dailyRate', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="2500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Half Day Rate ($)
                            </label>
                            <input
                              type="number"
                              value={addTalentForm.halfDayRate}
                              onChange={(e) => handleAddTalentFormChange('halfDayRate', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="1500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Usage Fee ($)
                            </label>
                            <input
                              type="number"
                              value={addTalentForm.usageFee}
                              onChange={(e) => handleAddTalentFormChange('usageFee', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="1500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Travel & Accommodation ($)
                            </label>
                            <input
                              type="number"
                              value={addTalentForm.travelAccommodation}
                              onChange={(e) => handleAddTalentFormChange('travelAccommodation', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="800"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Agency Percentage (%)
                            </label>
                            <input
                              type="number"
                              value={addTalentForm.agencyPercent}
                              onChange={(e) => handleAddTalentFormChange('agencyPercent', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="20"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Social Media */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Instagram Handle
                            </label>
                            <input
                              type="text"
                              value={addTalentForm.instagram}
                              onChange={(e) => handleAddTalentFormChange('instagram', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="@username"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Instagram Followers
                            </label>
                            <input
                              type="text"
                              value={addTalentForm.instagramFollowers}
                              onChange={(e) => handleAddTalentFormChange('instagramFollowers', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="50K"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              TikTok Handle
                            </label>
                            <input
                              type="text"
                              value={addTalentForm.tiktok}
                              onChange={(e) => handleAddTalentFormChange('tiktok', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="@username"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              TikTok Followers
                            </label>
                            <input
                              type="text"
                              value={addTalentForm.tiktokFollowers}
                              onChange={(e) => handleAddTalentFormChange('tiktokFollowers', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="100K"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={resetAddTalentForm}
                          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Reset Form
                        </button>
                        <button
                          type="submit"
                          disabled={addTalentLoading}
                          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                        >
                          {addTalentLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Adding Talent...</span>
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4" />
                              <span>Add Talent</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Admin: Dashboard Tab */}
            {activeTab === 'dashboard' && currentUserRole === 'ADMIN' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Admin Dashboard</h2>
                  <p className="text-gray-600">Welcome to the admin dashboard. Use the navigation tabs above to manage the platform.</p>
                </div>
              </div>
            )}

            {/* Admin: Talent Packages Tab */}
            {activeTab === 'talent-packages' && currentUserRole === 'ADMIN' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Talent Packages</h2>
                  <p className="text-gray-600">Manage talent packages for different projects.</p>
                </div>
              </div>
            )}

            {/* Admin: All Projects Tab */}
            {activeTab === 'all-projects' && currentUserRole === 'ADMIN' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">All Projects</h2>
                  <p className="text-gray-600">View and manage all projects in the system.</p>
                </div>
              </div>
            )}

            {/* Admin: Manage Users Tab */}
            {activeTab === 'manage-users' && currentUserRole === 'ADMIN' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Manage Users</h2>
                  <p className="text-gray-600">Manage user accounts and permissions.</p>
                </div>
              </div>
            )}
          </main>
        </>
      )}
    </div>
  );
};

export default PeopleSkillsPlatform; 