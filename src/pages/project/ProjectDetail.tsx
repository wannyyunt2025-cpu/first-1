import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Target, Lightbulb, Zap, Trophy, Mail, Github, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { useProjects } from '@/hooks/useProjects';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ContactModal } from '@/components/home/ContactModal';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getById } = useProjects();
  const [showContactModal, setShowContactModal] = useState(false);
  
  const project = getById(id || '');

  useEffect(() => {
    document.title = project ? `${project.name} | 项目详情` : '项目不存在 | 动态个人主页';
  }, [project]);

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">项目不存在</h1>
          <Link to="/">
            <Button variant="outline">返回首页</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const format = (d: Date) => `${d.getFullYear()}年${d.getMonth() + 1}月`;
    return `${format(startDate)} - ${format(endDate)}`;
  };

  const starItems = [
    { 
      key: 'situation', 
      title: '背景情境 (Situation)', 
      content: project.situation,
      icon: Target,
      color: 'text-blue-400'
    },
    { 
      key: 'task', 
      title: '任务目标 (Task)', 
      content: project.task,
      icon: Lightbulb,
      color: 'text-yellow-400'
    },
    { 
      key: 'action', 
      title: '行动方案 (Action)', 
      content: project.action,
      icon: Zap,
      color: 'text-green-400'
    },
    { 
      key: 'result', 
      title: '成果产出 (Result)', 
      content: project.result,
      icon: Trophy,
      color: 'text-purple-400'
    },
  ];

  const projectLinks = [
    { label: 'GitHub', url: project.githubUrl, icon: Github },
    { label: '在线演示', url: project.demoUrl, icon: ExternalLink },
    { label: '作品集', url: project.portfolioUrl, icon: ExternalLink },
  ].filter((item) => item.url);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              返回
            </Button>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-display-sm font-bold text-foreground mb-4">
              {project.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <span className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {project.role}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDateRange(project.startDate, project.endDate)}
              </span>
            </div>
            {project.summary && (
              <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground">
                {project.summary}
              </p>
            )}
            {projectLinks.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                {projectLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </a>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Keywords */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2 mb-10"
          >
            {project.keywords.map((keyword, index) => (
              <Badge 
                key={index}
                className="bg-primary/10 text-primary border border-primary/30"
              >
                {keyword}
              </Badge>
            ))}
          </motion.div>

          {/* Image Carousel */}
          {project.images && project.images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <Carousel className="w-full max-w-4xl mx-auto">
                <CarouselContent>
                  {project.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-video rounded-xl overflow-hidden bg-secondary">
                        <img 
                          src={image} 
                          alt={`${project.name} - 图片 ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {project.images.length > 1 && (
                  <>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                  </>
                )}
              </Carousel>
            </motion.div>
          )}

          {/* STAR Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {starItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className="h-full bg-card border-border/50 hover:border-primary/30 transition-colors">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <div className={`p-2 rounded-lg bg-secondary ${item.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.content}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {project.reflection && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              className="mx-auto mt-8 max-w-5xl"
            >
              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="rounded-lg bg-secondary p-2 text-primary">
                      <RefreshCw className="h-5 w-5" />
                    </div>
                    项目复盘 / 下一步
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {project.reflection}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Back to home */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12"
          >
            <Link to="/#projects">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 border-primary/50 text-primary hover:bg-primary/10"
              >
                <ArrowLeft className="h-4 w-4" />
                查看更多项目
              </Button>
            </Link>
            <Button
              variant="default"
              size="lg"
              onClick={() => setShowContactModal(true)}
              className="gap-2 bg-gradient-primary hover:opacity-90"
            >
              <Mail className="h-4 w-4" />
              获取联系方式
            </Button>
          </motion.div>
        </div>
      </main>

      <Footer />
      
      <ContactModal 
        open={showContactModal} 
        onOpenChange={setShowContactModal} 
      />
    </div>
  );
}
