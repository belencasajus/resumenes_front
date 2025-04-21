import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserCircleIcon, TrophyIcon } from '@heroicons/react/24/solid';
import { books } from '../data/mockData';

export default function ProfileView() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const username = localStorage.getItem('username') || 'User';
  const userRole = localStorage.getItem('userRole') || 'user';
  const [profileImage, setProfileImage] = useState(null);
  const [favorites] = useState(books.slice(0, 2));
  const [currentlyReading] = useState([
    { ...books[0], progress: 75 },
    { ...books[1], progress: 30 }
  ]);

  const trophies = [
    {
      id: 1,
      name: "Fantasy Enthusiast",
      description: "Read 3 fantasy books",
      icon: "🏰",
      progress: 1,
      total: 3,
      unlocked: false
    },
    {
      id: 2,
      name: "Consistent Reader",
      description: "Maintain a 7-day reading streak",
      icon: "🔥",
      progress: 5,
      total: 7,
      unlocked: false
    },
    {
      id: 3,
      name: "Review Master",
      description: "Write 10 book reviews",
      icon: "✍️",
      progress: 8,
      total: 10,
      unlocked: false
    },
    {
      id: 4,
      name: "Genre Explorer",
      description: "Read books from 5 different genres",
      icon: "🌎",
      progress: 3,
      total: 5,
      unlocked: false
    }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    navigate('/');
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
            ← Back to Home
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex gap-8">
            {/* Left Section (2/5) */}
            <div className="w-2/5 space-y-6">
              {/* Profile Image */}
              <div className="relative w-48 h-48 mx-auto">
                <label htmlFor="profile-image" className="cursor-pointer block">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="w-full h-full text-gray-300" />
                  )}
                  <input
                    type="file"
                    id="profile-image"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              {/* User Info */}
              <div className="space-y-3">
                <h2 className="text-xl font-semibold">User Information</h2>
                <div className="space-y-2">
                  <p className="text-gray-600">Username: {username}</p>
                  <p className="text-gray-600">Role: {userRole}</p>
                  <p className="text-gray-600">Email: admin@example.com</p>
                </div>
              </div>

              {/* Premium Button */}
              <button className="w-full bg-yellow-400 text-gray-900 px-4 py-2 rounded-md hover:bg-yellow-500 transition font-medium">
                Upgrade to Premium
              </button>

              {/* Trophies Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <TrophyIcon className="h-6 w-6 text-yellow-400 mr-2" />
                  Achievements
                </h2>
                <div className="space-y-4">
                  {trophies.map(trophy => (
                    <div key={trophy.id} className="bg-white p-3 rounded-md shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">{trophy.icon}</span>
                          <div>
                            <h3 className="font-medium">{trophy.name}</h3>
                            <p className="text-sm text-gray-600">{trophy.description}</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium">
                          {trophy.progress}/{trophy.total}
                        </span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full transition-all"
                          style={{ width: `${(trophy.progress / trophy.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>

            {/* Right Section (3/5) */}
            <div className="w-3/5 space-y-8">
              {/* Reading Stats */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Reading Stats</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-gray-600">Books Read</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold">8</p>
                    <p className="text-gray-600">Reviews</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold">4.5</p>
                    <p className="text-gray-600">Avg Rating</p>
                  </div>
                </div>
              </div>

              {/* Favorite Books */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Favorite Books</h2>
                <div className="space-y-4">
                  {favorites.map(book => (
                    <div key={book.id} className="flex gap-4 items-center">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-16 h-24 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-medium">{book.title}</h3>
                        <p className="text-gray-600">{book.author}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Currently Reading */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Currently Reading</h2>
                <div className="space-y-4">
                  {currentlyReading.map(book => (
                    <div key={book.id} className="flex gap-4 items-center">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-16 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{book.title}</h3>
                        <p className="text-gray-600">{book.author}</p>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{ width: `${book.progress}%` }}
                            />
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{book.progress}% complete</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}