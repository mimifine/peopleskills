import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database helper functions
export const db = {
  // User management
  users: {
    async getById(id) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    },

    async getByEmail(email) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()
      
      if (error) throw error
      return data
    },

    async create(userData) {
      const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async update(id, updates) {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    }
  },

  // Talent profiles
  talentProfiles: {
    async getAll() {
      const { data, error } = await supabase
        .from('talent_profiles')
        .select(`
          *,
          users (id, email, full_name, role),
          media_files (*)
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },

    async getById(id) {
      const { data, error } = await supabase
        .from('talent_profiles')
        .select(`
          *,
          users (id, email, full_name, role),
          media_files (*)
        `)
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    },

    async getByUserId(userId) {
      const { data, error } = await supabase
        .from('talent_profiles')
        .select(`
          *,
          users (id, email, full_name, role),
          media_files (*)
        `)
        .eq('user_id', userId)
        .single()
      
      if (error) throw error
      return data
    },

    async create(profileData) {
      const { data, error } = await supabase
        .from('talent_profiles')
        .insert(profileData)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async update(id, updates) {
      const { data, error } = await supabase
        .from('talent_profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async getPending() {
      const { data, error } = await supabase
        .from('talent_profiles')
        .select(`
          *,
          users (id, email, full_name, role)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    }
  },

  // Projects
  projects: {
    async getAll() {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          users!projects_brand_user_id_fkey (id, email, full_name, company_name)
        `)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },

    async getById(id) {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          users!projects_brand_user_id_fkey (id, email, full_name, company_name)
        `)
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    },

    async getByBrandId(brandId) {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          users!projects_brand_user_id_fkey (id, email, full_name, company_name)
        `)
        .eq('brand_user_id', brandId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },

    async create(projectData) {
      const { data, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async update(id, updates) {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    }
  },

  // Project-talent relationships
  projectTalent: {
    async getByProjectId(projectId) {
      const { data, error } = await supabase
        .from('project_talent')
        .select(`
          *,
          talent_profiles (
            *,
            users (id, email, full_name, role),
            media_files (*)
          )
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },

    async create(projectTalentData) {
      const { data, error } = await supabase
        .from('project_talent')
        .insert(projectTalentData)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async update(id, updates) {
      const { data, error } = await supabase
        .from('project_talent')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async updateVotes(id, brandUserId, voteType) {
      const { data: current, error: fetchError } = await supabase
        .from('project_talent')
        .select('brand_votes')
        .eq('id', id)
        .single()
      
      if (fetchError) throw fetchError

      const votes = current.brand_votes || { up: [], down: [] }
      
      // Remove existing vote from this user
      votes.up = votes.up.filter(id => id !== brandUserId)
      votes.down = votes.down.filter(id => id !== brandUserId)
      
      // Add new vote
      if (voteType === 'up') {
        votes.up.push(brandUserId)
      } else if (voteType === 'down') {
        votes.down.push(brandUserId)
      }

      const { data, error } = await supabase
        .from('project_talent')
        .update({ brand_votes: votes })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    }
  },

  // Brand favorites
  brandFavorites: {
    async getByBrandId(brandId) {
      const { data, error } = await supabase
        .from('brand_favorites')
        .select(`
          *,
          talent_profiles (
            *,
            users (id, email, full_name, role),
            media_files (*)
          )
        `)
        .eq('brand_user_id', brandId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },

    async add(brandId, talentProfileId) {
      const { data, error } = await supabase
        .from('brand_favorites')
        .insert({
          brand_user_id: brandId,
          talent_profile_id: talentProfileId
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async remove(brandId, talentProfileId) {
      const { error } = await supabase
        .from('brand_favorites')
        .delete()
        .eq('brand_user_id', brandId)
        .eq('talent_profile_id', talentProfileId)
      
      if (error) throw error
      return true
    },

    async isFavorited(brandId, talentProfileId) {
      const { data, error } = await supabase
        .from('brand_favorites')
        .select('id')
        .eq('brand_user_id', brandId)
        .eq('talent_profile_id', talentProfileId)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      return !!data
    }
  },

  // Media files
  mediaFiles: {
    async getByTalentProfileId(talentProfileId) {
      const { data, error } = await supabase
        .from('media_files')
        .select('*')
        .eq('talent_profile_id', talentProfileId)
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },

    async create(mediaData) {
      const { data, error } = await supabase
        .from('media_files')
        .insert(mediaData)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async update(id, updates) {
      const { data, error } = await supabase
        .from('media_files')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async delete(id) {
      const { error } = await supabase
        .from('media_files')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return true
    },

    async setPrimary(talentProfileId, mediaId) {
      // First, unset all primary media for this talent
      await supabase
        .from('media_files')
        .update({ is_primary: false })
        .eq('talent_profile_id', talentProfileId)

      // Then set the new primary media
      const { data, error } = await supabase
        .from('media_files')
        .update({ is_primary: true })
        .eq('id', mediaId)
        .select()
        .single()
      
      if (error) throw error
      return data
    }
  },

  // Comments
  comments: {
    async getByProjectTalentId(projectTalentId) {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          users (id, email, full_name, role)
        `)
        .eq('project_talent_id', projectTalentId)
        .order('created_at', { ascending: true })
      
      if (error) throw error
      return data
    },

    async create(commentData) {
      const { data, error } = await supabase
        .from('comments')
        .insert(commentData)
        .select(`
          *,
          users (id, email, full_name, role)
        `)
        .single()
      
      if (error) throw error
      return data
    }
  }
}

export default supabase 