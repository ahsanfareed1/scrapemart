import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { FolderKanban, Plus, Trash2, Edit2, Package, Calendar } from 'lucide-react';
import './Projects.css';

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    store_url: '',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      if (editingProject) {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update(formData)
          .eq('id', editingProject.id);

        if (error) throw error;
      } else {
        // Create new project
        const { error } = await supabase
          .from('projects')
          .insert([{ ...formData, user_id: user.id }]);

        if (error) throw error;
      }

      setShowModal(false);
      setEditingProject(null);
      setFormData({ name: '', description: '', store_url: '' });
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description || '',
      store_url: project.store_url || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project? All scraped products will be deleted.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const openModal = () => {
    setEditingProject(null);
    setFormData({ name: '', description: '', store_url: '' });
    setShowModal(true);
  };

  return (
    <div className="projects-page">
      <div className="page-header">
        <div>
          <h1>Projects</h1>
          <p>Organize your Shopify scraping tasks</p>
        </div>
        <button className="btn-primary" onClick={openModal}>
          <Plus size={20} /> New Project
        </button>
      </div>

      {loading ? (
        <div className="loading-state">Loading projects...</div>
      ) : projects.length > 0 ? (
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-header">
                <div className="project-icon">
                  <FolderKanban size={24} />
                </div>
                <div className="project-actions">
                  <button className="icon-btn" onClick={() => handleEdit(project)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="icon-btn danger" onClick={() => handleDelete(project.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <h3>{project.name}</h3>
              <p className="project-description">
                {project.description || 'No description'}
              </p>

              <div className="project-meta">
                <div className="meta-item">
                  <Package size={16} />
                  <span>{project.product_count || 0} products</span>
                </div>
                <div className="meta-item">
                  <Calendar size={16} />
                  <span>{new Date(project.updated_at).toLocaleDateString()}</span>
                </div>
              </div>

              <button 
                className="btn-secondary wide"
                onClick={() => navigate(`/dashboard/scraper/${project.id}`)}
              >
                Open Project
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <FolderKanban size={64} />
          <h3>No projects yet</h3>
          <p>Create your first project to start scraping Shopify stores</p>
          <button className="btn-primary" onClick={openModal}>
            <Plus size={20} /> Create Project
          </button>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingProject ? 'Edit Project' : 'New Project'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Project Name *</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., My Store Migration"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional project description"
                  rows={3}
                />
              </div>

              <div>
                <label htmlFor="store_url">Store URL</label>
                <input
                  type="url"
                  id="store_url"
                  value={formData.store_url}
                  onChange={(e) => setFormData({ ...formData, store_url: e.target.value })}
                  placeholder="https://example.myshopify.com"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingProject ? 'Update' : 'Create'} Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;















