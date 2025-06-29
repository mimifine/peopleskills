"use client";

import React, { useState } from 'react';
import { Star, DollarSign, User, Calendar, Send, Plus, FileText, Users, Briefcase, Eye, MapPin, ExternalLink, Upload, X, ThumbsUp, ThumbsDown, Heart, MessageCircle, Calculator, Edit3, Image, Video, Trash2, ChevronLeft, ChevronRight, Play, Check } from 'lucide-react';

const PeopleSkillsPlatform = () => {
  // Password protection state
  const [isPasswordProtected, setIsPasswordProtected] = useState(true);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTalentIds, setSelectedTalentIds] = useState([1, 2]);
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [showBudgetCalc, setShowBudgetCalc] = useState(false);
  const [showTalentComments, setShowTalentComments] = useState(null);
  const [showMediaUpload, setShowMediaUpload] = useState(null);
  const [showMediaViewer, setShowMediaViewer] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [editingNotes, setEditingNotes] = useState(null);
  const [editingBudget, setEditingBudget] = useState(null);
  const [newYouTubeLink, setNewYouTubeLink] = useState('');
  const [newVimeoLink, setNewVimeoLink] = useState('');
  const [imageCarouselIndex, setImageCarouselIndex] = useState({});
  const [videoCarouselIndex, setVideoCarouselIndex] = useState({});
  const [editingName, setEditingName] = useState(null);
  const [editingNameValue, setEditingNameValue] = useState('');
  const [showBriefModal, setShowBriefModal] = useState(false);
  const [showFullscreenMedia, setShowFullscreenMedia] = useState(null);
  const [projectDeadline, setProjectDeadline] = useState('');
  
  // Authentication state
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    role: ''
  });
  
  // Brief form state
  const [briefForm, setBriefForm] = useState({
    projectTitle: '',
    projectDescription: '',
    usageRights: '',
    talentCount: 1,
    talentGender: 'female',
    talentSizes: '',
    totalBudget: '',
    talentRateRange: '',
    shootStartDate: '',
    shootEndDate: '',
    fittingDate: '',
    shootLocation: ''
  });
  
  // Enhanced talent requirements state
  const [numberOfTalent, setNumberOfTalent] = useState(1);
  const [talentRequirements, setTalentRequirements] = useState([
    { id: 1, sizes: '', gender: '' }
  ]);
  
  // Projects data
  const [projects] = useState([
    {
      id: 1,
      title: 'Summer Campaign 2025',
      status: 'talent-review',
      deadline: 'March 15, 2025',
      budget: '$75,000',
      selectedTalent: [1, 2]
    },
    {
      id: 2,
      title: 'Fall Fashion Collection',
      status: 'brief-sent',
      deadline: 'April 30, 2025',
      budget: '$120,000',
      selectedTalent: [1]
    }
  ]);

  // Budget tracking
  const [budget] = useState({
    totals: {
      total: 5700
    }
  });
  
  const currentUser = { id: 'admin', name: 'Admin User', role: 'admin' };
  
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
      id: 'brand-1'
    },
    {
      email: 'talent@model.com',
      password: 'talent123',
      role: 'DIRECT_TALENT',
      name: 'Sarah Chen',
      id: 'talent-1'
    }
  ];
  
  // Authentication functions
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
      setAuthForm({ email: '', password: '', role: '' });
    } else {
      alert('Invalid email or password');
    }
  };
  
  const handleSignup = () => {
    if (!authForm.email || !authForm.password || !authForm.role) {
      alert('Please fill in all fields');
      return;
    }
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === authForm.email);
    if (existingUser) {
      alert('User already exists');
      return;
    }
    
    // Mock signup - in real app this would create a new user
    const newUser = {
      email: authForm.email,
      password: authForm.password,
      role: authForm.role,
      name: authForm.email.split('@')[0],
      id: `user-${Date.now()}`
    };
    
    mockUsers.push(newUser);
    setIsAuthenticated(true);
    setCurrentUserRole(newUser.role);
    setShowAuthModal(false);
    setAuthForm({ email: '', password: '', role: '' });
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUserRole(null);
    setActiveTab('dashboard');
  };
  
  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setShowAuthModal(true);
    setAuthForm({ email: '', password: '', role: '' });
  };
  
  // Password protection function
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === 'PeopleSkills1977') {
      setIsPasswordProtected(false);
      setPasswordError(false);
      setPasswordInput('');
    } else {
      setPasswordError(true);
      setPasswordInput('');
    }
  };
  
  const formatFollowers = (count) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(0) + 'K';
    }
    return count.toString();
  };

  const extractVideoId = (url, platform) => {
    if (platform === 'youtube') {
      const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
      return match ? match[1] : null;
    } else if (platform === 'vimeo') {
      const match = url.match(/vimeo\.com\/(\d+)/);
      return match ? match[1] : null;
    }
    return null;
  };

  const [talents, setTalents] = useState([
    {
      id: 1,
      name: 'Sarah Chen',
      category: 'Model/Influencer',
      rate: 2500,
      location: 'Los Angeles, CA',
      rating: 4.8,
      image: '/api/placeholder/300/400',
      socials: {
        instagram: {
          handle: '@sarahchen_model',
          url: 'https://instagram.com/sarahchen_model',
          followers: 125000,
          lastUpdated: '2 hours ago'
        },
        tiktok: {
          handle: '@sarahchenofficial',
          url: 'https://tiktok.com/@sarahchenofficial',
          followers: 89000,
          lastUpdated: '1 hour ago'
        }
      },
      votes: {
        up: ['sarah', 'lisa'],
        down: [],
        userVote: null
      },
      favorites: ['sarah', 'lisa'],
      isFavorited: false,
      castingNotes: "Perfect fit for our summer campaign aesthetic. Strong engagement rates and previous experience with lifestyle brands.",
      budgetBreakdown: {
        talentFee: 2500,
        agencyPercent: 20,
        usageFee: 1500,
        travelAccommodation: 800
      },
      media: {
        images: [
          { id: 1, url: 'https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Headshot', isPrimary: true, title: 'Headshot' },
          { id: 2, url: 'https://via.placeholder.com/400x400/4ECDC4/FFFFFF?text=Commercial+Shot', isPrimary: false, title: 'Commercial Shot' },
          { id: 3, url: 'https://via.placeholder.com/400x400/45B7D1/FFFFFF?text=Behind+the+Scenes', isPrimary: false, title: 'Behind the Scenes' },
          { id: 4, url: 'https://via.placeholder.com/400x400/96CEB4/FFFFFF?text=Professional+Look', isPrimary: false, title: 'Professional Look' }
        ],
        videos: [
          { 
            id: 1, 
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 
            videoId: 'dQw4w9WgXcQ',
            platform: 'youtube',
            thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
            title: 'YouTube Portfolio', 
            type: 'youtube',
            isPrimary: true
          },
          { 
            id: 2, 
            url: 'https://vimeo.com/123456789', 
            videoId: '123456789',
            platform: 'vimeo',
            thumbnailUrl: 'https://vumbnail.com/123456789.jpg',
            title: 'Vimeo Showreel', 
            type: 'vimeo',
            isPrimary: false
          }
        ]
      },
      comments: [
        {
          id: 1,
          author: 'Sarah Johnson',
          message: '@casting director - Love this choice! Her style matches perfectly.',
          timestamp: '2 hours ago'
        }
      ]
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      category: 'Actor/Model',
      rate: 3200,
      location: 'New York, NY',
      rating: 4.9,
      image: '/api/placeholder/300/400',
      socials: {
        instagram: {
          handle: '@marcusrodriguez',
          url: 'https://instagram.com/marcusrodriguez',
          followers: 67000,
          lastUpdated: '3 hours ago'
        },
        tiktok: {
          handle: '@marcusactor',
          url: 'https://tiktok.com/@marcusactor',
          followers: 42000,
          lastUpdated: '4 hours ago'
        }
      },
      votes: {
        up: ['mike'],
        down: ['lisa'],
        userVote: null
      },
      favorites: ['mike'],
      isFavorited: false,
      castingNotes: "Experienced commercial actor with strong camera presence. Premium rate but justified by his extensive portfolio.",
      budgetBreakdown: {
        talentFee: 3200,
        agencyPercent: 15,
        usageFee: 2000,
        travelAccommodation: 1200
      },
      media: {
        images: [
          { id: 1, url: 'https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Headshot', isPrimary: true, title: 'Headshot' },
          { id: 2, url: 'https://via.placeholder.com/400x400/4ECDC4/FFFFFF?text=Commercial+Shot', isPrimary: false, title: 'Commercial Shot' },
          { id: 3, url: 'https://via.placeholder.com/400x400/45B7D1/FFFFFF?text=Behind+the+Scenes', isPrimary: false, title: 'Behind the Scenes' },
          { id: 4, url: 'https://via.placeholder.com/400x400/96CEB4/FFFFFF?text=Professional+Look', isPrimary: false, title: 'Professional Look' }
        ],
        videos: [
          { 
            id: 1, 
            url: 'https://www.youtube.com/watch?v=9bZkp7q19f0', 
            videoId: '9bZkp7q19f0',
            platform: 'youtube',
            thumbnailUrl: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg',
            title: 'Acting Reel', 
            type: 'youtube',
            isPrimary: true
          },
          { 
            id: 2, 
            url: 'https://vimeo.com/123456789', 
            videoId: '123456789',
            platform: 'vimeo',
            thumbnailUrl: 'https://vumbnail.com/123456789.jpg',
            title: 'Vimeo Showreel', 
            type: 'vimeo',
            isPrimary: false
          }
        ]
      },
      comments: [
        {
          id: 1,
          author: 'Mike Chen',
          message: '@casting director - Great choice, his commercial experience shows.',
          timestamp: '1 hour ago'
        }
      ]
    }
  ]);

  const handleTalentSelection = (talentId) => {
    setSelectedTalentIds(prev => 
      prev.includes(talentId) 
        ? prev.filter(id => id !== talentId)
        : [...prev, talentId]
    );
  };

  const handleVote = (talentId, voteType) => {
    setTalents(prev => prev.map(talent => {
      if (talent.id === talentId) {
        const currentVote = talent.votes.userVote;
        let newUpVotes = [...talent.votes.up];
        let newDownVotes = [...talent.votes.down];
        
        if (currentVote === 'up') {
          newUpVotes = newUpVotes.filter(id => id !== currentUser.id);
        } else if (currentVote === 'down') {
          newDownVotes = newDownVotes.filter(id => id !== currentUser.id);
        }
        
        if (voteType === 'up' && currentVote !== 'up') {
          newUpVotes.push(currentUser.id);
        } else if (voteType === 'down' && currentVote !== 'down') {
          newDownVotes.push(currentUser.id);
        }
        
        return {
          ...talent,
          votes: {
            up: newUpVotes,
            down: newDownVotes,
            userVote: currentVote === voteType ? null : voteType
          }
        };
      }
      return talent;
    }));
  };

  const handleFavorite = (talentId) => {
    setTalents(prev => prev.map(talent => {
      if (talent.id === talentId) {
        const isFavorited = talent.favorites.includes(currentUser.id);
        return {
          ...talent,
          favorites: isFavorited 
            ? talent.favorites.filter(id => id !== currentUser.id)
            : [...talent.favorites, currentUser.id],
          isFavorited: !isFavorited
        };
      }
      return talent;
    }));
  };

  const handleImageUpload = (talentId, files) => {
    console.log('Uploading images for talent:', talentId, 'Files:', files);
    
    const newImages = Array.from(files).map((file, index) => ({
      id: Date.now() + index,
      url: URL.createObjectURL(file),
      isPrimary: false,
      title: `Image ${index + 1}`
    }));

    setTalents(prev => prev.map(talent => {
      if (talent.id === talentId) {
        console.log('Updating talent:', talent.name, 'with new images:', newImages);
        return {
          ...talent,
          media: {
            ...talent.media,
            images: [...talent.media.images, ...newImages]
          }
        };
      }
      return talent;
    }));
    
    setShowMediaUpload(null);
  };

  const handleVideoUpload = (talentId, files) => {
    console.log('Uploading videos for talent:', talentId, 'Files:', files);
    
    const newVideos = Array.from(files).map((file, index) => ({
      id: Date.now() + index,
      url: URL.createObjectURL(file),
      isPrimary: false,
      title: `Video ${index + 1}`,
      type: 'upload'
    }));

    setTalents(prev => prev.map(talent => {
      if (talent.id === talentId) {
        console.log('Updating talent:', talent.name, 'with new videos:', newVideos);
        return {
          ...talent,
          media: {
            ...talent.media,
            videos: [...talent.media.videos, ...newVideos]
          }
        };
      }
      return talent;
    }));
    
    setShowMediaUpload(null);
  };

  const addVideoLink = (talentId, platform, url) => {
    console.log('Adding video link for talent:', talentId, 'Platform:', platform, 'URL:', url);
    
    const videoId = extractVideoId(url, platform);
    if (!videoId) {
      alert('Invalid video URL');
      return;
    }

    let thumbnailUrl;
    if (platform === 'youtube') {
      thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      const fallbackUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      console.log('YouTube thumbnail URLs:', { primary: thumbnailUrl, fallback: fallbackUrl });
    } else if (platform === 'vimeo') {
      thumbnailUrl = `https://vumbnail.com/${videoId}.jpg`;
    }

    const newVideo = {
      id: Date.now(),
      url,
      videoId,
      platform,
      thumbnailUrl,
      fallbackThumbnailUrl: platform === 'youtube' ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null,
      isPrimary: false,
      title: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Video`,
      type: platform
    };

    setTalents(prev => prev.map(talent => {
      if (talent.id === talentId) {
        console.log('Updating talent:', talent.name, 'with new video link:', newVideo);
        return {
          ...talent,
          media: {
            ...talent.media,
            videos: [...talent.media.videos, newVideo]
          }
        };
      }
      return talent;
    }));

    if (platform === 'youtube') {
      setNewYouTubeLink('');
    } else {
      setNewVimeoLink('');
    }
  };

  const setPrimaryMedia = (talentId, mediaType, mediaId) => {
    console.log('Setting primary media for talent:', talentId, 'Type:', mediaType, 'ID:', mediaId);
    
    setTalents(prev => prev.map(talent => {
      if (talent.id === talentId) {
        const updatedMedia = { ...talent.media };
        
        if (mediaType === 'image') {
          updatedMedia.images = updatedMedia.images.map(img => ({
            ...img,
            isPrimary: img.id === mediaId
          }));
          console.log('Updated images:', updatedMedia.images);
        } else if (mediaType === 'video') {
          updatedMedia.videos = updatedMedia.videos.map(vid => ({
            ...vid,
            isPrimary: vid.id === mediaId
          }));
          console.log('Updated videos:', updatedMedia.videos);
        }
        
        console.log('Updated media for talent:', talent.name, updatedMedia);
        return {
          ...talent,
          media: updatedMedia
        };
      }
      return talent;
    }));
    
    setTimeout(() => {
      console.log('Primary media set successfully!');
    }, 100);
  };

  const removeMedia = (talentId, mediaType, mediaId) => {
    console.log('Removing media for talent:', talentId, 'Type:', mediaType, 'ID:', mediaId);
    
    setTalents(prev => prev.map(talent => {
      if (talent.id === talentId) {
        const updatedMedia = { ...talent.media };
        
        if (mediaType === 'image') {
          updatedMedia.images = updatedMedia.images.filter(img => img.id !== mediaId);
        } else if (mediaType === 'video') {
          updatedMedia.videos = updatedMedia.videos.filter(vid => vid.id !== mediaId);
        }
        
        console.log('Updated media for talent:', talent.name, updatedMedia);
        return {
          ...talent,
          media: updatedMedia
        };
      }
      return talent;
    }));
  };

  const addTestImages = (talentId) => {
    console.log('Adding test images for talent:', talentId);
    
    const testImages = [
      { id: Date.now() + 1, url: 'https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Test+Image+1', isPrimary: false, title: 'Test Image 1' },
      { id: Date.now() + 2, url: 'https://via.placeholder.com/400x400/4ECDC4/FFFFFF?text=Test+Image+2', isPrimary: false, title: 'Test Image 2' },
      { id: Date.now() + 3, url: 'https://via.placeholder.com/400x400/45B7D1/FFFFFF?text=Test+Image+3', isPrimary: false, title: 'Test Image 3' },
      { id: Date.now() + 4, url: 'https://via.placeholder.com/400x400/96CEB4/FFFFFF?text=Test+Image+4', isPrimary: false, title: 'Test Image 4' },
      { id: Date.now() + 5, url: 'https://via.placeholder.com/400x400/FFEAA7/000000?text=Test+Image+5', isPrimary: false, title: 'Test Image 5' }
    ];

    setTalents(prev => prev.map(talent => {
      if (talent.id === talentId) {
        console.log('Adding test images to talent:', talent.name);
        return {
          ...talent,
          media: {
            ...talent.media,
            images: [...talent.media.images, ...testImages]
          }
        };
      }
      return talent;
    }));
  };

  const clearImages = (talentId) => {
    console.log('Clearing images for talent:', talentId);
    
    setTalents(prev => prev.map(talent => {
      if (talent.id === talentId) {
        console.log('Clearing images for talent:', talent.name);
        return {
          ...talent,
          media: {
            ...talent.media,
            images: []
          }
        };
      }
      return talent;
    }));
  };

  const handleImageCarouselNav = (talentId, direction) => {
    setImageCarouselIndex(prev => {
      const current = prev[talentId] || 0;
      const talent = talents.find(t => t.id === talentId);
      const total = talent ? talent.media.images.length : 0;
      if (total === 0) return prev;
      let next = current + direction;
      if (next < 0) next = total - 1;
      if (next >= total) next = 0;
      return { ...prev, [talentId]: next };
    });
  };

  const handleVideoCarouselNav = (talentId, direction) => {
    setVideoCarouselIndex(prev => {
      const current = prev[talentId] || 0;
      const talent = talents.find(t => t.id === talentId);
      const total = talent ? talent.media.videos.length : 0;
      if (total === 0) return prev;
      let next = current + direction;
      if (next < 0) next = total - 1;
      if (next >= total) next = 0;
      return { ...prev, [talentId]: next };
    });
  };

  const filteredTalents = filterFavorites 
    ? talents.filter(talent => talent.favorites.includes(currentUser.id))
    : talents;

  const totalBudget = selectedTalentIds.reduce((sum, talentId) => {
    const talent = talents.find(t => t.id === talentId);
    return sum + (talent ? talent.rate : 0);
  }, 0);

  const isAdmin = currentUser.id === 'admin' || currentUser.role === 'admin';

  const handleNameEdit = (talentId, currentName) => {
    setEditingName(talentId);
    setEditingNameValue(currentName);
  };

  const handleNameSave = (talentId) => {
    if (editingNameValue.trim()) {
      setTalents(prev => prev.map(talent => 
        talent.id === talentId 
          ? { ...talent, name: editingNameValue.trim() }
          : talent
      ));
    }
    setEditingName(null);
    setEditingNameValue('');
  };

  const handleNameCancel = () => {
    setEditingName(null);
    setEditingNameValue('');
  };

  // Auto-populate talent sizes based on gender and count
  const autoPopulateTalentSizes = (gender, count) => {
    let sizes = '';
    
    if (gender === 'female') {
      if (count <= 5) {
        sizes = 'Women\'s sizes 2-8, must be 5\'4" to 5\'9", dress sizes 0-6';
      } else if (count <= 15) {
        sizes = 'Women\'s sizes 0-10, must be 5\'3" to 5\'10", dress sizes 00-8, shoe sizes 6-9';
      } else if (count <= 30) {
        sizes = 'Women\'s sizes 00-12, must be 5\'2" to 5\'11", dress sizes 00-10, shoe sizes 5-10, various body types';
      } else {
        sizes = 'Women\'s sizes 00-16, must be 5\'0" to 6\'0", dress sizes 00-14, shoe sizes 4-11, diverse body types and heights';
      }
    } else if (gender === 'male') {
      if (count <= 5) {
        sizes = 'Men\'s shirt sizes S-L, pants 30-34 waist, must be 5\'8" to 6\'2"';
      } else if (count <= 15) {
        sizes = 'Men\'s shirt sizes XS-XL, pants 28-36 waist, must be 5\'7" to 6\'3", shoe sizes 8-12';
      } else if (count <= 30) {
        sizes = 'Men\'s shirt sizes XS-XXL, pants 26-38 waist, must be 5\'6" to 6\'4", shoe sizes 7-13, various body types';
      } else {
        sizes = 'Men\'s shirt sizes XS-3XL, pants 24-40 waist, must be 5\'5" to 6\'5", shoe sizes 6-14, diverse body types and heights';
      }
    } else { // non-binary
      if (count <= 5) {
        sizes = 'Gender-neutral sizing, must be 5\'5" to 6\'0", flexible styling options';
      } else if (count <= 15) {
        sizes = 'Gender-neutral sizing, must be 5\'4" to 6\'1", flexible styling options, various body types';
      } else if (count <= 30) {
        sizes = 'Gender-neutral sizing, must be 5\'3" to 6\'2", flexible styling options, diverse body types and heights';
      } else {
        sizes = 'Gender-neutral sizing, must be 5\'2" to 6\'3", flexible styling options, diverse body types, heights, and styling preferences';
      }
    }
    
    return sizes;
  };

  // Handle brief form changes
  const handleBriefFormChange = (field, value) => {
    setBriefForm(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-populate talent sizes when gender or count changes
      if (field === 'talentGender' || field === 'talentCount') {
        updated.talentSizes = autoPopulateTalentSizes(updated.talentGender, updated.talentCount);
      }
      
      return updated;
    });
  };

  // Reset brief form to default values
  const resetBriefForm = () => {
    setBriefForm({
      projectTitle: '',
      projectDescription: '',
      usageRights: '',
      talentCount: 1,
      talentGender: 'female',
      talentSizes: autoPopulateTalentSizes('female', 1),
      totalBudget: '',
      talentRateRange: '',
      shootStartDate: '',
      shootEndDate: '',
      fittingDate: '',
      shootLocation: ''
    });
    setNumberOfTalent(1);
    setTalentRequirements([{ id: 1, sizes: '', gender: '' }]);
  };

  // Handle opening brief modal
  const handleOpenBriefModal = () => {
    resetBriefForm();
    setShowBriefModal(true);
  };

  // Handle talent number changes
  const handleTalentNumberChange = (count) => {
    setNumberOfTalent(count);
    
    // Create array of talent requirements based on count
    const newRequirements = [];
    for (let i = 1; i <= count; i++) {
      const existing = talentRequirements.find(req => req.id === i);
      newRequirements.push({
        id: i,
        sizes: existing ? existing.sizes : '',
        gender: existing ? existing.gender : ''
      });
    }
    setTalentRequirements(newRequirements);
  };

  // Update individual talent requirements
  const updateTalentRequirement = (talentId, field, value) => {
    setTalentRequirements(prev => 
      prev.map(req => 
        req.id === talentId ? { ...req, [field]: value } : req
      )
    );
  };

  // Handle sending brief
  const handleSendBrief = () => {
    console.log('Sending brief:', briefForm);
    // Here you would typically send the data to your backend
    alert('Brief sent successfully!');
    setShowBriefModal(false);
  };

  // Handle saving draft
  const handleSaveDraft = () => {
    console.log('Saving draft:', briefForm);
    // Here you would typically save the data to your backend
    alert('Draft saved successfully!');
    setShowBriefModal(false);
  };

  // MediaGallery Component
  const MediaGallery = ({ talent }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

    const nextImage = () => {
      setCurrentImageIndex((prev) => 
        prev === talent.media.images.length - 1 ? 0 : prev + 1
      );
    };

    const prevImage = () => {
      setCurrentImageIndex((prev) => 
        prev === 0 ? talent.media.images.length - 1 : prev - 1
      );
    };

    const nextVideo = () => {
      setCurrentVideoIndex((prev) => 
        prev === talent.media.videos.length - 1 ? 0 : prev + 1
      );
    };

    const prevVideo = () => {
      setCurrentVideoIndex((prev) => 
        prev === 0 ? talent.media.videos.length - 1 : prev - 1
      );
    };

    const extractVideoId = (url, platform) => {
      if (platform === 'youtube') {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
        return match ? match[1] : null;
      } else if (platform === 'vimeo') {
        const match = url.match(/vimeo\.com\/(\d+)/);
        return match ? match[1] : null;
      }
      return null;
    };

    const renderVideoPlayer = (video) => {
      if (video.type === 'youtube') {
        const videoId = extractVideoId(video.url, 'youtube');
        return videoId ? (
          <iframe
            className="w-full h-full rounded-lg"
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allowFullScreen
            title={video.title}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-red-100 text-red-600 rounded-lg">
            <p className="text-sm">Invalid YouTube URL</p>
          </div>
        );
      } else if (video.type === 'vimeo') {
        const videoId = extractVideoId(video.url, 'vimeo');
        return videoId ? (
          <iframe
            className="w-full h-full rounded-lg"
            src={`https://player.vimeo.com/video/${videoId}`}
            frameBorder="0"
            allowFullScreen
            title={video.title}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-red-100 text-red-600 rounded-lg">
            <p className="text-sm">Invalid Vimeo URL</p>
          </div>
        );
      } else {
        // For uploaded videos
        return (
          <video className="w-full h-full object-cover rounded-lg" controls>
            <source src={video.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      }
    };

    const openFullscreenImages = (startIndex = currentImageIndex) => {
      setShowFullscreenMedia({
        items: talent.media.images,
        type: 'image',
        startIndex: startIndex
      });
    };

    const openFullscreenVideos = (startIndex = currentVideoIndex) => {
      setShowFullscreenMedia({
        items: talent.media.videos,
        type: 'video',
        startIndex: startIndex
      });
    };

    return (
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Images Section - Make it clickable */}
        <div 
          className="bg-gray-200 rounded-lg overflow-hidden aspect-square relative cursor-pointer hover:opacity-90 transition-opacity group"
          onClick={() => openFullscreenImages()}
        >
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
              Images ({talent.media.images.length}/10)
            </span>
          </div>
          
          {talent.media.images.length > 0 ? (
            <>
              <img
                src={talent.media.images[currentImageIndex]?.url || 'https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Headshot'}
                alt={talent.media.images[currentImageIndex]?.title || 'Talent photo'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Create better placeholder based on title
                  const title = talent.media.images[currentImageIndex]?.title || 'Photo';
                  e.target.src = `https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=${encodeURIComponent(title)}`;
                }}
              />
              
              {/* Hover overlay to indicate clickability */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Eye className="h-8 w-8 text-white" />
                </div>
              </div>
              
              {/* Navigation arrows - prevent event bubbling */}
              {talent.media.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-opacity z-20"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-opacity z-20"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}
              
              {/* Expand icon */}
              <div className="absolute bottom-2 right-2 z-20">
                <Eye className="h-4 w-4 text-white bg-black bg-opacity-50 rounded p-1" />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 bg-gray-100">
              <div className="text-center">
                <Image className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No images</p>
              </div>
            </div>
          )}
        </div>

        {/* Videos Section - Make it clickable */}
        <div 
          className="bg-gray-200 rounded-lg overflow-hidden aspect-square relative cursor-pointer hover:opacity-90 transition-opacity group"
          onClick={() => openFullscreenVideos()}
        >
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
              Videos ({talent.media.videos.length}/3)
            </span>
          </div>
          
          {talent.media.videos.length > 0 ? (
            <>
              <div className="w-full h-full">
                {renderVideoPlayer(talent.media.videos[currentVideoIndex])}
              </div>
              
              {/* Hover overlay to indicate clickability */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Eye className="h-8 w-8 text-white" />
                </div>
              </div>
              
              {/* Navigation arrows for videos */}
              {talent.media.videos.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevVideo();
                    }}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 z-30 transition-opacity"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextVideo();
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 z-30 transition-opacity"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}
              
              {/* Expand icon */}
              <div className="absolute bottom-2 right-2 z-30">
                <Eye className="h-4 w-4 text-white bg-black bg-opacity-50 rounded p-1" />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 bg-gray-100">
              <div className="text-center">
                <Video className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No videos</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Fullscreen Media Viewer Component
  const FullscreenMediaViewer = ({ mediaData, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    
    React.useEffect(() => {
      if (mediaData) {
        setCurrentIndex(mediaData.startIndex || 0);
      }
    }, [mediaData]);
    
    if (!mediaData) return null;
    
    const { items, type, startIndex } = mediaData;
    
    const nextItem = () => {
      setCurrentIndex((prev) => prev === items.length - 1 ? 0 : prev + 1);
    };
    
    const prevItem = () => {
      setCurrentIndex((prev) => prev === 0 ? items.length - 1 : prev - 1);
    };
    
    const renderFullscreenVideo = (video) => {
      if (video.type === 'youtube') {
        const videoId = extractVideoId(video.url, 'youtube');
        return (
          <iframe
            className="w-full h-full max-w-4xl max-h-[80vh]"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            frameBorder="0"
            allowFullScreen
            title={video.title}
          />
        );
      } else if (video.type === 'vimeo') {
        const videoId = extractVideoId(video.url, 'vimeo');
        return (
          <iframe
            className="w-full h-full max-w-4xl max-h-[80vh]"
            src={`https://player.vimeo.com/video/${videoId}?autoplay=1`}
            frameBorder="0"
            allowFullScreen
            title={video.title}
          />
        );
      } else {
        return (
          <video 
            className="w-full h-full max-w-4xl max-h-[80vh] object-contain" 
            controls 
            autoPlay
          >
            <source src={video.url} type="video/mp4" />
          </video>
        );
      }
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-60"
        >
          <X className="h-8 w-8" />
        </button>
        
        {/* Navigation arrows */}
        {items.length > 1 && (
          <>
            <button
              onClick={prevItem}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-60"
            >
              <ChevronLeft className="h-12 w-12" />
            </button>
            <button
              onClick={nextItem}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-60"
            >
              <ChevronRight className="h-12 w-12" />
            </button>
          </>
        )}
        
        {/* Media content */}
        <div className="flex items-center justify-center w-full h-full p-8">
          {type === 'image' ? (
            <img
              src={items[currentIndex]?.url || 'https://via.placeholder.com/800x600/e5e7eb/6b7280?text=Image+Not+Found'}
              alt={items[currentIndex]?.title || 'Fullscreen image'}
              className="max-w-full max-h-full object-contain"
              style={{ 
                maxWidth: '90vw', 
                maxHeight: '90vh',
                width: 'auto',
                height: 'auto'
              }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x600/e5e7eb/6b7280?text=Image+Not+Found';
              }}
            />
          ) : (
            renderFullscreenVideo(items[currentIndex])
          )}
        </div>
        
        {/* Image counter */}
        {items.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
            <span>{currentIndex + 1} / {items.length}</span>
          </div>
        )}
        
        {/* Thumbnail dots */}
        {items.length > 1 && items.length <= 10 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Authentication Modal Component
  const AuthenticationModal = () => {
    if (!showAuthModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {authMode === 'login' ? 'Sign In' : 'Create Account'}
            </h2>
            <button
              onClick={() => setShowAuthModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            authMode === 'login' ? handleLogin() : handleSignup();
          }}>
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
                  placeholder="Enter your email"
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
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              {authMode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={authForm.role}
                    onChange={(e) => handleAuthFormChange('role', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select your role</option>
                    <option value="BRAND">Brand - I&apos;m hiring talent</option>
                    <option value="DIRECT_TALENT">Talent - I&apos;m looking for opportunities</option>
                  </select>
                </div>
              )}
              
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {authMode === 'login' ? "Don&apos;t have an account? " : "Already have an account? "}
              <button
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                {authMode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
          
          {/* Quick login buttons for testing */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3 text-center">Quick login for testing:</p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  handleAuthFormChange('email', 'admin@peopleskills.com');
                  handleAuthFormChange('password', 'admin123');
                  handleLogin();
                }}
                className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition-colors text-sm"
              >
                Login as Admin
              </button>
              <button
                onClick={() => {
                  handleAuthFormChange('email', 'brand@company.com');
                  handleAuthFormChange('password', 'brand123');
                  handleLogin();
                }}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Login as Brand
              </button>
              <button
                onClick={() => {
                  handleAuthFormChange('email', 'talent@model.com');
                  handleAuthFormChange('password', 'talent123');
                  handleLogin();
                }}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Login as Talent
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Password Protection Screen */}
      {isPasswordProtected ? (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-md w-full mx-auto p-8">
            <div className="bg-white rounded-lg shadow-xl p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">People Skills</h1>
                <p className="text-gray-600">Enter password to access the platform</p>
              </div>
              
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setPasswordError(false);
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                      passwordError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter password"
                    autoFocus
                  />
                  {passwordError && (
                    <p className="mt-2 text-sm text-red-600">Incorrect password. Please try again.</p>
                  )}
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Access Platform
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  Protected platform for authorized users only
                </p>
              </div>
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
                          onClick={() => setActiveTab('talent')}
                          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === 'talent'
                              ? 'bg-purple-100 text-purple-700'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          All Talent
                        </button>
                        <button
                          onClick={() => setActiveTab('brief')}
                          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === 'brief'
                              ? 'bg-purple-100 text-purple-700'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          All Briefs
                        </button>
                        <button
                          onClick={() => setActiveTab('users')}
                          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === 'users'
                              ? 'bg-purple-100 text-purple-700'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          User Management
                        </button>
                      </>
                    )}
                    
                    {currentUserRole === 'BRAND' && (
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
                          onClick={() => setActiveTab('talent')}
                          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === 'talent'
                              ? 'bg-purple-100 text-purple-700'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          Talent Review
                        </button>
                        <button
                          onClick={() => setActiveTab('brief')}
                          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === 'brief'
                              ? 'bg-purple-100 text-purple-700'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          Create Brief
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
                          My Profile
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
                        <button
                          onClick={() => setActiveTab('earnings')}
                          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === 'earnings'
                              ? 'bg-purple-100 text-purple-700'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          Earnings
                        </button>
                      </>
                    )}
                  </div>
                )}
                
                <div className="flex items-center space-x-4">
                  {isAuthenticated ? (
                    <>
                      {currentUserRole === 'BRAND' && (
                        <>
                          <button
                            onClick={() => setShowBudgetCalc(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                          >
                            <Calculator className="w-4 h-4 mr-2" />
                            Budget
                          </button>
                          <button 
                            onClick={handleOpenBriefModal}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            New Brief
                          </button>
                        </>
                      )}
                      
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
            {!isAuthenticated ? (
              // Login Screen
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center max-w-md">
                  <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to People Skills</h1>
                    <p className="text-lg text-gray-600 mb-8">
                      The premier platform for connecting brands with exceptional talent
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <button
                      onClick={() => openAuthModal('login')}
                      className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium text-lg"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => openAuthModal('signup')}
                      className="w-full border-2 border-purple-600 text-purple-600 py-3 px-6 rounded-lg hover:bg-purple-50 transition-colors font-medium text-lg"
                    >
                      Create Account
                    </button>
                  </div>
                  
                  <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-3">Quick access for testing:</p>
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        onClick={() => {
                          handleAuthFormChange('email', 'admin@peopleskills.com');
                          handleAuthFormChange('password', 'admin123');
                          handleLogin();
                        }}
                        className="text-sm bg-gray-800 text-white py-2 px-3 rounded hover:bg-gray-900 transition-colors"
                      >
                        Admin Access
                      </button>
                      <button
                        onClick={() => {
                          handleAuthFormChange('email', 'brand@company.com');
                          handleAuthFormChange('password', 'brand123');
                          handleLogin();
                        }}
                        className="text-sm bg-blue-600 text-white py-2 px-3 rounded hover:bg-blue-700 transition-colors"
                      >
                        Brand Access
                      </button>
                      <button
                        onClick={() => {
                          handleAuthFormChange('email', 'talent@model.com');
                          handleAuthFormChange('password', 'talent123');
                          handleLogin();
                        }}
                        className="text-sm bg-green-600 text-white py-2 px-3 rounded hover:bg-green-700 transition-colors"
                      >
                        Talent Access
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Authenticated Content
              <>
                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Dashboard</h2>
                    
                    {/* Quick Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                      <div className="bg-white rounded-lg shadow border p-6">
                        <div className="flex items-center">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Briefcase className="h-6 w-6 text-purple-600" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Active Projects</p>
                            <p className="text-2xl font-semibold text-gray-900">{projects.length}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg shadow border p-6">
                        <div className="flex items-center">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Users className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Talent</p>
                            <p className="text-2xl font-semibold text-gray-900">{talents.length}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg shadow border p-6">
                        <div className="flex items-center">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Star className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Selected Talent</p>
                            <p className="text-2xl font-semibold text-gray-900">{selectedTalentIds.length}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg shadow border p-6">
                        <div className="flex items-center">
                          <div className="p-2 bg-yellow-100 rounded-lg">
                            <DollarSign className="h-6 w-6 text-yellow-600" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Current Budget</p>
                            <p className="text-2xl font-semibold text-gray-900">${budget.totals.total.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                      <div className="lg:col-span-2 bg-white rounded-lg shadow border p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="p-1 bg-green-100 rounded-full">
                              <ThumbsUp className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-900">
                                <span className="font-medium">Sarah Johnson</span> voted up Sarah Chen
                              </p>
                              <p className="text-xs text-gray-500">2 hours ago</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="p-1 bg-blue-100 rounded-full">
                              <MessageCircle className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-900">
                                <span className="font-medium">Mike Chen</span> commented on Marcus Rodriguez
                              </p>
                              <p className="text-xs text-gray-500">1 hour ago</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="p-1 bg-red-100 rounded-full">
                              <Heart className="h-4 w-4 text-red-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-900">
                                <span className="font-medium">Lisa Park</span> favorited Sarah Chen
                              </p>
                              <p className="text-xs text-gray-500">3 hours ago</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="p-1 bg-purple-100 rounded-full">
                              <Plus className="h-4 w-4 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-900">
                                New talent added to Summer Campaign 2025
                              </p>
                              <p className="text-xs text-gray-500">5 hours ago</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg shadow border p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Voting Summary</h3>
                        <div className="space-y-3">
                          {talents.map(talent => (
                            <div key={talent.id} className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-900">{talent.name}</span>
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1 text-green-600">
                                  <ThumbsUp className="h-3 w-3" />
                                  <span className="text-xs">{talent.votes.up.length}</span>
                                </div>
                                <div className="flex items-center space-x-1 text-red-600">
                                  <ThumbsDown className="h-3 w-3" />
                                  <span className="text-xs">{talent.votes.down.length}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Project Cards */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Projects</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                          <div key={project.id} className="bg-white rounded-lg shadow border p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                project.status === 'talent-review' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {project.status === 'talent-review' ? 'In Review' : 'Brief Sent'}
                              </span>
                            </div>
                            
                            <div className="space-y-3 text-sm text-gray-600 mb-4">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>Deadline: {project.deadline}</span>
                              </div>
                              <div className="flex items-center">
                                <DollarSign className="h-4 w-4 mr-2" />
                                <span>{project.budget}</span>
                              </div>
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-2" />
                                <span>{selectedTalentIds.length} talent selected</span>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => setActiveTab('talent')}
                                className="flex-1 bg-purple-600 text-white py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors"
                              >
                                View Talent
                              </button>
                              <button 
                                onClick={() => setActiveTab('brief')}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                              >
                                Edit Brief
                              </button>
                            </div>
                          </div>
                        ))}
                        
                        {/* Add New Project Card */}
                        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:border-purple-400 hover:bg-purple-50 transition-colors cursor-pointer">
                          <Plus className="h-8 w-8 text-gray-400 mb-2" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">New Project</h3>
                          <p className="text-sm text-gray-600 text-center mb-4">Create a new casting brief to get started</p>
                          <button 
                            onClick={() => setActiveTab('brief')}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors"
                          >
                            Create Brief
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Talent Pool Tab */}
                {activeTab === 'talent' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <Users className="h-8 w-8 text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Talents</p>
                            <p className="text-2xl font-semibold text-gray-900">{talents.length}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <DollarSign className="h-8 w-8 text-yellow-600" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Budget</p>
                            <p className="text-2xl font-semibold text-gray-900">${totalBudget.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <Heart className="h-8 w-8 text-red-600" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Favorites</p>
                            <p className="text-2xl font-semibold text-gray-900">{talents.filter(t => t.favorites.includes(currentUser.id)).length}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h2 className="text-lg font-medium text-gray-900">Talent Pool</h2>
                          <div className="flex items-center space-x-4">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={filterFavorites}
                                onChange={(e) => setFilterFavorites(e.target.checked)}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">Show Favorites Only</span>
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredTalents.map((talent) => (
                            <div key={talent.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                              {/* Media Gallery */}
                              <MediaGallery talent={talent} />
                              
                              <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <div className="flex items-center space-x-2">
                                      <h3 className="text-lg font-semibold text-gray-900">{talent.name}</h3>
                                      {currentUser.role === 'admin' && (
                                        <button
                                          onClick={() => handleNameEdit(talent.id, talent.name)}
                                          className="text-gray-400 hover:text-gray-600"
                                          title="Edit name"
                                        >
                                          <Edit3 className="w-4 h-4" />
                                        </button>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-600">{talent.category}</p>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-sm text-gray-600">{talent.rating}</span>
                                  </div>
                                </div>
                                <div className="flex items-center text-sm text-gray-500 mb-3">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {talent.location}
                                </div>
                                {talent.castingNotes && (
                                  <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-start">
                                      <FileText className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                                      <div>
                                        <p className="text-xs font-medium text-blue-800 mb-1">Casting Notes</p>
                                        <p className="text-sm text-blue-700">{talent.castingNotes}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                <div className="mb-3 space-y-2">
                                  {talent.socials?.instagram && (
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-2">
                                        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
                                          <span className="text-white text-xs font-bold">IG</span>
                                        </div>
                                        <a 
                                          href={talent.socials.instagram.url} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-sm text-gray-700 hover:text-purple-600 flex items-center"
                                        >
                                          {talent.socials.instagram.handle}
                                          <ExternalLink className="w-3 h-3 ml-1" />
                                        </a>
                                      </div>
                                      <span className="text-xs text-gray-500">{formatFollowers(talent.socials.instagram.followers)} followers</span>
                                    </div>
                                  )}
                                  
                                  {talent.socials.tiktok && (
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-2">
                                        <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                                          <span className="text-white text-xs font-bold">TT</span>
                                        </div>
                                        <a 
                                          href={talent.socials.tiktok.url} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-sm text-gray-700 hover:text-black flex items-center"
                                        >
                                          {talent.socials.tiktok.handle}
                                          <ExternalLink className="w-3 h-3 ml-1" />
                                        </a>
                                      </div>
                                      <span className="text-xs text-gray-500">
                                        {formatFollowers(talent.socials.tiktok.followers)} followers
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center justify-between mb-4">
                                  <div className="text-lg font-semibold text-gray-900">
                                    ${talent.rate.toLocaleString()}
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => handleVote(talent.id, 'up')}
                                      className="p-1 rounded text-gray-400 hover:text-green-600"
                                    >
                                      <ThumbsUp className="w-4 h-4" />
                                    </button>
                                    <span className="text-sm text-gray-600">{talent.votes.up.length}</span>
                                    <button
                                      onClick={() => handleVote(talent.id, 'down')}
                                      className="p-1 rounded text-gray-400 hover:text-red-600"
                                    >
                                      <ThumbsDown className="w-4 h-4" />
                                    </button>
                                    <span className="text-sm text-gray-600">{talent.votes.down.length}</span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <button
                                    onClick={() => handleFavorite(talent.id)}
                                    className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${
                                      talent.favorites.includes(currentUser.id)
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700'
                                    }`}
                                  >
                                    <Heart className="w-4 h-4" />
                                    <span>Favorite</span>
                                  </button>
                                  
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => setShowMediaUpload(talent.id)}
                                      className="flex items-center space-x-1 px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700"
                                    >
                                      <Upload className="w-4 h-4" />
                                      <span>Media</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Brief Tab */}
                {activeTab === 'brief' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Casting Briefs</h2>
                    <div className="bg-white rounded-lg shadow border p-6">
                      <p className="text-gray-600 mb-4">Create and manage your casting briefs here.</p>
                      <button 
                        onClick={handleOpenBriefModal}
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Create New Brief</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>

          {/* Media Upload Modal */}
          {showMediaUpload && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Media Management</h2>
                  <button
                    onClick={() => setShowMediaUpload(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {(() => {
                  const talent = talents.find(t => t.id === showMediaUpload);
                  if (!talent) return null;
                  
                  return (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-md font-medium mb-3">Images</h3>
                        <div className="grid grid-cols-4 gap-4 mb-4">
                          {talent.media.images.map((image) => (
                            <div key={image.id} className="relative group">
                              <img
                                src={image.url}
                                alt={image.title}
                                className="w-full aspect-square object-cover rounded-lg"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                                  <button
                                    onClick={() => setPrimaryMedia(showMediaUpload, 'image', image.id)}
                                    className={`p-2 rounded-full ${image.isPrimary ? 'bg-blue-500 text-white ring-2 ring-blue-300' : 'bg-white text-gray-700'} hover:bg-blue-500 hover:text-white transition-all duration-200`}
                                    title={image.isPrimary ? 'Primary Image' : 'Set as Primary'}
                                  >
                                    <Star className={`w-4 h-4 ${image.isPrimary ? 'fill-current' : ''}`} />
                                  </button>
                                  <button
                                    onClick={() => removeMedia(showMediaUpload, 'image', image.id)}
                                    className="p-2 rounded-full bg-white text-red-600 hover:bg-red-500 hover:text-white transition-all duration-200"
                                    title="Remove Image"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              {image.isPrimary && (
                                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded font-medium shadow-lg">
                                  Primary
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex space-x-2">
                          <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Images
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) => handleImageUpload(showMediaUpload, e.target.files)}
                              className="hidden"
                            />
                          </label>
                          <button
                            onClick={() => addTestImages(showMediaUpload)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                          >
                            Add Test Images
                          </button>
                          <button
                            onClick={() => clearImages(showMediaUpload)}
                            className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                          >
                            Clear Images
                          </button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-md font-medium mb-3">Videos</h3>
                        <div className="grid grid-cols-4 gap-4 mb-4">
                          {talent.media.videos.map((video) => (
                            <div key={video.id} className="relative group">
                              <img
                                src={video.thumbnailUrl || video.url}
                                alt={video.title}
                                className="w-full aspect-square object-cover rounded-lg"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                                  <button
                                    onClick={() => setPrimaryMedia(showMediaUpload, 'video', video.id)}
                                    className={`p-2 rounded-full ${video.isPrimary ? 'bg-red-500 text-white ring-2 ring-red-300' : 'bg-white text-gray-700'} hover:bg-red-500 hover:text-white transition-all duration-200`}
                                    title={video.isPrimary ? 'Primary Video' : 'Set as Primary'}
                                  >
                                    <Star className={`w-4 h-4 ${video.isPrimary ? 'fill-current' : ''}`} />
                                  </button>
                                  <button
                                    onClick={() => removeMedia(showMediaUpload, 'video', video.id)}
                                    className="p-2 rounded-full bg-white text-red-600 hover:bg-red-500 hover:text-white transition-all duration-200"
                                    title="Remove Video"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-black bg-opacity-50 rounded-full p-2">
                                  <Play className="w-4 h-4 text-white" />
                                </div>
                              </div>
                              {video.isPrimary && (
                                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-medium shadow-lg">
                                  Primary
                                </div>
                              )}
                              {video.type && video.type !== 'upload' && (
                                <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                                  {video.type}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex space-x-2">
                            <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                              <Video className="w-4 h-4 mr-2" />
                              Upload Videos
                              <input
                                type="file"
                                multiple
                                accept="video/*"
                                onChange={(e) => handleVideoUpload(showMediaUpload, e.target.files)}
                                className="hidden"
                              />
                            </label>
                          </div>
                          
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={newYouTubeLink}
                              onChange={(e) => setNewYouTubeLink(e.target.value)}
                              placeholder="YouTube URL"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                              onClick={() => addVideoLink(showMediaUpload, 'youtube', newYouTubeLink)}
                              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                              Add YouTube
                            </button>
                          </div>
                          
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={newVimeoLink}
                              onChange={(e) => setNewVimeoLink(e.target.value)}
                              placeholder="Vimeo URL"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                              onClick={() => addVideoLink(showMediaUpload, 'vimeo', newVimeoLink)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                              Add Vimeo
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Enhanced Brief Creation Modal */}
          {showBriefModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Create Casting Brief</h2>
                  <button
                    onClick={() => setShowBriefModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Project Title
                        </label>
                        <input
                          type="text"
                          value={briefForm.projectTitle}
                          onChange={(e) => handleBriefFormChange('projectTitle', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter project title"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Project Description
                        </label>
                        <textarea
                          rows={4}
                          value={briefForm.projectDescription}
                          onChange={(e) => handleBriefFormChange('projectDescription', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Describe your project, campaign goals, brand values, and creative vision..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Talent Usage Rights
                        </label>
                        <textarea
                          rows={4}
                          value={briefForm.usageRights}
                          onChange={(e) => handleBriefFormChange('usageRights', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Specify detailed usage rights (e.g., Digital ads on Instagram and Facebook for 6 months, print ads in magazines for 3 months, website usage for 1 year, etc.)"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Deadline</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Project Deadline
                        </label>
                        <input
                          type="date"
                          value={projectDeadline}
                          onChange={(e) => setProjectDeadline(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Select project deadline"
                        />
                        <p className="text-xs text-gray-500 mt-1">When do you need final casting by?</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Deadline Notes (Optional)
                        </label>
                        <textarea
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Any additional context about the deadline, urgency, or timeline requirements..."
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Talent Requirements</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Number of Talent Needed
                        </label>
                        <select
                          value={numberOfTalent}
                          onChange={(e) => handleTalentNumberChange(parseInt(e.target.value))}
                          className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          {Array.from({ length: 15 }, (_, i) => i + 1).map(num => (
                            <option key={num} value={num}>
                              {num} {num === 1 ? 'talent' : 'talents'}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Dynamic Talent Sections */}
                      <div className="space-y-6">
                        {talentRequirements.map((talent, index) => (
                          <div key={talent.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h4 className="text-md font-semibold text-gray-900 mb-4">
                              Talent {talent.id}
                            </h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Sizes & Requirements
                                </label>
                                <textarea
                                  rows={3}
                                  value={talent.sizes}
                                  onChange={(e) => updateTalentRequirement(talent.id, 'sizes', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  placeholder="e.g., Women&apos;s size 4-8, 5&apos;6 to 5&apos;9, athletic build, brunette hair preferred"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Gender
                                </label>
                                <select
                                  value={talent.gender}
                                  onChange={(e) => updateTalentRequirement(talent.id, 'gender', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                  <option value="">Select Gender</option>
                                  <option value="female">Female</option>
                                  <option value="male">Male</option>
                                  <option value="non-binary">Non-Binary</option>
                                  <option value="any">Any Gender</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Overall Talent Notes */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Additional Talent Notes
                        </label>
                        <textarea
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Any additional requirements, special skills, or notes that apply to all talent..."
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ideal Total Project Budget
                        </label>
                        <input
                          type="text"
                          value={briefForm.totalBudget}
                          onChange={(e) => handleBriefFormChange('totalBudget', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="e.g., $75,000 or $50,000-$100,000"
                        />
                        <p className="text-xs text-gray-500 mt-1">Include all costs: talent, production, usage rights, etc.</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preferred Talent Rate Range
                        </label>
                        <input
                          type="text"
                          value={briefForm.talentRateRange}
                          onChange={(e) => handleBriefFormChange('talentRateRange', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="e.g., $2,000-$5,000 per day"
                        />
                        <p className="text-xs text-gray-500 mt-1">Daily rate range you&apos;re comfortable paying talent</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Shoot Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fitting Date (Optional)
                        </label>
                        <input
                          type="date"
                          value={briefForm.fittingDate}
                          onChange={(e) => handleBriefFormChange('fittingDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Shoot Location
                      </label>
                      <input
                        type="text"
                        value={briefForm.shootLocation}
                        onChange={(e) => handleBriefFormChange('shootLocation', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Studio address, city, or location details"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Creative Brief Files</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Project Creative Brief Files
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-2">Upload brand guidelines, mood boards, etc.</p>
                          <input
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            className="hidden"
                            id="project-files"
                          />
                          <label htmlFor="project-files" className="bg-purple-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-purple-700">
                            Browse Files
                          </label>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Talent Creative Brief Files
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-2">Upload talent direction documents</p>
                          <input
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            className="hidden"
                            id="talent-files"
                          />
                          <label htmlFor="talent-files" className="bg-purple-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-purple-700">
                            Browse Files
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button 
                      onClick={handleSaveDraft}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Save Draft
                    </button>
                    <button
                      onClick={handleSendBrief}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
                      <Send className="h-4 w-4" />
                      <span>Send Brief</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fullscreen Media Viewer */}
          {showFullscreenMedia && (
            <FullscreenMediaViewer
              mediaData={showFullscreenMedia}
              onClose={() => setShowFullscreenMedia(null)}
            />
          )}

          {/* Authentication Modal */}
          <AuthenticationModal />
        </>
      )}
    </div>
  );
};

export default PeopleSkillsPlatform;
