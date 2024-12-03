import { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';

const Settings = () => {
  const { siteName, themeColor, setSiteName, setThemeColor } = useSite();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    siteName: siteName,
    themeColor: themeColor,
  });

  const themeColors = [
    { name: 'Red', value: '#DC2626' },
    { name: 'Blue', value: '#2563EB' },
    { name: 'Green', value: '#16A34A' },
    { name: 'Purple', value: '#9333EA' },
    { name: 'Orange', value: '#EA580C' },
    { name: 'Pink', value: '#DB2777' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSiteName(formData.siteName);
    setThemeColor(formData.themeColor);
    navigate('/');
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6">Site Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium">Site Name</label>
          <input
            type="text"
            value={formData.siteName}
            onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
            className="w-full bg-gray-800 rounded-md px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Theme Color</label>
          <div className="grid grid-cols-3 gap-3">
            {themeColors.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setFormData({ ...formData, themeColor: color.value })}
                className={`p-4 rounded-md flex items-center justify-center transition-all ${
                  formData.themeColor === color.value
                    ? 'ring-2 ring-white'
                    : 'hover:ring-2 hover:ring-gray-400'
                }`}
                style={{ backgroundColor: color.value }}
              >
                <span className="text-white font-medium">{color.name}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          style={{ backgroundColor: formData.themeColor }}
          className="w-full text-white py-2 rounded-md hover:opacity-90 transition flex items-center justify-center gap-2"
        >
          <Save size={20} />
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default Settings;