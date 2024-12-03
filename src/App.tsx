import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';
import { SiteProvider } from './context/SiteContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import AddVideo from './components/AddVideo';
import VideoPlayer from './components/VideoPlayer';
import Settings from './components/Settings';
import Login from './components/Login';
import Register from './components/Register';
import './index.css';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
}

function AppContent() {
  const { user } = useAuth();

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={user ? {
        backgroundImage: `url('https://elznljzfbrnpjgolibec.supabase.co/storage/v1/object/public/dersflixlogo/arkaplan_kullanici.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      } : {}}
    >
      {/* Dark overlay when user is logged in - increased opacity from 40% to 60% */}
      {user && <div className="fixed inset-0 bg-black/60" />}

      {/* Main content */}
      <div className="relative z-10 flex-1">
        <Navbar />
        <main className="container mx-auto px-4 pt-20">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/add"
              element={
                <ProtectedRoute>
                  <AddVideo />
                </ProtectedRoute>
              }
            />
            <Route path="/watch/:videoId" element={<VideoPlayer />} />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <SiteProvider>
        <Router>
          <AppContent />
        </Router>
      </SiteProvider>
    </AuthProvider>
  );
}

export default App;