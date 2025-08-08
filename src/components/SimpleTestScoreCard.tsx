import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

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
      'mathematics': 100
    };
    return subjectMaxMarks[subjectName.toLowerCase()] || 100;
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
        <div className="text-center py-8">
          <p className="text-gray-600">No test scores available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Scores</h3>

      {/* Tests Overview */}
      {testScores.length > 0 && (
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <div className="text-sm text-gray-600">Tests Taken</div>
              <div className="text-xl font-bold text-gray-900">{testScores.length}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <div className="text-sm text-gray-600">Best Rank</div>
              <div className="text-xl font-bold text-gray-900">
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
              className="p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => setSelectedTest(selectedTest === test._id ? null : test._id)}
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-900">{test.name}</h4>
                <div className="px-2 py-1 bg-gray-900 text-white text-xs rounded">
                  Rank {test.rank}
                </div>
              </div>
              
              <div className="flex justify-between text-sm mb-3">
                <div className="text-gray-600">
                  <Calendar className="inline-block w-4 h-4 mr-1" />
                  {formatDate(test.date)}
                </div>
                <div className="text-gray-600">
                  <span className="font-medium">{test.percentile.toFixed(1)}%</span> Percentile
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gray-900 h-2 rounded-full"
                  style={{ width: `${test.percentile}%` }}
                ></div>
              </div>
            </div>

            {/* Expanded View */}
            {selectedTest === test._id && (
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <h5 className="font-medium text-gray-900 mb-2">Subject Marks</h5>
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
                            className="bg-gray-700 h-1.5 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Test Summary */}
                <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
                  <div className="text-sm">
                    <div className="text-gray-600 mb-1">Total Marks</div>
                    <div className="font-medium">
                      {test.total}/{getTestMaxMarks(test.subjects)}
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="text-gray-600 mb-1">Percentile</div>
                    <div className="font-medium">{test.percentile.toFixed(1)}%</div>
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
