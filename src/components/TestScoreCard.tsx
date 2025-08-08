import React, { useState, useMemo } from 'react';
import { BookOpen, TrendingUp, Calendar, Award, Filter } from 'lucide-react';
import { getStudentData } from '../util/user';

interface TestScore {
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

interface TestScoreCardProps {
  testScores: TestScore[];
  studentId?: string; // Optional student ID for API calls
  loading?: boolean; // Loading state for test scores
}

const TestScoreCard: React.FC<TestScoreCardProps> = ({ testScores, loading = false }) => {
  const [selectedTest, setSelectedTest] = useState<TestScore | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [subjectFilter, setSubjectFilter] = useState('');

  // Get real student data
  const studentData = getStudentData();

  // Only use provided test scores, never fallback to mock data
  const enhancedTestScores: TestScore[] = useMemo(() => {
    return testScores && testScores.length > 0 ? testScores : [];
  }, [testScores]);

  const filteredTestScores = useMemo(() => {
    let filtered = enhancedTestScores;

    // Date filter
    if (dateRange.startDate || dateRange.endDate) {
      filtered = filtered.filter(test => {
        const testDate = new Date(test.testDate);
        const start = dateRange.startDate ? new Date(dateRange.startDate) : new Date('1900-01-01');
        const end = dateRange.endDate ? new Date(dateRange.endDate) : new Date('2100-12-31');
        
        return testDate >= start && testDate <= end;
      });
    }

    // Subject filter
    if (subjectFilter) {
      filtered = filtered.filter(test => test.subject === subjectFilter);
    }

    return filtered.sort((a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime());
  }, [enhancedTestScores, dateRange, subjectFilter]);

  const getGradeInfo = (percentage: number) => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-600' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-500', bg: 'bg-green-500' };
    if (percentage >= 70) return { grade: 'B+', color: 'text-blue-600', bg: 'bg-blue-600' };
    if (percentage >= 60) return { grade: 'B', color: 'text-blue-500', bg: 'bg-blue-500' };
    if (percentage >= 50) return { grade: 'C', color: 'text-yellow-500', bg: 'bg-yellow-500' };
    return { grade: 'D', color: 'text-red-500', bg: 'bg-red-500' };
  };

  // Get subject color based on subject name for consistent coloring
  const getSubjectColor = (subject: string): string => {
    // Base colors that will be assigned to subjects as needed
    const baseColors = [
      'bg-indigo-500', 'bg-teal-500', 'bg-blue-500', 'bg-purple-500', 
      'bg-green-500', 'bg-yellow-500', 'bg-pink-500', 'bg-orange-500',
      'bg-red-500', 'bg-sky-500', 'bg-amber-500', 'bg-lime-500'
    ];
    
    // Get unique subjects from the filtered test scores
    const uniqueSubjects = Array.from(new Set(filteredTestScores.map(test => test.subject)));
    const subjectColorMap: { [key: string]: string } = {};
    
    // Create a map of subject to color
    uniqueSubjects.forEach((subj, index) => {
      subjectColorMap[subj] = baseColors[index % baseColors.length];
    });
    
    return subjectColorMap[subject] || 'bg-gray-500';
  };

  const averagePercentage = filteredTestScores.length > 0 
    ? filteredTestScores.reduce((sum, test) => sum + test.percentage, 0) / filteredTestScores.length 
    : 0;
  const averageGrade = getGradeInfo(averagePercentage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const clearFilters = () => {
    setDateRange({ startDate: '', endDate: '' });
    setSubjectFilter('');
  };

  const uniqueSubjects = Array.from(new Set(enhancedTestScores.map(test => test.subject)));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-gray-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Test Scores</h3>
            {studentData && (
              <p className="text-sm text-gray-600">
                {studentData.name} • Class {studentData.class} • Roll No. {studentData.rollNo}
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

      {/* Filter Section */}
      {showFilter && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
              >
                <option value="">All Subjects</option>
                {uniqueSubjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
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

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading test scores...</p>
        </div>
      )}

      {/* Overall Performance */}
      {!loading && filteredTestScores.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {dateRange.startDate || dateRange.endDate || subjectFilter ? 'Filtered' : 'Overall'} Performance
              </span>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${averageGrade.bg}`}>
              Grade {averageGrade.grade}
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{averagePercentage.toFixed(1)}%</div>
          <div className="text-sm text-gray-600 mb-3">
            Average across {filteredTestScores.length} test{filteredTestScores.length !== 1 ? 's' : ''}
          </div>
          
          {/* Additional Performance Metrics */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            {(() => {
              const bestRank = Math.min(...filteredTestScores.filter(t => t.rank).map(t => t.rank!));
              const bestPercentile = Math.max(...filteredTestScores.filter(t => t.percentile).map(t => t.percentile!));
              
              return (
                <>
                  {bestRank !== Infinity && (
                    <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                      <div className="text-xs text-gray-600">Best Rank</div>
                      <div className="text-lg font-semibold text-gray-900">{bestRank}</div>
                    </div>
                  )}
                  {bestPercentile !== -Infinity && (
                    <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                      <div className="text-xs text-gray-600">Best Percentile</div>
                      <div className="text-lg font-semibold text-gray-900">{bestPercentile.toFixed(1)}%</div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Subject-wise Scores */}
      {!loading && (
        <div className="space-y-3">
          {filteredTestScores.map((test, index) => {
          const gradeInfo = getGradeInfo(test.percentage);
          
          return (
            <div 
              key={`${test.subject}-${test.testDate}-${index}`}
              className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setSelectedTest(selectedTest?.testDate === test.testDate && selectedTest?.subject === test.subject ? null : test)}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-medium text-gray-900">{test.subject}</div>
                  <div className="text-xs text-gray-500">{test.testType}</div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium text-white ${gradeInfo.bg}`}>
                  {gradeInfo.grade}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                <span>{test.obtainedMarks}/{test.maxMarks}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{test.percentage}%</span>
                  <span className="text-xs text-gray-500">{formatDate(test.testDate)}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className={`${getSubjectColor(test.subject)} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${test.percentage}%` }}
                ></div>
              </div>

              {/* Expanded Details */}
              {selectedTest?.testDate === test.testDate && selectedTest?.subject === test.subject && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Test Date</span>
                    </div>
                    <div className="text-gray-900 font-medium">
                      {formatDate(test.testDate)}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Award className="w-4 h-4" />
                      <span>Test Type</span>
                    </div>
                    <div className="text-gray-900 font-medium">
                      {test.testType}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <BookOpen className="w-4 h-4" />
                      <span>Marks Obtained</span>
                    </div>
                    <div className="text-gray-900 font-medium">
                      {test.obtainedMarks} out of {test.maxMarks}
                    </div>
                    {test.rank && (
                      <>
                        <div className="flex items-center gap-2 text-gray-600">
                          <TrendingUp className="w-4 h-4" />
                          <span>Rank</span>
                        </div>
                        <div className="text-gray-900 font-medium">
                          {test.rank}
                        </div>
                      </>
                    )}
                    {test.percentile && (
                      <>
                        <div className="flex items-center gap-2 text-gray-600">
                          <TrendingUp className="w-4 h-4" />
                          <span>Percentile</span>
                        </div>
                        <div className="text-gray-900 font-medium">
                          {test.percentile}%
                        </div>
                      </>
                    )}
                    {test.totalMarks && (
                      <>
                        <div className="flex items-center gap-2 text-gray-600">
                          <BookOpen className="w-4 h-4" />
                          <span>Total Test Marks</span>
                        </div>
                        <div className="text-gray-900 font-medium">
                          {test.totalMarks}
                        </div>
                      </>
                    )}
                    {test.batch && (
                      <>
                        <div className="flex items-center gap-2 text-gray-600">
                          <BookOpen className="w-4 h-4" />
                          <span>Batch</span>
                        </div>
                        <div className="text-gray-900 font-medium">
                          {test.batch}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Performance Feedback */}
                  <div className="p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="text-sm text-gray-700">
                      {test.percentage >= 90 && "Outstanding performance! Excellent understanding of the subject."}
                      {test.percentage >= 80 && test.percentage < 90 && "Very good performance. Keep up the excellent work."}
                      {test.percentage >= 70 && test.percentage < 80 && "Good performance. There's room for improvement."}
                      {test.percentage >= 60 && test.percentage < 70 && "Average performance. Consider additional study time."}
                      {test.percentage >= 50 && test.percentage < 60 && "Below average. Focus on understanding key concepts."}
                      {test.percentage < 50 && "Needs improvement. Consider seeking additional help."}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        </div>
      )}

      {!loading && filteredTestScores.length === 0 && (
        <div className="text-center py-8">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">
            {dateRange.startDate || dateRange.endDate || subjectFilter 
              ? 'No test scores found for the selected filters.' 
              : 'No test scores available for this student. Please check back later.'
            }
          </p>
          {(dateRange.startDate || dateRange.endDate || subjectFilter) && (
            <button
              onClick={clearFilters}
              className="mt-2 text-sm text-gray-900 font-medium hover:underline"
            >
              Clear filters to check for available scores
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TestScoreCard;