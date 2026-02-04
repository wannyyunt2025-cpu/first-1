import { useState } from 'react';
import { motion } from 'framer-motion';
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
  const [jdText, setJdText] = useState('');
  const [rankedProjects, setRankedProjects] = useState<Project[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const [matchedKeywords, setMatchedKeywords] = useState<string[]>([]);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState('');

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
    <div className="space-y-6">
      {/* 操作区域 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            智能简历生成
          </CardTitle>
          <CardDescription>
            粘贴目标岗位的JD，系统将自动匹配您的项目经历并生成定制化简历
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">职位描述（JD）</label>
            <Textarea
              placeholder="请粘贴目标岗位的职位描述，包括岗位职责、技能要求等..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              className="min-h-[150px] resize-none"
              disabled={isGenerated}
            />
          </div>

          {matchedKeywords.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                匹配到的关键词
              </label>
              <div className="flex flex-wrap gap-2">
                {matchedKeywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {!isGenerated ? (
              <Button onClick={handleGenerate} className="gap-2">
                <Sparkles className="h-4 w-4" />
                智能匹配
              </Button>
            ) : (
              <>
                <Button onClick={handleReset} variant="outline" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  重新开始
                </Button>
                <Button 
                  onClick={handleAiGenerate} 
                  className="gap-2 bg-purple-600 hover:bg-purple-700"
                  disabled={isAiGenerating}
                >
                  {isAiGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                  {isAiGenerating ? 'AI生成中...' : '生成完整简历'}
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
          <Card className="border-purple-200 shadow-lg">
            <CardHeader className="bg-purple-50/50">
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <Bot className="h-5 w-5" />
                AI 生成建议
              </CardTitle>
              <CardDescription>
                基于目标职位为您定制的简历内容
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-purple max-w-none pt-6 dark:prose-invert">
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
          <Card className="border-primary/50">
            <CardHeader className="border-b border-border">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h2 className="text-3xl font-bold">{profile?.name || '姓名'}</h2>
                  <p className="text-lg text-muted-foreground">{profile?.title || '职位'}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                    {profile?.contact.email && (
                      <span>📧 {profile.contact.email}</span>
                    )}
                    {profile?.contact.wechat && (
                      <span>💬 {profile.contact.wechat}</span>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              {/* 个人优势 */}
              {profile?.slogan && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">个人优势</h3>
                  </div>
                  <p className="text-muted-foreground pl-7">{profile.slogan}</p>
                </div>
              )}

              <Separator />

              {/* 核心技能 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">核心技能</h3>
                </div>
                <div className="flex flex-wrap gap-2 pl-7">
                  {topSkills.map((skill) => {
                    const matched = isKeywordMatched(skill.name);
                    return (
                      <Badge
                        key={skill.id}
                        variant={matched ? "default" : "secondary"}
                        className={matched ? 'bg-primary text-primary-foreground' : ''}
                      >
                        {skill.name}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* 项目经历 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">项目经历</h3>
                </div>
                <div className="space-y-6 pl-7">
                  {rankedProjects.map((project) => (
                    <div key={project.id} className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-base">{project.name}</h4>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {project.role}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDateRange(project.startDate, project.endDate)}
                            </span>
                          </div>
                        </div>
                        {getMatchedKeywords(project, jdText).length > 0 && (
                          <Badge variant="outline" className="border-primary/50 text-primary">
                            匹配度: {getMatchedKeywords(project, jdText).length}
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-2 text-sm">
                        {project.situation && (
                          <p>
                            <span className="font-medium text-foreground">【项目背景】</span>
                            <span className="text-muted-foreground">{project.situation}</span>
                          </p>
                        )}
                        {project.task && (
                          <p>
                            <span className="font-medium text-foreground">【主要任务】</span>
                            <span className="text-muted-foreground">{project.task}</span>
                          </p>
                        )}
                        {project.action && (
                          <p>
                            <span className="font-medium text-foreground">【实施方案】</span>
                            <span className="text-muted-foreground">{project.action}</span>
                          </p>
                        )}
                        {project.result && (
                          <p>
                            <span className="font-medium text-primary">【项目成果】</span>
                            <span className={isKeywordMatched(project.result) ? 'text-primary font-medium' : 'text-muted-foreground'}>
                              {project.result}
                            </span>
                          </p>
                        )}
                      </div>

                      {project.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {project.keywords.map((keyword, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
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
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">教育背景</h3>
                    </div>
                    <div className="space-y-3 pl-7">
                      {education.map((edu) => (
                        <div key={edu.id} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{edu.school}</h4>
                            <span className="text-sm text-muted-foreground">
                              {formatDateRange(edu.startDate, edu.endDate)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {edu.degree} · {edu.major}
                          </p>
                          {edu.description && (
                            <p className="text-sm text-muted-foreground">{edu.description}</p>
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
