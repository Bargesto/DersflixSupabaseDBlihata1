import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DatabaseService } from '../services/database';

interface SiteContextType {
  siteName: string;
  themeColor: string;
  setSiteName: (name: string) => void;
  setThemeColor: (color: string) => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [siteName, setSiteName] = useState('DERSFLIX');
  const [themeColor, setThemeColor] = useState('#DC2626');

  useEffect(() => {
    // Load site settings from Supabase
    const loadSiteSettings = async () => {
      try {
        const settings = await DatabaseService.getSiteSettings();
        if (settings) {
          setSiteName(settings.site_name);
          setThemeColor(settings.theme_color);
        }
      } catch (error) {
        console.error('Error loading site settings:', error);
      }
    };

    loadSiteSettings();
  }, []);

  const updateSiteName = async (name: string) => {
    try {
      await DatabaseService.updateSiteSettings(name, themeColor);
      setSiteName(name);
    } catch (error) {
      console.error('Error updating site name:', error);
    }
  };

  const updateThemeColor = async (color: string) => {
    try {
      await DatabaseService.updateSiteSettings(siteName, color);
      setThemeColor(color);
    } catch (error) {
      console.error('Error updating theme color:', error);
    }
  };

  return (
    <SiteContext.Provider 
      value={{ 
        siteName, 
        themeColor,
        setSiteName: updateSiteName, 
        setThemeColor: updateThemeColor 
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
}