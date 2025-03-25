'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    role: '',
    field: '',
    year: '',
    exam: '',
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [profileSubmitted, setProfileSubmitted] = useState(false);
  const router = useRouter();

  const slides = [
    {
      title: "Personal Information",
      fields: [
        { id: "firstName", label: "First Name", value: user.firstName, onChange: (e) => setUser({ ...user, firstName: e.target.value }) },
        { id: "lastName", label: "Last Name", value: user.lastName, onChange: (e) => setUser({ ...user, lastName: e.target.value }) }
      ]
    },
    {
      title: "Your Status",
      fields: [
        {
          id: "role",
          label: "Are you a student or working professional?",
          type: "dropdown",
          value: user.role,
          onChange: (e) => setUser({ ...user, role: e.target.value }),
          options: ["Student", "Working Professional"]
        }
      ]
    },
    {
      title: user.role === 'Student' ? "Your Study Details" : "Your Work Details",
      fields: user.role === 'Student'
        ? [
            {
              id: "field",
              label: "What field are you studying?",
              type: "dropdown",
              value: user.field,
              onChange: (e) => setUser({ ...user, field: e.target.value }),
              options: ["Engineering", "Commerce", "Science", "Arts", "Other"]
            },
            {
              id: "year",
              label: "Which year are you in?",
              type: "dropdown",
              value: user.year,
              onChange: (e) => setUser({ ...user, year: e.target.value }),
              options: ["1st Year", "2nd Year", "3rd Year", "4th Year", "Other"]
            }
          ]
        : [
            {
              id: "field",
              label: "What field are you working in?",
              type: "dropdown",
              value: user.field,
              onChange: (e) => setUser({ ...user, field: e.target.value }),
              options: ["IT", "Consultancy", "Marketing", "Finance", "Other"]
            }
          ]
    },
    {
      title: "Competitive Exam",
      fields: [
        {
          id: "exam",
          label: "Which competitive exam are you appearing for?",
          type: "dropdown",
          value: user.exam,
          onChange: (e) => setUser({ ...user, exam: e.target.value }),
          options: ["GRE", "CAT", "SAT", "GMAT", "GATE", "NDA"]
        }
      ]
    },
    {
      title: "Review & Create",
      fields: []
    }
  ];

  const handleNext = () => {
    if (validateCurrentSlide()) {
      if (currentSlide < slides.length - 1) {
        setCurrentSlide(currentSlide + 1);
        setDropdownOpen(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      setDropdownOpen(false);
    }
  };

  const handleSubmit = async () => {
    if (validateAllSlides()) {
      try {
        const response = await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });
  
        if (response.ok) {
          localStorage.setItem("profileComplete", "true");
          localStorage.setItem("userProfile", JSON.stringify(user)); // Store profile details
          setProfileSubmitted(true);
          router.push("/home"); // Redirect to home page
        } else {
          console.error("Error saving profile");
        }
      } catch (error) {
        console.error("Failed to connect to backend", error);
      }
    }
  };
  
  

  const validateCurrentSlide = () => {
    const currentFields = slides[currentSlide].fields;
    const newErrors = {};
    currentFields.forEach(field => {
      if (field.type === 'dropdown' && !user[field.id]) {
        newErrors[field.id] = 'This field is required';
      }
      if (field.id === 'firstName' && !user.firstName) {
        newErrors['firstName'] = 'First Name is required';
      }
      if (field.id === 'lastName' && !user.lastName) {
        newErrors['lastName'] = 'Last Name is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAllSlides = () => {
    const allFields = slides.flatMap(slide => slide.fields);
    const newErrors = {};
    allFields.forEach(field => {
      if (field.type === 'dropdown' && !user[field.id]) {
        newErrors[field.id] = 'This field is required';
      }
      if (field.id === 'firstName' && !user.firstName) {
        newErrors['firstName'] = 'First Name is required';
      }
      if (field.id === 'lastName' && !user.lastName) {
        newErrors['lastName'] = 'Last Name is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-8 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500'>
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-xl transform transition hover:scale-105 hover:shadow-2xl">
        <h1 className="text-4xl font-extrabold text-purple-900 mb-8">{slides[currentSlide].title}</h1>

        <div className="space-y-6">
          {slides[currentSlide].fields.map((field) => (
            <div key={field.id} className="mb-5">
              <label htmlFor={field.id} className="block text-lg font-medium text-purple-700 mb-2">
                {field.label}
              </label>
              {field.type === 'dropdown' ? (
                <select
                  id={field.id}
                  value={user[field.id]}
                  onChange={field.onChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select {field.label.toLowerCase()}</option>
                  {field.options.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.id}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  type="text"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={field.label}
                />
              )}
              {errors[field.id] && <p className="text-red-500 text-sm">{errors[field.id]}</p>}
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          {currentSlide > 0 && (
            <button onClick={handlePrevious} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
              Previous
            </button>
          )}
          {currentSlide < slides.length - 1 ? (
            <button onClick={handleNext} className="px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800">
              Next
            </button>
          ) : (
            <button onClick={handleSubmit} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Submit
            </button>
          )}
        </div>

        {profileSubmitted && (
          <button
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full"
            onClick={() => router.push("/profile/view")}
          >
            View Profile
          </button>
        )}
      </div>
    </div>
  );
}
