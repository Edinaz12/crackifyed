# 🏗️ Architecture Overview - Crackifyed Backend

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React/Vue)                      │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS API Calls
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   NestJS REST API                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Controllers (REST Endpoints)                        │   │
│  │  - PersonController                                 │   │
│  │  - DateRatingController                             │   │
│  │  - MapController                                    │   │
│  └────────────────┬─────────────────────────────────────┘   │
│                   │                                          │
│  ┌────────────────▼─────────────────────────────────────┐   │
│  │  Services (Business Logic)                           │   │
│  │  - PersonService                                    │   │
│  │  - DateRatingService                                │   │
│  └────────────────┬─────────────────────────────────────┘   │
│                   │                                          │
│  ┌────────────────▼─────────────────────────────────────┐   │
│  │  Data Layer (TypeORM)                               │   │
│  └────────────────┬─────────────────────────────────────┘   │
└────────────────────┼──────────────────────────────────────┘
                     │
                     ▼
        ┌──────────────────────────────┐
        │  PostgreSQL + PostGIS        │
        │  ├─ person                   │
        │  ├─ person_image             │
        │  ├─ date_rating (with POINT) │
        │  └─ indexes + views          │
        └──────────────────────────────┘
```

## Module Structure

```
src/
├── app.module.ts              # Root module
├── app.controller.ts          # Root controller
├── app.service.ts             # Root service
│
├── controllers/               # API Endpoints
│   ├── person.controller.ts
│   ├── date-rating.controller.ts
│   └── map.controller.ts
│
├── services/                  # Business Logic
│   ├── person.service.ts
│   └── date-rating.service.ts
│
├── entities/                  # Database Models
│   ├── person.entity.ts
│   ├── person-image.entity.ts
│   └── date-rating.entity.ts
│
├── dtos/                      # Data Transfer Objects (Validation)
│   ├── person.dto.ts
│   └── date-rating.dto.ts
│
├── modules/                   # Feature Modules
│   ├── person.module.ts
│   └── date-rating.module.ts
│
├── config/                    # Configuration
│   └── database.config.ts
│
├── migrations/                # Database Migrations
│   └── 1710000000000-InitialSchema.ts
│
└── main.ts                    # Application Bootstrap
```

## Design Patterns

### 1. **Service/Repository Pattern**
- Controllers handle HTTP requests
- Services contain business logic
- TypeORM handles data access

```typescript
// Controller receives request
@Post() create(@Body() dto: CreatePersonDto)

// Service processes request
async create(dto: CreatePersonDto): Promise<Person> {
  return this.personRepository.save(dto);
}
```

### 2. **Dependency Injection**
All services are injected via constructor for:
- Loose coupling
- Easy testing
- Better maintainability

```typescript
constructor(
  @InjectRepository(Person)
  private personRepository: Repository<Person>,
) {}
```

### 3. **DTO Validation**
- DTOs define request/response shape
- class-validator decorators ensure data quality
- Automatic transformation with class-transformer

```typescript
export class CreatePersonDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(18)
  @Max(120)
  age: number;
}
```

### 4. **Module Organization**
- Feature modules group related functionality
- Exports allow cross-module dependencies
- Clean separation of concerns

## Data Model

### Person Entity
```typescript
{
  id: number;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  description?: string;
  images: PersonImage[];      // One-to-many
  ratings: DateRating[];      // One-to-many
}
```

### DateRating Entity
```typescript
{
  id: number;
  person: Person;             // Many-to-one
  overallRating: 1-10;
  kindnessRating?: 1-10;
  conversationRating?: 1-10;
  humorRating?: 1-10;
  comment?: string;
  dateOfDate: Date;
  locationName?: string;
  locationCoordinates: POINT; // PostGIS geometry
  instagramHandle?: string;   // Sensitive
  phoneNumber?: string;       // Sensitive
  snapchatHandle?: string;    // Sensitive
}
```

### PersonImage Entity
```typescript
{
  id: number;
  person: Person;   // Many-to-one
  imageUrl: string;
  imagePath?: string;
}
```

## API Layers

### 1. **Presentation Layer** (Controllers)
- HTTP request/response handling
- Input validation with DTOs
- Error handling and formatting

### 2. **Business Logic Layer** (Services)
- Core application logic
- Data aggregation and transformation
- Geospatial queries for mapping

### 3. **Data Access Layer** (TypeORM)
- Database operations (CRUD)
- Query optimization with relations
- PostGIS spatial queries

### 4. **Database Layer** (PostgreSQL)
- Table structures
- Relationships and constraints
- Indexes for performance
- PostGIS for geospatial features

## Key Technologies

### **NestJS**
- Modern Node.js framework
- Built-in dependency injection
- Modular architecture
- Easy testing setup

### **TypeORM**
- TypeScript ORM
- Type-safe queries
- Relations management
- Migration support
- PostGIS integration

### **PostgreSQL + PostGIS**
- Powerful relational database
- Geographic data support
- Spatial queries (within X meters)
- GeoJSON export

### **TypeScript**
- Type safety
- Better IDE support
- Reduced runtime errors
- Self-documenting code

## API Response Pattern

All endpoints follow a consistent pattern:

```javascript
// Success Response
{
  id: 1,
  name: "Emma",
  age: 26,
  ...
}

// List Response
{
  data: [...],
  total: 50,
  page: 1,
  limit: 20
}

// Error Response
{
  statusCode: 400,
  message: "Validation failed",
  error: "Bad Request"
}
```

## Geolocation Architecture

### How Map Features Work

1. **Rating Creation**
   ```
   User provides location coordinates (lat/lng)
   → Saved as PostGIS POINT geometry
   → Indexed with spatial index (GIST)
   ```

2. **Spatial Queries**
   ```
   Client requests nearby ratings (lat, lng, radius)
   → Database uses ST_DWithin() function
   → Returns sorted by distance
   ```

3. **GeoJSON Export**
   ```
   Server transforms ratings to GeoJSON features
   → Client renders on Leaflet/Mapbox
   → Click marker to see person profile
   ```

### PostGIS Integration

```sql
-- Spatial index for fast queries
CREATE INDEX idx_location ON date_rating 
  USING GIST(locationCoordinates);

-- Find ratings within 5km radius
SELECT * FROM date_rating
WHERE ST_DWithin(
  locationCoordinates::geography,
  ST_Point(lat, lng)::geography,
  5000  -- meters
);
```

## Performance Optimizations

### Database Level
- Indexes on frequently queried columns
- Spatial index for geographic queries
- Eager loading of relations (avoid N+1)
- Pagination for large result sets

### Application Level
- Connection pooling
- Query optimization with QueryBuilder
- Response caching (future)
- Lazy loading when appropriate

### Example Query Optimization
```typescript
// ✗ Bad: N+1 queries
const persons = await this.repository.find();
// Each person.ratings triggers a separate query

// ✓ Good: Eager load relations
const persons = await this.repository.find({
  relations: ['images', 'ratings'],
});
```

## Security Layers

1. **Input Validation**
   - DTOs with class-validator
   - Type checking
   - Range validation

2. **SQL Injection Prevention**
   - Parameterized queries (TypeORM)
   - No string interpolation

3. **CORS Protection**
   - Whitelist allowed origins
   - Credentials handling

4. **Contact Info Protection**
   - Phone/Instagram not selected by default
   - Only visible to authenticated users (future)

## Scalability Considerations

### Horizontal Scaling
- Stateless API (can run multiple instances)
- Database connection pooling
- Load balancer in front
- Shared database backend

### Database Scaling
- Read replicas for queries
- Write-through to primary
- Sharding for very large datasets (future)

### Caching Strategy (Future)
- Redis for frequently accessed data
- Cache invalidation on updates
- Cache warming for popular persons

## Error Handling

```typescript
try {
  const person = await this.personService.findById(id);
} catch (error) {
  if (error instanceof NotFoundException) {
    // Handle 404
  } else {
    // Log and rethrow
  }
}
```

## Testing Strategy

### Unit Tests
- Services isolated from database
- Mock repositories
- Test business logic

### Integration Tests
- Full API calls
- Real database (test database)
- End-to-end flows

### Approach
```typescript
describe('PersonService', () => {
  let service: PersonService;
  let repository: Repository<Person>;

  beforeEach(async () => {
    // Setup test module
  });

  it('should find person by id', async () => {
    const result = await service.findById(1);
    expect(result).toBeDefined();
  });
});
```

## Future Enhancements

### Authentication Layer
- JWT tokens
- User accounts
- Role-based access

### Real-time Features
- WebSockets for notifications
- Live rating updates
- Real-time location sharing

### Advanced Analytics
- User engagement metrics
- Rating trends
- Location heatmaps

### Machine Learning
- Person recommendations
- Rating predictions
- Anomaly detection

---

**Architecture Last Updated**: March 2024
