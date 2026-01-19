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

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(() => getProjects());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const refresh = useCallback(() => {
    setProjects(getProjects());
  }, []);

  const publicProjects = getPublicProjects();

  const getById = useCallback((id: string) => {
    return getProjectById(id);
  }, []);

  const add = useCallback((project: Omit<Project, 'id' | 'sortOrder'>) => {
    setIsLoading(true);
    try {
      const newProject: Project = {
        ...project,
        id: generateId(),
        sortOrder: projects.length + 1,
      };
      addProject(newProject);
      refresh();
      return newProject;
    } finally {
      setIsLoading(false);
    }
  }, [projects.length, refresh]);

  const update = useCallback((project: Project) => {
    setIsLoading(true);
    try {
      updateProject(project);
      refresh();
    } finally {
      setIsLoading(false);
    }
  }, [refresh]);

  const remove = useCallback((id: string) => {
    setIsLoading(true);
    try {
      deleteProject(id);
      refresh();
    } finally {
      setIsLoading(false);
    }
  }, [refresh]);

  const reorder = useCallback((newOrder: string[]) => {
    setIsLoading(true);
    try {
      const reorderedProjects = newOrder.map((id, index) => {
        const project = projects.find(p => p.id === id);
        if (project) {
          return { ...project, sortOrder: index + 1 };
        }
        return null;
      }).filter(Boolean) as Project[];
      
      saveProjects(reorderedProjects);
      refresh();
    } finally {
      setIsLoading(false);
    }
  }, [projects, refresh]);

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
