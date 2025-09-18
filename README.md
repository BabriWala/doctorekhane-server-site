# Azhari Travels Backend

A complete backend solution for Azhari Travels agency built with Node.js, Express, and MongoDB.

## Features

- 🔐 JWT-based authentication with role management
- 👥 User and Admin role separation
- 📦 Tour package management with CRUD operations
- 🛂 Visa application processing system
- 📅 Booking management with payment tracking
- 📝 Blog and content management
- 🖼️ Gallery and media management
- 📧 Contact form and newsletter system
- 🌐 Bangla localization support
- 🔒 Security middleware (Helmet, CORS, Rate limiting)
- 📁 File upload with Multer/Cloudinary support

## Installation

1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd azhari-travels-backend
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables
\`\`\`bash
cp .env.example .env
# Edit .env with your configuration
\`\`\`

4. Start the server
\`\`\`bash
# Development
npm run dev

# Production
npm start
\`\`\`

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-password` - Update password

### Tour Package Endpoints
- `GET /api/packages` - Get all packages (with filters)
- `GET /api/packages/featured` - Get featured packages
- `GET /api/packages/:id` - Get single package
- `POST /api/packages` - Create package (Admin)
- `PUT /api/packages/:id` - Update package (Admin)
- `DELETE /api/packages/:id` - Delete package (Admin)

### Booking Endpoints
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking

### Admin Endpoints
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - Manage users
- `GET /api/admin/bookings` - Manage all bookings
- `GET /api/admin/visa-applications` - Manage visa applications

## Database Models

- **User**: User accounts with role-based access
- **TourPackage**: Travel packages with itinerary
- **Booking**: Customer bookings with payment tracking
- **VisaApplication**: Visa processing system
- **Blog**: Content management for travel blogs
- **FAQ**: Frequently asked questions
- **Gallery**: Image gallery management
- **Contact**: Contact form submissions
- **Newsletter**: Email subscription management

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS protection
- Helmet security headers
- File upload restrictions

## Localization

The API supports Bangla localization for:
- Error messages
- Success messages
- Validation messages
- Email templates

## File Upload

Supports file uploads for:
- User profile photos
- Package images
- Visa documents
- Gallery images

## Email Notifications

Automated emails for:
- Booking confirmations
- Visa application updates
- Admin notifications
- Newsletter subscriptions

## Deployment

The application is ready for deployment with:
- Environment-based configuration
- PM2 process management support
- Docker containerization ready
- MongoDB Atlas compatibility

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
