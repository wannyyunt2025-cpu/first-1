import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { FileText, Download, RefreshCw, Sparkles, Calendar, User, Target, Zap, Trophy, Bot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useProjects } from '@/hooks/useProjects';
import { useProfile } from '@/hooks/useProfile';
import { useSkills } from '@/hooks/useSkills';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/useTheme';
import { rankProjectsByJD, parseJD, getMatchedKeywords } from '@/lib/jdParser';
import { getEducation } from '@/lib/storage';
import { Project } from '@/types';
import { generateResume } from '@/lib/bailian';
import ReactMarkdown from 'react-markdown';

export function ResumeGenerator() {
  const { toast } = useToast();
  const { profile } = useProfile();
  const { publicProjects } = useProjects();
  const { getTopSkills } = useSkills();
  const { style } = useTheme();
  const [jdText, setJdText] = useState('');
  const [rankedProjects, setRankedProjects] = useState<Project[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const [matchedKeywords, setMatchedKeywords] = useState<string[]>([]);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState('');

  const isMinimalist = style === 'minimalist';

  const education = getEducation();
  const topSkills = getTopSkills(10);

  const handleGenerate = () => {
    if (!jdText.trim()) {
      toast({
        title: '请输入JD',
        description: '请粘贴目标岗位的职位描述',
        variant: 'destructive',
      });
      return;
    }

    const parsed = parseJD(jdText);
    const ranked = rankProjectsByJD(publicProjects, jdText);
    
    setRankedProjects(ranked);
    setMatchedKeywords(parsed.keywords);
    setIsGenerated(true);

    toast({
      title: '匹配完成',
      description: `匹配到 ${parsed.keywords.length} 个关键词`,
    });
  };

  const handleAiGenerate = async () => {
    if (!jdText.trim()) {
      toast({
        title: '请输入JD',
        description: '请粘贴目标岗位的职位描述',
        variant: 'destructive',
      });
      return;
    }

    setIsAiGenerating(true);
    setAiResult('');
    
    try {
      // 构建Prompt
      const prompt = `
请根据以下求职者的信息和目标岗位JD，生成一份专业的简历。
要求：
1. 突出求职者与JD匹配的技能和项目经历
2. 使用专业、简洁的语言
3. 输出为Markdown格式

【求职者信息】
姓名：${profile?.name || '未填写'}
职位：${profile?.title || '未填写'}
个人优势：${profile?.slogan || '未填写'}
技能：${topSkills.map(s => s.name).join(', ')}

【项目经历】
${rankedProjects.slice(0, 3).map(p => `
项目：${p.name}
角色：${p.role}
背景：${p.situation}
任务：${p.task}
行动：${p.action}
结果：${p.result}
`).join('\n')}

【教育背景】
${education.map(e => `${e.school} ${e.major} ${e.degree}`).join('\n')}

【目标岗位JD】
${jdText}
      `;

      const result = await generateResume(prompt);
      setAiResult(result);
      toast({
        title: 'AI生成成功',
        description: '简历内容已生成',
      });
    } catch (error) {
      console.error('AI生成失败:', error);
      toast({
        title: '生成失败',
        description: error instanceof Error ? error.message : '请检查网络或API配置',
        variant: 'destructive',
      });
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleReset = () => {
    setJdText('');
    setRankedProjects([]);
    setIsGenerated(false);
    setMatchedKeywords([]);
    setAiResult('');
  };

  const handleDownload = () => {
    toast({
      title: 'V1.1版本即将支持',
      description: '请截图保存当前简历内容',
    });
  };

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const format = (d: Date) => `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
    return `${format(startDate)} - ${format(endDate)}`;
  };

  const isKeywordMatched = (text: string) => {
    return matchedKeywords.some(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  return (
    <div className="space-y-8">
      {/* 操作区域 */}
      <Card className={`border-none shadow-sm ${isMinimalist ? 'bg-white' : 'bg-card'}`}>
        <CardHeader className="pb-8">
          <CardTitle className={`font-black tracking-tight flex items-center gap-2 ${isMinimalist ? 'text-2xl text-slate-900' : ''}`}>
            <Sparkles className={`h-5 w-5 ${isMinimalist ? 'text-slate-900' : 'text-primary'}`} />
            {isMinimalist ? 'AI Resume Optimizer' : '智能简历生成'}
          </CardTitle>
          <CardDescription className={isMinimalist ? 'text-slate-500 font-medium' : ''}>
            {isMinimalist ? 'Paste the target Job Description to generate a tailored resume.' : '粘贴目标岗位的JD，系统将自动匹配您的项目经历并生成定制化简历'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className={`text-[10px] font-black uppercase tracking-widest ${isMinimalist ? 'text-slate-400' : 'text-sm font-medium'}`}>
              {isMinimalist ? 'Job Description (JD)' : '职位描述（JD）'}
            </label>
            <Textarea
              placeholder={isMinimalist ? "Paste job responsibilities and requirements here..." : "请粘贴目标岗位的职位描述，包括岗位职责、技能要求等..."}
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              className={`min-h-[150px] rounded-2xl focus:ring-primary/20 transition-all resize-none ${isMinimalist ? 'bg-slate-50 border-slate-100' : ''}`}
              disabled={isGenerated}
            />
          </div>

          {matchedKeywords.length > 0 && (
            <div className="space-y-3">
              <label className={`text-[10px] font-black uppercase tracking-widest ${isMinimalist ? 'text-slate-400' : 'text-sm font-medium text-muted-foreground'}`}>
                {isMinimalist ? 'Matched Keywords' : '匹配到的关键词'}
              </label>
              <div className="flex flex-wrap gap-2">
                {matchedKeywords.map((keyword, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 ${
                      isMinimalist ? 'bg-primary/5 text-primary border-none' : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            {!isGenerated ? (
              <Button 
                onClick={handleGenerate} 
                className={`h-12 px-8 rounded-xl font-bold shadow-lg active:scale-[0.98] transition-all ${
                  isMinimalist ? 'bg-slate-900 hover:bg-slate-800 text-white' : 'bg-gradient-primary hover:opacity-90'
                }`}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isMinimalist ? 'Match Skills' : '智能匹配'}
              </Button>
            ) : (
              <>
                <Button 
                  onClick={handleReset} 
                  variant="outline" 
                  className={`h-12 px-6 rounded-xl font-bold ${isMinimalist ? 'border-slate-200' : ''}`}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {isMinimalist ? 'Restart' : '重新开始'}
                </Button>
                <Button 
                  onClick={handleAiGenerate} 
                  className={`h-12 px-8 rounded-xl font-bold shadow-lg active:scale-[0.98] transition-all ${
                    isMinimalist ? 'bg-primary hover:opacity-90' : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                  disabled={isAiGenerating}
                >
                  {isAiGenerating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Bot className="h-4 w-4 mr-2" />
                  )}
                  {isAiGenerating ? (isMinimalist ? 'Generating...' : 'AI生成中...') : (isMinimalist ? 'Generate with AI' : '生成完整简历')}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI 生成结果预览 */}
      {aiResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className={`border-none shadow-xl overflow-hidden ${isMinimalist ? 'bg-white rounded-3xl' : 'border-purple-200'}`}>
            <CardHeader className={isMinimalist ? 'bg-slate-50/50 pb-8' : 'bg-purple-50/50'}>
              <CardTitle className={`flex items-center gap-2 ${isMinimalist ? 'text-slate-900 font-black' : 'text-purple-900'}`}>
                <Bot className="h-5 w-5" />
                {isMinimalist ? 'AI Custom Resume' : 'AI 生成建议'}
              </CardTitle>
              <CardDescription className={isMinimalist ? 'text-slate-500 font-medium' : ''}>
                {isMinimalist ? 'Tailored content based on your target position.' : '基于目标职位为您定制的简历内容'}
              </CardDescription>
            </CardHeader>
            <CardContent className={`prose max-w-none pt-8 dark:prose-invert ${isMinimalist ? 'prose-slate' : 'prose-purple'}`}>
              <ReactMarkdown>{aiResult}</ReactMarkdown>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* 原始简历预览区域 */}
      {isGenerated && !aiResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className={`border-none shadow-xl ${isMinimalist ? 'bg-white rounded-3xl' : 'border-primary/50'}`}>
            <CardHeader className={`pb-8 ${isMinimalist ? 'border-b border-slate-50' : 'border-b border-border'}`}>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h2 className={`text-4xl font-black tracking-tighter ${isMinimalist ? 'text-slate-900' : ''}`}>{profile?.name || '姓名'}</h2>
                  <p className={`text-xl font-bold ${isMinimalist ? 'text-primary' : 'text-muted-foreground'}`}>{profile?.title || '职位'}</p>
                  <div className="flex flex-wrap items-center gap-6 mt-4">
                    {profile?.contact.email && (
                      <span className={`text-sm font-bold flex items-center gap-2 ${isMinimalist ? 'text-slate-500' : 'text-muted-foreground'}`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        {profile.contact.email}
                      </span>
                    )}
                    {profile?.contact.wechat && (
                      <span className={`text-sm font-bold flex items-center gap-2 ${isMinimalist ? 'text-slate-500' : 'text-muted-foreground'}`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        {profile.contact.wechat}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-10 pt-10">
              {/* 个人优势 */}
              {profile?.slogan && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Target className={`h-5 w-5 ${isMinimalist ? 'text-slate-900' : 'text-primary'}`} />
                    <h3 className={`text-lg font-black uppercase tracking-widest ${isMinimalist ? 'text-slate-900' : ''}`}>
                      {isMinimalist ? 'Value Proposition' : '个人优势'}
                    </h3>
                  </div>
                  <p className={`leading-relaxed pl-8 ${isMinimalist ? 'text-slate-600 font-medium' : 'text-muted-foreground'}`}>{profile.slogan}</p>
                </div>
              )}

              {isMinimalist ? <div className="h-px bg-slate-50" /> : <Separator />}

              {/* 核心技能 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Zap className={`h-5 w-5 ${isMinimalist ? 'text-slate-900' : 'text-primary'}`} />
                  <h3 className="text-lg font-black uppercase tracking-widest">
                    {isMinimalist ? 'Technical Stack' : '核心技能'}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2 pl-8">
                  {topSkills.map((skill) => {
                    const matched = isKeywordMatched(skill.name);
                    return (
                      <Badge
                        key={skill.id}
                        variant={matched ? "default" : "secondary"}
                        className={cn(
                          "text-[10px] font-black uppercase tracking-widest px-3 py-1.5",
                          matched 
                            ? (isMinimalist ? 'bg-slate-900 text-white border-none' : 'bg-primary text-primary-foreground')
                            : (isMinimalist ? 'bg-slate-50 text-slate-500 border-none' : '')
                        )}
                      >
                        {skill.name}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              {isMinimalist ? <div className="h-px bg-slate-50" /> : <Separator />}

              {/* 项目经历 */}
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <Trophy className={`h-5 w-5 ${isMinimalist ? 'text-slate-900' : 'text-primary'}`} />
                  <h3 className="text-lg font-black uppercase tracking-widest">
                    {isMinimalist ? 'Project Highlights' : '项目经历'}
                  </h3>
                </div>
                <div className="space-y-12 pl-8">
                  {rankedProjects.map((project) => (
                    <div key={project.id} className="space-y-4 group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-xl font-black tracking-tight ${isMinimalist ? 'text-slate-900' : ''}`}>{project.name}</h4>
                          <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest mt-2 text-slate-400">
                            <span className="flex items-center gap-1.5">
                              <User className="h-3 w-3" />
                              {project.role}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-3 w-3" />
                              {formatDateRange(project.startDate, project.endDate)}
                            </span>
                          </div>
                        </div>
                        {getMatchedKeywords(project, jdText).length > 0 && (
                          <Badge variant="outline" className={cn(
                            "font-black text-[10px] tracking-widest uppercase py-1 px-3",
                            isMinimalist ? "border-primary/20 text-primary bg-primary/5" : "border-primary/50 text-primary"
                          )}>
                            {isMinimalist ? 'Score' : '匹配度'}: {getMatchedKeywords(project, jdText).length}
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-4 text-sm leading-relaxed">
                        {project.situation && (
                          <div className="flex gap-3">
                            <span className={`shrink-0 font-black text-[10px] uppercase tracking-widest w-20 pt-1 ${isMinimalist ? 'text-slate-400' : 'text-foreground'}`}>[Context]</span>
                            <span className={isMinimalist ? 'text-slate-600 font-medium' : 'text-muted-foreground'}>{project.situation}</span>
                          </div>
                        )}
                        {project.task && (
                          <div className="flex gap-3">
                            <span className={`shrink-0 font-black text-[10px] uppercase tracking-widest w-20 pt-1 ${isMinimalist ? 'text-slate-400' : 'text-foreground'}`}>[Task]</span>
                            <span className={isMinimalist ? 'text-slate-600 font-medium' : 'text-muted-foreground'}>{project.task}</span>
                          </div>
                        )}
                        {project.action && (
                          <div className="flex gap-3">
                            <span className={`shrink-0 font-black text-[10px] uppercase tracking-widest w-20 pt-1 ${isMinimalist ? 'text-slate-400' : 'text-foreground'}`}>[Action]</span>
                            <span className={isMinimalist ? 'text-slate-600 font-medium' : 'text-muted-foreground'}>{project.action}</span>
                          </div>
                        )}
                        {project.result && (
                          <div className="flex gap-3">
                            <span className={`shrink-0 font-black text-[10px] uppercase tracking-widest w-20 pt-1 ${isMinimalist ? 'text-primary' : 'text-primary'}`}>[Result]</span>
                            <span className={cn(
                              "font-bold",
                              isKeywordMatched(project.result) ? 'text-primary' : (isMinimalist ? 'text-slate-900' : 'text-muted-foreground')
                            )}>
                              {project.result}
                            </span>
                          </div>
                        )}
                      </div>

                      {project.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {project.keywords.map((keyword, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-[10px] font-black uppercase tracking-widest border-slate-100 text-slate-400"
                            >
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 教育背景 */}
              {education.length > 0 && (
                <>
                  {isMinimalist ? <div className="h-px bg-slate-50" /> : <Separator />}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <FileText className={`h-5 w-5 ${isMinimalist ? 'text-slate-900' : 'text-primary'}`} />
                      <h3 className="text-lg font-black uppercase tracking-widest">
                        {isMinimalist ? 'Education' : '教育背景'}
                      </h3>
                    </div>
                    <div className="space-y-6 pl-8">
                      {education.map((edu) => (
                        <div key={edu.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className={`text-base font-black ${isMinimalist ? 'text-slate-900' : ''}`}>{edu.school}</h4>
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                              {formatDateRange(edu.startDate, edu.endDate)}
                            </span>
                          </div>
                          <p className={`text-sm font-bold ${isMinimalist ? 'text-primary' : 'text-muted-foreground'}`}>
                            {edu.degree} · {edu.major}
                          </p>
                          {edu.description && (
                            <p className={`text-sm leading-relaxed ${isMinimalist ? 'text-slate-500 font-medium' : 'text-muted-foreground'}`}>{edu.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
