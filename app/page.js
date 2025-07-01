"use client";

import React, { useState, useEffect } from 'react';
import { Star, DollarSign, User, Calendar, Send, Plus, FileText, Users, Briefcase, Eye, MapPin, ExternalLink, Upload, X, ThumbsUp, ThumbsDown, Heart, MessageCircle, Calculator, Edit3, Image, Video, Trash2, ChevronLeft, ChevronRight, Play, Check } from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import AdminTalentManagement from './AdminTalentManagement.js';

const PeopleSkillsPlatform = () => {
  // Password protection state
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
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
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
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
    bust: '',
    waist: '',
    hips: '',
    shoeSize: '',
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
    agencyLink: '',
    modelsComLink: '',
    status: 'pending'
  });
  
  const [addTalentLoading, setAddTalentLoading] = useState(false);
  const [addTalentMessage, setAddTalentMessage] = useState({ type: '', text: '' });
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Media upload state
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Brand Interface state
  const [briefForm, setBriefForm] = useState({
    title: '',
    description: '',
    budgetMin: '',
    budgetMax: '',
    deadline: '',
    shootStartDate: '',
    shootEndDate: '',
    location: '',
    usageRights: '',
    numberOfTalent: 1
  });
  const [briefLoading, setBriefLoading] = useState(false);
  const [briefMessage, setBriefMessage] = useState({ type: '', text: '' });
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'Spring Fashion Campaign',
      description: 'Looking for models for our spring collection launch',
      budget_min: 2000,
      budget_max: 5000,
      location: 'Los Angeles, CA',
      number_of_talent: 3,
      status: 'active',
      created_at: '2024-01-15'
    },
    {
      id: 2,
      title: 'Beauty Product Launch',
      description: 'Seeking influencers for skincare line promotion',
      budget_min: 1500,
      budget_max: 3000,
      location: 'New York, NY',
      number_of_talent: 2,
      status: 'draft',
      created_at: '2024-01-10'
    },
    {
      id: 3,
      title: 'Lifestyle Magazine Feature',
      description: 'Editorial shoot for upcoming lifestyle feature',
      budget_min: 1000,
      budget_max: 2500,
      location: 'Miami, FL',
      number_of_talent: 1,
      status: 'completed',
      created_at: '2024-01-05'
    }
  ]);
  const [talents, setTalents] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [talentRequirements, setTalentRequirements] = useState([
    { id: 1, gender: '', size: '', age: '', notes: '' }
  ]);

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
      bust: '',
      waist: '',
      hips: '',
      shoeSize: '',
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
      agencyLink: '',
      modelsComLink: '',
      status: 'pending'
    });
    setUploadedPhotos([]);
    setUploadedVideos([]);
    setAddTalentMessage({ type: '', text: '' });
  };

  const handleAddTalentSubmit = async (e) => {
    console.log('🎯 Form submit triggered!');
    e.preventDefault();
    
    console.log('📝 Form data:', addTalentForm);
    console.log('✅ Full name check:', addTalentForm.fullName.trim());
    
    if (!addTalentForm.fullName.trim()) {
      console.log('❌ Full name is empty');
      setAddTalentMessage({ type: 'error', text: 'Full name is required' });
      return;
    }
  
    setAddTalentLoading(true);
    setAddTalentMessage({ type: '', text: '' });
  
    try {
      console.log('🔄 Starting talent profile creation...');
      console.log('📝 Raw form data:', addTalentForm);
      console.log('🔗 Supabase client:', supabase);
      console.log('🌐 Environment check:', {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing'
      });

      // Show loading message to user
      setAddTalentMessage({ type: 'info', text: '🔄 Connecting to database...' });

      // Build socials object only if data exists
      const socials = {};
      if (addTalentForm.instagram && addTalentForm.instagram.trim()) {
        socials.instagram = {
          handle: addTalentForm.instagram,
          url: `https://instagram.com/${addTalentForm.instagram.replace('@', '')}`,
          followers: addTalentForm.instagramFollowers ? parseInt(addTalentForm.instagramFollowers) : 0
        };
      }
      if (addTalentForm.tiktok && addTalentForm.tiktok.trim()) {
        socials.tiktok = {
          handle: addTalentForm.tiktok,
          url: `https://tiktok.com/@${addTalentForm.tiktok.replace('@', '')}`,
          followers: addTalentForm.tiktokFollowers ? parseInt(addTalentForm.tiktokFollowers) : 0
        };
      }
  
      // Prepare data - convert empty strings to null
      const talentData = {
        full_name: addTalentForm.fullName.trim(),
        bio: addTalentForm.bio.trim() || null,
        category: addTalentForm.category.trim() || null,
        location: addTalentForm.location.trim() || null,
        height: addTalentForm.height.trim() || null,
        bust: addTalentForm.bust.trim() || null,
        waist: addTalentForm.waist.trim() || null,
        hips: addTalentForm.hips.trim() || null,
        shoe_size: addTalentForm.shoeSize.trim() || null,
        daily_rate: addTalentForm.dailyRate ? parseInt(addTalentForm.dailyRate) : null,
        half_day_rate: addTalentForm.halfDayRate ? parseInt(addTalentForm.halfDayRate) : null,
        usage_fee: addTalentForm.usageFee ? parseInt(addTalentForm.usageFee) : null,
        travel_accommodation: addTalentForm.travelAccommodation ? parseInt(addTalentForm.travelAccommodation) : null,
        agency_percent: addTalentForm.agencyPercent ? parseInt(addTalentForm.agencyPercent) : null,
        socials: Object.keys(socials).length > 0 ? socials : null,
        agency_link: addTalentForm.agencyLink.trim() || null,
        models_com_link: addTalentForm.modelsComLink.trim() || null,
        photos: uploadedPhotos.length > 0 ? uploadedPhotos.map(p => ({ url: p.preview, filename: p.file.name })) : [],
        videos: uploadedVideos.length > 0 ? uploadedVideos.map(v => ({ url: v.preview, filename: v.file.name })) : [],
        status: addTalentForm.status || 'pending',
        created_at: new Date().toISOString()
      };
  
            console.log('📤 Submitting talent data:', talentData);
      console.log('🎯 Target table: talent_profiles');

      setAddTalentMessage({ type: 'info', text: '📤 Submitting talent data...' });

      // Insert into Supabase
      const { data, error } = await supabase
        .from('talent_profiles')
        .insert([talentData])
        .select();
  
      if (error) {
        console.error('❌ Supabase error:', error);
        console.error('❌ Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw new Error(error.message || 'Failed to create talent profile');
      }
  
      console.log('✅ Success! Created talent:', data);
      
      // Show success notification
      setSuccessMessage(`🎉 Success! "${addTalentForm.fullName}" has been added to the talent database.`);
      setShowSuccessNotification(true);
      
      // Clear form immediately
      resetAddTalentForm();
      
      // Hide notification after 5 seconds
      setTimeout(() => {
        setShowSuccessNotification(false);
      }, 5000);
  
    } catch (error) {
      console.error('❌ Error creating talent profile:', error);
      console.error('❌ Error stack:', error.stack);
      setAddTalentMessage({ 
        type: 'error', 
        text: error.message || 'Failed to create talent profile. Please try again.' 
      });
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
      setCurrentUser(user);
      setShowRoleSelection(true);
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
    setCurrentUser(null);
    setShowRoleSelection(false);
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

  // Media upload handlers
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file)
    }));
    
    if (uploadedPhotos.length + newPhotos.length <= 10) {
      setUploadedPhotos(prev => [...prev, ...newPhotos]);
    } else {
      alert('Maximum 10 photos allowed');
    }
  };

  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newVideos = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file)
    }));
    
    if (uploadedVideos.length + newVideos.length <= 5) {
      setUploadedVideos(prev => [...prev, ...newVideos]);
    } else {
      alert('Maximum 5 videos allowed');
    }
  };

  const removePhoto = (id) => {
    setUploadedPhotos(prev => prev.filter(photo => photo.id !== id));
  };

  const removeVideo = (id) => {
    setUploadedVideos(prev => prev.filter(video => video.id !== id));
  };

  // Brand Interface Form Handlers
  const handleBriefFormChange = (field, value) => {
    setBriefForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetBriefForm = () => {
    setBriefForm({
      title: '',
      description: '',
      budgetMin: '',
      budgetMax: '',
      deadline: '',
      shootStartDate: '',
      shootEndDate: '',
      location: '',
      usageRights: '',
      numberOfTalent: 1
    });
    setTalentRequirements([{ id: 1, gender: '', size: '', age: '', notes: '' }]);
    setBriefMessage({ type: '', text: '' });
  };

  const handleTalentRequirementChange = (id, field, value) => {
    setTalentRequirements(prev => 
      prev.map(req => 
        req.id === id ? { ...req, [field]: value } : req
      )
    );
  };

  const updateTalentRequirements = (count) => {
    const newRequirements = [];
    for (let i = 1; i <= count; i++) {
      newRequirements.push({
        id: i,
        gender: '',
        size: '',
        age: '',
        notes: ''
      });
    }
    setTalentRequirements(newRequirements);
  };

  const handleBriefSubmit = async (e) => {
    e.preventDefault();
    
    if (!briefForm.title.trim()) {
      setBriefMessage({ type: 'error', text: 'Project title is required' });
      return;
    }

    setBriefLoading(true);
    setBriefMessage({ type: '', text: '' });

    try {
      const projectData = {
        title: briefForm.title.trim(),
        description: briefForm.description.trim() || null,
        budget_min: briefForm.budgetMin ? parseInt(briefForm.budgetMin) : null,
        budget_max: briefForm.budgetMax ? parseInt(briefForm.budgetMax) : null,
        deadline: briefForm.deadline || null,
        shoot_start_date: briefForm.shootStartDate || null,
        shoot_end_date: briefForm.shootEndDate || null,
        location: briefForm.location.trim() || null,
        usage_rights: briefForm.usageRights.trim() || null,
        number_of_talent: parseInt(briefForm.numberOfTalent) || 1,
        status: 'draft',
        brand_user_id: currentUser?.id || 'brand-1', // Use actual user ID if available
        created_at: new Date().toISOString()
      };

      console.log('📤 Submitting project data:', projectData);

      // Insert into Supabase
      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select();

      if (error) {
        console.error('❌ Supabase error:', error);
        throw new Error(error.message || 'Failed to create project');
      }

      console.log('✅ Success! Created project:', data);
      
      setBriefMessage({ type: 'success', text: 'Project brief created successfully!' });
      resetBriefForm();
      
      // Add to local projects array
      setProjects(prev => [data[0], ...prev]);

    } catch (error) {
      console.error('❌ Error creating project:', error);
      setBriefMessage({ 
        type: 'error', 
        text: error.message || 'Failed to create project. Please try again.' 
      });
    } finally {
      setBriefLoading(false);
    }
  };

  const handleFavorite = (talentId) => {
    if (favorites.includes(talentId)) {
      setFavorites(prev => prev.filter(id => id !== talentId));
    } else {
      setFavorites(prev => [...prev, talentId]);
    }
  };

  // Load projects from Supabase when brand user accesses dashboard
  useEffect(() => {
    const loadProjects = async () => {
      if (currentUserRole === 'BRAND' && currentUser) {
        try {
          console.log('🔄 Loading projects for user:', currentUser.id);
          
          const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('brand_user_id', currentUser.id)
            .order('created_at', { ascending: false });

          if (error) {
            console.error('❌ Error loading projects:', error);
            return;
          }

          console.log('✅ Loaded projects:', data);
          setProjects(data || []);
        } catch (error) {
          console.error('❌ Error loading projects:', error);
        }
      }
    };

    loadProjects();
  }, [currentUserRole, currentUser]);

  // Success notification component
  const SuccessNotification = ({ message, onClose }) => {
    return (
      <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 animate-in slide-in-from-right duration-300">
        <Check className="h-5 w-5" />
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 hover:bg-green-600 rounded p-1 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
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
            <h2 className="text-lg font-semibold text-gray-900">
              {authMode === 'login' ? 'Sign In' : 'Sign Up'}
            </h2>
            <button
              onClick={() => setShowAuthModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={(e) => { e.preventDefault(); authMode === 'login' ? handleLogin() : handleSignup(); }}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={authForm.email}
                  onChange={(e) => handleAuthFormChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
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
                  required
                />
              </div>
              
              {authMode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={authForm.fullName}
                    onChange={(e) => handleAuthFormChange('fullName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
              )}
              
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
              >
                {authMode === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
          </form>
          
          <div className="mt-4 text-center">
            <button
              onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
              className="text-purple-600 hover:text-purple-700 text-sm"
            >
              {authMode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Role Selection Component
  const RoleSelectionScreen = () => {
    const handleRoleSelect = (role) => {
      setCurrentUserRole(role);
      setShowRoleSelection(false);
      setActiveTab(role === 'ADMIN' ? 'dashboard' : role === 'BRAND' ? 'brand-dashboard' : 'dashboard');
    };

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Choose Your View
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Select how you&apos;d like to view the platform
            </p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => handleRoleSelect('ADMIN')}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              <Users className="h-6 w-6 mr-3" />
              View as Admin
            </button>
            
            <button
              onClick={() => handleRoleSelect('BRAND')}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Briefcase className="h-6 w-6 mr-3" />
              View as Brand
            </button>
            
            <button
              onClick={() => handleRoleSelect('DIRECT_TALENT')}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <User className="h-6 w-6 mr-3" />
              View as Talent
            </button>
          </div>
          
          <div className="text-center">
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthenticationModal />
      
      {!isAuthenticated ? (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">People Skills</h1>
            <p className="text-gray-600 mb-6">Talent casting platform for brands and agencies</p>
            <div className="space-y-3">
              <button
                onClick={() => openAuthModal('login')}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuthModal('signup')}
                className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      ) : showRoleSelection ? (
        <RoleSelectionScreen />
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
                          onClick={() => setActiveTab('talent-management')}
                          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === 'talent-management'
                              ? 'bg-purple-100 text-purple-700'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          Talent Management
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
                    {currentUserRole === 'BRAND' && (
                      <>
                        <button
                          onClick={() => setActiveTab('brand-dashboard')}
                          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === 'brand-dashboard'
                              ? 'bg-purple-100 text-purple-700'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          Dashboard
                        </button>
                        <button
                          onClick={() => setActiveTab('create-brief')}
                          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === 'create-brief'
                              ? 'bg-purple-100 text-purple-700'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          Create Brief
                        </button>
                        <button
                          onClick={() => setActiveTab('my-projects')}
                          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === 'my-projects'
                              ? 'bg-purple-100 text-purple-700'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          My Projects
                        </button>
                        <button
                          onClick={() => setActiveTab('browse-talent')}
                          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === 'browse-talent'
                              ? 'bg-purple-100 text-purple-700'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          Browse Talent
                        </button>
                      </>
                    )}
                    {currentUserRole === 'DIRECT_TALENT' && (
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
                          onClick={() => setActiveTab('profile')}
                          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === 'profile'
                              ? 'bg-purple-100 text-purple-700'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          Profile
                        </button>
                        <button
                          onClick={() => setActiveTab('opportunities')}
                          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === 'opportunities'
                              ? 'bg-purple-100 text-purple-700'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          Opportunities
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
            {/* Admin: Talent Management Tab */}
            {activeTab === 'talent-management' && currentUserRole === 'ADMIN' && (
              <AdminTalentManagement />
            )}

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
                      <div className={`mb-6 p-4 rounded-lg border-2 ${
                        addTalentMessage.type === 'success' 
                          ? 'bg-green-50 text-green-800 border-green-300' 
                          : 'bg-red-50 text-red-800 border-red-300'
                      }`}>
                        <div className="flex items-center">
                          {addTalentMessage.type === 'success' ? (
                            <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                          ) : (
                            <X className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
                          )}
                          <span className="font-medium">{addTalentMessage.text}</span>
                        </div>
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
                              <option value="Artist">Artist</option>
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
                            Bust
                          </label>
                          <input
                            type="text"
                            value={addTalentForm.bust}
                            onChange={(e) => handleAddTalentFormChange('bust', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="34"
                          />
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Waist
                          </label>
                          <input
                            type="text"
                            value={addTalentForm.waist}
                            onChange={(e) => handleAddTalentFormChange('waist', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="24"
                          />
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hips
                          </label>
                          <input
                            type="text"
                            value={addTalentForm.hips}
                            onChange={(e) => handleAddTalentFormChange('hips', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="36"
                          />
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Shoe Size
                          </label>
                          <input
                            type="text"
                            value={addTalentForm.shoeSize}
                            onChange={(e) => handleAddTalentFormChange('shoeSize', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="7"
                          />
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
                              placeholder="5000"
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
                              placeholder="1000"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Agency Percent (%)
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
                              placeholder="10K"
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
                              placeholder="50K"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Agency Links */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Agency Links</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Agency Link
                            </label>
                            <input
                              type="url"
                              value={addTalentForm.agencyLink}
                              onChange={(e) => handleAddTalentFormChange('agencyLink', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="https://agency.com/talent-profile"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Models.com Link
                            </label>
                            <input
                              type="url"
                              value={addTalentForm.modelsComLink}
                              onChange={(e) => handleAddTalentFormChange('modelsComLink', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="https://models.com/talent-name"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Media Upload */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Media Upload</h3>
                        
                        {/* Photos Upload */}
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Photos ({uploadedPhotos.length}/10)
                          </label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handlePhotoUpload}
                              className="hidden"
                              id="photo-upload"
                            />
                            <label htmlFor="photo-upload" className="cursor-pointer">
                              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                              <p className="text-sm text-gray-600 mb-2">
                                Click to upload photos or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, GIF up to 10MB each. Maximum 10 photos.
                              </p>
                            </label>
                          </div>
                          
                          {/* Uploaded Photos Preview */}
                          {uploadedPhotos.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                              {uploadedPhotos.map((photo) => (
                                <div key={photo.id} className="relative">
                                  <img
                                    src={photo.preview}
                                    alt="Preview"
                                    className="w-full h-32 object-cover rounded-lg"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removePhoto(photo.id)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Videos Upload */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Videos ({uploadedVideos.length}/5)
                          </label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <input
                              type="file"
                              multiple
                              accept="video/*"
                              onChange={handleVideoUpload}
                              className="hidden"
                              id="video-upload"
                            />
                            <label htmlFor="video-upload" className="cursor-pointer">
                              <Video className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                              <p className="text-sm text-gray-600 mb-2">
                                Click to upload videos or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">
                                MP4, MOV up to 50MB each. Maximum 5 videos.
                              </p>
                            </label>
                          </div>
                          
                          {/* Uploaded Videos Preview */}
                          {uploadedVideos.length > 0 && (
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                              {uploadedVideos.map((video) => (
                                <div key={video.id} className="relative">
                                  <video
                                    src={video.preview}
                                    controls
                                    className="w-full h-48 object-cover rounded-lg"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeVideo(video.id)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={addTalentLoading}
                          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {addTalentLoading ? 'Adding Talent...' : 'Add Talent'}
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

            {/* Brand: Dashboard Tab */}
            {activeTab === 'brand-dashboard' && currentUserRole === 'BRAND' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Brand Dashboard</h2>
                    <p className="text-sm text-gray-600 mt-1">Overview of your projects and talent</p>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <Briefcase className="h-8 w-8 text-purple-600" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-purple-600">Active Projects</p>
                            <p className="text-2xl font-bold text-purple-900">{projects.filter(p => p.status === 'active').length}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <Users className="h-8 w-8 text-blue-600" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-blue-600">Favorite Talent</p>
                            <p className="text-2xl font-bold text-blue-900">{favorites.length}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <Check className="h-8 w-8 text-green-600" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-green-600">Completed</p>
                            <p className="text-2xl font-bold text-green-900">{projects.filter(p => p.status === 'completed').length}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Recent Projects</h3>
                      {projects.length > 0 ? (
                        <div className="space-y-3">
                          {projects.slice(0, 3).map((project) => (
                            <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium text-gray-900">{project.title}</h4>
                                  <p className="text-sm text-gray-600">{project.description}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  project.status === 'active' ? 'bg-green-100 text-green-800' :
                                  project.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {project.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No projects yet. Create your first brief!</p>
                      )}
                    </div>

                    {/* Brand Activity Section */}
                    <div className="mt-8 space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Brand Activity</h3>
                      
                      {/* Favorited Talent */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-blue-900">Favorited Talent</h4>
                          <Heart className="h-5 w-5 text-blue-600" />
                        </div>
                        {favorites.length > 0 ? (
                          <div className="space-y-2">
                            {favorites.slice(0, 3).map((talentId) => (
                              <div key={talentId} className="flex items-center justify-between bg-white rounded p-2">
                                <span className="text-sm text-blue-800">Talent #{talentId}</span>
                                <div className="flex items-center space-x-2">
                                  <button className="text-blue-600 hover:text-blue-800">
                                    <ThumbsUp className="h-4 w-4" />
                                  </button>
                                  <button className="text-red-600 hover:text-red-800">
                                    <ThumbsDown className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                            {favorites.length > 3 && (
                              <p className="text-xs text-blue-600">+{favorites.length - 3} more favorites</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-blue-700">No favorited talent yet. Start browsing talent to add favorites!</p>
                        )}
                      </div>

                      {/* Recent Votes */}
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-green-900">Recent Votes</h4>
                          <div className="flex items-center space-x-1">
                            <ThumbsUp className="h-4 w-4 text-green-600" />
                            <ThumbsDown className="h-4 w-4 text-green-600" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between bg-white rounded p-2">
                            <span className="text-sm text-green-800">Talent #1 - Fashion Campaign</span>
                            <ThumbsUp className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="flex items-center justify-between bg-white rounded p-2">
                            <span className="text-sm text-green-800">Talent #3 - Product Shoot</span>
                            <ThumbsDown className="h-4 w-4 text-red-600" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Brand: Create Brief Tab */}
            {activeTab === 'create-brief' && currentUserRole === 'BRAND' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Create New Brief</h2>
                    <p className="text-sm text-gray-600 mt-1">Define your project requirements and budget</p>
                  </div>
                  
                  <div className="p-6">
                    {/* Success/Error Messages */}
                    {briefMessage.text && (
                      <div className={`mb-6 p-4 rounded-lg border-2 ${
                        briefMessage.type === 'success' 
                          ? 'bg-green-50 text-green-800 border-green-300' 
                          : 'bg-red-50 text-red-800 border-red-300'
                      }`}>
                        <div className="flex items-center">
                          {briefMessage.type === 'success' ? (
                            <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                          ) : (
                            <X className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
                          )}
                          <span className="font-medium">{briefMessage.text}</span>
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleBriefSubmit} className="space-y-6">
                      {/* Project Details */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Project Title *
                            </label>
                            <input
                              type="text"
                              value={briefForm.title}
                              onChange={(e) => handleBriefFormChange('title', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Enter project title"
                              required
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Project Description
                            </label>
                            <textarea
                              value={briefForm.description}
                              onChange={(e) => handleBriefFormChange('description', e.target.value)}
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Describe your project requirements, concept, and goals..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Location
                            </label>
                            <input
                              type="text"
                              value={briefForm.location}
                              onChange={(e) => handleBriefFormChange('location', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="City, State or Remote"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Number of Talent Needed
                            </label>
                            <input
                              type="number"
                              value={briefForm.numberOfTalent}
                              onChange={(e) => {
                                const count = parseInt(e.target.value) || 1;
                                handleBriefFormChange('numberOfTalent', count);
                                updateTalentRequirements(count);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              min="1"
                              max="10"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Talent Requirements */}
                      {talentRequirements.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Talent Requirements</h3>
                          <div className="space-y-4">
                            {talentRequirements.map((requirement) => (
                              <div key={requirement.id} className="border border-gray-200 rounded-lg p-4">
                                <h4 className="font-medium text-gray-900 mb-3">Talent #{requirement.id}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Gender
                                    </label>
                                    <select
                                      value={requirement.gender}
                                      onChange={(e) => handleTalentRequirementChange(requirement.id, 'gender', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                      <option value="">Select gender</option>
                                      <option value="male">Male</option>
                                      <option value="female">Female</option>
                                      <option value="non-binary">Non-binary</option>
                                      <option value="any">Any</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Size
                                    </label>
                                    <select
                                      value={requirement.size}
                                      onChange={(e) => handleTalentRequirementChange(requirement.id, 'size', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                      <option value="">Select size</option>
                                      <option value="xs">XS</option>
                                      <option value="s">S</option>
                                      <option value="m">M</option>
                                      <option value="l">L</option>
                                      <option value="xl">XL</option>
                                      <option value="xxl">XXL</option>
                                      <option value="any">Any</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Age Range
                                    </label>
                                    <select
                                      value={requirement.age}
                                      onChange={(e) => handleTalentRequirementChange(requirement.id, 'age', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                      <option value="">Select age range</option>
                                      <option value="18-25">18-25</option>
                                      <option value="26-35">26-35</option>
                                      <option value="36-45">36-45</option>
                                      <option value="46-55">46-55</option>
                                      <option value="55+">55+</option>
                                      <option value="any">Any</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="mt-3">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Additional Notes
                                  </label>
                                  <textarea
                                    value={requirement.notes}
                                    onChange={(e) => handleTalentRequirementChange(requirement.id, 'notes', e.target.value)}
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Any specific requirements or notes for this talent..."
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Budget */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Minimum Budget ($)
                            </label>
                            <input
                              type="number"
                              value={briefForm.budgetMin}
                              onChange={(e) => handleBriefFormChange('budgetMin', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="5000"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Maximum Budget ($)
                            </label>
                            <input
                              type="number"
                              value={briefForm.budgetMax}
                              onChange={(e) => handleBriefFormChange('budgetMax', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="25000"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Deadline
                            </label>
                            <input
                              type="date"
                              value={briefForm.deadline}
                              onChange={(e) => handleBriefFormChange('deadline', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Shoot Start Date
                            </label>
                            <input
                              type="date"
                              value={briefForm.shootStartDate}
                              onChange={(e) => handleBriefFormChange('shootStartDate', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Shoot End Date
                            </label>
                            <input
                              type="date"
                              value={briefForm.shootEndDate}
                              onChange={(e) => handleBriefFormChange('shootEndDate', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Usage Rights */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Usage Rights
                        </label>
                        <textarea
                          value={briefForm.usageRights}
                          onChange={(e) => handleBriefFormChange('usageRights', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Describe how you plan to use the content (social media, advertising, etc.)..."
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={briefLoading}
                          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {briefLoading ? 'Creating Brief...' : 'Create Brief'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Brand: My Projects Tab */}
            {activeTab === 'my-projects' && currentUserRole === 'BRAND' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">My Projects</h2>
                    <p className="text-sm text-gray-600 mt-1">Manage your project briefs and track progress</p>
                  </div>
                  
                  <div className="p-6">
                    {projects.length > 0 ? (
                      <div className="space-y-4">
                        {projects.map((project) => (
                          <div key={project.id} className="border border-gray-200 rounded-lg p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                              </div>
                              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                                project.status === 'active' ? 'bg-green-100 text-green-800' :
                                project.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                                project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {project.status}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-gray-700">Budget:</span>
                                <span className="ml-2 text-gray-600">
                                  ${project.budget_min || '0'} - ${project.budget_max || '0'}
                                </span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Location:</span>
                                <span className="ml-2 text-gray-600">{project.location || 'Not specified'}</span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Talent Needed:</span>
                                <span className="ml-2 text-gray-600">{project.number_of_talent}</span>
                              </div>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">
                                  Created: {new Date(project.created_at).toLocaleDateString()}
                                </span>
                                <div className="space-x-2">
                                  <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                                    View Details
                                  </button>
                                  <button className="px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700">
                                    Edit
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No projects yet</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating your first brief.</p>
                        <div className="mt-6">
                          <button
                            onClick={() => setActiveTab('create-brief')}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                          >
                            Create Brief
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Brand: Browse Talent Tab */}
            {activeTab === 'browse-talent' && currentUserRole === 'BRAND' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Browse Talent</h2>
                    <p className="text-sm text-gray-600 mt-1">Discover and favorite talent for your projects</p>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Sophisticated Talent Cards with Carousels */}
                      {[
                        {
                          id: 1,
                          name: 'Vittoria Ceretti',
                          category: 'Fashion Model',
                          location: 'Milan, Italy',
                          rate: 5000,
                          rating: 4.9,
                          bio: 'International fashion model with extensive runway and editorial experience.',
                          socials: { 
                            instagram: { followers: 850000, handle: 'vittoria' }, 
                            tiktok: { followers: 120000, handle: 'vittoriaceretti' } 
                          },
                          photos: [
                            'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=400&fit=crop',
                            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop',
                            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop'
                          ],
                          videos: [
                            'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
                            'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4'
                          ]
                        },
                        {
                          id: 2,
                          name: 'Sarah Chen',
                          category: 'Lifestyle Model',
                          location: 'Los Angeles, CA',
                          rate: 2500,
                          rating: 4.7,
                          bio: 'Lifestyle influencer and commercial model specializing in beauty and fashion.',
                          socials: { 
                            instagram: { followers: 125000, handle: 'sarahchen' }, 
                            tiktok: { followers: 89000, handle: 'sarahchenofficial' } 
                          },
                          photos: [
                            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop',
                            'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=400&fit=crop',
                            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop'
                          ],
                          videos: [
                            'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
                          ]
                        },
                        {
                          id: 3,
                          name: 'Marcus Johnson',
                          category: 'Fitness Model',
                          location: 'Miami, FL',
                          rate: 3000,
                          rating: 4.8,
                          bio: 'Professional fitness model and personal trainer with 8+ years experience.',
                          socials: { 
                            instagram: { followers: 200000, handle: 'marcusjohnson' }, 
                            tiktok: { followers: 150000, handle: 'marcusjohnsonfit' } 
                          },
                          photos: [
                            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
                            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
                            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop'
                          ],
                          videos: [
                            'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
                            'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4'
                          ]
                        }
                      ].map((talent) => (
                        <div key={talent.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                          {/* Media Carousel Section */}
                          <div className="relative">
                            <div className="grid grid-cols-2 gap-1 h-64">
                              {/* Photos Carousel */}
                              <div className="relative overflow-hidden">
                                {talent.photos && talent.photos.length > 0 && (
                                  <>
                                    <img
                                      src={talent.photos[imageCarouselIndex[talent.id] || 0]}
                                      alt={`${talent.name} photo ${(imageCarouselIndex[talent.id] || 0) + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                    {talent.photos.length > 1 && (
                                      <>
                                        <button
                                          onClick={() => setImageCarouselIndex(prev => ({
                                            ...prev,
                                            [talent.id]: ((prev[talent.id] || 0) - 1 + talent.photos.length) % talent.photos.length
                                          }))}
                                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70"
                                        >
                                          <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        <button
                                          onClick={() => setImageCarouselIndex(prev => ({
                                            ...prev,
                                            [talent.id]: ((prev[talent.id] || 0) + 1) % talent.photos.length
                                          }))}
                                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70"
                                        >
                                          <ChevronRight className="h-4 w-4" />
                                        </button>
                                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                                          {talent.photos.map((_, index) => (
                                            <div
                                              key={index}
                                              className={`w-2 h-2 rounded-full ${
                                                (imageCarouselIndex[talent.id] || 0) === index
                                                  ? 'bg-white'
                                                  : 'bg-white bg-opacity-50'
                                              }`}
                                            />
                                          ))}
                                        </div>
                                      </>
                                    )}
                                    <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                                      <Image className="h-3 w-3 inline mr-1" />
                                      {talent.photos.length}
                                    </div>
                                  </>
                                )}
                              </div>
                              
                              {/* Videos Carousel */}
                              <div className="relative overflow-hidden">
                                {talent.videos && talent.videos.length > 0 && (
                                  <>
                                    <video
                                      src={talent.videos[videoCarouselIndex[talent.id] || 0]}
                                      className="w-full h-full object-cover"
                                      muted
                                      loop
                                    />
                                    {talent.videos.length > 1 && (
                                      <>
                                        <button
                                          onClick={() => setVideoCarouselIndex(prev => ({
                                            ...prev,
                                            [talent.id]: ((prev[talent.id] || 0) - 1 + talent.videos.length) % talent.videos.length
                                          }))}
                                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70"
                                        >
                                          <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        <button
                                          onClick={() => setVideoCarouselIndex(prev => ({
                                            ...prev,
                                            [talent.id]: ((prev[talent.id] || 0) + 1) % talent.videos.length
                                          }))}
                                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70"
                                        >
                                          <ChevronRight className="h-4 w-4" />
                                        </button>
                                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                                          {talent.videos.map((_, index) => (
                                            <div
                                              key={index}
                                              className={`w-2 h-2 rounded-full ${
                                                (videoCarouselIndex[talent.id] || 0) === index
                                                  ? 'bg-white'
                                                  : 'bg-white bg-opacity-50'
                                              }`}
                                            />
                                          ))}
                                        </div>
                                      </>
                                    )}
                                    <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                                      <Video className="h-3 w-3 inline mr-1" />
                                      {talent.videos.length}
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="bg-black bg-opacity-50 text-white p-2 rounded-full">
                                        <Play className="h-6 w-6" />
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                            
                            {/* Favorite Button */}
                            <button
                              onClick={() => handleFavorite(talent.id)}
                              className={`absolute top-3 right-3 p-2 rounded-full ${
                                favorites.includes(talent.id)
                                  ? 'bg-red-500 text-white'
                                  : 'bg-white text-gray-400 hover:text-red-500'
                              }`}
                            >
                              <Heart className={`h-5 w-5 ${favorites.includes(talent.id) ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                          
                          {/* Card Content */}
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{talent.name}</h3>
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
                            
                            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{talent.bio}</p>
                            
                            <div className="flex justify-between items-center mb-3">
                              <div className="flex items-center text-green-600">
                                <DollarSign className="h-4 w-4" />
                                <span className="font-semibold">{talent.rate.toLocaleString()}</span>
                                <span className="text-sm text-gray-500 ml-1">/day</span>
                              </div>
                              <div className="text-xs text-gray-500">
                                {talent.socials.instagram.followers.toLocaleString()} followers
                              </div>
                            </div>
                            
                            {/* Social Media Links */}
                            <div className="flex space-x-3">
                              <a
                                href={`https://instagram.com/${talent.socials.instagram.handle}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-pink-600 hover:text-pink-700 text-sm font-medium"
                              >
                                <span className="mr-1">📸</span>
                                @{talent.socials.instagram.handle}
                              </a>
                              <a
                                href={`https://tiktok.com/@${talent.socials.tiktok.handle}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-gray-600 hover:text-gray-700 text-sm font-medium"
                              >
                                <span className="mr-1">🎵</span>
                                @{talent.socials.tiktok.handle}
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Talent Interface */}
            {currentUserRole === 'DIRECT_TALENT' && (
              <div className="space-y-6">
                {/* Talent Dashboard */}
                {activeTab === 'dashboard' && (
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h2 className="text-lg font-medium text-gray-900">Talent Dashboard</h2>
                      <p className="text-sm text-gray-600 mt-1">Manage your profile and view opportunities</p>
                    </div>
                    
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <div className="flex items-center">
                            <Briefcase className="h-8 w-8 text-blue-600" />
                            <div className="ml-3">
                              <p className="text-sm font-medium text-blue-600">Active Projects</p>
                              <p className="text-2xl font-bold text-blue-900">3</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-green-50 rounded-lg p-4">
                          <div className="flex items-center">
                            <DollarSign className="h-8 w-8 text-green-600" />
                            <div className="ml-3">
                              <p className="text-sm font-medium text-green-600">This Month</p>
                              <p className="text-2xl font-bold text-green-900">$12,500</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-purple-50 rounded-lg p-4">
                          <div className="flex items-center">
                            <Star className="h-8 w-8 text-purple-600" />
                            <div className="ml-3">
                              <p className="text-sm font-medium text-purple-600">Rating</p>
                              <p className="text-2xl font-bold text-purple-900">4.8</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Recent Opportunities</h3>
                        <div className="space-y-3">
                          {[
                            { id: 1, title: 'Fashion Campaign - Spring Collection', brand: 'Nike', budget: '$3,500', status: 'Pending' },
                            { id: 2, title: 'Beauty Product Launch', brand: 'Sephora', budget: '$2,800', status: 'Accepted' },
                            { id: 3, title: 'Lifestyle Magazine Feature', brand: 'Vogue', budget: '$1,500', status: 'Completed' }
                          ].map((opportunity) => (
                            <div key={opportunity.id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium text-gray-900">{opportunity.title}</h4>
                                  <p className="text-sm text-gray-600">{opportunity.brand}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-green-600">{opportunity.budget}</p>
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    opportunity.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                                    opportunity.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {opportunity.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Talent Profile Management */}
                {activeTab === 'profile' && (
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h2 className="text-lg font-medium text-gray-900">Profile Management</h2>
                      <p className="text-sm text-gray-600 mt-1">Update your talent profile and portfolio</p>
                    </div>
                    
                    <div className="p-6">
                      <div className="space-y-6">
                        {/* Profile Photo Upload */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Photos</h3>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">Upload your best photos</p>
                            <button className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                              Choose Files
                            </button>
                          </div>
                        </div>

                        {/* Basic Information */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                              <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Your full name"
                                defaultValue="Sarah Chen"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                                <option>Model</option>
                                <option>Actor</option>
                                <option>Influencer</option>
                                <option>Athlete</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                              <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="City, State"
                                defaultValue="Los Angeles, CA"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Daily Rate ($)</label>
                              <input
                                type="number"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="2500"
                                defaultValue="2500"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Bio */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                          <textarea
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Tell brands about yourself..."
                            defaultValue="Professional model with 5+ years experience in fashion and commercial modeling. Specializing in lifestyle, beauty, and fashion photography."
                          />
                        </div>

                        {/* Social Media */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Instagram Handle</label>
                              <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="@username"
                                defaultValue="@sarahchen"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">TikTok Handle</label>
                              <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="@username"
                                defaultValue="@sarahchenofficial"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end">
                          <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Talent Opportunities */}
                {activeTab === 'opportunities' && (
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h2 className="text-lg font-medium text-gray-900">Available Opportunities</h2>
                      <p className="text-sm text-gray-600 mt-1">Browse and apply for casting opportunities</p>
                    </div>
                    
                    <div className="p-6">
                      <div className="space-y-4">
                        {[
                          {
                            id: 1,
                            title: 'Fashion Campaign - Spring Collection',
                            brand: 'Nike',
                            description: 'Looking for athletic models for our spring sportswear campaign.',
                            budget: '$3,500',
                            location: 'Los Angeles, CA',
                            shootDate: '2024-03-15',
                            requirements: 'Athletic build, 5\'8"+, Experience with sports photography'
                          },
                          {
                            id: 2,
                            title: 'Beauty Product Launch',
                            brand: 'Sephora',
                            description: 'Seeking models for our new skincare line launch campaign.',
                            budget: '$2,800',
                            location: 'New York, NY',
                            shootDate: '2024-03-20',
                            requirements: 'Clear skin, 18-25 age range, Experience with beauty photography'
                          },
                          {
                            id: 3,
                            title: 'Lifestyle Magazine Feature',
                            brand: 'Vogue',
                            description: 'Editorial shoot for upcoming lifestyle feature.',
                            budget: '$1,500',
                            location: 'Miami, FL',
                            shootDate: '2024-03-25',
                            requirements: 'Fashion-forward, 5\'7"+, Editorial experience preferred'
                          }
                        ].map((opportunity) => (
                          <div key={opportunity.id} className="border border-gray-200 rounded-lg p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">{opportunity.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">{opportunity.brand}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-green-600">{opportunity.budget}</p>
                                <p className="text-sm text-gray-500">{opportunity.location}</p>
                              </div>
                            </div>
                            
                            <p className="text-gray-700 mb-4">{opportunity.description}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                              <div>
                                <span className="font-medium text-gray-700">Shoot Date:</span>
                                <span className="ml-2 text-gray-600">{opportunity.shootDate}</span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Requirements:</span>
                                <span className="ml-2 text-gray-600">{opportunity.requirements}</span>
                              </div>
                            </div>
                            
                            <div className="flex space-x-3">
                              <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                                Apply Now
                              </button>
                              <button className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                                Save for Later
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </>
      )}
      
      {/* Success Notification */}
      {showSuccessNotification && (
        <SuccessNotification
          message={successMessage}
          onClose={() => setShowSuccessNotification(false)}
        />
      )}
    </div>
  );
};

export default PeopleSkillsPlatform;
