# 🎯 Crackifyed Backend API

**Dating Rating Backend** - A modern NestJS API for rating dates and viewing profiles on a map.

## 📋 Features

- ✅ **Person Management**: Create and manage person profiles
- ✅ **Date Ratings**: Rate dates with multiple categories (kindness, conversation, humor)
- ✅ **Geolocation**: Store and query ratings by location
- ✅ **Map Integration**: Display ratings on interactive maps (GeoJSON support)
- ✅ **REST API**: Well-documented, scalable endpoints
- ✅ **TypeORM**: Strong database schema with PostGIS support
- ✅ **Validation**: Comprehensive input validation
- ✅ **Docker**: Ready for containerized deployment

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (or use Docker)
- PostgreSQL 12+ with PostGIS extension
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone <your-repo>
cd crackifyed/backend

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env

# 4. Update .env with your database credentials
# DB_HOST=localhost
# DB_USERNAME=crackifyed_user
# etc.

# 5. Start development server
npm run start:dev
```

### Using Docker

```bash
# Build and start all services (PostgreSQL + NestJS)
docker-compose up --build

# Access the API at http://localhost:3000
# View Swagger docs at http://localhost:3000/api/docs
```

## 📡 API Endpoints

### Persons
- `POST /api/v1/persons` - Create a person profile
- `GET /api/v1/persons` - List all persons (paginated)
- `GET /api/v1/persons/:id` - Get person details with ratings
- `PUT /api/v1/persons/:id` - Update person
- `DELETE /api/v1/persons/:id` - Delete person
- `GET /api/v1/persons/:id/stats` - Get person statistics

### Ratings
- `POST /api/v1/ratings?personId=X` - Create a date rating
- `GET /api/v1/ratings` - List all ratings
- `GET /api/v1/ratings/:id` - Get rating details
- `GET /api/v1/ratings/person/:personId` - Get ratings for a person
- `PUT /api/v1/ratings/:id` - Update a rating
- `DELETE /api/v1/ratings/:id` - Delete a rating

### Map/Geolocation
- `GET /api/v1/map/ratings` - Get all ratings as GeoJSON
- `GET /api/v1/map/ratings?minLat=X&minLng=Y&maxLat=X&maxLng=Y` - Get ratings in bounding box
- `GET /api/v1/map/bounds` - Get ratings within bounds (paginated)
- `GET /api/v1/map/nearby?lat=X&lng=Y&radius=5000` - Find ratings near a point

## 📊 Database Schema

### Person
```sql
CREATE TABLE person (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  age INT,
  gender VARCHAR(50),
  description TEXT,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### DateRating
```sql
CREATE TABLE date_rating (
  id SERIAL PRIMARY KEY,
  personId INT REFERENCES person(id),
  overallRating INT (1-10),
  kindnessRating INT (1-10),
  conversationRating INT (1-10),
  humorRating INT (1-10),
  comment TEXT,
  dateOfDate DATE,
  locationName VARCHAR(512),
  locationCoordinates POINT (PostGIS),
  instagramHandle VARCHAR(255),
  phoneNumber VARCHAR(20),
  snapchatHandle VARCHAR(255),
  createdAt TIMESTAMP
);
```

### PersonImage
```sql
CREATE TABLE person_image (
  id SERIAL PRIMARY KEY,
  personId INT REFERENCES person(id),
  imageUrl VARCHAR(1024),
  imagePath VARCHAR(255),
  createdAt TIMESTAMP
);
```

## 🔧 Development

### Running Tests
```bash
npm run test            # Run all tests
npm run test:watch     # Watch mode
npm run test:cov       # Coverage report
```

### Database Migrations
```bash
npm run migration:generate  # Auto-generate migration
npm run migration:run       # Run migrations
npm run migration:revert    # Revert last migration
```

### Linting & Formatting
```bash
npm run lint           # Run ESLint
npm run format         # Format with Prettier
```

### Build for Production
```bash
npm run build          # Compile TypeScript
npm run start:prod     # Start production server
```

## 📝 Example Requests

### Create a Person
```bash
curl -X POST http://localhost:3000/api/v1/persons \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Emma",
    "age": 26,
    "gender": "female",
    "description": "Love hiking and coffee"
  }'
```

### Create a Rating
```bash
curl -X POST "http://localhost:3000/api/v1/ratings?personId=1" \
  -H "Content-Type: application/json" \
  -d '{
    "overallRating": 8,
    "kindnessRating": 9,
    "conversationRating": 8,
    "humorRating": 7,
    "comment": "Had a great time!",
    "dateOfDate": "2024-03-12",
    "locationName": "Café am Markt, Berlin",
    "locationCoordinates": {
      "x": 13.405,
      "y": 52.52
    }
  }'
```

### Get Nearby Ratings
```bash
curl "http://localhost:3000/api/v1/map/nearby?lat=52.52&lng=13.405&radius=5000"
```

## 🔐 Security Considerations

- ✅ Input validation on all endpoints
- ✅ SQL injection protection (TypeORM parameterized queries)
- ✅ CORS configured
- ✅ Rate limiting ready (implement via middleware)
- ✅ Contact info (phone, Instagram) marked as sensitive
- ✅ Moderation needed for comments (add word filter)

### Recommended Enhancements
1. Add JWT authentication for Premium features
2. Implement rate limiting middleware
3. Add comment moderation/filtering
4. Use CloudFront/CDN for images
5. Add request logging & monitoring
6. Implement API versioning strategy

## 📦 Project Structure

```
src/
├── entities/          # Database models
├── dtos/              # Data transfer objects
├── controllers/       # API endpoints
├── services/          # Business logic
├── modules/           # Feature modules
├── config/            # Configuration
├── migrations/        # Database migrations
├── main.ts            # App bootstrap
└── app.module.ts      # Root module
```

## 🚢 Deployment

### Docker Deployment
```bash
# Build image
docker build -t crackifyed-backend:latest .

# Run container
docker run -p 3000:3000 \
  -e DB_HOST=your-db-host \
  -e DB_USERNAME=user \
  -e DB_PASSWORD=password \
  -e DB_NAME=crackifyed_db \
  crackifyed-backend:latest
```

### Environment Variables (Production)
```env
NODE_ENV=production
APP_PORT=3000
DB_HOST=<production-db-host>
DB_USERNAME=<secure-username>
DB_PASSWORD=<strong-password>
JWT_SECRET=<strong-random-key>
CORS_ORIGIN=https://your-frontend.com
```

## 📚 Swagger Documentation

Visit `http://localhost:3000/api/docs` for interactive API documentation.

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

MIT

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Happy dating rating! 🎉**
