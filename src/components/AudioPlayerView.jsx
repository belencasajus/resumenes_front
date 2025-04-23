import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlayIcon, PauseIcon, BackwardIcon, ForwardIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';

export default function AudioPlayerView() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [speed, setSpeed] = useState(1); 
  const audioRef = useRef(null);

  useEffect(() => {
    fetch(`http://localhost:8080/resumenes/${id}`, { credentials: 'include' })
      .then(r => r.json()).then(setBook).catch(console.error);
  }, [id]);

  useEffect(() => {
    if (!book) return;
    if (audioRef.current) audioRef.current.pause();     // limpiar anterior

    const audio = new Audio(`http://localhost:8080${book.audio}`);
    audioRef.current = audio;

    const fmt = s => {
      const m = Math.floor(s / 60);
      const ss = Math.floor(s % 60).toString().padStart(2, '0');
      return `${m}:${ss}`;
    };

    const onLoaded   = () => setDuration(fmt(audio.duration));
    const onTime     = () => {
      setCurrentTime(fmt(audio.currentTime));
      setProgress((audio.currentTime / audio.duration) * 100);
    };
    const onEnded    = () => setIsPlaying(false);

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate',     onTime);
    audio.addEventListener('ended',          onEnded);

    return () => {
      audio.pause();                                     
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnded);
    };
  }, [book]);

  const handlePlayPause = () => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) { a.pause(); setIsPlaying(false); }
    else { a.play(); setIsPlaying(true); }
  };
  const handleSeek = e => {
    const a = audioRef.current;
    if (a && a.duration) a.currentTime = (e.target.value / 100) * a.duration;
  };
  const jump = sec => {
    const a = audioRef.current;
    if (a) a.currentTime = Math.min(Math.max(0, a.currentTime + sec), a.duration);
  };

  /* velocidad */
  const handleSpeed = e => {                         
    const rate = parseFloat(e.target.value);
    setSpeed(rate);
    if (audioRef.current) audioRef.current.playbackRate = rate;
  };

  if (!book) return <div className="text-white text-center mt-10">Cargando…</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* volver */}
        <Link to={`/book/${id}`} className="inline-flex items-center text-gray-300 hover:text-white mb-8">
          <ArrowLeftIcon className="h-5 w-5 mr-2" /> Volver
        </Link>

        {/* portada + datos */}
        <div className="text-center mb-12">
          <img src={`http://localhost:8080${book.imagen}`} alt={book.titulo}
               className="w-64 h-96 object-cover rounded-lg shadow-2xl mx-auto mb-8" />
          <h1 className="text-3xl font-bold mb-2">{book.titulo}</h1>
          <p className="text-gray-400 text-lg">{book.autor}</p>
        </div>

        {/* reproductor */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-xl">

          {/* barra progreso */}
          <input type="range" min="0" max="100" value={progress}
                 onChange={handleSeek}
                 className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
          <div className="flex justify-between text-sm text-gray-400 mt-1">
            <span>{currentTime}</span><span>{duration}</span>
          </div>

          {/* botones */}
          <div className="flex items-center justify-center space-x-8 mt-6">
            <button onClick={() => jump(-10)} className="p-2 hover:text-indigo-400"><BackwardIcon className="h-8 w-8"/></button>
            <button onClick={handlePlayPause}
                    className="bg-indigo-600 p-4 rounded-full hover:bg-indigo-700 transition transform hover:scale-105">
              {isPlaying ? <PauseIcon className="h-8 w-8"/> : <PlayIcon className="h-8 w-8"/>}
            </button>
            <button onClick={() => jump(10)} className="p-2 hover:text-indigo-400"><ForwardIcon className="h-8 w-8"/></button>
          </div>
        </div>

        {/* velocidad */}
        <div className="mt-6 flex justify-center">
          <select value={speed} onChange={handleSpeed}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="0.75">0.75×</option>
            <option value="1">1.0×</option>
            <option value="1.25">1.25×</option>
            <option value="1.5">1.5×</option>
            <option value="2">2.0×</option>
          </select>
        </div>
      </div>
    </div>
  );
}
