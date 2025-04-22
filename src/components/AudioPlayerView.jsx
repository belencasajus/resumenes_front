import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  PlayIcon, 
  PauseIcon, 
  BackwardIcon, 
  ForwardIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/solid';

export default function AudioPlayerView() {
  const { id } = useParams();
  const [book, setBook] = useState(null); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');

  useEffect(() => {
    fetch(`http://localhost:8080/resumenes/${id}`, {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener el resumen');
        return res.json();
      })
      .then(data => setBook(data))
      .catch(err => console.error(err));
  }, [id]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            clearInterval(interval);
            return 100;
          }
          return prev + 0.5;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  useEffect(() => {
    // Simulate loading audio duration
    setDuration('15:30');
  }, []);

  useEffect(() => {
    // Update current time based on progress
    const totalSeconds = (15 * 60 + 30) * (progress / 100);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    setCurrentTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
  }, [progress]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
  };

  const handleForward = () => {
    setProgress(prev => Math.min(prev + 5, 100));
  };

  const handleBackward = () => {
    setProgress(prev => Math.max(prev - 5, 0));
  };

  if (!book) {
    return <div className="text-white text-center mt-10">Cargando resumen...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link
          to={`/book/${id}`}
          className="inline-flex items-center text-gray-300 hover:text-white mb-8"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Volver 
        </Link>

        <div className="text-center mb-12">
          <img
            src={book.imagen}
            alt={book.titulo}
            className="w-64 h-96 object-cover rounded-lg shadow-2xl mx-auto mb-8"
          />
          <h1 className="text-3xl font-bold mb-2">{book.titulo}</h1>
          <p className="text-gray-400 text-lg">{book.autor}</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
          {/* Progress Bar */}
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>{currentTime}</span>
              <span>{duration}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-8">
            <button
              onClick={handleBackward}
              className="p-2 hover:text-indigo-400 transition"
            >
              <BackwardIcon className="h-8 w-8" />
            </button>

            <button
              onClick={handlePlayPause}
              className="bg-indigo-600 p-4 rounded-full hover:bg-indigo-700 transition transform hover:scale-105"
            >
              {isPlaying ? (
                <PauseIcon className="h-8 w-8" />
              ) : (
                <PlayIcon className="h-8 w-8" />
              )}
            </button>

            <button
              onClick={handleForward}
              className="p-2 hover:text-indigo-400 transition"
            >
              <ForwardIcon className="h-8 w-8" />
            </button>
          </div>
        </div>
        
        {/* Speed Control */}
        <div className="mt-6 flex justify-center">
          <select
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="0.75">0.75x</option>
            <option value="1.0" selected>1.0x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="2.0">2.0x</option>
          </select>
        </div>
      </div>
    </div>
  );
}