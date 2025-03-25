"use client"; // ✅ Ensure it's a Client Component

import { useEffect, useState } from "react";
import { fetchMatches } from "@/endpoints/api";

interface Match {
  id: number;
  name: string;
  compatibility: number;
  field: string;
  year: string;
  exam: string;
  profilePic: string; // Assuming profile picture is available
}

const Matching = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Fetch logged-in username from localStorage or auth state
    const storedUsername = localStorage.getItem("username"); // Adjust this based on auth setup
    if (storedUsername) {
      setUsername(storedUsername);
      getMatches(storedUsername);
    }
  }, []);

  const getMatches = async (username: string) => {
    try {
        const data = await fetchMatches(username); // ✅ Now passing username correctly
        setMatches(data.matches);
    } catch (error) {
        console.error("Error fetching matches:", error);
    } finally {
        setLoading(false);
    }
};


  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-500 to-pink-500 p-6 text-white">
      <h1 className="text-3xl font-bold text-center mb-6">Top Matches</h1>

      {loading ? (
        <p className="text-center text-lg">Loading...</p>
      ) : matches.length === 0 ? (
        <p className="text-center text-lg">No matches found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <div key={match.id} className="bg-white text-black p-4 rounded-xl shadow-lg">
              <img src={match.profilePic} alt={match.name} className="w-16 h-16 rounded-full mx-auto mb-2" />
              <h2 className="text-xl font-semibold text-center">{match.name}</h2>
              <p className="text-gray-700 text-center">{match.field}, {match.year}</p>
              <p className="text-gray-700 text-center">Exam: {match.exam}</p>
              <p className="text-center text-lg font-bold text-purple-600">
                Compatibility: {match.compatibility}%
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matching;
