import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSite } from '../context/SiteContext';
import { extractVideoInfo } from '../utils/videoHelpers';
import { DatabaseService } from '../services/database';

const AddVideo = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { themeColor } = useSite();
  const [formData, setFormData] = useState({
    title: '',
    videoUrl: '',
    class: '',
    subject: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setError('');
    setLoading(true);
    
    const videoInfo = extractVideoInfo(formData.videoUrl);
    if (!videoInfo) {
      setError('Please enter a valid video URL from YouTube, Vimeo, or Dailymotion');
      setLoading(false);
      return;
    }

    try {
      await DatabaseService.addVideo({
        title: formData.title,
        video_url: formData.videoUrl,
        platform: videoInfo.platform,
        video_id: videoInfo.videoId,
        class: formData.class,
        subject: formData.subject,
        user_id: user.id
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error adding video:', error);
      setError('Failed to add video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-black/40 backdrop-blur-md rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-white">Add New Video</h2>
        {error && (
          <div className="bg-red-500/70 backdrop-blur-sm text-white p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-white/90">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-white/10 backdrop-blur-sm rounded-md px-4 py-2 text-white placeholder-white/50 border border-white/10 focus:border-white/30 transition-colors"
              placeholder="Enter video title"
            />
          </div>
          <div>
            <label className="block mb-1 text-white/90">Video URL</label>
            <input
              type="url"
              required
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              className="w-full bg-white/10 backdrop-blur-sm rounded-md px-4 py-2 text-white placeholder-white/50 border border-white/10 focus:border-white/30 transition-colors"
              placeholder="Enter YouTube, Vimeo, or Dailymotion URL"
            />
          </div>
          <div>
            <label className="block mb-1 text-white/90">Class</label>
            <input
              type="text"
              required
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              className="w-full bg-white/10 backdrop-blur-sm rounded-md px-4 py-2 text-white placeholder-white/50 border border-white/10 focus:border-white/30 transition-colors"
              placeholder="9, 10, 11, etc."
            />
          </div>
          <div>
            <label className="block mb-1 text-white/90">Subject</label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full bg-white/10 backdrop-blur-sm rounded-md px-4 py-2 text-white placeholder-white/50 border border-white/10 focus:border-white/30 transition-colors"
              placeholder="Mathematics, Physics, etc."
            />
          </div>
          <button
            type="submit"
            style={{ backgroundColor: themeColor }}
            className="w-full text-white py-2 rounded-md hover:opacity-90 transition mt-6 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? 'Adding Video...' : 'Add Video'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVideo;