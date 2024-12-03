import { useState, useEffect } from 'react';
import { Video } from '../types';
import VideoGrid from './VideoGrid';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { DatabaseService } from '../services/database';

const Dashboard = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideos = async () => {
      if (user) {
        try {
          const data = await DatabaseService.getVideos(user.id);
          setVideos(data || []);
        } catch (error) {
          console.error('Error loading videos:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setVideos([]);
        setLoading(false);
      }
    };

    loadVideos();
  }, [user]);

  const classes = ['all', ...new Set(videos.map(video => video.class))];
  const subjects = ['all', ...new Set(videos.map(video => video.subject))];

  const filteredVideos = videos.filter(video => {
    const matchesClass = selectedClass === 'all' || video.class === selectedClass;
    const matchesSubject = selectedSubject === 'all' || video.subject === selectedSubject;
    return matchesClass && matchesSubject;
  });

  if (!user) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="https://elznljzfbrnpjgolibec.supabase.co/storage/v1/object/public/dersflixlogo/dersflix_intro.mp4"
          onLoadedMetadata={(e) => {
            const videoElement = e.target as HTMLVideoElement;
            videoElement.playbackRate = 0.85;
          }}
        />
        
        <div className="absolute inset-0 bg-black/50" />
        
        <div className="relative z-10 flex flex-col items-center justify-center space-y-6 text-center px-4">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white">Welcome to the Video Platform</h2>
            <p className="text-xl text-gray-200">Please login to view and manage your videos</p>
          </div>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="px-8 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-8 py-3 border-2 border-red-600 text-red-600 rounded-md hover:bg-red-600 hover:text-white transition font-medium"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-xl text-gray-400">Loading videos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {videos.length === 0 ? (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold mb-2">No Videos Found</h2>
          <p className="text-gray-400 mb-4">You haven't added any videos yet.</p>
          <Link
            to="/add"
            className="inline-block px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Add Your First Video
          </Link>
        </div>
      ) : (
        <>
          <div className="flex gap-4">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-gray-800/90 backdrop-blur-sm text-white px-4 py-2 rounded-md"
            >
              {classes.map(c => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Classes' : `Class ${c}`}
                </option>
              ))}
            </select>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-gray-800/90 backdrop-blur-sm text-white px-4 py-2 rounded-md"
            >
              {subjects.map(s => (
                <option key={s} value={s}>
                  {s === 'all' ? 'All Subjects' : s}
                </option>
              ))}
            </select>
          </div>
          <VideoGrid videos={filteredVideos} />
        </>
      )}
    </div>
  );
};

export default Dashboard;