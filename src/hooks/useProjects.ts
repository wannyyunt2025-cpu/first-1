import { useState, useEffect, useCallback } from 'react';
import { Project } from '@/types';
import { 
  getProjects, 
  getPublicProjects, 
  getProjectById, 
  saveProjects, 
  addProject, 
  updateProject, 
  deleteProject, 
  generateId 
} from '@/lib/storage';
import { database, isDatabaseAvailable } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(() => getProjects());
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    if (await isDatabaseAvailable()) {
      try {
        const data = await database.getProjects();
        if (data && data.length > 0) {
          setProjects(data);
          saveProjects(data);
        }
      } catch (error) {
        console.error('Failed to load projects:', error);
      }
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refresh = loadData;

  const publicProjects = projects.filter(p => p.isPublic);

  const getById = useCallback((id: string) => {
    return projects.find(p => p.id === id);
  }, [projects]);

  const add = useCallback(async (project: Omit<Project, 'id' | 'sortOrder'>) => {
    setIsLoading(true);
    try {
      if (await isDatabaseAvailable()) {
        // Database First
        const projectData = {
          ...project,
          sortOrder: projects.length + 1,
        };
        const createdProject = await database.createProject(projectData);
        
        if (createdProject) {
          setProjects(prev => {
            const newList = [...prev, createdProject];
            saveProjects(newList); // Sync to local
            return newList;
          });
          toast({ title: "项目添加成功" });
          return createdProject;
        } else {
           throw new Error('Database creation failed');
        }
      } else {
        // Fallback to local
        const newProject: Project = {
          ...project,
          id: generateId(),
          sortOrder: projects.length + 1,
        };
        
        addProject(newProject);
        setProjects(prev => [...prev, newProject]);
        toast({ title: "项目添加成功 (本地模式)" });
        return newProject;
      }
    } catch (error) {
      console.error('Failed to add project:', error);
      toast({ title: "添加失败", variant: "destructive" });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [projects.length, toast]);

  const update = useCallback(async (project: Project) => {
    setIsLoading(true);
    try {
      if (await isDatabaseAvailable()) {
        await database.updateProject(project.id, project);
        setProjects(prev => {
          const newList = prev.map(p => p.id === project.id ? project : p);
          saveProjects(newList);
          return newList;
        });
      } else {
        updateProject(project);
        setProjects(prev => prev.map(p => p.id === project.id ? project : p));
      }
      
      toast({ title: "项目更新成功" });
    } catch (error) {
      console.error('Failed to update project:', error);
      toast({ title: "更新失败", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const remove = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      if (await isDatabaseAvailable()) {
        await database.deleteProject(id);
        setProjects(prev => {
          const newList = prev.filter(p => p.id !== id);
          saveProjects(newList);
          return newList;
        });
      } else {
        deleteProject(id);
        setProjects(prev => prev.filter(p => p.id !== id));
      }
      
      toast({ title: "项目删除成功" });
    } catch (error) {
      console.error('Failed to delete project:', error);
      toast({ title: "删除失败", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const reorder = useCallback(async (newOrder: string[]) => {
    setIsLoading(true);
    try {
      // Local logic
      const reorderedProjects = newOrder.map((id, index) => {
        const project = projects.find(p => p.id === id);
        if (project) {
          return { ...project, sortOrder: index + 1 };
        }
        return null;
      }).filter(Boolean) as Project[];
      
      saveProjects(reorderedProjects);
      setProjects(reorderedProjects);

      // Remote logic
      if (await isDatabaseAvailable()) {
        await Promise.all(reorderedProjects.map(p => 
          database.updateProject(p.id, { sortOrder: p.sortOrder })
        ));
      }
    } catch (error) {
        console.error('Failed to reorder projects:', error);
    } finally {
      setIsLoading(false);
    }
  }, [projects]);

  return {
    projects,
    publicProjects,
    isLoading,
    getById,
    add,
    update,
    remove,
    reorder,
    refresh,
  };
}
