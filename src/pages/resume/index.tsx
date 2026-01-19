import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Download, RefreshCw, Sparkles, Calendar, User, Target, Zap, Trophy } from 'lucide-react';
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

export default function Resume() {
  const { toast } = useToast();
  const { profile } = useProfile();
  const { publicProjects } = useProjects();
  const { getTopSkills } = useSkills();
  const [jdText, setJdText] = useState('');
  const [rankedProjects, setRankedProjects] = useState<Project[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const [matchedKeywords, setMatchedKeywords] = useState<string[]>([]);

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
      title: '生成成功',
      description: `匹配到 ${parsed.keywords.length} 个关键词`,
    });
  };

  const handleReset = () => {
    setJdText('');
    setRankedProjects([]);
    setIsGenerated(false);
    setMatchedKeywords([]);
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                智能简历生成
              </h1>
            </div>
            {isGenerated && (
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleReset}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  重新生成
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleDownload}
                  className="bg-gradient-primary hover:opacity-90 gap-2"
                >
                  <Download className="h-4 w-4" />
                  下载PDF
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-8">
        {!isGenerated ? (
          /* JD Input Section */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <Card className="bg-card border-border/50">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">智能简历生成</CardTitle>
                <CardDescription className="text-base">
                  粘贴目标岗位的JD，系统将自动匹配您的经历并重新排序
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Textarea
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    placeholder="请粘贴目标岗位的职位描述（JD）..."
                    className="bg-secondary/50 min-h-[200px] resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    提示：JD中包含的技术栈、职位要求等关键词会被自动提取并匹配
                  </p>
                </div>

                <Button 
                  onClick={handleGenerate}
                  disabled={!jdText.trim()}
                  className="w-full bg-gradient-primary hover:opacity-90 gap-2 h-12 text-lg"
                >
                  <Sparkles className="h-5 w-5" />
                  生成定制简历
                </Button>

                {/* Preview of available data */}
                <div className="pt-4 border-t border-border">
                  <h4 className="text-sm font-medium text-foreground mb-3">可用数据预览</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="p-3 rounded-lg bg-secondary/30">
                      <p className="text-2xl font-bold text-primary">{publicProjects.length}</p>
                      <p className="text-xs text-muted-foreground">项目经历</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/30">
                      <p className="text-2xl font-bold text-primary">{topSkills.length}</p>
                      <p className="text-xs text-muted-foreground">技能标签</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/30">
                      <p className="text-2xl font-bold text-primary">{education.length}</p>
                      <p className="text-xs text-muted-foreground">教育背景</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/30">
                      <p className="text-2xl font-bold text-primary">STAR</p>
                      <p className="text-xs text-muted-foreground">描述法则</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          /* Resume Preview */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Matched Keywords */}
            {matchedKeywords.length > 0 && (
              <div className="mb-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm text-primary mb-2">匹配到的关键词：</p>
                <div className="flex flex-wrap gap-2">
                  {matchedKeywords.map((keyword, idx) => (
                    <Badge key={idx} className="bg-primary/20 text-primary">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Resume Content */}
            <Card className="bg-card border-border/50 overflow-hidden">
              <div className="bg-gradient-primary p-8 text-center">
                <h1 className="text-3xl font-bold text-primary-foreground mb-2">
                  {profile.name}
                </h1>
                <p className="text-xl text-primary-foreground/90 mb-3">
                  {profile.title}
                </p>
                <p className="text-primary-foreground/70">
                  {profile.contact.email} | {profile.contact.wechat}
                </p>
              </div>

              <CardContent className="p-8 space-y-8">
                {/* Professional Summary */}
                <section>
                  <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    个人简介
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {profile.slogan}
                  </p>
                </section>

                <Separator />

                {/* Skills */}
                <section>
                  <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    核心技能
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {topSkills.map((skill) => (
                      <Badge 
                        key={skill.id}
                        className={
                          isKeywordMatched(skill.name)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground'
                        }
                      >
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </section>

                <Separator />

                {/* Projects - Ranked */}
                <section>
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    项目经历
                    <span className="text-xs font-normal text-muted-foreground ml-2">
                      (已按匹配度排序)
                    </span>
                  </h2>
                  <div className="space-y-6">
                    {rankedProjects.map((project, index) => {
                      const projectMatches = getMatchedKeywords(project, jdText);
                      return (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-4 rounded-lg border ${
                            projectMatches.length > 0 
                              ? 'border-primary/30 bg-primary/5' 
                              : 'border-border/30 bg-secondary/20'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {project.name}
                                {projectMatches.length > 0 && (
                                  <Badge className="ml-2 bg-primary/20 text-primary text-xs">
                                    高匹配
                                  </Badge>
                                )}
                              </h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-3 mt-1">
                                <span className="flex items-center gap-1">
                                  <User className="h-3.5 w-3.5" />
                                  {project.role}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {formatDateRange(project.startDate, project.endDate)}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2 text-sm text-muted-foreground">
                            <p><strong className="text-foreground">背景：</strong>{project.situation}</p>
                            <p><strong className="text-foreground">任务：</strong>{project.task}</p>
                            <p><strong className="text-foreground">行动：</strong>{project.action}</p>
                            <p className="text-foreground font-medium">
                              <strong>成果：</strong>{project.result}
                            </p>
                          </div>

                          {project.keywords.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {project.keywords.map((keyword, idx) => (
                                <Badge 
                                  key={idx} 
                                  variant="outline"
                                  className={
                                    matchedKeywords.some(k => 
                                      k.toLowerCase() === keyword.toLowerCase()
                                    )
                                      ? 'border-primary text-primary'
                                      : 'border-border text-muted-foreground'
                                  }
                                >
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </section>

                {/* Education */}
                {education.length > 0 && (
                  <>
                    <Separator />
                    <section>
                      <h2 className="text-lg font-semibold text-foreground mb-3">
                        教育背景
                      </h2>
                      <div className="space-y-3">
                        {education.map((edu) => (
                          <div key={edu.id}>
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-foreground">{edu.school}</p>
                                <p className="text-sm text-muted-foreground">
                                  {edu.degree} - {edu.major}
                                </p>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {edu.startDate} - {edu.endDate}
                              </p>
                            </div>
                            {edu.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {edu.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleReset}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                重新生成
              </Button>
              <Button 
                size="lg"
                onClick={handleDownload}
                className="bg-gradient-primary hover:opacity-90 gap-2"
              >
                <Download className="h-4 w-4" />
                下载PDF
              </Button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
