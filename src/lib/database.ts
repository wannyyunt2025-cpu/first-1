import { supabase, isSupabaseConfigured } from './supabase';
import type { Profile, Skill, Project, Education, Portfolio, Comment } from '@/types';

// ============================================
// Data Mappers
// ============================================

const mapProfileFromDB = (data: any): Profile => ({
  id: data.id,
  name: data.name,
  title: data.title,
  slogan: data.slogan,
  avatar: data.avatar,
  contact: {
    email: data.email,
    wechat: data.wechat,
    phone: data.phone,
  },
  visibility: {
    email: data.email_visibility,
    wechat: data.wechat_visibility,
    phone: data.phone_visibility,
  },
});

const mapProfileToDB = (profile: Partial<Profile>): any => {
  const dbData: any = {};
  if (profile.name !== undefined) dbData.name = profile.name;
  if (profile.title !== undefined) dbData.title = profile.title;
  if (profile.slogan !== undefined) dbData.slogan = profile.slogan;
  if (profile.avatar !== undefined) dbData.avatar = profile.avatar;
  
  if (profile.contact) {
    if (profile.contact.email !== undefined) dbData.email = profile.contact.email;
    if (profile.contact.wechat !== undefined) dbData.wechat = profile.contact.wechat;
    if (profile.contact.phone !== undefined) dbData.phone = profile.contact.phone;
  }
  
  if (profile.visibility) {
    if (profile.visibility.email !== undefined) dbData.email_visibility = profile.visibility.email;
    if (profile.visibility.wechat !== undefined) dbData.wechat_visibility = profile.visibility.wechat;
    if (profile.visibility.phone !== undefined) dbData.phone_visibility = profile.visibility.phone;
  }
  
  return dbData;
};

const mapProjectFromDB = (data: any): Project => ({
  ...data,
  startDate: data.start_date,
  endDate: data.end_date,
  isPublic: data.is_public,
  sortOrder: data.sort_order,
});

const mapProjectToDB = (project: Partial<Project>): any => {
  const dbData: any = { ...project };
  if (project.startDate !== undefined) dbData.start_date = project.startDate;
  if (project.endDate !== undefined) dbData.end_date = project.endDate;
  if (project.isPublic !== undefined) dbData.is_public = project.isPublic;
  if (project.sortOrder !== undefined) dbData.sort_order = project.sortOrder;
  
  delete dbData.startDate;
  delete dbData.endDate;
  delete dbData.isPublic;
  delete dbData.sortOrder;
  return dbData;
};

const mapEducationFromDB = (data: any): Education => ({
  ...data,
  startDate: data.start_date,
  endDate: data.end_date,
});

const mapEducationToDB = (edu: Partial<Education>): any => {
  const dbData: any = { ...edu };
  if (edu.startDate !== undefined) dbData.start_date = edu.startDate;
  if (edu.endDate !== undefined) dbData.end_date = edu.endDate;
  
  delete dbData.startDate;
  delete dbData.endDate;
  return dbData;
};

const mapCommentFromDB = (data: any): Comment => ({
  ...data,
  createdAt: data.created_at,
  replyAt: data.reply_at,
});

const mapCommentToDB = (comment: Partial<Comment>): any => {
  const dbData: any = { ...comment };
  if (comment.createdAt !== undefined) dbData.created_at = comment.createdAt;
  if (comment.replyAt !== undefined) dbData.reply_at = comment.replyAt;
  
  delete dbData.createdAt;
  delete dbData.replyAt;
  return dbData;
};

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
      // console.error('获取个人信息失败:', error);
      return null;
    }
    
    return mapProfileFromDB(data);
  },
  
  async createProfile(profile: Omit<Profile, 'id'>): Promise<Profile | null> {
    const dbData = mapProfileToDB(profile);
    const { data, error } = await supabase
      .from('profiles')
      .insert(dbData)
      .select()
      .single();
    
    if (error) {
      console.error('创建个人信息失败:', error);
      return null;
    }
    
    return mapProfileFromDB(data);
  },
  
  async updateProfile(profileId: string, updates: Partial<Profile>): Promise<boolean> {
    const dbData = mapProfileToDB(updates);
    const { error } = await supabase
      .from('profiles')
      .update(dbData)
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
  
  async createSkill(skill: Omit<Skill, 'id'>): Promise<Skill | null> {
    const { id, ...rest } = skill as any; // Remove ID if present, let DB generate it or use it? 
    // Usually let DB generate ID. But our local logic generates ID. 
    // If we want to sync local ID to DB, we should include it.
    // Supabase allows inserting ID.
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
    
    return data.map(mapProjectFromDB);
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
    
    return mapProjectFromDB(data);
  },
  
  async createProject(project: Omit<Project, 'id'>): Promise<Project | null> {
    const dbData = mapProjectToDB(project);
    const { data, error } = await supabase
      .from('projects')
      .insert(dbData)
      .select()
      .single();
    
    if (error) {
      console.error('创建项目失败:', error);
      return null;
    }
    
    return mapProjectFromDB(data);
  },
  
  async updateProject(projectId: string, updates: Partial<Project>): Promise<boolean> {
    const dbData = mapProjectToDB(updates);
    const { error } = await supabase
      .from('projects')
      .update(dbData)
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
    
    return data.map(mapEducationFromDB);
  },
  
  async createEducation(education: Omit<Education, 'id'>): Promise<Education | null> {
    const dbData = mapEducationToDB(education);
    const { data, error } = await supabase
      .from('education')
      .insert(dbData)
      .select()
      .single();
    
    if (error) {
      console.error('创建教育背景失败:', error);
      return null;
    }
    
    return mapEducationFromDB(data);
  },
  
  async updateEducation(educationId: string, updates: Partial<Education>): Promise<boolean> {
    const dbData = mapEducationToDB(updates);
    const { error } = await supabase
      .from('education')
      .update(dbData)
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
  
  async createPortfolio(portfolio: Omit<Portfolio, 'id'>): Promise<Portfolio | null> {
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
    
    return data.map(mapCommentFromDB);
  },
  
  async getApprovedComments(): Promise<Comment[]> {
    return this.getComments('approved');
  },
  
  async createComment(comment: Omit<Comment, 'id'>): Promise<Comment | null> {
    const dbData = mapCommentToDB(comment);
    const { data, error } = await supabase
      .from('comments')
      .insert(dbData)
      .select()
      .single();
    
    if (error) {
      console.error('创建留言失败:', error);
      return null;
    }
    
    return mapCommentFromDB(data);
  },
  
  async updateComment(commentId: string, updates: Partial<Comment>): Promise<boolean> {
    const dbData = mapCommentToDB(updates);
    const { error } = await supabase
      .from('comments')
      .update(dbData)
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
