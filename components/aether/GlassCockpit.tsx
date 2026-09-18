'use client';

import ForgeEditor from './ForgeEditor';
import ProjectCard from './ProjectCard';
import GenesisModal from './GenesisModal'; 
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectDNA } from '../../data/projects';

interface GlassCockpitProps {
  onForgeStateChange: (isForging: boolean) => void;
}

export default function GlassCockpit({ onForgeStateChange }: GlassCockpitProps) {
  const [projects, setProjects] = useState<ProjectDNA[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectDNA | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        if (!res.ok) throw new Error("Network response was not ok");
        
        const data = await res.json();
        
        if (Array.isArray(data)) {
            const formattedProjects = data.map((p: any) => ({
               id: p.id,
               title: p.title,
               tagline: p.tagline,
               category: p.category,
               status: p.status,
               activeUsers: "0",
               lastUpdate: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "Just now"
            })) as unknown as ProjectDNA[];
            
            setProjects(formattedProjects);
        }
      } catch (error) {
console.error("CRITICAL FAILURE:", error);      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleAddProject = async (title: string) => {
    const tempId = `temp-${Date.now()}`;
    
    const optimisticProject = {
      id: tempId,
      title: title,
      category: "SYSTEM",
      tagline: "AUTONOMOUS GENERATIVE ENTITY",
      status: "ACTIVE",
      activeUsers: "0",
      lastUpdate: "Just now"
    } as any as ProjectDNA;

    setProjects(prev => [optimisticProject, ...prev]);

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      
      if (!res.ok) throw new Error("Save failed");

      const savedProject = await res.json();
      
      setProjects(prev => prev.map(p => 
        p.id === tempId ? { 
            ...p, 
            id: savedProject.id, 
            lastUpdate: new Date(savedProject.createdAt).toLocaleDateString() 
        } : p
      ));
      
    } catch (error) {
      console.error("WRITE FAILED", error);
      setProjects(prev => prev.filter(p => p.id !== tempId));
    }
  };

  return (
    <div className="w-full max-w-7xl h-[85vh] overflow-y-auto px-6 py-12 no-scrollbar relative font-sans selection:bg-white selection:text-black">
      <AnimatePresence mode="wait">
        {!selectedProject ? (
          <motion.div key="registry" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
            
            <div className="mb-16 border-l-[1px] border-white pl-8">
              <h2 className="text-6xl font-black tracking-tighter text-white uppercase italic">
                Neural Forge <span className="text-white/20 not-italic">X</span>
              </h2>
              <div className="flex gap-6 mt-6 items-center">
                <p className="text-white/30 tracking-[0.4em] text-[10px] uppercase font-bold">
                  {isLoading ? "ESTABLISHING CONNECTION..." : `DATABASE ONLINE / ${projects.length} NODES`}
                </p>
                <div className="h-[1px] w-24 bg-white/10" />
                <button 
                  onClick={() => setIsGenerating(true)}
                  className="text-[10px] text-white border border-white/20 px-6 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-500 uppercase font-bold tracking-widest"
                >
                  + Generate Project Y
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
              {projects.map((p, index) => (
                <ProjectCard 
                  key={p.id} 
                  project={p} 
                  index={index} 
                  onClick={setSelectedProject} 
                />
              ))}
            </div>

          </motion.div>
        ) : (
          <motion.div key="editor" className="h-full">
            <ForgeEditor 
              project={selectedProject} 
              onClose={() => setSelectedProject(null)} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isGenerating && (
          <GenesisModal 
            onClose={() => setIsGenerating(false)}
            onSuccess={handleAddProject} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}