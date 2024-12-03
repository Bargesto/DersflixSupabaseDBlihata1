import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { Video } from '../types';
import { ArrowLeft, Star, CheckCircle, Plus, X, Check, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';
import { DatabaseService } from '../services/database';

const VideoPlayer = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState<Video | null>(null);
  const { user } = useAuth();
  const [newTodo, setNewTodo] = useState('');
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideo = async () => {
      if (!videoId) return;

      try {
        const data = await DatabaseService.getVideo(videoId);
        if (data && (!user || user.id !== data.user_id)) {
          navigate('/');
          return;
        }
        setVideo(data);
      } catch (error) {
        console.error('Error loading video:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadVideo();
  }, [videoId, user, navigate]);

  const updateVideoStatus = async (updates: Partial<Video>) => {
    if (!video || !user) return;

    try {
      const updatedVideo = await DatabaseService.updateVideo(video.id, updates);
      setVideo(updatedVideo);
    } catch (error) {
      console.error('Error updating video:', error);
    }
  };

  const toggleWatched = () => {
    if (!user || !video) return;
    updateVideoStatus({ watched: !video.watched });
  };

  const toggleFavorite = () => {
    if (!user || !video) return;
    updateVideoStatus({ favorite: !video.favorite });
  };

  const handleDelete = async () => {
    if (!video || !user || user.id !== video.user_id) return;
    
    try {
      await DatabaseService.deleteVideo(video.id);
      navigate('/');
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!video || !user || !newTodo.trim()) return;

    try {
      const newTodoItem = await DatabaseService.addTodo(video.id, newTodo.trim());
      setVideo({
        ...video,
        todos: [...(video.todos ?? []), newTodoItem]
      });
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (todoId: string) => {
    if (!video || !user) return;

    try {
      const todo = video.todos?.find(t => t.id === todoId);
      if (!todo) return;

      await DatabaseService.updateTodo(todoId, { completed: !todo.completed });
      setVideo({
        ...video,
        todos: video.todos?.map(t =>
          t.id === todoId ? { ...t, completed: !t.completed } : t
        ) ?? []
      });
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (todoId: string) => {
    if (!video || !user) return;

    try {
      await DatabaseService.deleteTodo(todoId);
      setVideo({
        ...video,
        todos: video.todos?.filter(todo => todo.id !== todoId) ?? []
      });
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-xl text-gray-400">Loading video...</div>
      </div>
    );
  }

  if (!video || !user) {
    return null;
  }

  const renderVideoPlayer = () => {
    if (video.platform === 'embed') {
      return (
        <div 
          className="w-full h-full"
          dangerouslySetInnerHTML={{ 
            __html: video.video_id.includes('<iframe') 
              ? video.video_id 
              : `<iframe src="${video.video_id}" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>`
          }}
        />
      );
    }

    return (
      <ReactPlayer
        url={video.video_url}
        width="100%"
        height="100%"
        controls
        playing
      />
    );
  };

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="flex items-center gap-2 mb-4 text-gray-400 hover:text-white">
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>
        <div className="aspect-video mb-4 bg-gray-900">
          {renderVideoPlayer()}
        </div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
            <p className="text-gray-400">
              Class {video.class} - {video.subject}
            </p>
            <span className="text-sm text-gray-500 uppercase mt-2 inline-block">
              {video.platform}
            </span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={toggleWatched}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
                video.watched
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <CheckCircle size={20} />
              {video.watched ? 'Watched' : 'Mark as Watched'}
            </button>
            <button
              onClick={toggleFavorite}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
                video.favorite
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <Star
                size={20}
                fill={video.favorite ? 'currentColor' : 'none'}
              />
              {video.favorite ? 'Favorited' : 'Add to Favorites'}
            </button>
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
              title="Delete Video"
            >
              <Trash2 size={20} />
              Delete
            </button>
          </div>
        </div>

        {/* Notes Section */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Notes</h2>
          
          <form onSubmit={addTodo} className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new note..."
              className="flex-1 bg-gray-700 rounded-md px-4 py-2"
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition flex items-center gap-2"
            >
              <Plus size={20} />
              Add
            </button>
          </form>

          <div className="space-y-2">
            {video.todos?.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center gap-2 bg-gray-700 p-3 rounded-md group"
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    todo.completed
                      ? 'bg-green-600 border-green-600'
                      : 'border-gray-400 hover:border-green-600'
                  }`}
                >
                  {todo.completed && <Check size={14} />}
                </button>
                <span
                  className={`flex-1 ${
                    todo.completed ? 'line-through text-gray-400' : ''
                  }`}
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
            {(!video.todos || video.todos.length === 0) && (
              <p className="text-gray-400 text-center py-4">
                No notes yet. Add your first note above!
              </p>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Video"
        message="Are you sure you want to delete this video?"
      />
    </>
  );
};

export default VideoPlayer;