import apiClient from "./axios";
import { StudentData } from "./user";

export interface SendOtpResponse {
  success: boolean;
  message: string;
  jobId?: string;
  messageId?: string;
}

export interface VerifyOtpResponse {
  message: string;
  data: StudentData[];
  token: string;
}

export const sendOtp = async (mobileNumber: string): Promise<SendOtpResponse> => {
  try {
    const response = await apiClient.post("/api/auth/parent-login", { mobileNumber });
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

export const verifyOtp = async (mobileNumber: string, code: string): Promise<VerifyOtpResponse> => {
  try {
    const response = await apiClient.post("/api/auth/verify-login-otp", { mobileNumber, code });
    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

export const getTestScores = async (rollNumber: string) => {
  try {
    const response = await apiClient.get(`/api/test-score/search-test-scores?query=${rollNumber}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching test scores:", error);
    throw error;
  }
};

export const getAttendanceByRollNumber = async (rollNumber: string) => {
  try {
    const response = await apiClient.get(`/api/student/get-attendence-by-rollnumber/${rollNumber}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance:", error);
    throw error;
  }
};

// Fees types
export interface FeeSubmission {
  dateOfReceipt: string;
  amount: number;
  mode: string;
  receiptNumber: string;
  UTR?: string;
  _id?: string;
}

export interface FeeRecord {
  _id: string;
  studentRollNo: string;
  totalFees?: number;
  discount?: number;
  finalFees: number;
  approvedBy?: string;
  paidAmount: number;
  pendingAmount: number;
  status: "PAID" | "PARTIAL" | "PENDING" | string;
  dueDate?: string;
  submissions: FeeSubmission[];
  createdAt?: string;
  updatedAt?: string;
}

export interface FeesByRollNumberResponse {
  fees: FeeRecord[];
  studentName: string;
}

export const getFeesByRollNumber = async (
  rollNumber: string
): Promise<FeesByRollNumberResponse> => {
  try {
    const response = await apiClient.get(
      `/api/fee/get-fee-by-roll-number/${rollNumber}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching fees by roll number:", error);
    throw error;
  }
};
