import React, { useState, useEffect } from 'react';
import { Calendar, BookOpen, LogOut, ChevronDown, Phone } from 'lucide-react';
import AttendanceCard from './AttendanceCard';
import TestScoreCard from './TestScoreCard';
import ConfirmationDialog from './ConfirmationDialog';
import { getStudentData, getParentData, clearUserSession, transformTestScores, TestScore, ApiTestScore } from '../util/user';
import { getTestScores, getAttendanceByRollNumber } from '../util/server';
import toast from 'react-hot-toast';

interface Child {
  id: string;
  name: string;
  class: string;
  section: string;
  rollNumber: string;
  attendance: {
    present: number;
    total: number;
    percentage: number;
  };
  testScores: {
    subject: string;
    maxMarks: number;
    obtainedMarks: number;
    percentage: number;
    testDate: string;
   testType: string;
  }[];
}

interface DashboardProps {
  phoneNumber: string;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ phoneNumber, onLogout }) => {
  const [selectedChild, setSelectedChild] = useState(0);
  const [showChildDropdown, setShowChildDropdown] = useState(false);
  const [testScores, setTestScores] = useState<TestScore[]>([]);
  const [loadingTestScores, setLoadingTestScores] = useState(false);
  const [attendanceData, setAttendanceData] = useState<any>(undefined);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Get real user data from user manager
  const studentData = getStudentData();
  const parentData = getParentData();
  console.log("Student's data: ", studentData);

  // Fetch test scores and attendance when component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (studentData?.rollNo) {
        // Fetch test scores
        setLoadingTestScores(true);
        try {
          const apiTestScores: ApiTestScore[] = await getTestScores(studentData.rollNo.toString());
          const transformedScores = transformTestScores(apiTestScores);
          setTestScores(transformedScores);
        } catch (error) {
          console.error('Error fetching test scores:', error);
          toast.error('Failed to load test scores');
        } finally {
          setLoadingTestScores(false);
        }
        
        // Fetch attendance data
        setLoadingAttendance(true);
        try {
          const attendance = await getAttendanceByRollNumber(studentData.rollNo.toString());
          setAttendanceData(attendance);
        } catch (error) {
          console.error('Error fetching attendance:', error);
          toast.error('Failed to load attendance data');
        } finally {
          setLoadingAttendance(false);
        }
      }
    };

    fetchData();
  }, [studentData?.rollNo]);

  // Handle logout
  const handleLogout = () => {
    // Show the confirmation dialog
    setShowLogoutConfirm(true);
  };

  // Handle actual logout after confirmation
  const confirmLogout = () => {
    clearUserSession();
    onLogout();
    toast.success("Logged out successfully");
    setShowLogoutConfirm(false);
  };

  // If no student data, show loading or error
  if (!studentData || !parentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600">Getting your student information</p>
        </div>
      </div>
    );
  }

  // Transform real data to match expected format
  const children: Child[] = [
    {
      id: studentData._id,
      name: studentData.name,
      class: studentData.class,
      section: 'A', // Default section since not in API response
      rollNumber: studentData.rollNo.toString(),
      attendance: {
        present: 87, // Mock data - would come from API
        total: 95,
        percentage: 91.6
      },
      testScores: testScores.length > 0 ? testScores : [
        // Fallback mock test scores if API data not available
        { subject: 'Mathematics', maxMarks: 100, obtainedMarks: 92, percentage: 92, testDate: '2024-12-10', testType: 'Unit Test' },
        { subject: 'Science', maxMarks: 100, obtainedMarks: 88, percentage: 88, testDate: '2024-12-08', testType: 'Monthly Test' },
        { subject: 'English', maxMarks: 100, obtainedMarks: 85, percentage: 85, testDate: '2024-12-05', testType: 'Unit Test' },
        { subject: 'Social Studies', maxMarks: 100, obtainedMarks: 90, percentage: 90, testDate: '2024-12-03', testType: 'Quarterly Exam' },
        { subject: 'Hindi', maxMarks: 100, obtainedMarks: 87, percentage: 87, testDate: '2024-12-01', testType: 'Unit Test' }
      ]
    }
  ];

  const currentChild = children[selectedChild];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Hello, {parentData.fatherName}</h1>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Phone className="w-3 h-3" />
                  <span>+91 {phoneNumber}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Child Selector */}
      {children.length > 1 && (
        <div className="px-4 py-4 bg-white border-b border-gray-200">
          <div className="relative">
            <button
              onClick={() => setShowChildDropdown(!showChildDropdown)}
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="text-left">
                <div className="font-medium text-gray-900">{currentChild.name}</div>
                <div className="text-sm text-gray-600">
                  Class {currentChild.class} {currentChild.section} • Roll No. {currentChild.rollNumber}
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${showChildDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showChildDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                {children.map((child, index) => (
                  <button
                    key={child.id}
                    onClick={() => {
                      setSelectedChild(index);
                      setShowChildDropdown(false);
                    }}
                    className={`w-full p-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                      index === selectedChild ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div className="font-medium text-gray-900">{child.name}</div>
                    <div className="text-sm text-gray-600">
                      Class {child.class} {child.section} • Roll No. {child.rollNumber}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="px-4 py-6 space-y-6">
        {/* Child Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-3">
            <img src={studentData.image.url || '/user/user.jpg'} alt={`${currentChild.name}'s profile`} className="w-12 h-12 rounded-full" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{currentChild.name}</h2>
              <p className="text-gray-600">
                Class {currentChild.class} {currentChild.section} • Roll No. {currentChild.rollNumber}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-600 mx-auto mb-1" />
              <div className="text-sm text-gray-600">Attendance</div>
              <div className="text-lg font-semibold text-gray-900">{currentChild.attendance.percentage}%</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <BookOpen className="w-5 h-5 text-gray-600 mx-auto mb-1" />
              <div className="text-sm text-gray-600">Test Reports</div>
              <div className="text-lg font-semibold text-gray-900">{currentChild.testScores.length}</div>
            </div>
          </div>
        </div>

        {/* Attendance Section */}
        <AttendanceCard 
          attendanceData={attendanceData} 
          loading={loadingAttendance}
          rollNumber={currentChild.rollNumber}
        />

        {/* Test Scores Section */}
        <TestScoreCard 
          testScores={currentChild.testScores} 
          studentId={currentChild.id}
          loading={loadingTestScores}
        />
      </main>

      {/* Logout Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showLogoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
};

export default Dashboard;