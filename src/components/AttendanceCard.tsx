import React, { useState, useMemo } from 'react';
import { Calendar, Users, CheckCircle, XCircle, Filter, ChevronDown, Clock } from 'lucide-react';
import { getStudentData } from '../util/user';

// API response attendance record interface
interface AttendanceRecord {
  _id: string;
  rollNo: string;
  name: string;
  inTime: string;
  outTime: string;
  lateArrival: string;
  earlyDeparture: string;
  workingHours: string;
  otDuration: string;
  presentStatus: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface AttendanceResponse {
  data: AttendanceRecord[];
  status: boolean;
}

interface AttendanceProps {
  attendanceData?: AttendanceResponse;
  loading: boolean;
  rollNumber?: string; // Optional since we don't use it directly in this component
}

const AttendanceCard: React.FC<AttendanceProps> = ({ attendanceData, loading }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [showDetailedView, setShowDetailedView] = useState(false);

  // Get real student data
  const studentData = getStudentData();
  
  // Use the actual attendance records from the API
  const attendanceRecords = useMemo(() => {
    if (!attendanceData || !attendanceData.data) {
      return [];
    }
    return attendanceData.data;
  }, [attendanceData]);

  const filteredRecords = useMemo(() => {
    if (!dateRange.startDate && !dateRange.endDate) {
      return attendanceRecords;
    }
    
    return attendanceRecords.filter(record => {
      const recordDate = new Date(record.date);
      const start = dateRange.startDate ? new Date(dateRange.startDate) : new Date('1900-01-01');
      const end = dateRange.endDate ? new Date(dateRange.endDate) : new Date('2100-12-31');
      
      return recordDate >= start && recordDate <= end;
    });
  }, [attendanceRecords, dateRange]);

  const filteredStats = useMemo(() => {
    const present = filteredRecords.filter(r => r.presentStatus === 'P').length;
    const total = filteredRecords.length;
    const percentage = total > 0 ? Math.round((present / total) * 100 * 10) / 10 : 0;
    
    return { present, total, percentage };
  }, [filteredRecords]);

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 90) return { status: 'excellent', color: 'text-gray-900', bg: 'bg-gray-900' };
    if (percentage >= 80) return { status: 'good', color: 'text-gray-700', bg: 'bg-gray-700' };
    if (percentage >= 75) return { status: 'average', color: 'text-gray-600', bg: 'bg-gray-600' };
    return { status: 'poor', color: 'text-gray-500', bg: 'bg-gray-500' };
  };

  const statusInfo = getAttendanceStatus(filteredStats.percentage);
  const absent = filteredStats.total - filteredStats.present;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const clearFilters = () => {
    setDateRange({ startDate: '', endDate: '' });
  };

  // Get present and absent days from filtered records
  const absentDays = filteredRecords.filter(r => r.presentStatus !== 'P');
  const presentDays = filteredRecords.filter(r => r.presentStatus === 'P');
  
  // Show loading state if data is loading
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-gray-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Attendance Overview</h3>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  // Show empty state if no data
  if (!attendanceData || !attendanceData.data || attendanceData.data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-gray-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Attendance Overview</h3>
          </div>
        </div>
        <div className="text-center py-8">
          <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">No attendance records available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Attendance Overview</h3>
            {studentData && (
              <p className="text-sm text-gray-600">
                {studentData.name} • Class {studentData.class} • Roll No. {studentData.rollNo}
              </p>
            )}
            {!studentData && attendanceData.data.length > 0 && (
              <p className="text-sm text-gray-600">
                {attendanceData.data[0].name} • Roll No. {attendanceData.data[0].rollNo}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`p-2 rounded-lg transition-colors ${showFilter ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Date Filter */}
      {showFilter && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={clearFilters}
                className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
              >
                Clear Filters
              </button>
              <button
                onClick={() => setShowFilter(false)}
                className="flex-1 px-3 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Progress Circle */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-gray-200"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={statusInfo.color}
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${filteredStats.percentage}, 100`}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{filteredStats.percentage}%</div>
              <div className="text-xs text-gray-600 capitalize">{statusInfo.status}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Users className="w-4 h-4 text-gray-600 mx-auto mb-1" />
          <div className="text-xs text-gray-600">Total Days</div>
          <div className="text-lg font-semibold text-gray-900">{filteredStats.total}</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <CheckCircle className="w-4 h-4 text-gray-600 mx-auto mb-1" />
          <div className="text-xs text-gray-600">Present</div>
          <div className="text-lg font-semibold text-gray-900">{filteredStats.present}</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <XCircle className="w-4 h-4 text-gray-600 mx-auto mb-1" />
          <div className="text-xs text-gray-600">Absent</div>
          <div className="text-lg font-semibold text-gray-900">{absent}</div>
        </div>
      </div>

      {/* Detailed View Toggle */}
      <button
        onClick={() => setShowDetailedView(!showDetailedView)}
        className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors mb-4"
      >
        <span className="text-sm font-medium text-gray-700">View Detailed Records</span>
        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showDetailedView ? 'rotate-180' : ''}`} />
      </button>

      {/* Detailed Records */}
      {showDetailedView && (
        <div className="space-y-4">
          {/* Absent Days */}
          {absentDays.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-4 h-4 text-red-500" />
                <h4 className="font-medium text-gray-900">Absent Days ({absentDays.length})</h4>
              </div>
              <div className="space-y-2">
                {absentDays.map((record) => (
                  <div key={record._id} className="text-sm bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{formatDate(record.date)}</span>
                      <span className="text-red-500 font-medium">Absent</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Present Days */}
          {presentDays.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <h4 className="font-medium text-gray-900">Present Days ({presentDays.length})</h4>
              </div>
              <div className="max-h-80 overflow-y-auto">
                <div className="space-y-2">
                  {presentDays.map((record) => (
                    <div key={record._id} className="text-sm bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{formatDate(record.date)}</span>
                        <span className="text-green-500 font-medium">Present</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <span className="text-gray-500">In Time:</span> 
                          <span className="ml-1 font-medium">{record.inTime}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Out Time:</span> 
                          <span className="ml-1 font-medium">{record.outTime === 'N/A' ? '-' : record.outTime}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Late By:</span> 
                          <span className="ml-1 font-medium">{record.lateArrival}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Working Hours:</span> 
                          <span className="ml-1 font-medium">{record.workingHours}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Status Message */}
      <div className={`p-3 rounded-lg border-l-4 ${statusInfo.bg.replace('bg-', 'border-l-')} bg-gray-50`}>
        <div className="text-sm text-gray-700">
          {filteredStats.percentage >= 90 && "Excellent attendance! Keep it up."}
          {filteredStats.percentage >= 80 && filteredStats.percentage < 90 && "Good attendance record."}
          {filteredStats.percentage >= 75 && filteredStats.percentage < 80 && "Attendance needs improvement."}
          {filteredStats.percentage < 75 && "Low attendance. Please ensure regular school attendance."}
        </div>
      </div>
    </div>
  );
};

export default AttendanceCard;