# Admin Panel Setup Guide

Your admin panel is now complete! Here's what you need to do to get it running:

## 🚀 Quick Setup

### 1. Install Required Dependencies
```bash
npm install bcryptjs jsonwebtoken @types/bcryptjs @types/jsonwebtoken @types/node
```

### 2. Environment Variables
Create a `.env` file in your project root:

```env
# JWT Secret for authentication (change this to a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Resend API for guest post submissions
RESEND_API_KEY=your-resend-api-key
```

### 3. Update Admin Credentials
Edit `src/pages/api/admin/login.ts` and update:
- `ADMIN_EMAIL` - Your admin email
- `ADMIN_PASSWORD_HASH` - Hash of your password (use bcrypt to generate)

## 🎯 Admin Panel Features

### ✅ Completed Features

**Authentication & Security**
- JWT-based login system
- Protected admin routes
- Secure session management
- Auto-logout functionality

**Dashboard Overview**
- Statistics cards (posts, authors, submissions, views)
- Recent activity widgets
- Quick action buttons
- Responsive design

**Post Management**
- Create, edit, delete posts
- Rich Markdown editor with toolbar
- Live preview functionality
- Tag management system
- Status control (draft, published, scheduled)
- Search and filtering

**Guest Post Review**
- Submission queue management
- Approval workflow (pending → reviewing → approved/rejected)
- Full content preview
- Avatar and attachment handling
- Email notifications integration

**Author Management**
- Create and edit author profiles
- Avatar upload support
- Social media links
- Role management (admin/guest)
- Status tracking

**Media Library**
- File upload system
- Grid and list views
- Image preview
- File management (copy URL, delete)
- Size and type tracking

**Settings Configuration**
- General site settings
- Appearance preferences
- Feature toggles
- SEO optimization
- Guest submission controls

## 🔐 Security Features

- **Authentication**: JWT tokens with expiration
- **Route Protection**: Middleware-based access control
- **Secure Cookies**: HttpOnly, secure, same-site
- **Input Validation**: Server-side validation
- **CSRF Protection**: Built-in security measures

## 📱 Access Points

Visit these URLs to access your admin panel:

- **Login**: `/admin/login`
- **Dashboard**: `/admin`
- **Posts**: `/admin/posts`
- **Authors**: `/admin/authors`
- **Submissions**: `/admin/submissions`
- **Media**: `/admin/media`
- **Settings**: `/admin/settings`

## 🎨 Default Login Credentials

- **Email**: `admin@miawoezo.com`
- **Password**: `admin123`

**Important**: Change these credentials in production!

## 🔧 Customization

### Update Site Settings
1. Go to `/admin/settings`
2. Modify general, appearance, and SEO settings
3. Toggle features on/off as needed

### Configure Guest Submissions
1. Enable/disable guest post submissions
2. Set approval requirements
3. Configure file upload limits
4. Customize email notifications

### Manage Authors
1. Add new authors with profiles
2. Upload author avatars
3. Set social media links
4. Manage roles and permissions

## 🚀 Deployment Notes

### Production Checklist
- [ ] Change default admin credentials
- [ ] Set secure JWT_SECRET
- [ ] Configure RESEND_API_KEY
- [ ] Enable HTTPS
- [ ] Set up proper file permissions
- [ ] Test all admin functionality
- [ ] Backup your data

### Security Best Practices
- Use strong, unique passwords
- Regularly update dependencies
- Monitor admin access logs
- Limit failed login attempts
- Keep software updated

## 🐛 Troubleshooting

### Login Issues
- Check JWT_SECRET is set
- Verify admin credentials
- Clear browser cookies

### File Upload Issues
- Check file permissions
- Verify upload directory exists
- Check file size limits

### API Errors
- Check environment variables
- Verify dependency installation
- Check browser console for errors

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify all dependencies are installed
3. Ensure environment variables are set
4. Check file permissions

Your admin panel is now ready to use! 🎉
