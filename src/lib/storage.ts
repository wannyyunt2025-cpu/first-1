import {
  UserData,
  defaultUserData,
  Profile,
  Skill,
  Project,
  LearningRecord,
  InsightCard,
  Education,
  Portfolio,
  Comment,
  ResumeRecord,
} from '@/types';

const STORAGE_KEY = 'dynamic_profile_data';

// 获取完整数据
export function getUserData(): UserData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
  }
  return defaultUserData;
}

// 保存完整数据
export function saveUserData(data: UserData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

// Profile 操作
export function getProfile(): Profile {
  return getUserData().profile;
}

export function saveProfile(profile: Profile): void {
  const data = getUserData();
  data.profile = profile;
  saveUserData(data);
}

// Skills 操作
export function getSkills(): Skill[] {
  return getUserData().skills;
}

export function saveSkills(skills: Skill[]): void {
  const data = getUserData();
  data.skills = skills;
  saveUserData(data);
}

export function addSkill(skill: Skill): void {
  const data = getUserData();
  data.skills.push(skill);
  saveUserData(data);
}

export function updateSkill(skill: Skill): void {
  const data = getUserData();
  const index = data.skills.findIndex(s => s.id === skill.id);
  if (index !== -1) {
    data.skills[index] = skill;
    saveUserData(data);
  }
}

export function deleteSkill(id: string): void {
  const data = getUserData();
  data.skills = data.skills.filter(s => s.id !== id);
  saveUserData(data);
}

// Projects 操作
export function getProjects(): Project[] {
  return getUserData().projects.sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getPublicProjects(): Project[] {
  return getProjects().filter(p => p.isPublic);
}

export function getProjectById(id: string): Project | undefined {
  return getUserData().projects.find(p => p.id === id);
}

export function saveProjects(projects: Project[]): void {
  const data = getUserData();
  data.projects = projects;
  saveUserData(data);
}

export function addProject(project: Project): void {
  const data = getUserData();
  project.sortOrder = data.projects.length + 1;
  data.projects.push(project);
  saveUserData(data);
}

export function updateProject(project: Project): void {
  const data = getUserData();
  const index = data.projects.findIndex(p => p.id === project.id);
  if (index !== -1) {
    data.projects[index] = project;
    saveUserData(data);
  }
}

export function deleteProject(id: string): void {
  const data = getUserData();
  data.projects = data.projects.filter(p => p.id !== id);
  saveUserData(data);
}

// Learning Records 操作
export function getLearningRecords(): LearningRecord[] {
  return (getUserData().learningRecords || []).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getPublicLearningRecords(): LearningRecord[] {
  return getLearningRecords().filter(record => record.isPublic);
}

export function saveLearningRecords(records: LearningRecord[]): void {
  const data = getUserData();
  data.learningRecords = records;
  saveUserData(data);
}

export function addLearningRecord(record: LearningRecord): void {
  const data = getUserData();
  data.learningRecords = [...(data.learningRecords || []), record];
  saveUserData(data);
}

export function updateLearningRecord(record: LearningRecord): void {
  const data = getUserData();
  const records = data.learningRecords || [];
  const index = records.findIndex(item => item.id === record.id);
  if (index !== -1) {
    records[index] = record;
    data.learningRecords = records;
    saveUserData(data);
  }
}

export function deleteLearningRecord(id: string): void {
  const data = getUserData();
  data.learningRecords = (data.learningRecords || []).filter(record => record.id !== id);
  saveUserData(data);
}

// Insight Cards 操作
export function getInsightCards(): InsightCard[] {
  return (getUserData().insightCards || []).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getPublicInsightCards(): InsightCard[] {
  return getInsightCards().filter(card => card.isPublic);
}

export function saveInsightCards(cards: InsightCard[]): void {
  const data = getUserData();
  data.insightCards = cards;
  saveUserData(data);
}

export function addInsightCard(card: InsightCard): void {
  const data = getUserData();
  data.insightCards = [...(data.insightCards || []), card];
  saveUserData(data);
}

export function updateInsightCard(card: InsightCard): void {
  const data = getUserData();
  const cards = data.insightCards || [];
  const index = cards.findIndex(item => item.id === card.id);
  if (index !== -1) {
    cards[index] = card;
    data.insightCards = cards;
    saveUserData(data);
  }
}

export function deleteInsightCard(id: string): void {
  const data = getUserData();
  data.insightCards = (data.insightCards || []).filter(card => card.id !== id);
  saveUserData(data);
}

// Education 操作
export function getEducation(): Education[] {
  return getUserData().education;
}

export function saveEducation(education: Education[]): void {
  const data = getUserData();
  data.education = education;
  saveUserData(data);
}

export function addEducation(edu: Education): void {
  const data = getUserData();
  data.education.push(edu);
  saveUserData(data);
}

export function updateEducation(edu: Education): void {
  const data = getUserData();
  const index = data.education.findIndex(e => e.id === edu.id);
  if (index !== -1) {
    data.education[index] = edu;
    saveUserData(data);
  }
}

export function deleteEducation(id: string): void {
  const data = getUserData();
  data.education = data.education.filter(e => e.id !== id);
  saveUserData(data);
}

// Portfolio 操作
export function getPortfolios(): Portfolio[] {
  return getUserData().portfolios;
}

export function savePortfolios(portfolios: Portfolio[]): void {
  const data = getUserData();
  data.portfolios = portfolios;
  saveUserData(data);
}

export function addPortfolio(portfolio: Portfolio): void {
  const data = getUserData();
  data.portfolios.push(portfolio);
  saveUserData(data);
}

export function deletePortfolio(id: string): void {
  const data = getUserData();
  data.portfolios = data.portfolios.filter(p => p.id !== id);
  saveUserData(data);
}

// Comments 操作
export function getComments(): Comment[] {
  return getUserData().comments.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getApprovedComments(): Comment[] {
  return getComments().filter(c => c.status === 'approved');
}

export function getPendingComments(): Comment[] {
  return getComments().filter(c => c.status === 'pending');
}

export function getAllComments(): Comment[] {
  return getComments();
}

export function saveComments(comments: Comment[]): void {
  const data = getUserData();
  data.comments = comments;
  saveUserData(data);
}

export function addComment(comment: Comment): void {
  const data = getUserData();
  data.comments.push(comment);
  saveUserData(data);
}

export function updateComment(comment: Comment): void {
  const data = getUserData();
  const index = data.comments.findIndex(c => c.id === comment.id);
  if (index !== -1) {
    data.comments[index] = comment;
    saveUserData(data);
  }
}

export function deleteComment(id: string): void {
  const data = getUserData();
  data.comments = data.comments.filter(c => c.id !== id);
  saveUserData(data);
}

// Resume Records 操作
export function getResumeRecords(): ResumeRecord[] {
  return getUserData().resumeRecords;
}

export function addResumeRecord(record: ResumeRecord): void {
  const data = getUserData();
  data.resumeRecords.push(record);
  saveUserData(data);
}

// 导出/导入数据
export function exportData(): string {
  return JSON.stringify(getUserData(), null, 2);
}

export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString) as UserData;
    saveUserData(data);
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
}

// 重置数据
export function resetData(): void {
  saveUserData(defaultUserData);
}

// 生成唯一ID
export function generateId(): string {
  const webCrypto = globalThis.crypto as Crypto | undefined;
  if (webCrypto?.randomUUID) {
    return webCrypto.randomUUID();
  }

  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
