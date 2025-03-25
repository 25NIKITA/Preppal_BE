'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ViewProfilePage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<{ firstName?: string; lastName?: string; role?: string; field?: string; year?: string; exam?: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('userProfile');
    if (storedUser) {
      setUserProfile(JSON.parse(storedUser));
    }
  }, []);

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        <div className="text-white text-2xl font-bold">No profile data available</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="w-full max-w-lg p-8 bg-white bg-opacity-90 rounded-lg shadow-xl transform transition hover:scale-105 hover:shadow-2xl">
        <h1 className="text-4xl font-extrabold text-purple-900 mb-6 text-center">Profile Details</h1>
        
        <div className="space-y-5">
          <div className="text-lg font-medium">
            <span className="text-purple-700">First Name:</span> {userProfile.firstName}
          </div>
          <div className="text-lg font-medium">
            <span className="text-purple-700">Last Name:</span> {userProfile.lastName}
          </div>
          <div className="text-lg font-medium">
            <span className="text-purple-700">Role:</span> {userProfile.role}
          </div>
          {userProfile.role === "Student" && (
            <>
              <div className="text-lg font-medium">
                <span className="text-purple-700">Field of Study:</span> {userProfile.field}
              </div>
              <div className="text-lg font-medium">
                <span className="text-purple-700">Year:</span> {userProfile.year}
              </div>
            </>
          )}
          {userProfile.role === "Working Professional" && (
            <div className="text-lg font-medium">
              <span className="text-purple-700">Field of Work:</span> {userProfile.field}
            </div>
          )}
          <div className="text-lg font-medium">
            <span className="text-purple-700">Competitive Exam:</span> {userProfile.exam}
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button 
            onClick={() => router.push('/home')} 
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Back to Home
          </button>

         
        </div>
      </div>
    </div>
  );
}
