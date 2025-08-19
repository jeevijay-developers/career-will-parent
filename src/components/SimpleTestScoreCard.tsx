import React, { useState } from 'react';
import { Calendar, BookOpen } from 'lucide-react';

// Interface matching the API response structure
interface TestSubject {
  name: string;
  marks: number;
  _id: string;
}

interface TestRecord {
  _id: string;
  rollNumber: number;
  student: string;
  father: string;
  batch: string;
  subjects: TestSubject[];
  percentile: number;
  total: number;
  rank: number;
  date: string;
  name: string;
}

interface SimpleTestScoreCardProps {
  testScores: TestRecord[];
  loading: boolean;
}

const SimpleTestScoreCard: React.FC<SimpleTestScoreCardProps> = ({ testScores, loading }) => {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get total max marks for a test (using predefined max marks)
  const getMaxMarksForSubject = (subjectName: string): number => {
    const subjectMaxMarks: { [key: string]: number } = {
      'physics': 180,
      'chemistry': 180,
      'biology': 360,
    };
    return subjectMaxMarks[subjectName.toLowerCase()] || 100;
  };
  
  // Get subject color based on subject name for consistent coloring
  const getSubjectColor = (subjectName: string): string => {
    const subjectColors: { [key: string]: string } = {
      'physics': 'bg-blue-500',
      'chemistry': 'bg-purple-500',
      'biology': 'bg-green-500',
      'mathematics': 'bg-indigo-500',
      'english': 'bg-yellow-500',
      'hindi': 'bg-pink-500',
      'social studies': 'bg-orange-500',
      'science': 'bg-teal-500'
    };
    return subjectColors[subjectName.toLowerCase()] || 'bg-gray-500';
  };
  
  // Get performance color based on percentage
  const getPerformanceColor = (percentage: number): string => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Calculate test max marks
  const getTestMaxMarks = (subjects: TestSubject[]): number => {
    return subjects.reduce((total, subject) => total + getMaxMarksForSubject(subject.name), 0);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading test scores...</p>
        </div>
      </div>
    );
  }

  if (!testScores || testScores.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-indigo-900 border-b border-indigo-100 pb-2 mb-4">Test Scores</h3>
        <div className="text-center py-8">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No test scores available for this student. Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-indigo-900 border-b border-indigo-100 pb-2 mb-4">Test Scores</h3>

      {/* Tests Overview */}
      {testScores.length > 0 && (
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-center">
              <div className="text-sm text-blue-600">Tests Taken</div>
              <div className="text-xl font-bold text-blue-700">{testScores.length}</div>
            </div>
            <div className="p-3 bg-green-50 border border-green-100 rounded-lg text-center">
              <div className="text-sm text-green-600">Best Rank</div>
              <div className="text-xl font-bold text-green-700">
                {Math.min(...testScores.map(test => test.rank))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* List of Tests */}
      <div className="space-y-4">
        {testScores.map((test) => (
          <div 
            key={test._id} 
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            {/* Test Header */}
            <div 
              className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedTest === test._id ? 'border-l-4 border-l-blue-500' : ''}`}
              onClick={() => setSelectedTest(selectedTest === test._id ? null : test._id)}
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-900">{test.name}</h4>
                <div className="px-2 py-1 bg-indigo-600 text-white text-xs rounded-full">
                  Rank {test.rank}
                </div>
              </div>
              
              <div className="flex justify-between text-sm mb-3">
                <div className="text-gray-600">
                  <Calendar className="inline-block w-4 h-4 mr-1 text-indigo-500" />
                  {formatDate(test.date)}
                </div>
                <div className="text-gray-600">
                  <span className="font-medium text-indigo-600">{test.percentile.toFixed(1)}%</span> Percentile
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`${getPerformanceColor(test.percentile)} h-2 rounded-full`}
                  style={{ width: `${test.percentile}%` }}
                ></div>
              </div>
            </div>

            {/* Expanded View */}
            {selectedTest === test._id && (
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <h5 className="font-medium text-indigo-700 mb-2">Subject Marks</h5>
                <div className="space-y-3">
                  {test.subjects.map(subject => {
                    const maxMarks = getMaxMarksForSubject(subject.name);
                    const percentage = Math.round((subject.marks / maxMarks) * 100);
                    
                    return (
                      <div key={subject._id}>
                        <div className="flex justify-between text-sm mb-1">
                          <div className="capitalize">{subject.name}</div>
                          <div>
                            <span className="font-medium">{subject.marks}/{maxMarks}</span>
                            <span className="text-gray-600 ml-2">({percentage}%)</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`${getSubjectColor(subject.name)} h-1.5 rounded-full`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Test Summary */}
                <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
                  <div className="text-sm p-2 rounded-lg bg-blue-50">
                    <div className="text-blue-600 mb-1">Total Marks</div>
                    <div className="font-medium text-blue-700">
                      {test.total}/{getTestMaxMarks(test.subjects)}
                    </div>
                  </div>
                  <div className="text-sm p-2 rounded-lg bg-green-50">
                    <div className="text-green-600 mb-1">Percentile</div>
                    <div className="font-medium text-green-700">{test.percentile.toFixed(1)}%</div>
                  </div>
                  {test.batch !== "n/a" && (
                    <div className="text-sm col-span-2">
                      <div className="text-gray-600 mb-1">Batch</div>
                      <div className="font-medium">{test.batch}</div>
                    </div>
                  )}
                  {test.student !== "n/a" && (
                    <div className="text-sm col-span-2">
                      <div className="text-gray-600 mb-1">Student Name</div>
                      <div className="font-medium">{test.student}</div>
                    </div>
                  )}
                  {test.father !== "n/a" && (
                    <div className="text-sm col-span-2">
                      <div className="text-gray-600 mb-1">Father's Name</div>
                      <div className="font-medium">{test.father}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleTestScoreCard;
