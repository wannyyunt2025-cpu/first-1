import { Project } from '@/types';

// 常见技术关键词库
const TECH_KEYWORDS = [
  // 前端
  'react', 'vue', 'angular', 'typescript', 'javascript', 'html', 'css', 'sass', 'less',
  'webpack', 'vite', 'nextjs', 'nuxt', 'tailwind', 'antd', 'element', 'redux', 'mobx',
  'taro', '小程序', 'uniapp', 'flutter', 'react native',
  // 后端
  'node', 'nodejs', 'python', 'java', 'golang', 'go', 'php', 'ruby', 'c++', 'c#',
  'spring', 'django', 'flask', 'express', 'koa', 'fastapi', 'nestjs',
  // 数据库
  'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'oracle', 'sql',
  // 云服务/DevOps
  'docker', 'kubernetes', 'k8s', 'aws', 'azure', 'gcp', 'linux', 'nginx', 'jenkins', 'cicd',
  // 数据/AI
  '数据分析', '机器学习', '深度学习', 'pytorch', 'tensorflow', 'ai', 'ml', 'nlp',
  'pandas', 'numpy', 'spark', 'hadoop', 'flink', '大数据',
  // 其他
  'git', 'agile', 'scrum', '微服务', '分布式', '高并发', '性能优化', '架构',
  '产品', '设计', 'ui', 'ux', 'figma', 'sketch', '用户体验',
];

// 职位关键词
const POSITION_KEYWORDS = [
  '前端', '后端', '全栈', '架构师', '技术负责人', '开发工程师', '开发', '工程师',
  '数据', '分析师', '算法', '产品经理', '设计师', 'leader', '主管', '经理',
];

export interface ParsedJD {
  keywords: string[];
  positions: string[];
  rawText: string;
}

// 解析JD，提取关键词
export function parseJD(jdText: string): ParsedJD {
  const lowerText = jdText.toLowerCase();
  
  // 提取技术关键词
  const foundKeywords = TECH_KEYWORDS.filter(keyword => 
    lowerText.includes(keyword.toLowerCase())
  );
  
  // 提取职位关键词
  const foundPositions = POSITION_KEYWORDS.filter(keyword =>
    lowerText.includes(keyword.toLowerCase())
  );
  
  // 去重并保留原始大小写
  const uniqueKeywords = [...new Set(foundKeywords)];
  const uniquePositions = [...new Set(foundPositions)];
  
  return {
    keywords: uniqueKeywords,
    positions: uniquePositions,
    rawText: jdText,
  };
}

// 计算项目与JD的匹配度
export function calculateMatchScore(project: Project, parsedJD: ParsedJD): number {
  let score = 0;
  
  const projectText = [
    project.name,
    project.role,
    project.situation,
    project.task,
    project.action,
    project.result,
    ...project.keywords,
  ].join(' ').toLowerCase();
  
  // 关键词匹配
  parsedJD.keywords.forEach(keyword => {
    if (projectText.includes(keyword.toLowerCase())) {
      score += 10;
    }
  });
  
  // 项目标签直接匹配加分
  project.keywords.forEach(tag => {
    if (parsedJD.keywords.some(k => k.toLowerCase() === tag.toLowerCase())) {
      score += 15;
    }
  });
  
  // 职位匹配
  parsedJD.positions.forEach(position => {
    if (projectText.includes(position.toLowerCase())) {
      score += 5;
    }
  });
  
  return score;
}

// 根据JD重新排序项目
export function rankProjectsByJD(projects: Project[], jdText: string): Project[] {
  const parsedJD = parseJD(jdText);
  
  return [...projects]
    .map(project => ({
      project,
      score: calculateMatchScore(project, parsedJD),
    }))
    .sort((a, b) => b.score - a.score)
    .map(item => item.project);
}

// 获取匹配的关键词高亮
export function getMatchedKeywords(project: Project, jdText: string): string[] {
  const parsedJD = parseJD(jdText);
  const projectKeywords = project.keywords.map(k => k.toLowerCase());
  
  return parsedJD.keywords.filter(keyword =>
    projectKeywords.includes(keyword.toLowerCase()) ||
    project.action.toLowerCase().includes(keyword.toLowerCase()) ||
    project.result.toLowerCase().includes(keyword.toLowerCase())
  );
}
