# 🔒 Security & Privacy Guidelines for Crackifyed

## 🛡️ Security Architecture

### Authentication & Authorization
- **Current**: Anonymous API (no user auth required)
- **Future**: JWT-based authentication for Premium features
- **Sensitive Data**: Contact info (phone, Instagram, Snapchat) should only be visible to authenticated users

### Data Protection

#### Personal Information
- ✅ **Name, Age, Gender, Description**: Public (anyone can view)
- ✅ **Average Rating**: Public (calculated from public ratings)
- ✅ **Profile Pictures**: Public
- ⚠️ **Contact Info**: Protected (Instagram, Phone, Snapchat stored but not visible without auth)
- ⚠️ **Location**: Public (shown on map for ratings only)

#### Rating Comments
- Should be moderated for inappropriate content
- Implement word filtering for offensive language
- Consider manual review for complex cases

### Input Validation
```typescript
// All DTOs use class-validator
// Examples:
- Name: 255 char max, no special characters recommended
- Age: 18-120 range (adjustable)
- Rating: 1-10 numeric validation
- Coordinates: Valid lat/lng validation
- Comments: Max 1000 characters, profanity filter
```

## ⚠️ Abuse Prevention

### Rating Spamming
- Implement per-IP rate limiting (e.g., 10 ratings/hour)
- Track repeated ratings of same person
- Flag suspicious activity patterns

### Offensive Content
- Auto-filter comments for profanity
- Manual moderation queue for flagged ratings
- Option to report inappropriate ratings

### False Information
- Encourage users to report inaccurate profiles
- Manual review process for reported persons
- Consider "verified" badges for legitimate profiles

### Location Privacy
- Don't store exact home addresses
- Encourage rating locations to be public venues
- Consider generalizing coordinates (e.g., to city level)

## 🔑 API Security

### CORS
```typescript
// Only allow trusted origins
app.use(cors({
  origin: ['https://crackifyed.com', 'https://www.crackifyed.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Rate Limiting (Recommended)
```typescript
// Apply to all endpoints
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

### SQL Injection Prevention
- ✅ Using TypeORM with parameterized queries
- ✅ Never interpolate user input into SQL
- ✅ Validate all inputs with class-validator

### XSS Protection
- ✅ Return JSON only (not HTML)
- ✅ Sanitize user comments before storage
- ✅ Use Content-Security-Policy headers

## 🔐 Sensitive Data Handling

### Contact Information Fields
```typescript
@Column({ 
  type: 'varchar', 
  nullable: true, 
  select: false  // Not included in default queries
})
instagramHandle: string;

// Only load if authenticated user requests:
.select(['rating.instagramHandle'])
```

### Password Security (Future Auth)
```typescript
// When implementing user authentication:
- Use bcrypt with min 10 rounds
- Hash passwords before storage
- NEVER return passwords in responses
- Implement password reset with tokens
- Enforce strong password requirements
```

## 📍 Location Data Security

### GeoJSON Export
- ✅ Include person profile info in features
- ✅ Don't expose sensitive user data
- ✅ Limit query results with bounding box

### Privacy Considerations
- Store location at rating level (not person level)
- Multiple dates can have different locations
- Avoid aggregating to determine home address

## 🔔 Content Moderation

### Automatic Filtering
```typescript
// Profanity filter example
const profanityFilter = require('bad-words');
const filter = new profanityFilter();

comment = filter.clean(userComment);
```

### Manual Review
- Flag ratings with:
  - Multiple reports
  - Automatically detected profanity
  - Suspicious patterns (spam bots)
  - Hateful/discriminatory content

### User Reporting
- Add report endpoint: `POST /api/v1/ratings/:id/report`
- Fields: `reason`, `description`
- Store in separate `reports` table

## 📜 Privacy Policy Highlights

### Data Collection
- We collect: Names, ages, genders, descriptions, ratings, photos, locations
- We don't collect: User identity, IP address, cookies/tracking

### Data Usage
- Ratings are used to calculate statistics
- Locations are only used for map display
- Comments are public (after moderation)

### Data Retention
- Person profiles: Indefinitely (until deletion)
- Ratings: Indefinitely (until deletion)
- Contact info: Only if provided by rater

### User Rights
- Right to delete: Delete profile → deletes all ratings
- Right to erasure: Request manual data removal
- Right to access: Export personal data

## 🚨 Incident Response

### If Breach Discovered
1. Immediately disable affected accounts
2. Reset contact information
3. Notify users of what data was exposed
4. Rotate JWT secrets
5. Review access logs
6. Implement additional protections

## 🧪 Security Testing Checklist

- [ ] SQL Injection tests
- [ ] XSS payload tests
- [ ] CORS misconfiguration tests
- [ ] Authentication bypass tests
- [ ] API rate limiting tests
- [ ] Input validation tests
- [ ] Comment moderation tests
- [ ] Location privacy tests

## 🔄 Regular Maintenance

### Weekly
- [ ] Review error logs for attack patterns
- [ ] Check for unusual rating activity

### Monthly
- [ ] Rotate JWT secrets
- [ ] Review security patches
- [ ] Update dependencies

### Quarterly
- [ ] Security audit
- [ ] Penetration testing
- [ ] Update security documentation

## 📞 Responsible Disclosure

If you discover a security vulnerability:
1. **Do NOT** create a public issue
2. Email: security@crackifyed.com
3. Include: Description, impact, proof-of-concept
4. Allow 30 days for patch before public disclosure

---

**Last Updated**: March 2024
**Version**: 1.0.0
