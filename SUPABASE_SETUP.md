# 🚀 Supabase Setup Guide for Moods App

This guide will walk you through setting up Supabase as your backend for the Moods app.

## 📋 Prerequisites

- A Supabase account ([sign up here](https://supabase.com))
- Your Moods app codebase
- Basic understanding of SQL (optional, but helpful)

## 🎯 Step-by-Step Setup

### 1. Create Supabase Project

1. **Sign in to Supabase** at [supabase.com](https://supabase.com)
2. **Click "New Project"**
3. **Choose Organization** (or create one)
4. **Project Details:**
   - Name: `moods-app` (or your preferred name)
   - Database Password: Create a strong password (save this!)
   - Region: Choose closest to your users
5. **Click "Create new project"**
6. **Wait for setup** (usually 2-3 minutes)

### 2. Get Your Project Credentials

1. **Go to Project Settings** (gear icon in sidebar)
2. **Click "API"** in the left menu
3. **Copy these values:**
   - **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
   - **anon/public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 3. Set Environment Variables

Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**⚠️ Important:**

- Never commit `.env.local` to git
- The `NEXT_PUBLIC_` prefix makes these available in the browser
- Restart your dev server after adding these

### 4. Set Up Database Schema

1. **Go to SQL Editor** in your Supabase dashboard
2. **Click "New query"**
3. **Copy and paste** the contents of `supabase-schema.sql`
4. **Click "Run"** to execute the SQL

This will create:

- `users` table for family members
- `moods` table for mood entries
- Sample family data (Alex, Teresa, River, Finn)
- Proper indexes and security policies

### 5. Test Your Setup

1. **Restart your dev server:**

   ```bash
   yarn dev
   ```

2. **Open your app** and try to log in
3. **Check the browser console** for any errors
4. **Verify data is being saved** in Supabase dashboard

## 🔧 Troubleshooting

### Common Issues

#### "Invalid API key" Error

- Check your `.env.local` file exists
- Verify the anon key is correct
- Restart your dev server

#### "Table doesn't exist" Error

- Make sure you ran the SQL schema
- Check the table names in Supabase dashboard
- Verify the SQL executed without errors

#### CORS Issues

- Supabase handles CORS automatically
- If you see CORS errors, check your environment variables

### Debug Steps

1. **Check Supabase Dashboard:**

   - Go to "Table Editor" to see your tables
   - Check "Logs" for any errors
   - Verify "Authentication" settings

2. **Check Browser Console:**

   - Look for network errors
   - Check for JavaScript errors
   - Verify API calls are being made

3. **Check Environment Variables:**
   ```bash
   # In your terminal
   echo $NEXT_PUBLIC_SUPABASE_URL
   echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

## 🚀 Production Deployment

### Vercel Deployment

1. **Add environment variables** in Vercel dashboard
2. **Deploy your app**
3. **Test the production version**

### Environment Variables in Production

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your public anon key

## 🔒 Security Features

Your Supabase setup includes:

- **Row Level Security (RLS)** enabled
- **Proper access policies** for users and moods
- **Input validation** and constraints
- **Automatic timestamps** for all records

## 📊 Monitoring & Analytics

### Supabase Dashboard Features

- **Real-time data** viewing
- **Query performance** monitoring
- **User authentication** logs
- **Database backups** (automatic)

### Useful Queries

```sql
-- View all family moods
SELECT * FROM moods ORDER BY created_at DESC;

-- View active family members
SELECT * FROM users WHERE is_active = true;

-- Count moods by user
SELECT user_name, COUNT(*) as mood_count
FROM moods
GROUP BY user_name;
```

## 🔄 Next Steps

After setup, you can:

1. **Customize family members** in the users table
2. **Add more mood types** or fields
3. **Implement real-time updates** using Supabase subscriptions
4. **Add user authentication** with Supabase Auth
5. **Set up automated backups** and monitoring

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Design Best Practices](https://supabase.com/docs/guides/database)

## 🆘 Need Help?

- **Supabase Discord**: [Join here](https://discord.supabase.com)
- **Supabase GitHub**: [Issues & Discussions](https://github.com/supabase/supabase)
- **Community Forum**: [Ask questions](https://github.com/supabase/supabase/discussions)

---

**🎉 Congratulations!** Your Moods app now has a powerful, scalable backend with Supabase!
