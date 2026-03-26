import React, { useState, useEffect, useCallback } from 'react';
import contentService from '../../services/contentService';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import './AdminContent.css';

const AdminContent = () => {
  const [blocks, setBlocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [currentBlock, setCurrentBlock] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const fetchContentBlocks = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await contentService.getAllContent();
      setBlocks(response.data || []);
    } catch (err) {
      toast.error('Failed to fetch content.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContentBlocks();
  }, [fetchContentBlocks]);

  const handleOpenModal = (mode, block = null) => {
    setModalMode(mode);
    if (mode === 'create') {
      setCurrentBlock({ key: '', title: '', type: 'text', content: '' });
    } else {
      setCurrentBlock({ ...block });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentBlock(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentBlock(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        await contentService.createContentBlock(currentBlock);
        toast.success('Content block created successfully!');
      } else {
        await contentService.updateContentBlock(currentBlock.id, currentBlock);
        toast.success('Content block updated successfully!');
      }
      fetchContentBlocks();
      handleCloseModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await contentService.deleteContentBlock(id);
      toast.success('Content block deleted successfully!');
      setConfirmDeleteId(null);
      fetchContentBlocks();
    } catch (err) {
      toast.error('Failed to delete content block.');
    }
  };

  return (
    <div className="admin-content-container">
      <div className="header-with-action">
        <h2>Manage Website Content</h2>
        <button onClick={() => handleOpenModal('create')} className="create-btn">
          <FaPlus /> Create New
        </button>
      </div>

      {isLoading ? <p>Loading content...</p> : (
        <div className="content-blocks-list">
          {blocks.map(block => (
            <div key={block.id} className="content-block-card">
              <h4>{block.title}</h4>
              <p><small>Key: <code>{block.key}</code> | Type: {block.type}</small></p>
              <p className="content-preview">{block.content.substring(0, 100)}...</p>
              <div className="card-footer">
                <small>Last updated by: {block.updatedBy?.name || 'N/A'}</small>
                <div className="card-actions">
                  <button onClick={() => handleOpenModal('edit', block)} className="icon-btn edit-btn"><FaEdit /></button>
                  {confirmDeleteId === block.id ? (
                    <>
                      <button onClick={() => handleDelete(block.id)} className="icon-btn delete-btn" title="Confirm delete">✓</button>
                      <button onClick={() => setConfirmDeleteId(null)} className="icon-btn" title="Cancel">✕</button>
                    </>
                  ) : (
                    <button onClick={() => setConfirmDeleteId(block.id)} className="icon-btn delete-btn"><FaTrash /></button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{modalMode === 'create' ? 'Create New Content Block' : `Edit: ${currentBlock.title}`}</h3>
            <form onSubmit={handleSubmit}>
              <input type="text" name="title" value={currentBlock.title} onChange={handleInputChange} placeholder="Title" required />
              <input type="text" name="key" value={currentBlock.key} onChange={handleInputChange} placeholder="Unique Key (e.g., about-us)" required disabled={modalMode === 'edit'} />
              <select name="type" value={currentBlock.type} onChange={handleInputChange}>
                <option value="text">Text</option>
                <option value="html">HTML</option>
                <option value="markdown">Markdown</option>
                <option value="image_url">Image URL</option>
                <option value="json">JSON</option>
              </select>
              <textarea name="content" value={currentBlock.content} onChange={handleInputChange} placeholder="Content" rows="10" required />
              <div className="modal-actions">
                <button type="submit" className="save-btn">Save Changes</button>
                <button type="button" onClick={handleCloseModal} className="cancel-btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContent;
