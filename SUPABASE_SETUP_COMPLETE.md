# Complete Supabase Setup Guide for People Skills Platform

## 🚀 Quick Start Checklist

- [ ] Create `.env.local` file with Supabase credentials
- [ ] Run database schema SQL in Supabase dashboard
- [ ] Restart development server
- [ ] Test "Add Talent" form with just a name
- [ ] Verify data appears in Supabase table

---

## 📋 Step-by-Step Setup Instructions

### Step 1: Create Environment Variables File

Create a file named `.env.local` in your project root directory with the following content:

```bash
# =============================================================================
# SUPABASE CONFIGURATION FOR PEOPLE SKILLS PLATFORM
# =============================================================================
# 
# To get these values:
# 1. Go to https://supabase.com and sign in
# 2. Select your project (or create a new one)
# 3. Go to Settings > API
# 4. Copy the "Project URL" and "anon public" key
# 5. Replace the values below
#
# =============================================================================

# Your Supabase project URL (required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here

# Your Supabase anon/public key (required)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# =============================================================================
# APP CONFIGURATION
# =============================================================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important:** Replace `your_supabase_project_url_here` and `your_supabase_anon_key_here` with your actual Supabase credentials.

### Step 2: Set Up Database Schema

1. Go to your Supabase dashboard: https://supabase.com
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar
4. Copy the entire contents of `database-schema.sql` from your project
5. Paste it into the SQL Editor
6. Click **"Run"** to execute all the SQL commands
7. Verify the table was created by going to **Table Editor** and looking for `talent_profiles`

### Step 3: Restart Development Server

After creating the `.env.local` file, restart your development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm run dev
```

### Step 4: Test the Integration

1. Open your app in the browser (usually http://localhost:3000)
2. Navigate to the "Add Talent" section
3. Fill out just the **Full Name** field (leave everything else blank)
4. Click **Submit**
5. Check the browser console for success/error messages
6. Go to your Supabase dashboard > Table Editor > talent_profiles to see the new record

---

## 🔧 Troubleshooting Common Issues

### Issue 1: "Missing Supabase environment variables"

**Symptoms:** Error in console about missing environment variables

**Solution:**
- Make sure `.env.local` file exists in project root
- Verify the file name is exactly `.env.local` (not `.env` or `.env.local.txt`)
- Restart your development server after creating the file
- Check that the environment variable names are correct (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)

### Issue 2: "Permission denied" (RLS error)

**Symptoms:** Error code 42501 when trying to insert data

**Solution:**
1. Go to Supabase dashboard > Authentication > Policies
2. Find the `talent_profiles` table
3. Make sure you have an INSERT policy named "Enable insert for all users"
4. If not, create it with:
   - Policy name: "Enable insert for all users"
   - Operation: INSERT
   - USING expression: `true`
   - WITH CHECK expression: `true`

### Issue 3: "relation does not exist"

**Symptoms:** Error code 42P01 when trying to insert data

**Solution:**
- Run the database schema SQL in Supabase SQL Editor
- Verify the `talent_profiles` table exists in Table Editor
- Check that all columns are present with correct data types

### Issue 4: "Authentication failed"

**Symptoms:** Connection errors or authentication failures

**Solution:**
- Verify your Supabase project URL is correct (no trailing slashes)
- Make sure you're using the anon key, not the service role key
- Check that your Supabase project is active
- Restart your development server

### Issue 5: Form validation errors for optional fields

**Symptoms:** Getting errors when leaving fields blank

**Solution:**
- The updated code should handle this automatically
- Only the `full_name` field is required
- All other fields should be optional and not cause validation errors
- Empty strings are converted to `null` for database storage

---

## 📊 Database Schema Overview

The `talent_profiles` table has the following structure:

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | UUID | Yes | Primary key (auto-generated) |
| `full_name` | TEXT | Yes | **Only required field** |
| `bio` | TEXT | No | Optional biography |
| `category` | TEXT | No | Talent category (e.g., "Fashion Model") |
| `location` | TEXT | No | Geographic location |
| `height` | TEXT | No | Height (e.g., "5'8"") |
| `daily_rate` | INTEGER | No | Daily rate in dollars |
| `half_day_rate` | INTEGER | No | Half-day rate in dollars |
| `usage_fee` | INTEGER | No | Usage fee in dollars |
| `travel_accommodation` | INTEGER | No | Travel/accommodation costs |
| `agency_percent` | INTEGER | No | Agency commission percentage |
| `socials` | JSONB | No | Social media data (Instagram, TikTok) |
| `status` | TEXT | No | Status (pending/approved/rejected) |
| `created_at` | TIMESTAMP | Yes | Auto-generated timestamp |
| `updated_at` | TIMESTAMP | Yes | Auto-updated timestamp |

---

## 🧪 Testing Your Setup

### Test 1: Minimal Data Submission
1. Fill out only the "Full Name" field
2. Leave all other fields blank
3. Submit the form
4. Should succeed without any validation errors

### Test 2: Partial Data Submission
1. Fill out "Full Name" and a few other fields
2. Leave some fields blank
3. Submit the form
4. Should succeed and store null values for blank fields

### Test 3: Full Data Submission
1. Fill out all fields with valid data
2. Submit the form
3. Should succeed and store all data properly

### Test 4: Social Media Data
1. Fill out Instagram and/or TikTok handles
2. Add follower counts
3. Submit the form
4. Check that socials JSONB field contains the data

---

## 🔍 Verification Commands

Run these SQL queries in your Supabase SQL Editor to verify everything is working:

```sql
-- Check if table exists and has correct structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'talent_profiles'
ORDER BY ordinal_position;

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'talent_profiles';

-- Check if policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'talent_profiles';

-- Check recent talent profiles
SELECT * FROM talent_profiles ORDER BY created_at DESC LIMIT 5;
```

---

## 🎯 Expected Behavior

After completing this setup, you should be able to:

✅ **Submit forms with just a name** - No validation errors for blank optional fields  
✅ **Submit forms with partial data** - Only filled fields are stored, others are null  
✅ **Submit forms with full data** - All data is properly stored  
✅ **See success messages** - Clear feedback when submissions succeed  
✅ **See helpful error messages** - Specific guidance when things go wrong  
✅ **View data in Supabase** - New records appear in the talent_profiles table  
✅ **Handle social media data** - Instagram/TikTok data stored as JSONB  

---

## 🆘 Getting Help

If you're still having issues:

1. **Check the browser console** for detailed error messages
2. **Check the terminal** where you're running `npm run dev` for server errors
3. **Verify your Supabase project** is active and accessible
4. **Double-check environment variables** are correct and the file is named properly
5. **Restart your development server** after making any changes

The updated code includes extensive logging and error handling to help you identify and fix any issues quickly.

---

## 📝 Next Steps

Once your Supabase integration is working:

1. **Test with real data** - Add some actual talent profiles
2. **Customize the form** - Add or modify fields as needed
3. **Add authentication** - Implement user login/signup
4. **Add admin features** - Approve/reject talent profiles
5. **Add search/filtering** - Find talent by category, location, etc.
6. **Add media uploads** - Upload photos and videos for talent profiles

---

*This setup guide covers everything needed to get your People Skills Platform working with Supabase. The code has been updated to handle all edge cases and provide clear feedback for troubleshooting.* 