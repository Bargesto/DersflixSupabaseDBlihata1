import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSite } from '../context/SiteContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { themeColor, siteName } = useSite();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const success = await register(formData.email, formData.password);
    if (success) {
      navigate('/');
    } else {
      setError('This email is already registered or there was an error');
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center"
      style={{
        backgroundImage: `url('https://elznljzfbrnpjgolibec.supabase.co/storage/v1/object/public/dersflixlogo/arkaplan_dersflix.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="max-w-md w-full mx-4 relative z-10">
        <div className="bg-black/40 backdrop-blur-md p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Register for {siteName}</h2>
          {error && (
            <div className="bg-red-500/70 backdrop-blur-sm text-white p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-white/90">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/10 backdrop-blur-sm rounded-md px-4 py-2 text-white placeholder-white/50 border border-white/10 focus:border-white/30 transition-colors"
                placeholder="Enter your email address"
              />
            </div>
            <div>
              <label className="block mb-1 text-white/90">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-white/10 backdrop-blur-sm rounded-md px-4 py-2 text-white placeholder-white/50 border border-white/10 focus:border-white/30 transition-colors"
                placeholder="Choose a password (min. 6 characters)"
              />
            </div>
            <div>
              <label className="block mb-1 text-white/90">Confirm Password</label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full bg-white/10 backdrop-blur-sm rounded-md px-4 py-2 text-white placeholder-white/50 border border-white/10 focus:border-white/30 transition-colors"
                placeholder="Confirm your password"
              />
            </div>
            <button
              type="submit"
              style={{ backgroundColor: themeColor }}
              className="w-full text-white py-2 rounded-md hover:opacity-90 transition mt-6"
            >
              Register
            </button>
          </form>
          <p className="mt-4 text-center text-white/70">
            Already have an account?{' '}
            <Link
              to="/login"
              style={{ color: themeColor }}
              className="hover:opacity-90"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;