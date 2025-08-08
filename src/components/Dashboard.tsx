import React, { useState } from 'react';
import { User, Calendar, BookOpen, LogOut, ChevronDown, Phone } from 'lucide-react';
import AttendanceCard from './AttendanceCard';
import TestScoreCard from './TestScoreCard';

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

  // Mock data - In real app, this would come from API
  const children: Child[] = [
    {
      id: '1',
      name: 'Arjun Kumar',
      class: '10th',
      section: 'A',
      rollNumber: '15',
      attendance: {
        present: 87,
        total: 95,
        percentage: 91.6
      },
      testScores: [
        { subject: 'Mathematics', maxMarks: 100, obtainedMarks: 92, percentage: 92, testDate: '2024-12-10', testType: 'Unit Test' },
        { subject: 'Science', maxMarks: 100, obtainedMarks: 88, percentage: 88, testDate: '2024-12-08', testType: 'Monthly Test' },
        { subject: 'English', maxMarks: 100, obtainedMarks: 85, percentage: 85, testDate: '2024-12-05', testType: 'Unit Test' },
        { subject: 'Social Studies', maxMarks: 100, obtainedMarks: 90, percentage: 90, testDate: '2024-12-03', testType: 'Quarterly Exam' },
        { subject: 'Hindi', maxMarks: 100, obtainedMarks: 87, percentage: 87, testDate: '2024-12-01', testType: 'Unit Test' }
      ]
    },
    {
      id: '2',
      name: 'Priya Kumar',
      class: '7th',
      section: 'B',
      rollNumber: '23',
      attendance: {
        present: 92,
        total: 95,
        percentage: 96.8
      },
      testScores: [
        { subject: 'Mathematics', maxMarks: 100, obtainedMarks: 95, percentage: 95, testDate: '2024-12-10', testType: 'Unit Test' },
        { subject: 'Science', maxMarks: 100, obtainedMarks: 91, percentage: 91, testDate: '2024-12-08', testType: 'Monthly Test' },
        { subject: 'English', maxMarks: 100, obtainedMarks: 89, percentage: 89, testDate: '2024-12-05', testType: 'Unit Test' },
        { subject: 'Social Studies', maxMarks: 100, obtainedMarks: 93, percentage: 93, testDate: '2024-12-03', testType: 'Quarterly Exam' }
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
              <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Parent Portal</h1>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Phone className="w-3 h-3" />
                  <span>+91 {phoneNumber}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onLogout}
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
            <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
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
        <AttendanceCard attendance={currentChild.attendance} />

        {/* Test Scores Section */}
        <TestScoreCard testScores={currentChild.testScores} />
      </main>
    </div>
  );
};

export default Dashboard;