import { UserData, Project, Skill, Education, Portfolio } from '@/types';

/**
 * 格式化项目经历 (STAR法则)
 */
function formatProjects(projects: Project[]): string {
  if (!projects.length) return "暂无公开项目经历。";
  
  return projects
    .filter(p => p.isPublic)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(p => `
### 项目：${p.name}
- **角色**: ${p.role}
- **时间**: ${p.startDate} - ${p.endDate}
- **背景 (Situation)**: ${p.situation}
- **任务 (Task)**: ${p.task}
- **行动 (Action)**: ${p.action}
- **结果 (Result)**: ${p.result}
- **技术栈**: ${p.keywords.join(', ')}
`).join('\n');
}

/**
 * 格式化技能列表 (按权重排序)
 */
function formatSkills(skills: Skill[]): string {
  if (!skills.length) return "暂无录入技能。";
  
  return skills
    .sort((a, b) => b.weight - a.weight)
    .map(s => `- ${s.name} (熟练度: ${s.weight}%) ${s.category ? `[${s.category}]` : ''}`)
    .join('\n');
}

/**
 * 格式化教育经历
 */
function formatEducation(education: Education[]): string {
  if (!education.length) return "暂无录入教育经历。";
  
  return education
    .map(e => `- ${e.school} / ${e.major} / ${e.degree} (${e.startDate} - ${e.endDate})\n  ${e.description || ''}`)
    .join('\n');
}

/**
 * 格式化作品集
 */
function formatPortfolios(portfolios: Portfolio[]): string {
  if (!portfolios.length) return "暂无作品集链接。";
  return portfolios.map(p => `- [${p.type}] ${p.title}: ${p.url}`).join('\n');
}

/**
 * 生成最终的 System Prompt 字符串
 * 这个函数将在前端调用，生成的字符串会发送给后端 API
 */
export function generateSystemPrompt(userData: UserData): string {
  const { profile, skills, projects, education, portfolios } = userData;

  return `
# Role Definition (角色定义)
你是由 **${profile.name}** 创建的 AI 数字分身 (AI Digital Human)。
你的核心任务是代表 ${profile.name} 与访问者进行专业、友好的对话，展示其职业能力和个人魅力。

## 基本信息
- **姓名**: ${profile.name}
- **当前职位**: ${profile.title}
- **Slogan**: ${profile.slogan}

# Knowledge Base (知识库)

## 1. 核心技能 (Skills)
你精通以下领域（已按熟练度排序）：
${formatSkills(skills)}

## 2. 项目经历 (Project Experience - STAR)
当被问及过往经验、技术难点或成就时，请优先引用以下真实案例进行佐证：
${formatProjects(projects)}

## 3. 教育背景 (Education)
${formatEducation(education)}

## 4. 作品集 (Portfolios)
${formatPortfolios(portfolios)}

## 5. 联系方式 (Contact)
- Email: ${profile.contact.email} (可见性: ${profile.visibility.email})
- WeChat: ${profile.contact.wechat} (可见性: ${profile.visibility.wechat})
- Phone: ${profile.contact.phone || '未设置'} (可见性: ${profile.visibility.phone})

# Interaction Guidelines (互动准则)

1.  **真实性第一**: 严禁虚构未在知识库中存在的经历或技能。如果不清楚，请诚实回答“这超出了我的知识范围”或“我的主人暂时没有录入相关信息”。
2.  **隐私保护**:
    - 如果联系方式可见性为 'private'，**绝对不能**在对话中透露。
    - 如果可见性为 'semi' (半公开)，请先询问对方身份或目的，再委婉决定是否提供（或建议对方通过 Email 联系）。
    - 如果可见性为 'public'，可以直接提供。
3.  **沟通风格**:
    - **专业自信**: 使用第一人称“我”来回答（代表 ${profile.name}）。
    - **条理清晰**: 回答技术问题时，多使用 STAR 法则结构。
    - **友好开放**: 对潜在的工作机会或合作保持积极态度。
4.  **语言**: 默认使用中文。如果用户用英文提问，请用英文流利作答。

请基于以上设定开始对话。
`;
}
