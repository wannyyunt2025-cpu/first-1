import { database, isDatabaseAvailable } from './database';
import * as storage from './storage';
import { toast } from 'sonner';

/**
 * 数据迁移工具
 * 用于将localStorage数据迁移到Supabase数据库
 */

export interface MigrationProgress {
  step: string;
  current: number;
  total: number;
  status: 'pending' | 'running' | 'success' | 'error';
  message?: string;
}

export type MigrationCallback = (progress: MigrationProgress) => void;

/**
 * 检查localStorage是否有数据
 */
export function hasLocalStorageData(): boolean {
  try {
    const profile = storage.getProfile();
    const skills = storage.getSkills();
    const projects = storage.getProjects();
    
    return Boolean(
      profile || 
      skills.length > 0 || 
      projects.length > 0
    );
  } catch {
    return false;
  }
}

/**
 * 获取localStorage数据概览
 */
export function getLocalStorageStats() {
  try {
    const profile = storage.getProfile();
    const skills = storage.getSkills();
    const projects = storage.getProjects();
    const education = storage.getEducation();
    const portfolios = storage.getPortfolios();
    const comments = storage.getAllComments();
    
    return {
      hasProfile: Boolean(profile),
      skillsCount: skills.length,
      projectsCount: projects.length,
      educationCount: education.length,
      portfoliosCount: portfolios.length,
      commentsCount: comments.length,
    };
  } catch (error) {
    console.error('获取本地数据统计失败:', error);
    return {
      hasProfile: false,
      skillsCount: 0,
      projectsCount: 0,
      educationCount: 0,
      portfoliosCount: 0,
      commentsCount: 0,
    };
  }
}

/**
 * 执行数据迁移
 */
export async function migrateToDatabase(
  onProgress?: MigrationCallback
): Promise<boolean> {
  // 检查数据库可用性
  const dbAvailable = await isDatabaseAvailable();
  if (!dbAvailable) {
    toast.error('数据库未配置或不可用，请先配置Supabase');
    return false;
  }

  const updateProgress = (
    step: string,
    current: number,
    total: number,
    status: MigrationProgress['status'],
    message?: string
  ) => {
    if (onProgress) {
      onProgress({ step, current, total, status, message });
    }
  };

  try {
    // Step 1: 迁移个人信息
    updateProgress('profile', 1, 7, 'running', '正在迁移个人信息...');
    const localProfile = storage.getProfile();
    if (localProfile) {
      const existingProfile = await database.getProfile();
      if (existingProfile) {
        // 更新现有profile
        await database.updateProfile(existingProfile.id, {
          name: localProfile.name,
          title: localProfile.title,
          slogan: localProfile.slogan,
          avatar: localProfile.avatar,
          email: localProfile.contact.email,
          wechat: localProfile.contact.wechat,
          phone: localProfile.contact.phone,
          email_visibility: localProfile.visibility.email,
          wechat_visibility: localProfile.visibility.wechat,
          phone_visibility: localProfile.visibility.phone,
        });
      } else {
        // 创建新profile
        await database.createProfile({
          name: localProfile.name,
          title: localProfile.title,
          slogan: localProfile.slogan,
          avatar: localProfile.avatar,
          email: localProfile.contact.email,
          wechat: localProfile.contact.wechat,
          phone: localProfile.contact.phone,
          email_visibility: localProfile.visibility.email,
          wechat_visibility: localProfile.visibility.wechat,
          phone_visibility: localProfile.visibility.phone,
        });
      }
    }
    updateProgress('profile', 1, 7, 'success', '个人信息迁移完成');

    // Step 2: 迁移技能
    updateProgress('skills', 2, 7, 'running', '正在迁移技能...');
    const localSkills = storage.getSkills();
    const existingSkills = await database.getSkills();
    for (const skill of localSkills) {
      // 检查是否已存在（根据名称）
      const exists = existingSkills.some(s => s.name === skill.name);
      if (!exists) {
        await database.createSkill({
          name: skill.name,
          weight: skill.weight,
          category: skill.category,
        });
      }
    }
    updateProgress('skills', 2, 7, 'success', `已迁移 ${localSkills.length} 个技能`);

    // Step 3: 迁移项目
    updateProgress('projects', 3, 7, 'running', '正在迁移项目...');
    const localProjects = storage.getProjects();
    const existingProjects = await database.getProjects();
    for (const project of localProjects) {
      // 检查是否已存在（根据名称）
      const exists = existingProjects.some(p => p.name === project.name);
      if (!exists) {
        await database.createProject({
          name: project.name,
          role: project.role,
          start_date: project.startDate,
          end_date: project.endDate,
          situation: project.situation,
          task: project.task,
          action: project.action,
          result: project.result,
          images: project.images,
          keywords: project.keywords,
          is_public: project.isPublic,
          sort_order: project.sortOrder,
        });
      }
    }
    updateProgress('projects', 3, 7, 'success', `已迁移 ${localProjects.length} 个项目`);

    // Step 4: 迁移教育背景
    updateProgress('education', 4, 7, 'running', '正在迁移教育背景...');
    const localEducation = storage.getEducation();
    const existingEducation = await database.getEducation();
    for (const edu of localEducation) {
      // 检查是否已存在（根据学校+专业+学位）
      const exists = existingEducation.some(e => 
        e.school === edu.school && 
        e.major === edu.major && 
        e.degree === edu.degree
      );
      if (!exists) {
        await database.createEducation({
          school: edu.school,
          degree: edu.degree,
          major: edu.major,
          start_date: edu.startDate,
          end_date: edu.endDate,
          description: edu.description,
        });
      }
    }
    updateProgress('education', 4, 7, 'success', `已迁移 ${localEducation.length} 条教育背景`);

    // Step 5: 迁移作品集
    updateProgress('portfolios', 5, 7, 'running', '正在迁移作品集...');
    const localPortfolios = storage.getPortfolios();
    const existingPortfolios = await database.getPortfolios();
    for (const portfolio of localPortfolios) {
      // 检查是否已存在（根据标题+链接）
      const exists = existingPortfolios.some(p => 
        p.title === portfolio.title && 
        p.url === portfolio.url
      );
      if (!exists) {
        await database.createPortfolio({
          title: portfolio.title,
          url: portfolio.url,
          type: portfolio.type,
        });
      }
    }
    updateProgress('portfolios', 5, 7, 'success', `已迁移 ${localPortfolios.length} 个作品集`);

    // Step 6: 迁移留言
    updateProgress('comments', 6, 7, 'running', '正在迁移留言...');
    const localComments = storage.getAllComments();
    const existingComments = await database.getComments();
    for (const comment of localComments) {
      // 检查是否已存在（根据内容+昵称）
      // 注意：留言内容可能很长，这里简单对比内容前50个字符和昵称
      const exists = existingComments.some(c => 
        c.content === comment.content && 
        c.nickname === comment.nickname &&
        // 如果创建时间非常接近（例如1秒内），也认为是同一条
        Math.abs(new Date(c.createdAt).getTime() - new Date(comment.createdAt).getTime()) < 1000
      );
      
      if (!exists) {
        await database.createComment({
          id: storage.generateId(),
          nickname: comment.nickname,
          content: comment.content,
          createdAt: comment.createdAt,
          status: comment.status,
          reply: comment.reply,
          replyAt: comment.replyAt,
        });
      }
    }
    updateProgress('comments', 6, 7, 'success', `已迁移 ${localComments.length} 条留言`);

    // Step 7: 完成
    updateProgress('complete', 7, 7, 'success', '数据迁移完成！');
    
    toast.success('数据迁移完成！', {
      description: '所有数据已成功迁移到数据库',
    });
    
    return true;
  } catch (error) {
    console.error('数据迁移失败:', error);
    updateProgress('error', 0, 7, 'error', `迁移失败: ${error}`);
    toast.error('数据迁移失败', {
      description: error instanceof Error ? error.message : '未知错误',
    });
    return false;
  }
}

/**
 * 清除localStorage数据（迁移成功后可选）
 */
export function clearLocalStorage() {
  const keys = [
    'portfolio_profile',
    'portfolio_skills',
    'portfolio_projects',
    'portfolio_education',
    'portfolio_portfolios',
    'portfolio_comments',
  ];
  
  keys.forEach(key => localStorage.removeItem(key));
  toast.success('本地数据已清除');
}

/**
 * 导出数据为JSON（作为备份）
 */
export function exportToJSON(): string {
  const data = {
    profile: storage.getProfile(),
    skills: storage.getSkills(),
    projects: storage.getProjects(),
    education: storage.getEducation(),
    portfolios: storage.getPortfolios(),
    comments: storage.getAllComments(),
    exportedAt: new Date().toISOString(),
  };
  
  return JSON.stringify(data, null, 2);
}

/**
 * 下载JSON备份文件
 */
export function downloadBackup() {
  const json = exportToJSON();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  toast.success('备份文件已下载');
}
