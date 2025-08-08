// User management utility for parent portal
// Handles storing and retrieving user data from OTP verification response

export interface ParentData {
  occupation: string;
  fatherName: string;
  motherName: string;
  parentContact: string;
  email: string;
}

export interface ImageData {
  public_id: string;
  url: string;
}

export interface StudentData {
  parent: ParentData;
  image: ImageData;
  _id: string;
  name: string;
  rollNo: number;
  class: string;
  previousSchoolName: string;
  medium: string;
  DOB: string;
  gender: string;
  category: string;
  state: string;
  city: string;
  pinCode: string;
  permanentAddress: string;
  mobileNumber: string;
  tShirtSize: string;
  howDidYouHearAboutUs: string;
  programmeName: string;
  emergencyContact: string;
  email: string;
  phone: string;
  kit: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UserSession {
  token: string;
  studentData: StudentData;
  phoneNumber: string;
  loginTime: string;
  expiresAt: string;
}

const USER_STORAGE_KEY = 'career_will_parent_session';
const TOKEN_VALIDITY_HOURS = 24; // Token valid for 24 hours

class UserManager {
  
  /**
   * Save user session after successful OTP verification
   */
  saveUserSession(phoneNumber: string, token: string, studentData: StudentData): void {
    try {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + TOKEN_VALIDITY_HOURS * 60 * 60 * 1000);
      
      const userSession: UserSession = {
        token,
        studentData,
        phoneNumber,
        loginTime: now.toISOString(),
        expiresAt: expiresAt.toISOString()
      };

      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userSession));
      console.log('User session saved successfully');
    } catch (error) {
      console.error('Error saving user session:', error);
    }
  }

  /**
   * Get current user session
   */
  getUserSession(): UserSession | null {
    try {
      const sessionData = localStorage.getItem(USER_STORAGE_KEY);
      if (!sessionData) {
        console.log('No session data found in localStorage');
        return null;
      }

      const userSession: UserSession = JSON.parse(sessionData);
      
      // Check if session has expired
      if (this.isSessionExpired(userSession)) {
        console.log('Session has expired, clearing session');
        this.clearUserSession();
        return null;
      }

    //   console.log('Valid session found:', {
    //     phoneNumber: userSession.phoneNumber,
    //     studentName: userSession.studentData.name,
    //     expiresAt: userSession.expiresAt
    //   });
      return userSession;
    } catch (error) {
      console.error('Error retrieving user session:', error);
      return null;
    }
  }

  /**
   * Get current user's token
   */
  getToken(): string | null {
    const session = this.getUserSession();
    return session?.token || null;
  }

  /**
   * Get current student data
   */
  getStudentData(): StudentData | null {
    const session = this.getUserSession();
    return session?.studentData || null;
  }

  /**
   * Get current user's phone number
   */
  getPhoneNumber(): string | null {
    const session = this.getUserSession();
    return session?.phoneNumber || null;
  }

  /**
   * Get parent information
   */
  getParentData(): ParentData | null {
    const studentData = this.getStudentData();
    return studentData?.parent || null;
  }

  /**
   * Check if user is currently logged in
   */
  isLoggedIn(): boolean {
    const session = this.getUserSession();
    return session !== null && !this.isSessionExpired(session);
  }

  /**
   * Check if session has expired
   */
  private isSessionExpired(session: UserSession): boolean {
    try {
      const now = new Date();
      const expiresAt = new Date(session.expiresAt);
      return now > expiresAt;
    } catch (error) {
      console.error('Error checking session expiry:', error);
      return true; // Assume expired if there's an error
    }
  }

  /**
   * Clear user session (logout)
   */
  clearUserSession(): void {
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
      console.log('User session cleared');
    } catch (error) {
      console.error('Error clearing user session:', error);
    }
  }

  /**
   * Get session info for debugging
   */
  getSessionInfo(): { isLoggedIn: boolean; expiresAt?: string; studentName?: string } {
    const session = this.getUserSession();
    if (!session) {
      return { isLoggedIn: false };
    }

    return {
      isLoggedIn: true,
      expiresAt: session.expiresAt,
      studentName: session.studentData.name
    };
  }

}

// Create and export a singleton instance
const userManager = new UserManager();

export default userManager;

// Export individual methods for convenience - using function wrappers to avoid destructuring issues
export const saveUserSession = (phoneNumber: string, token: string, studentData: StudentData): void => {
  return userManager.saveUserSession(phoneNumber, token, studentData);
};

export const getUserSession = (): UserSession | null => {
  return userManager.getUserSession();
};

export const getToken = (): string | null => {
  return userManager.getToken();
};

export const getStudentData = (): StudentData | null => {
  return userManager.getStudentData();
};

export const getPhoneNumber = (): string | null => {
  return userManager.getPhoneNumber();
};

export const getParentData = (): ParentData | null => {
  return userManager.getParentData();
};

export const isLoggedIn = (): boolean => {
  return userManager.isLoggedIn();
};

export const clearUserSession = (): void => {
  return userManager.clearUserSession();
};

export const getSessionInfo = (): { isLoggedIn: boolean; expiresAt?: string; studentName?: string } => {
  return userManager.getSessionInfo();
};

// Test score related interfaces and functions
export interface TestScoreSubject {
  name: string;
  marks: number;
  _id: string;
}

export interface ApiTestScore {
  _id: string;
  rollNumber: number;
  student: string;
  father: string;
  batch: string;
  subjects: TestScoreSubject[];
  percentile: number;
  total: number;
  rank: number;
  date: string;
  name: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export interface TestScore {
  subject: string;
  maxMarks: number;
  obtainedMarks: number;
  percentage: number;
  testDate: string;
  testType: string;
  // Additional fields from API
  testId?: string;
  rank?: number;
  percentile?: number;
  totalMarks?: number;
  batch?: string;
}

// Transform API test scores to component format
export const transformTestScores = (apiTestScores: ApiTestScore[]): TestScore[] => {
  console.log('Raw API test scores received:', apiTestScores);
  
  const transformedScores: TestScore[] = [];
  
  apiTestScores.forEach(testRecord => {
    console.log('Processing test record:', {
      name: testRecord.name,
      date: testRecord.date,
      rank: testRecord.rank,
      percentile: testRecord.percentile,
      total: testRecord.total,
      subjects: testRecord.subjects.length
    });
    
    testRecord.subjects.forEach(subject => {
      // Assuming max marks based on subject (you might want to get this from API)
      const maxMarks = getMaxMarksForSubject(subject.name);
      const percentage = Math.round((subject.marks / maxMarks) * 100);
      
      const transformedScore = {
        subject: subject.name.charAt(0).toUpperCase() + subject.name.slice(1), // Capitalize first letter
        maxMarks: maxMarks,
        obtainedMarks: subject.marks,
        percentage: percentage,
        testDate: testRecord.date,
        testType: testRecord.name || 'Test', // Use test name from API
        // Additional data from API
        testId: testRecord._id,
        rank: testRecord.rank,
        percentile: testRecord.percentile,
        totalMarks: testRecord.total,
        batch: testRecord.batch !== 'n/a' ? testRecord.batch : undefined
      };
      
      transformedScores.push(transformedScore);
    });
  });
  
  console.log('Transformed test scores:', transformedScores);
  
  // Sort by date (newest first)
  return transformedScores.sort((a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime());
};

// Helper function to determine max marks based on subject
const getMaxMarksForSubject = (subjectName: string): number => {
  // Common max marks for different subjects - adjust based on your school's system
  const subjectMaxMarks: { [key: string]: number } = {
    'physics': 180,
    'chemistry': 180,
    'biology': 360,
    'mathematics': 100,
    'english': 100,
    'hindi': 100,
    'social studies': 100,
    'science': 100
  };
  
  return subjectMaxMarks[subjectName.toLowerCase()] || 100; // Default to 100 if subject not found
};