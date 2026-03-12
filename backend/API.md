# 📖 API Documentation - Crackifyed Backend

## Base URL
```
http://localhost:3000
```

## Authentication
Currently, the API does not require authentication for basic operations.
Premium features will require JWT authentication (future implementation).

## Response Format
All responses are in JSON format.

### Success Response
```json
{
  "id": 1,
  "name": "Emma",
  "age": 26,
  "gender": "female",
  ...
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Error message here",
  "error": "Bad Request"
}
```

---

## 👤 Person Endpoints

### Create Person
**POST** `/api/v1/persons`

Creates a new person profile.

**Request Body:**
```json
{
  "name": "Emma Schmidt",
  "age": 26,
  "gender": "female",
  "description": "Love hiking and cooking"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "name": "Emma Schmidt",
  "age": 26,
  "gender": "female",
  "description": "Love hiking and cooking",
  "images": [],
  "averageRating": 0,
  "totalRatings": 0,
  "createdAt": "2024-03-12T10:00:00Z",
  "updatedAt": "2024-03-12T10:00:00Z"
}
```

### Get All Persons
**GET** `/api/v1/persons?page=1&limit=20&search=Emma`

Retrieves a paginated list of all persons.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `search` (optional): Search by name

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "name": "Emma Schmidt",
      "age": 26,
      "gender": "female",
      "description": "Love hiking and cooking",
      "images": [],
      "averageRating": 8.5,
      "totalRatings": 2,
      "createdAt": "2024-03-12T10:00:00Z",
      "updatedAt": "2024-03-12T10:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20
}
```

### Get Person by ID
**GET** `/api/v1/persons/:id`

Retrieves detailed profile of a specific person including all ratings.

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Emma Schmidt",
  "age": 26,
  "gender": "female",
  "description": "Love hiking and cooking",
  "images": [
    {
      "id": 1,
      "imageUrl": "https://example.com/image1.jpg"
    }
  ],
  "averageRating": 8.5,
  "totalRatings": 2,
  "createdAt": "2024-03-12T10:00:00Z",
  "updatedAt": "2024-03-12T10:00:00Z",
  "ratings": [
    {
      "id": 1,
      "personId": 1,
      "overallRating": 8,
      "kindnessRating": 9,
      "conversationRating": 8,
      "humorRating": 7,
      "comment": "Great person!",
      "dateOfDate": "2024-03-01",
      "locationName": "Café am Markt",
      "locationCoordinates": {
        "x": 13.405,
        "y": 52.52
      },
      "createdAt": "2024-03-12T10:00:00Z"
    }
  ]
}
```

### Update Person
**PUT** `/api/v1/persons/:id`

Updates a person's profile information.

**Request Body:**
```json
{
  "name": "Emma Schmidt",
  "age": 27,
  "description": "Love hiking, cooking, and travel"
}
```

**Response:** `200 OK`

### Delete Person
**DELETE** `/api/v1/persons/:id`

Deletes a person and all their ratings.

**Response:** `204 No Content`

### Get Person Statistics
**GET** `/api/v1/persons/:id/stats`

Get aggregated statistics about a person.

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Emma Schmidt",
  "age": 26,
  "gender": "female",
  "averageRating": 8.5,
  "totalRatings": 2,
  "imageCount": 3
}
```

---

## ⭐ Rating Endpoints

### Create Rating
**POST** `/api/v1/ratings?personId=1`

Creates a new date rating for a person.

**Query Parameters:**
- `personId` (required): ID of the person being rated

**Request Body:**
```json
{
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
  },
  "instagramHandle": "@emma_schmidt",
  "phoneNumber": "+49123456789",
  "snapchatHandle": "emmaschmidt"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "personId": 1,
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
  },
  "createdAt": "2024-03-12T10:00:00Z"
}
```

### Get All Ratings
**GET** `/api/v1/ratings?page=1&limit=20`

Retrieves a paginated list of all ratings.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:** `200 OK`
```json
{
  "data": [...],
  "total": 50,
  "page": 1,
  "limit": 20
}
```

### Get Rating by ID
**GET** `/api/v1/ratings/:id`

Retrieves a specific rating.

**Response:** `200 OK`

### Get Ratings for Specific Person
**GET** `/api/v1/ratings/person/:personId?page=1&limit=20`

Retrieves all ratings for a specific person.

**Response:** `200 OK`
```json
{
  "data": [...],
  "total": 5
}
```

### Update Rating
**PUT** `/api/v1/ratings/:id`

Updates an existing rating. All fields are optional.

**Request Body:**
```json
{
  "overallRating": 9,
  "comment": "Updated comment"
}
```

**Response:** `200 OK`

### Delete Rating
**DELETE** `/api/v1/ratings/:id`

Deletes a rating.

**Response:** `204 No Content`

---

## 🗺️ Map Endpoints

### Get All Ratings as GeoJSON
**GET** `/api/v1/map/ratings`

Returns all ratings as GeoJSON for display on maps.

**Query Parameters:**
- `minLat` (optional): Minimum latitude for bounding box
- `minLng` (optional): Minimum longitude for bounding box
- `maxLat` (optional): Maximum latitude for bounding box
- `maxLng` (optional): Maximum longitude for bounding box

**Response:** `200 OK`
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "id": 1,
        "personId": 1,
        "personName": "Emma Schmidt",
        "overallRating": 8,
        "locationName": "Café am Markt",
        "dateOfDate": "2024-03-12",
        "createdAt": "2024-03-12T10:00:00Z"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [13.405, 52.52]
      }
    }
  ]
}
```

### Get Ratings in Bounding Box
**GET** `/api/v1/map/bounds?minLat=52&minLng=13&maxLat=53&maxLng=14`

Gets ratings within a geographic bounding box.

**Query Parameters:**
- `minLat` (required): Minimum latitude
- `minLng` (required): Minimum longitude
- `maxLat` (required): Maximum latitude
- `maxLng` (required): Maximum longitude
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "personId": 1,
      "personName": "Emma Schmidt",
      "overallRating": 8,
      "locationName": "Café am Markt",
      "locationCoordinates": {
        "x": 13.405,
        "y": 52.52
      },
      "dateOfDate": "2024-03-12",
      "createdAt": "2024-03-12T10:00:00Z"
    }
  ],
  "total": 1
}
```

### Get Nearby Ratings
**GET** `/api/v1/map/nearby?lat=52.52&lng=13.405&radius=5000`

Find ratings near a specific point.

**Query Parameters:**
- `lat` (required): Latitude
- `lng` (required): Longitude
- `radius` (optional): Search radius in meters (default: 5000)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "personId": 1,
      "personName": "Emma Schmidt",
      "overallRating": 8,
      "locationName": "Café am Markt",
      "locationCoordinates": {
        "x": 13.405,
        "y": 52.52
      },
      "dateOfDate": "2024-03-12",
      "distance": 245.3,
      "createdAt": "2024-03-12T10:00:00Z"
    }
  ],
  "total": 1
}
```

---

## 🏥 Health Check

### Health Endpoint
**GET** `/health`

Check API health status.

**Response:** `200 OK`
```json
{
  "status": "healthy",
  "timestamp": "2024-03-12T10:00:00Z",
  "version": "1.0.0"
}
```

---

## 📊 Validation Rules

### Person
- `name`: Required, string, max 255 characters
- `age`: Required, integer, min 18, max 120
- `gender`: Required, one of: `male`, `female`, `other`
- `description`: Optional, string, any length

### Rating
- `overallRating`: Required, integer, 1-10
- `kindnessRating`: Optional, integer, 1-10
- `conversationRating`: Optional, integer, 1-10
- `humorRating`: Optional, integer, 1-10
- `comment`: Optional, string, max 1000 characters
- `dateOfDate`: Required, ISO date format (YYYY-MM-DD)
- `locationName`: Optional, string, max 512 characters
- `locationCoordinates`: Required, object with `x` (longitude) and `y` (latitude)
- `instagramHandle`: Optional, string (contact info)
- `phoneNumber`: Optional, string (contact info)
- `snapchatHandle`: Optional, string (contact info)

---

## 🔄 Pagination

All list endpoints support pagination:
- `page`: Current page (1-indexed)
- `limit`: Items per page

Default: `page=1, limit=20`

Response includes: `data`, `total`, `page`, `limit`

---

## 📝 Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 204 | No Content | Request successful, no response body |
| 400 | Bad Request | Invalid input parameters |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error |

---

Last Updated: March 2024
