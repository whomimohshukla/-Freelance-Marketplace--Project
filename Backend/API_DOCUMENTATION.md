# SkillBridge API Documentation

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication APIs

### 1. Send OTP
Send a verification code to user's email for signup.

**Endpoint:** `POST /users/send-otp`

**Request Body:**
```json
{
    "email": "user@example.com"
}
```

**Success Response (200 OK):**
```json
{
    "message": "OTP sent successfully"
}
```

**Error Responses:**

*Email Missing (400 Bad Request):*
```json
{
    "message": "Email is required"
}
```

*User Exists (400 Bad Request):*
```json
{
    "message": "User already exists"
}
```

*Email Send Failed (500 Internal Server Error):*
```json
{
    "message": "Failed to send OTP email"
}
```

### 2. User Signup
Complete user registration with OTP verification.

**Endpoint:** `POST /users/signup`

**Request Body:**
```json
{
    "email": "user@example.com",
    "password": "yourpassword",
    "firstName": "John",
    "lastName": "Doe",
    "role": "freelancer",
    "skills": ["JavaScript", "React", "Node.js"],
    "hourlyRate": 50,
    "otp": "123456"
}
```

**Required Fields:**
- email
- password
- firstName
- lastName
- role (must be either "client" or "freelancer")
- otp

**Optional Fields:**
- skills (array of strings)
- hourlyRate (number)

**Success Response (201 Created):**
```json
{
    "message": "User created successfully",
    "user": {
        "_id": "user_id",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "freelancer",
        "skills": ["JavaScript", "React", "Node.js"],
        "hourlyRate": 50,
        "status": "active",
        "joinDate": "2024-12-17T19:23:45.000Z",
        "createdAt": "2024-12-17T19:23:45.000Z",
        "updatedAt": "2024-12-17T19:23:45.000Z"
    }
}
```

**Error Responses:**

*Missing Fields (400 Bad Request):*
```json
{
    "message": "Missing required fields",
    "required": ["email", "password", "firstName", "lastName", "role", "otp"]
}
```

*Invalid OTP (400 Bad Request):*
```json
{
    "message": "Invalid OTP"
}
```

*OTP Expired (400 Bad Request):*
```json
{
    "message": "OTP expired or not found"
}
```

## Data Validation Rules

### Email
- Must be a valid email format
- Must be unique in the system
- Will be converted to lowercase

### Password
- Minimum length: 6 characters
- Stored securely using bcrypt hashing

### Names (firstName, lastName)
- Required fields
- Whitespace will be trimmed

### Role
- Must be either "client" or "freelancer"
- Required field

### Skills
- Optional array of strings
- Empty array if not provided

### Hourly Rate
- Optional number
- Defaults to 0 if not provided

### Status
- Either "active" or "inactive"
- Defaults to "active"

## Notes

1. **Authentication Flow:**
   - First call the send-otp endpoint
   - Use the received OTP to complete signup
   - OTP expires in 5 minutes

2. **Email Notifications:**
   - OTP verification email
   - Welcome email after successful signup

3. **Security Features:**
   - Password hashing
   - OTP expiration
   - Email verification
   - Input validation

4. **Rate Limiting:**
   - 100 requests per 15 minutes per IP

## Testing in Postman

1. Create a new collection called "SkillBridge API"
2. Set up environment variables:
   - `BASE_URL`: http://localhost:3000/api/v1

3. Import the following cURL commands:

**Send OTP:**
```bash
curl -X POST {{BASE_URL}}/users/send-otp \
-H "Content-Type: application/json" \
-d '{
    "email": "user@example.com"
}'
```

**Signup:**
```bash
curl -X POST {{BASE_URL}}/users/signup \
-H "Content-Type: application/json" \
-d '{
    "email": "user@example.com",
    "password": "yourpassword",
    "firstName": "John",
    "lastName": "Doe",
    "role": "freelancer",
    "skills": ["JavaScript", "React", "Node.js"],
    "hourlyRate": 50,
    "otp": "123456"
}'
```

## Error Handling

All API endpoints follow a consistent error response format:
```json
{
    "message": "Error message here"
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
