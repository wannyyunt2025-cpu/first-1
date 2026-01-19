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
  situation: string;       // 情境
  task: string;            // 任务
  action: string;          // 行动
  result: string;          // 结果（Key Result）
  images: string[];        // 项目图片URLs
  keywords: string[];      // 关键词标签
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
  education: Education[];
  portfolios: Portfolio[];
  comments: Comment[];
  resumeRecords: ResumeRecord[];
}

// 默认数据
export const defaultProfile: Profile = {
  id: 'default',
  name: '张三',
  title: '全栈开发工程师',
  slogan: '用代码创造价值，用技术改变世界',
  avatar: '',
  contact: {
    email: 'example@email.com',
    wechat: 'wechat_id',
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
  skills: [
    { id: '1', name: 'React', weight: 95, category: '前端' },
    { id: '2', name: 'TypeScript', weight: 90, category: '前端' },
    { id: '3', name: 'Node.js', weight: 85, category: '后端' },
    { id: '4', name: 'Python', weight: 80, category: '后端' },
    { id: '5', name: '产品设计', weight: 75, category: '设计' },
  ],
  projects: [
    {
      id: '1',
      name: '企业级管理系统',
      role: '技术负责人',
      startDate: '2024-01',
      endDate: '2024-06',
      situation: '公司内部管理系统老旧，无法满足业务快速发展需求，用户反馈操作繁琐，效率低下。',
      task: '负责新系统架构设计和核心模块开发，需要在3个月内完成MVP版本上线。',
      action: '采用React+TypeScript重构前端，引入微前端架构实现模块解耦；后端使用Node.js，设计RESTful API；建立CI/CD流程，确保代码质量。',
      result: '系统上线后用户操作效率提升60%，页面加载速度提升3倍，获得公司年度最佳技术项目奖。',
      images: [],
      keywords: ['React', 'TypeScript', 'Node.js', '微前端', '架构设计'],
      isPublic: true,
      sortOrder: 1,
    },
    {
      id: '2',
      name: '智能数据分析平台',
      role: '全栈开发工程师',
      startDate: '2023-06',
      endDate: '2023-12',
      situation: '业务部门需要一个能够自动化分析销售数据的工具，减少人工报表制作时间。',
      task: '独立开发一个数据可视化分析平台，支持多维度数据展示和自动报告生成。',
      action: '使用Python进行数据处理，React构建前端可视化界面，集成ECharts实现动态图表，开发自动化报告生成模块。',
      result: '平台投入使用后，业务部门报表制作时间从2天缩短至2小时，数据准确率达到99.5%。',
      images: [],
      keywords: ['Python', '数据分析', 'React', 'ECharts', '可视化'],
      isPublic: true,
      sortOrder: 2,
    },
    {
      id: '3',
      name: '移动端电商小程序',
      role: '前端开发工程师',
      startDate: '2023-01',
      endDate: '2023-05',
      situation: '公司计划拓展移动端业务，需要开发一款功能完善的电商小程序。',
      task: '负责小程序前端开发，实现商品展示、购物车、订单管理等核心功能。',
      action: '使用Taro框架进行跨平台开发，优化页面性能，实现懒加载和虚拟列表，与后端协作完成接口对接。',
      result: '小程序上线首月日活用户突破5000，转化率达到行业平均水平的1.5倍。',
      images: [],
      keywords: ['Taro', '小程序', '电商', '性能优化', '跨平台'],
      isPublic: true,
      sortOrder: 3,
    },
  ],
  education: [
    {
      id: '1',
      school: '某知名大学',
      degree: '本科',
      major: '计算机科学与技术',
      startDate: '2016-09',
      endDate: '2020-06',
      description: '主修数据结构、算法、操作系统、计算机网络等核心课程，GPA 3.8/4.0',
    },
  ],
  portfolios: [
    { id: '1', title: 'GitHub', url: 'https://github.com', type: 'github' },
  ],
  comments: [],
  resumeRecords: [],
};
