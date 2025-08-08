import React, { useEffect, useState } from 'react';
import userManager, { StudentData, ParentData } from '../util/user';

const UserProfile: React.FC = () => {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [parentData, setParentData] = useState<ParentData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is logged in and get their data
    const loggedIn = userManager.isLoggedIn();
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      const student = userManager.getStudentData();
      const parent = userManager.getParentData();
      setStudentData(student);
      setParentData(parent);
    }
  }, []);

  const handleLogout = () => {
    userManager.clearUserSession();
    setIsLoggedIn(false);
    setStudentData(null);
    setParentData(null);
  };

  if (!isLoggedIn) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">User Profile</h2>
        <p>Please login to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Profile</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {studentData && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Student Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Name:</strong> {studentData.name}</p>
              <p><strong>Roll No:</strong> {studentData.rollNo}</p>
              <p><strong>Class:</strong> {studentData.class}</p>
              <p><strong>Mobile:</strong> {studentData.mobileNumber}</p>
              <p><strong>Email:</strong> {studentData.email}</p>
            </div>
            <div>
              <p><strong>Gender:</strong> {studentData.gender}</p>
              <p><strong>Category:</strong> {studentData.category}</p>
              <p><strong>DOB:</strong> {new Date(studentData.DOB).toLocaleDateString()}</p>
              <p><strong>T-Shirt Size:</strong> {studentData.tShirtSize}</p>
              <p><strong>Medium:</strong> {studentData.medium}</p>
            </div>
          </div>
          
          {studentData.image && (
            <div className="mt-4">
              <p><strong>Photo:</strong></p>
              <img
                src={studentData.image.url}
                alt="Student"
                className="w-24 h-24 rounded-full object-cover mt-2"
              />
            </div>
          )}
        </div>
      )}

      {parentData && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Parent Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Father's Name:</strong> {parentData.fatherName}</p>
              <p><strong>Mother's Name:</strong> {parentData.motherName}</p>
            </div>
            <div>
              <p><strong>Contact:</strong> {parentData.parentContact}</p>
              <p><strong>Email:</strong> {parentData.email}</p>
              <p><strong>Occupation:</strong> {parentData.occupation}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 bg-gray-100 rounded-lg p-4">
        <h4 className="font-semibold mb-2">Session Information</h4>
        <pre className="text-sm">
          {JSON.stringify(userManager.getSessionInfo(), null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default UserProfile;
