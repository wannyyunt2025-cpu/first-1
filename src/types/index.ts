// 个人基础信息
export interface Profile {
  id: string;
  name: string;
  title: string;           // 职业定位
  slogan: string;          // 一句话介绍
  avatar?: string;         // 头像URL
  contact: {
    email: string;
    wechat: string;
    phone?: string;
  };
  visibility: {
    email: 'public' | 'semi' | 'private';
    wechat: 'public' | 'semi' | 'private';
    phone: 'public' | 'semi' | 'private';
  };
}

// 技能
export interface Skill {
  id: string;
  name: string;
  weight: number;          // 0-100权重
  category?: string;       // 技能分类
}

// 项目经历（STAR法则）
export interface Project {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  summary?: string;        // 首页短摘要
  situation: string;       // 情境
  task: string;            // 任务
  action: string;          // 行动
  result: string;          // 结果（Key Result）
  reflection?: string;     // 项目复盘 / 下一步
  images: string[];        // 项目图片URLs
  keywords: string[];      // 关键词标签
  isPublic: boolean;
  featured?: boolean;      // 是否作为首页主项目
  sortOrder: number;
  githubUrl?: string;
  demoUrl?: string;
  portfolioUrl?: string;
}

// 学习 / 训练营经历
export interface LearningRecord {
  id: string;
  title: string;
  type: 'tool' | 'bootcamp' | 'volunteer' | 'project' | 'other';
  time: string;
  role?: string;
  output?: string;
  reflection?: string;
  isPublic: boolean;
  sortOrder: number;
}

// AI 理解 / 观点卡片
export interface InsightCard {
  id: string;
  title: string;
  content: string;
  sourceProjectId?: string;
  isPublic: boolean;
  sortOrder: number;
}

// 教育背景
export interface Education {
  id: string;
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
  description?: string;
}

// 作品集链接
export interface Portfolio {
  id: string;
  title: string;
  url: string;
  type: 'github' | 'behance' | 'dribbble' | 'website' | 'other';
}

// 留言
export interface Comment {
  id: string;
  nickname?: string;
  content: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reply?: string;
  replyAt?: string;
}

// 简历生成记录
export interface ResumeRecord {
  id: string;
  jd: string;
  generatedAt: string;
  projectOrder: string[];  // 重排序后的项目ID列表
  customContent?: string;
}

// 完整的用户数据
export interface UserData {
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  learningRecords: LearningRecord[];
  insightCards: InsightCard[];
  education: Education[];
  portfolios: Portfolio[];
  comments: Comment[];
  resumeRecords: ResumeRecord[];
}

// 默认数据
export const defaultProfile: Profile = {
  id: 'default',
  name: '',
  title: '',
  slogan: '',
  avatar: '',
  contact: {
    email: '',
    wechat: '',
    phone: '',
  },
  visibility: {
    email: 'semi',
    wechat: 'semi',
    phone: 'private',
  },
};

export const defaultUserData: UserData = {
  profile: defaultProfile,
  skills: [],
  projects: [],
  learningRecords: [],
  insightCards: [],
  education: [],
  portfolios: [],
  comments: [],
  resumeRecords: [],
};
