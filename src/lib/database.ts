import { supabase, isSupabaseConfigured } from './supabase';
import type { Profile, Skill, Project, Education, Portfolio, Comment } from '@/types';

/**
 * 数据库服务层
 * 提供统一的数据访问接口，封装Supabase操作
 */
export const database = {
  // ============================================
  // Profile (个人信息)
  // ============================================
  
  async getProfile(): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .single();
    
    if (error) {
      console.error('获取个人信息失败:', error);
      return null;
    }
    
    return data as Profile;
  },
  
  async createProfile(profile: Omit<Profile, 'id' | 'created_at' | 'updated_at'>): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single();
    
    if (error) {
      console.error('创建个人信息失败:', error);
      return null;
    }
    
    return data as Profile;
  },
  
  async updateProfile(profileId: string, updates: Partial<Profile>): Promise<boolean> {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', profileId);
    
    if (error) {
      console.error('更新个人信息失败:', error);
      return false;
    }
    
    return true;
  },

  // ============================================
  // Skills (技能)
  // ============================================
  
  async getSkills(): Promise<Skill[]> {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('weight', { ascending: false });
    
    if (error) {
      console.error('获取技能列表失败:', error);
      return [];
    }
    
    return data as Skill[];
  },
  
  async createSkill(skill: Omit<Skill, 'id' | 'created_at' | 'updated_at'>): Promise<Skill | null> {
    const { data, error } = await supabase
      .from('skills')
      .insert(skill)
      .select()
      .single();
    
    if (error) {
      console.error('创建技能失败:', error);
      return null;
    }
    
    return data as Skill;
  },
  
  async updateSkill(skillId: string, updates: Partial<Skill>): Promise<boolean> {
    const { error } = await supabase
      .from('skills')
      .update(updates)
      .eq('id', skillId);
    
    if (error) {
      console.error('更新技能失败:', error);
      return false;
    }
    
    return true;
  },
  
  async deleteSkill(skillId: string): Promise<boolean> {
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', skillId);
    
    if (error) {
      console.error('删除技能失败:', error);
      return false;
    }
    
    return true;
  },

  // ============================================
  // Projects (项目)
  // ============================================
  
  async getProjects(publicOnly = false): Promise<Project[]> {
    let query = supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (publicOnly) {
      query = query.eq('is_public', true);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('获取项目列表失败:', error);
      return [];
    }
    
    return data as Project[];
  },
  
  async getProjectById(projectId: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();
    
    if (error) {
      console.error('获取项目详情失败:', error);
      return null;
    }
    
    return data as Project;
  },
  
  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();
    
    if (error) {
      console.error('创建项目失败:', error);
      return null;
    }
    
    return data as Project;
  },
  
  async updateProject(projectId: string, updates: Partial<Project>): Promise<boolean> {
    const { error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId);
    
    if (error) {
      console.error('更新项目失败:', error);
      return false;
    }
    
    return true;
  },
  
  async deleteProject(projectId: string): Promise<boolean> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);
    
    if (error) {
      console.error('删除项目失败:', error);
      return false;
    }
    
    return true;
  },

  // ============================================
  // Education (教育背景)
  // ============================================
  
  async getEducation(): Promise<Education[]> {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .order('start_date', { ascending: false });
    
    if (error) {
      console.error('获取教育背景失败:', error);
      return [];
    }
    
    return data as Education[];
  },
  
  async createEducation(education: Omit<Education, 'id' | 'created_at' | 'updated_at'>): Promise<Education | null> {
    const { data, error } = await supabase
      .from('education')
      .insert(education)
      .select()
      .single();
    
    if (error) {
      console.error('创建教育背景失败:', error);
      return null;
    }
    
    return data as Education;
  },
  
  async updateEducation(educationId: string, updates: Partial<Education>): Promise<boolean> {
    const { error } = await supabase
      .from('education')
      .update(updates)
      .eq('id', educationId);
    
    if (error) {
      console.error('更新教育背景失败:', error);
      return false;
    }
    
    return true;
  },
  
  async deleteEducation(educationId: string): Promise<boolean> {
    const { error } = await supabase
      .from('education')
      .delete()
      .eq('id', educationId);
    
    if (error) {
      console.error('删除教育背景失败:', error);
      return false;
    }
    
    return true;
  },

  // ============================================
  // Portfolios (作品集)
  // ============================================
  
  async getPortfolios(): Promise<Portfolio[]> {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('获取作品集失败:', error);
      return [];
    }
    
    return data as Portfolio[];
  },
  
  async createPortfolio(portfolio: Omit<Portfolio, 'id' | 'created_at' | 'updated_at'>): Promise<Portfolio | null> {
    const { data, error } = await supabase
      .from('portfolios')
      .insert(portfolio)
      .select()
      .single();
    
    if (error) {
      console.error('创建作品集失败:', error);
      return null;
    }
    
    return data as Portfolio;
  },
  
  async updatePortfolio(portfolioId: string, updates: Partial<Portfolio>): Promise<boolean> {
    const { error } = await supabase
      .from('portfolios')
      .update(updates)
      .eq('id', portfolioId);
    
    if (error) {
      console.error('更新作品集失败:', error);
      return false;
    }
    
    return true;
  },
  
  async deletePortfolio(portfolioId: string): Promise<boolean> {
    const { error } = await supabase
      .from('portfolios')
      .delete()
      .eq('id', portfolioId);
    
    if (error) {
      console.error('删除作品集失败:', error);
      return false;
    }
    
    return true;
  },

  // ============================================
  // Comments (留言)
  // ============================================
  
  async getComments(statusFilter?: 'pending' | 'approved' | 'rejected'): Promise<Comment[]> {
    let query = supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('获取留言列表失败:', error);
      return [];
    }
    
    return data as Comment[];
  },
  
  async getApprovedComments(): Promise<Comment[]> {
    return this.getComments('approved');
  },
  
  async createComment(comment: Omit<Comment, 'id' | 'created_at' | 'updated_at'>): Promise<Comment | null> {
    const { data, error } = await supabase
      .from('comments')
      .insert(comment)
      .select()
      .single();
    
    if (error) {
      console.error('创建留言失败:', error);
      return null;
    }
    
    return data as Comment;
  },
  
  async updateComment(commentId: string, updates: Partial<Comment>): Promise<boolean> {
    const { error } = await supabase
      .from('comments')
      .update(updates)
      .eq('id', commentId);
    
    if (error) {
      console.error('更新留言失败:', error);
      return false;
    }
    
    return true;
  },
  
  async approveComment(commentId: string, reply?: string): Promise<boolean> {
    const updates: Partial<Comment> = {
      status: 'approved',
      ...(reply && { reply, replyAt: new Date().toISOString() }),
    };
    
    return this.updateComment(commentId, updates);
  },
  
  async rejectComment(commentId: string): Promise<boolean> {
    return this.updateComment(commentId, { status: 'rejected' });
  },
  
  async deleteComment(commentId: string): Promise<boolean> {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);
    
    if (error) {
      console.error('删除留言失败:', error);
      return false;
    }
    
    return true;
  },
};

/**
 * 检查数据库是否已配置并可用
 */
export async function isDatabaseAvailable(): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }
  
  try {
    const { error } = await supabase.from('profiles').select('count').limit(1);
    return !error;
  } catch {
    return false;
  }
}
