'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResourcesPage() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [examType, setExamType] = useState('');
  const [resourceTopic, setResourceTopic] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadedResources, setUploadedResources] = useState<{ name: string; topic: string; exam: string; url: string }[]>([]);
  const [communityUploads] = useState([
    { name: 'John Doe - GRE Notes', topic: 'Quantitative', exam: 'GRE', url: '#' },
    { name: 'Jane Smith - CAT PDFs', topic: 'Verbal Ability', exam: 'CAT', url: '#' },
    { name: 'Alex Brown - GATE Concepts', topic: 'Computer Science', exam: 'GATE', url: '#' }
  ]);

  const exams = ['GRE', 'CAT', 'GATE', 'UPSC', 'JEE', 'NEET', 'SSC', 'Banking', 'Others'];
  const topics: { [key: string]: string[] } = {
    GRE: ['Quantitative', 'Verbal Reasoning', 'Analytical Writing'],
    CAT: ['Quantitative Aptitude', 'Verbal Ability', 'Data Interpretation'],
    GATE: ['Computer Science', 'Electronics', 'Mechanical'],
    UPSC: ['General Studies', 'Current Affairs', 'Optional Subjects'],
    JEE: ['Physics', 'Chemistry', 'Mathematics'],
    NEET: ['Biology', 'Chemistry', 'Physics'],
    SSC: ['Reasoning', 'Mathematics', 'General Awareness'],
    Banking: ['Reasoning', 'Quantitative Aptitude', 'General Awareness'],
    Others: ['General Knowledge', 'Aptitude', 'Miscellaneous']
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('profileComplete');
    router.push('/login');
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeDropdown = () => setDropdownOpen(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !examType || !resourceTopic) return;
    setUploading(true);

    setTimeout(() => {
      setUploading(false);
      setUploadedResources([
        ...uploadedResources,
        { name: selectedFile.name, topic: resourceTopic, exam: examType, url: URL.createObjectURL(selectedFile) }
      ]);
      setSelectedFile(null);
      setExamType('');
      setResourceTopic('');
      alert('File uploaded successfully!');
    }, 2000);
  };

  const handleDelete = (index: number) => {
    setUploadedResources(uploadedResources.filter((_, i) => i !== index));
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-br from-teal-400 via-blue-500 to-indigo-600 text-white flex flex-col">
        <div className="p-4 bg-gradient-to-r from-teal-500 to-blue-600 flex items-center justify-center">
          <h1 className="text-3xl font-extrabold">PREPPAL</h1>
        </div>
        <nav className="flex-1 mt-6">
          <ul className="space-y-2">
            <li><button onClick={() => router.push('/home')} className="p-3 hover:bg-indigo-700 w-full">Home</button></li>
            <li><button onClick={() => router.push('/study-rooms')} className="p-3 hover:bg-indigo-700 w-full">Study Rooms</button></li>
            <li><button onClick={() => router.push('/community')} className="p-3 hover:bg-indigo-700 w-full">Community</button></li>
            <li><button onClick={() => router.push('/resources')} className="p-3 hover:bg-indigo-700 w-full">Resources</button></li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        <header className="w-full flex items-center justify-between p-4 bg-white bg-opacity-70 shadow-md">
          <div className="text-2xl font-extrabold text-gray-800">Resources</div>
          <div className="relative">
            <img
              src="/profile-pic.jpeg"
              alt="Profile Icon"
              className="w-14 h-14 rounded-full cursor-pointer border-4 border-gradient-to-r from-purple-400 to-pink-500"
              onClick={toggleDropdown}
            />
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-xl z-50">
                <button onClick={() => { router.push('/profile'); closeDropdown(); }} className="w-full text-left px-4 py-3 hover:bg-gray-100">View Profile</button>
                <button onClick={handleLogout} className="w-full text-left px-4 py-3 hover:bg-gray-100">Logout</button>
              </div>
            )}
          </div>
        </header>

        {/* Upload Section */}
        <main className="p-6">
          <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold text-gray-800">Upload Resources</h2>
            <div className="mt-4">
              <select className="border p-2 rounded w-full" value={examType} onChange={(e) => setExamType(e.target.value)}>
                <option value="">Select Exam</option>
                {exams.map(exam => <option key={exam} value={exam}>{exam}</option>)}
              </select>
              <select className="border p-2 rounded w-full mt-2" value={resourceTopic} onChange={(e) => setResourceTopic(e.target.value)}>
                <option value="">Select Resource Topic</option>
                {examType && topics[examType]?.map(topic => <option key={topic} value={topic}>{topic}</option>)}
              </select>
              <input type="file" className="border p-2 mt-2 w-full" onChange={handleFileChange} />
              <button onClick={handleUpload} disabled={!selectedFile || uploading} className="bg-blue-500 text-white p-2 rounded mt-2 w-full">
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>

          {/* View Section */}
          <div className="mt-6">
            <h2 className="text-xl font-bold text-gray-800">View Resources</h2>
            {Object.keys(topics).map(exam => (
              uploadedResources.some(res => res.exam === exam) && (
                <div key={exam} className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-800">{exam}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                    {uploadedResources.filter(res => res.exam === exam).map((resource, index) => (
                      <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-center">
                        <a href={resource.url} className="text-blue-500 hover:underline">{resource.name} - {resource.topic}</a>
                        <button onClick={() => handleDelete(index)} className="text-red-500">Delete</button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
