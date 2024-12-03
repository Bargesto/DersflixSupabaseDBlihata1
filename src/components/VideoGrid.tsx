import { Link } from 'react-router-dom';
import { Video } from '../types';
import { getThumbnailUrl } from '../utils/videoHelpers';
import { Star, CheckCircle, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import Modal from './Modal';

interface VideoGridProps {
  videos: Video[];
}

const VideoGrid = ({ videos }: VideoGridProps) => {
  const { user } = useAuth();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null);
  const [failedThumbnails, setFailedThumbnails] = useState<Set<string>>(new Set());

  const handleDeleteClick = (e: React.MouseEvent, videoId: string) => {
    e.preventDefault(); // Prevent navigation
    setVideoToDelete(videoId);
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (!videoToDelete) return;
    
    const videos = JSON.parse(localStorage.getItem('videos') || '[]');
    const updatedVideos = videos.filter((v: Video) => v.id !== videoToDelete);
    localStorage.setItem('videos', JSON.stringify(updatedVideos));
    
    // Force a reload to refresh the video list
    window.location.reload();
  };

  const handleThumbnailError = (videoId: string) => {
    setFailedThumbnails(prev => new Set(prev).add(videoId));
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video) => (
          <Link
            key={video.id}
            to={`/watch/${video.id}`}
            className="bg-gray-800 rounded-md overflow-hidden hover:scale-105 transition group relative"
          >
            <div className="relative">
              <img
                src={failedThumbnails.has(video.id) 
                  ? 'https://elznljzfbrnpjgolibec.supabase.co/storage/v1/object/public/dersflixlogo/video-thumbnail-default.jpg'
                  : getThumbnailUrl(video.platform, video.video_id)}
                alt={video.title}
                className="w-full aspect-video object-cover"
                onError={() => handleThumbnailError(video.id)}
              />
              <div className="absolute top-2 right-2 flex gap-2">
                {video.watched && (
                  <div className="bg-green-600 p-1 rounded-full">
                    <CheckCircle size={16} />
                  </div>
                )}
                {video.favorite && (
                  <div className="bg-yellow-600 p-1 rounded-full">
                    <Star size={16} fill="currentColor" />
                  </div>
                )}
              </div>
              {user && user.id === video.user_id && (
                <button
                  onClick={(e) => handleDeleteClick(e, video.id)}
                  className="absolute top-2 left-2 bg-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Videoyu sil"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg">{video.title}</h3>
              <p className="text-gray-400 text-sm">
                Class {video.class} - {video.subject}
              </p>
              <span className="text-xs text-gray-500 uppercase mt-2 inline-block">
                {video.platform}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setVideoToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Videoyu Sil"
        message="Bu videoyu silmek istediğinizden emin misiniz?"
      />
    </>
  );
};

export default VideoGrid;