import { supabase } from '../config/supabaseClient';
import { Video, Todo } from '../types';

export const DatabaseService = {
  // Site Settings
  async getSiteSettings() {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateSiteSettings(siteName: string, themeColor: string) {
    const { data, error } = await supabase
      .from('site_settings')
      .update({ site_name: siteName, theme_color: themeColor })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Videos
  async getVideos(userId: string) {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        todos (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getVideo(videoId: string) {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        todos (*)
      `)
      .eq('id', videoId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async addVideo(video: {
    title: string;
    video_url: string;
    platform: string;
    video_id: string;
    class: string;
    subject: string;
    user_id: string;
  }) {
    const { data, error } = await supabase
      .from('videos')
      .insert([video])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateVideo(videoId: string, updates: Partial<Video>) {
    const { data, error } = await supabase
      .from('videos')
      .update(updates)
      .eq('id', videoId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteVideo(videoId: string) {
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', videoId);
    
    if (error) throw error;
  },

  // Todos
  async getTodos(videoId: string) {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('video_id', videoId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async addTodo(videoId: string, text: string) {
    const { data, error } = await supabase
      .from('todos')
      .insert([{ 
        video_id: videoId, 
        text,
        completed: false
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateTodo(todoId: string, updates: Partial<Todo>) {
    const { data, error } = await supabase
      .from('todos')
      .update(updates)
      .eq('id', todoId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteTodo(todoId: string) {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', todoId);
    
    if (error) throw error;
  }
};