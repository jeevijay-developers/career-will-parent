# User Management System Documentation

This document explains how to use the user management system for the Career Will Parent Portal.

## Overview

The user management system handles storing and retrieving user data after successful OTP verification. It uses localStorage to persist user sessions and provides various utility methods to interact with user data.

## Installation

The user management system is already integrated into your project. Import it from:

```typescript
import userManager from '../util/user';
// or
import { isLoggedIn, getStudentData, getToken } from '../util/user';
```

## Usage Examples

### 1. After OTP Verification (Login Component)

```typescript
const handleOtpSubmit = async (e: React.FormEvent) => {
  // ... OTP verification logic
  
  try {
    const res = await verifyOtp(phoneNumber, otp);
    if (res.token && res.data?.[0]) {
      // Save user session
      userManager.saveUserSession(phoneNumber, res.token, res.data[0]);
      
      // Redirect to dashboard
      onLogin(phoneNumber, res.token, res.data[0]);
    }
  } catch (error) {
    // Handle error
  }
};
```

### 2. Check if User is Logged In

```typescript
import { isLoggedIn } from '../util/user';

const MyComponent = () => {
  const loggedIn = isLoggedIn();
  
  if (!loggedIn) {
    return <LoginComponent />;
  }
  
  return <Dashboard />;
};
```

### 3. Get Student Data

```typescript
import { getStudentData } from '../util/user';

const StudentProfile = () => {
  const studentData = getStudentData();
  
  if (!studentData) {
    return <div>No student data found</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {studentData.name}</h1>
      <p>Class: {studentData.class}</p>
      <p>Roll No: {studentData.rollNo}</p>
    </div>
  );
};
```

### 4. Get Parent Information

```typescript
import { getParentData } from '../util/user';

const ParentProfile = () => {
  const parentData = getParentData();
  
  return (
    <div>
      <h2>Parent Information</h2>
      <p>Father: {parentData?.fatherName}</p>
      <p>Mother: {parentData?.motherName}</p>
      <p>Contact: {parentData?.parentContact}</p>
    </div>
  );
};
```

### 5. Get Authentication Token

```typescript
import { getToken } from '../util/user';

const makeApiCall = async () => {
  const token = getToken();
  
  if (!token) {
    throw new Error('User not authenticated');
  }
  
  const response = await fetch('/api/some-endpoint', {
    headers: {
      'Authorization': \`Bearer \${token}\`,
      'Content-Type': 'application/json'
    }
  });
  
  return response.json();
};
```

### 6. Logout User

```typescript
import { clearUserSession } from '../util/user';

const LogoutButton = () => {
  const handleLogout = () => {
    clearUserSession();
    // Redirect to login page
    window.location.href = '/login';
  };
  
  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};
```

### 7. Update Student Data

```typescript
import { updateStudentData } from '../util/user';

const updateProfile = () => {
  updateStudentData({
    email: 'newemail@example.com',
    mobileNumber: '9876543210'
  });
};
```

### 8. Session Management

```typescript
import { getSessionInfo, extendSession } from '../util/user';

const SessionManager = () => {
  const sessionInfo = getSessionInfo();
  
  const handleExtendSession = () => {
    extendSession();
  };
  
  return (
    <div>
      <p>Logged in: {sessionInfo.isLoggedIn ? 'Yes' : 'No'}</p>
      {sessionInfo.expiresAt && (
        <p>Session expires: {new Date(sessionInfo.expiresAt).toLocaleString()}</p>
      )}
      <button onClick={handleExtendSession}>Extend Session</button>
    </div>
  );
};
```

## Available Methods

### Core Methods
- `saveUserSession(phoneNumber, token, studentData)` - Save user session after login
- `getUserSession()` - Get complete user session
- `isLoggedIn()` - Check if user is logged in
- `clearUserSession()` - Logout user

### Data Getters
- `getToken()` - Get authentication token
- `getStudentData()` - Get student information
- `getParentData()` - Get parent information
- `getPhoneNumber()` - Get user's phone number

### Session Management
- `updateStudentData(partialData)` - Update student information
- `getSessionInfo()` - Get session debugging info
- `extendSession()` - Extend session validity

## Data Types

### StudentData
Contains complete student information including:
- Personal details (name, rollNo, class, etc.)
- Contact information
- Parent information
- Academic details
- Images

### ParentData
Contains parent information:
- Father's and mother's names
- Contact details
- Occupation
- Email

### UserSession
Contains:
- Authentication token
- Complete student data
- Phone number
- Login timestamp
- Expiration time

## Security Features

1. **Automatic Session Expiry**: Sessions expire after 24 hours
2. **Session Validation**: All methods check for valid, non-expired sessions
3. **Secure Storage**: Uses localStorage with JSON serialization
4. **Error Handling**: Graceful error handling for corrupted data

## Best Practices

1. Always check `isLoggedIn()` before accessing user data
2. Handle null returns from getter methods
3. Use try-catch blocks when calling user methods
4. Clear sessions on logout
5. Extend sessions for active users
6. Validate token before making API calls

## Example: Complete Authentication Flow

```typescript
// Login.tsx
const handleLogin = async () => {
  const response = await verifyOtp(phone, otp);
  userManager.saveUserSession(phone, response.token, response.data[0]);
  router.push('/dashboard');
};

// Dashboard.tsx
const Dashboard = () => {
  const studentData = getStudentData();
  const isAuthenticated = isLoggedIn();
  
  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }
  
  return <div>Welcome {studentData?.name}</div>;
};

// Header.tsx
const Header = () => {
  const handleLogout = () => {
    clearUserSession();
    router.push('/login');
  };
  
  return <button onClick={handleLogout}>Logout</button>;
};
```
