# Supabase Database Setup Guide

This guide will help you migrate your People Skills app from hardcoded data to a Supabase database.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `people-skills-app`
   - Database Password: Choose a strong password
   - Region: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be set up (2-3 minutes)

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to Settings → API
2. Copy the following values:
   - Project URL
   - Anon public key
   - Service role key (keep this secret)

## 3. Set Up Environment Variables

1. Create a `.env.local` file in your project root
2. Add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 4. Create the Database Schema

1. In your Supabase dashboard, go to SQL Editor
2. Copy the contents of `database-schema.sql`
3. Paste it into the SQL editor
4. Click "Run" to execute the schema

## 5. Set Up Authentication (Optional)

If you want to use Supabase Auth instead of custom authentication:

1. Go to Authentication → Settings in your Supabase dashboard
2. Configure your authentication settings
3. Update the authentication logic in your app

## 6. Test the Database Connection

1. Start your development server: `npm run dev`
2. Check the browser console for any connection errors
3. Verify that the Supabase client is working

## 7. Migrate Your Data

### Option A: Use the Migration Script

1. Update the `scripts/migrate-data.js` file with your actual data
2. Run the migration script:
   ```bash
   node scripts/migrate-data.js
   ```

### Option B: Manual Migration

1. Go to Table Editor in your Supabase dashboard
2. Manually add your users, talent profiles, and projects
3. Use the sample data from the migration script as a reference

## 8. Update Your Application Code

### Replace Hardcoded Data with Database Calls

1. **Update Authentication:**
   ```javascript
   // Replace mockUsers with database calls
   import { db } from '../lib/supabase'
   
   const handleLogin = async () => {
     try {
       const user = await db.users.getByEmail(authForm.email)
       if (user && verifyPassword(authForm.password, user.password_hash)) {
         setIsAuthenticated(true)
         setCurrentUserRole(user.role)
         setCurrentUser(user)
       }
     } catch (error) {
       console.error('Login failed:', error)
     }
   }
   ```

2. **Update Talent Data:**
   ```javascript
   // Replace hardcoded talents with database calls
   const [talents, setTalents] = useState([])
   
   useEffect(() => {
     const loadTalents = async () => {
       try {
         const talentData = await db.talentProfiles.getAll()
         setTalents(talentData)
       } catch (error) {
         console.error('Failed to load talents:', error)
       }
     }
     loadTalents()
   }, [])
   ```

3. **Update Projects:**
   ```javascript
   // Replace hardcoded projects with database calls
   const [projects, setProjects] = useState([])
   
   useEffect(() => {
     const loadProjects = async () => {
       try {
         const projectData = await db.projects.getAll()
         setProjects(projectData)
       } catch (error) {
         console.error('Failed to load projects:', error)
       }
     }
     loadProjects()
   }, [])
   ```

## 9. Update Component Functions

### Replace State Updates with Database Calls

1. **Talent Favorites:**
   ```javascript
   const handleFavorite = async (talentId) => {
     try {
       if (await db.brandFavorites.isFavorited(currentUser.id, talentId)) {
         await db.brandFavorites.remove(currentUser.id, talentId)
       } else {
         await db.brandFavorites.add(currentUser.id, talentId)
       }
       // Refresh favorites
       const favorites = await db.brandFavorites.getByBrandId(currentUser.id)
       setFavorites(favorites)
     } catch (error) {
       console.error('Failed to update favorites:', error)
     }
   }
   ```

2. **Voting:**
   ```javascript
   const handleVote = async (projectTalentId, voteType) => {
     try {
       await db.projectTalent.updateVotes(projectTalentId, currentUser.id, voteType)
       // Refresh project talent data
       const projectTalent = await db.projectTalent.getByProjectId(projectId)
       setProjectTalent(projectTalent)
     } catch (error) {
       console.error('Failed to update votes:', error)
     }
   }
   ```

3. **Comments:**
   ```javascript
   const handleAddComment = async (projectTalentId, message) => {
     try {
       await db.comments.create({
         project_talent_id: projectTalentId,
         user_id: currentUser.id,
         message
       })
       // Refresh comments
       const comments = await db.comments.getByProjectTalentId(projectTalentId)
       setComments(comments)
     } catch (error) {
       console.error('Failed to add comment:', error)
     }
   }
   ```

## 10. Add Error Handling

```javascript
// Add error boundaries and loading states
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)

const loadData = async () => {
  setLoading(true)
  setError(null)
  try {
    const data = await db.talentProfiles.getAll()
    setTalents(data)
  } catch (err) {
    setError(err.message)
    console.error('Failed to load data:', err)
  } finally {
    setLoading(false)
  }
}
```

## 11. Test Everything

1. Test user registration and login
2. Test talent profile creation and viewing
3. Test project creation and management
4. Test favorites and voting functionality
5. Test media upload and management
6. Test comments and communication

## 12. Deploy to Production

1. Set up your production environment variables
2. Deploy your Next.js app to Vercel or your preferred platform
3. Update your Supabase project settings for production
4. Test all functionality in production

## Troubleshooting

### Common Issues:

1. **CORS Errors:** Make sure your Supabase project allows your domain
2. **RLS Policy Errors:** Check that your Row Level Security policies are correct
3. **Authentication Errors:** Verify your API keys and authentication setup
4. **Data Type Errors:** Ensure your data matches the database schema

### Getting Help:

- Check the [Supabase Documentation](https://supabase.com/docs)
- Join the [Supabase Discord](https://discord.supabase.com)
- Review the [Next.js Documentation](https://nextjs.org/docs)

## Next Steps

After setting up the database:

1. **Add Real Authentication:** Implement proper password hashing and JWT tokens
2. **Add File Upload:** Integrate with Supabase Storage for media files
3. **Add Real-time Features:** Use Supabase Realtime for live updates
4. **Add Email Notifications:** Use Supabase Edge Functions for email sending
5. **Add Analytics:** Track user behavior and platform usage
6. **Add Payment Integration:** Integrate with Stripe or similar payment processor

## Security Considerations

1. **Never expose your service role key** in client-side code
2. **Use Row Level Security** to protect your data
3. **Validate all inputs** before sending to the database
4. **Use HTTPS** in production
5. **Regularly update dependencies** to patch security vulnerabilities
6. **Monitor your database** for suspicious activity 