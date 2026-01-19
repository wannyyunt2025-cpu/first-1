import { supabase, isSupabaseConfigured } from './supabase';
import type { Profile, Skill, Project, Education, Portfolio, Comment } from '@/types';

// ============================================
// Data Mappers
// ============================================

type ProfileRow = {
  id: string;
  name: string;
  title: string;
  slogan: string;
  avatar: string | null;
  email: string;
  wechat: string;
  phone: string | null;
  email_visibility: Profile['visibility']['email'];
  wechat_visibility: Profile['visibility']['wechat'];
  phone_visibility: Profile['visibility']['phone'];
  created_at?: string;
  updated_at?: string;
};

type ProfileUpsert = Partial<Omit<ProfileRow, 'id' | 'created_at' | 'updated_at'>>;

const mapProfileFromDB = (data: ProfileRow): Profile => ({
  id: data.id,
  name: data.name ?? '',
  title: data.title ?? '',
  slogan: data.slogan ?? '',
  avatar: data.avatar ?? undefined,
  contact: {
    email: data.email ?? '',
    wechat: data.wechat ?? '',
    phone: data.phone ?? undefined,
  },
  visibility: {
    email: data.email_visibility ?? 'semi',
    wechat: data.wechat_visibility ?? 'semi',
    phone: data.phone_visibility ?? 'private',
  },
});

const mapProfileToDB = (profile: Partial<Profile>): ProfileUpsert => {
  const dbData: ProfileUpsert = {};
  if (profile.name !== undefined) dbData.name = profile.name;
  if (profile.title !== undefined) dbData.title = profile.title;
  if (profile.slogan !== undefined) dbData.slogan = profile.slogan;
  if (profile.avatar !== undefined) dbData.avatar = profile.avatar ?? null;

  if (profile.contact) {
    if (profile.contact.email !== undefined) dbData.email = profile.contact.email;
    if (profile.contact.wechat !== undefined) dbData.wechat = profile.contact.wechat;
    if (profile.contact.phone !== undefined) dbData.phone = profile.contact.phone ?? null;
  }

  if (profile.visibility) {
    if (profile.visibility.email !== undefined) dbData.email_visibility = profile.visibility.email;
    if (profile.visibility.wechat !== undefined) dbData.wechat_visibility = profile.visibility.wechat;
    if (profile.visibility.phone !== undefined) dbData.phone_visibility = profile.visibility.phone;
  }

  return dbData;
};

type ProjectRow = {
  id: string;
  name: string;
  role: string;
  start_date: string;
  end_date: string;
  situation: string | null;
  task: string | null;
  action: string | null;
  result: string | null;
  images: string[] | null;
  keywords: string[] | null;
  is_public: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

type ProjectUpsert = Partial<Omit<ProjectRow, 'id' | 'created_at' | 'updated_at'>>;

const mapProjectFromDB = (data: ProjectRow): Project => ({
  id: data.id,
  name: data.name ?? '',
  role: data.role ?? '',
  startDate: data.start_date ?? '',
  endDate: data.end_date ?? '',
  situation: data.situation ?? '',
  task: data.task ?? '',
  action: data.action ?? '',
  result: data.result ?? '',
  images: data.images ?? [],
  keywords: data.keywords ?? [],
  isPublic: Boolean(data.is_public),
  sortOrder: Number.isFinite(data.sort_order) ? data.sort_order : 0,
});

const mapProjectToDB = (project: Partial<Project>): ProjectUpsert => {
  const dbData: ProjectUpsert = {};
  if (project.name !== undefined) dbData.name = project.name;
  if (project.role !== undefined) dbData.role = project.role;
  if (project.startDate !== undefined) dbData.start_date = project.startDate;
  if (project.endDate !== undefined) dbData.end_date = project.endDate;
  if (project.situation !== undefined) dbData.situation = project.situation ?? null;
  if (project.task !== undefined) dbData.task = project.task ?? null;
  if (project.action !== undefined) dbData.action = project.action ?? null;
  if (project.result !== undefined) dbData.result = project.result ?? null;
  if (project.images !== undefined) dbData.images = project.images ?? [];
  if (project.keywords !== undefined) dbData.keywords = project.keywords ?? [];
  if (project.isPublic !== undefined) dbData.is_public = project.isPublic;
  if (project.sortOrder !== undefined) dbData.sort_order = project.sortOrder;
  return dbData;
};

type EducationRow = {
  id: string;
  school: string;
  degree: string;
  major: string;
  start_date: string;
  end_date: string;
  description: string | null;
  created_at?: string;
  updated_at?: string;
};

type EducationUpsert = Partial<Omit<EducationRow, 'id' | 'created_at' | 'updated_at'>>;

const mapEducationFromDB = (data: EducationRow): Education => ({
  id: data.id,
  school: data.school ?? '',
  degree: data.degree ?? '',
  major: data.major ?? '',
  startDate: data.start_date ?? '',
  endDate: data.end_date ?? '',
  description: data.description ?? undefined,
});

const mapEducationToDB = (edu: Partial<Education>): EducationUpsert => {
  const dbData: EducationUpsert = {};
  if (edu.school !== undefined) dbData.school = edu.school;
  if (edu.degree !== undefined) dbData.degree = edu.degree;
  if (edu.major !== undefined) dbData.major = edu.major;
  if (edu.startDate !== undefined) dbData.start_date = edu.startDate;
  if (edu.endDate !== undefined) dbData.end_date = edu.endDate;
  if (edu.description !== undefined) dbData.description = edu.description ?? null;
  return dbData;
};

type CommentRow = {
  id: string;
  nickname: string | null;
  content: string;
  status: Comment['status'];
  reply: string | null;
  reply_at: string | null;
  created_at: string;
  updated_at?: string;
};

type CommentUpsert = Partial<Omit<CommentRow, 'id' | 'created_at' | 'updated_at'>>;

const mapCommentFromDB = (data: CommentRow): Comment => ({
  id: data.id,
  nickname: data.nickname ?? undefined,
  content: data.content ?? '',
  createdAt: data.created_at ?? new Date().toISOString(),
  status: data.status ?? 'pending',
  reply: data.reply ?? undefined,
  replyAt: data.reply_at ?? undefined,
});

const mapCommentToDB = (comment: Partial<Comment>): CommentUpsert => {
  const dbData: CommentUpsert = {};
  if (comment.nickname !== undefined) dbData.nickname = comment.nickname ?? null;
  if (comment.content !== undefined) dbData.content = comment.content;
  if (comment.status !== undefined) dbData.status = comment.status;
  if (comment.reply !== undefined) dbData.reply = comment.reply ?? null;
  if (comment.replyAt !== undefined) dbData.reply_at = comment.replyAt ?? null;
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
  
  async createSkill(skill: Pick<Skill, 'name' | 'weight' | 'category'> & { id?: string }): Promise<Skill | null> {
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
