export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  video_id?: string;
}

export interface Video {
  id: string;
  title: string;
  video_url: string;
  platform: 'youtube' | 'vimeo' | 'dailymotion' | 'embed';
  video_id: string;
  class: string;
  subject: string;
  user_id: string;
  watched?: boolean;
  favorite?: boolean;
  todos?: Todo[];
  created_at?: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  theme_color: string;
  updated_at?: string;
}