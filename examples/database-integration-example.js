// Example: How to integrate Supabase database calls into your existing components
// This shows the pattern for replacing hardcoded data with database calls

import { useState, useEffect } from 'react'
import { db } from '../lib/supabase'

// Example: Updated Authentication Component
export function UpdatedAuthenticationModal({ isOpen, onClose, onLogin }) {
  const [authForm, setAuthForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Get user from database
      const user = await db.users.getByEmail(authForm.email)
      
      if (!user) {
        setError('User not found')
        return
      }

      // In production, you should hash passwords and compare hashes
      // For now, we'll assume the password is correct
      if (user.password_hash) { // Replace with proper password verification
        onLogin(user)
        onClose()
      } else {
        setError('Invalid password')
      }
    } catch (err) {
      setError('Login failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <h2>Login</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={authForm.email}
            onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={authForm.password}
            onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

// Example: Updated Talent Display Component
export function UpdatedTalentDisplay() {
  const [talents, setTalents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadTalents()
  }, [])

  const loadTalents = async () => {
    try {
      setLoading(true)
      const talentData = await db.talentProfiles.getAll()
      setTalents(talentData)
    } catch (err) {
      setError('Failed to load talents: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading talents...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="talent-grid">
      {talents.map((talent) => (
        <TalentCard key={talent.id} talent={talent} />
      ))}
    </div>
  )
}

// Example: Updated Project Management
export function UpdatedProjectManagement({ currentUser }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentUser?.role === 'BRAND') {
      loadUserProjects()
    } else {
      loadAllProjects()
    }
  }, [currentUser])

  const loadUserProjects = async () => {
    try {
      const projectData = await db.projects.getByBrandId(currentUser.id)
      setProjects(projectData)
    } catch (err) {
      console.error('Failed to load user projects:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadAllProjects = async () => {
    try {
      const projectData = await db.projects.getAll()
      setProjects(projectData)
    } catch (err) {
      console.error('Failed to load projects:', err)
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (projectData) => {
    try {
      const newProject = await db.projects.create({
        ...projectData,
        brand_user_id: currentUser.id
      })
      setProjects([newProject, ...projects])
      return newProject
    } catch (err) {
      console.error('Failed to create project:', err)
      throw err
    }
  }

  if (loading) return <div>Loading projects...</div>

  return (
    <div className="projects-container">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}

// Example: Updated Favorites Management
export function UpdatedFavoritesManager({ currentUser }) {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentUser?.role === 'BRAND') {
      loadFavorites()
    }
  }, [currentUser])

  const loadFavorites = async () => {
    try {
      const favoritesData = await db.brandFavorites.getByBrandId(currentUser.id)
      setFavorites(favoritesData)
    } catch (err) {
      console.error('Failed to load favorites:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = async (talentId) => {
    try {
      const isFavorited = await db.brandFavorites.isFavorited(currentUser.id, talentId)
      
      if (isFavorited) {
        await db.brandFavorites.remove(currentUser.id, talentId)
      } else {
        await db.brandFavorites.add(currentUser.id, talentId)
      }
      
      // Refresh favorites
      await loadFavorites()
    } catch (err) {
      console.error('Failed to update favorite:', err)
    }
  }

  if (loading) return <div>Loading favorites...</div>

  return (
    <div className="favorites-container">
      {favorites.map((favorite) => (
        <TalentCard 
          key={favorite.talent_profiles.id} 
          talent={favorite.talent_profiles}
          onFavorite={() => toggleFavorite(favorite.talent_profiles.id)}
          isFavorited={true}
        />
      ))}
    </div>
  )
}

// Example: Updated Voting System
export function UpdatedVotingSystem({ projectTalent, currentUser }) {
  const handleVote = async (voteType) => {
    try {
      await db.projectTalent.updateVotes(projectTalent.id, currentUser.id, voteType)
      // You might want to refresh the data here or use optimistic updates
    } catch (err) {
      console.error('Failed to update vote:', err)
    }
  }

  const upVotes = projectTalent.brand_votes?.up?.length || 0
  const downVotes = projectTalent.brand_votes?.down?.length || 0
  const userVote = projectTalent.brand_votes?.up?.includes(currentUser.id) ? 'up' :
                   projectTalent.brand_votes?.down?.includes(currentUser.id) ? 'down' : null

  return (
    <div className="voting-container">
      <button 
        onClick={() => handleVote('up')}
        className={userVote === 'up' ? 'voted' : ''}
      >
        👍 {upVotes}
      </button>
      <button 
        onClick={() => handleVote('down')}
        className={userVote === 'down' ? 'voted' : ''}
      >
        👎 {downVotes}
      </button>
    </div>
  )
}

// Example: Updated Comments System
export function UpdatedCommentsSystem({ projectTalentId, currentUser }) {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadComments()
  }, [projectTalentId])

  const loadComments = async () => {
    try {
      const commentsData = await db.comments.getByProjectTalentId(projectTalentId)
      setComments(commentsData)
    } catch (err) {
      console.error('Failed to load comments:', err)
    } finally {
      setLoading(false)
    }
  }

  const addComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      await db.comments.create({
        project_talent_id: projectTalentId,
        user_id: currentUser.id,
        message: newComment.trim()
      })
      
      setNewComment('')
      await loadComments() // Refresh comments
    } catch (err) {
      console.error('Failed to add comment:', err)
    }
  }

  if (loading) return <div>Loading comments...</div>

  return (
    <div className="comments-container">
      <form onSubmit={addComment}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows={3}
        />
        <button type="submit">Post Comment</button>
      </form>
      
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <strong>{comment.users.full_name}</strong>
            <p>{comment.message}</p>
            <small>{new Date(comment.created_at).toLocaleDateString()}</small>
          </div>
        ))}
      </div>
    </div>
  )
}

// Example: Updated Talent Profile Creation
export function UpdatedTalentProfileCreation({ currentUser, onComplete }) {
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    category: '',
    location: '',
    daily_rate: '',
    half_day_rate: '',
    usage_fee: '',
    travel_accommodation: '',
    height: '',
    clothing_sizes: {},
    socials: {}
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const talentProfile = await db.talentProfiles.create({
        ...formData,
        user_id: currentUser.id,
        daily_rate: parseInt(formData.daily_rate),
        half_day_rate: parseInt(formData.half_day_rate),
        usage_fee: parseInt(formData.usage_fee),
        travel_accommodation: parseInt(formData.travel_accommodation)
      })

      onComplete(talentProfile)
    } catch (err) {
      console.error('Failed to create talent profile:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Full Name"
        value={formData.full_name}
        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
        required
      />
      <textarea
        placeholder="Bio"
        value={formData.bio}
        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
      />
      <input
        type="text"
        placeholder="Category"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
      />
      <input
        type="text"
        placeholder="Location"
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
      />
      <input
        type="number"
        placeholder="Daily Rate"
        value={formData.daily_rate}
        onChange={(e) => setFormData({ ...formData, daily_rate: e.target.value })}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating Profile...' : 'Create Profile'}
      </button>
    </form>
  )
} 