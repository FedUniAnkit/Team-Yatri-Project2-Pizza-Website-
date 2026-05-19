import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import userService from '../../services/userService';
import authService from '../../services/authService';
import { toast } from 'react-toastify';
import { FaSort, FaSortUp, FaSortDown, FaUserPlus, FaTimes } from 'react-icons/fa';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', role: '', status: '' });
  const [sorting, setSorting] = useState({ sortBy: 'createdAt', order: 'desc' });
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // { type, id, payload }
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', phone: '' });
  const [isInviting, setIsInviting] = useState(false);
  const location = useLocation();

  // Initialize filters from query string (e.g., ?role=customer or ?role=staff)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam && ['customer', 'staff', 'admin'].includes(roleParam)) {
      setFilters(prev => ({ ...prev, role: roleParam }));
    }
  }, [location.search]);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = { ...filters, ...sorting };
      const response = await userService.getAllUsers(params);
      // Tolerate both shapes:
      // 1) { success, data: [...] }
      // 2) [...] (raw array)
      const list = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : response?.data?.data || [];
      // Debug
      // eslint-disable-next-line no-console
      console.log('GET /users params:', params, 'response:', response, 'list.length:', list.length);
      setUsers(list);
      // If filters produced no results, try fetching without filters to verify data exists
      if (list.length === 0 && (filters.role || filters.status || filters.search)) {
        try {
          const fallback = await userService.getAllUsers({ sortBy: sorting.sortBy, order: sorting.order });
          const fallbackList = Array.isArray(fallback)
            ? fallback
            : Array.isArray(fallback?.data)
              ? fallback.data
              : fallback?.data?.data || [];
          // eslint-disable-next-line no-console
          console.log('Fallback fetch (no filters) length:', fallbackList.length);
          if (fallbackList.length > 0) {
            toast.info('No users matched current filters. Showing all users.');
            setUsers(fallbackList);
            // Also clear filters in UI to reflect shown data
            setFilters(prev => ({ ...prev, search: '', role: '', status: '' }));
          }
        } catch (e) {
          // ignore, error already handled by outer catch on next render
        }
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to fetch users.';
      toast.error(`Failed to fetch users: ${msg}`);
      // eslint-disable-next-line no-console
      console.error('GET /users failed', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters, sorting]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSort = (column) => {
    setSorting(prev => ({
      sortBy: column,
      order: prev.sortBy === column && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleSetStatus = async (id, isActive) => {
    try {
      await userService.setUserStatus(id, isActive);
      const action = isActive ? 'activated' : 'deactivated';
      toast.success(`User ${action} successfully!`);
      setConfirmAction(null);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update user status.');
    }
  };

  const handleResetPassword = async (id) => {
    try {
      const result = await userService.adminResetPassword(id);
      if (result.temporaryPassword) {
        toast.success(`Password reset! Temp password: ${result.temporaryPassword}`, { autoClose: 15000 });
      } else {
        toast.success(result.message || 'Password reset email sent!');
      }
      setConfirmAction(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await userService.deleteUser(id);
      toast.success('User deleted successfully!');
      setConfirmAction(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  const handleInviteChange = (e) => {
    const { name, value } = e.target;
    setInviteForm(prev => ({ ...prev, [name]: value }));
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    if (!inviteForm.name || !inviteForm.email) {
      toast.error('Name and email are required.');
      return;
    }
    setIsInviting(true);
    try {
      const result = await authService.createStaff(inviteForm);
      if (result.emailSent) {
        toast.success(`Staff account created for ${result.user?.email || inviteForm.email}. Invitation email sent!`);
      } else {
        toast.warn(`Staff account created but email failed. Temporary password: ${result.temporaryPassword}`, { autoClose: false });
      }
      setShowInviteModal(false);
      setInviteForm({ name: '', email: '', phone: '' });
      fetchUsers();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to create staff account.';
      toast.error(msg);
    } finally {
      setIsInviting(false);
    }
  };

  const SortIcon = ({ column }) => {
    if (sorting.sortBy !== column) return <FaSort />;
    if (sorting.order === 'asc') return <FaSortUp />;
    return <FaSortDown />;
  };

  return (
    <div className="admin-users-container">
      <div className="admin-users-header">
        <h2>Manage Users</h2>
        <button className="invite-staff-btn" onClick={() => setShowInviteModal(true)}>
          <FaUserPlus /> Invite Staff
        </button>
      </div>

      {showInviteModal && (
        <div className="modal-overlay" onClick={() => setShowInviteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Invite New Staff Member</h3>
              <button className="modal-close" onClick={() => setShowInviteModal(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleInviteSubmit} className="invite-form">
              <div className="form-group">
                <label htmlFor="staff-name">Full Name *</label>
                <input
                  id="staff-name"
                  type="text"
                  name="name"
                  placeholder="Enter staff member's name"
                  value={inviteForm.name}
                  onChange={handleInviteChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="staff-email">Email Address *</label>
                <input
                  id="staff-email"
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  value={inviteForm.email}
                  onChange={handleInviteChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="staff-phone">Phone Number</label>
                <input
                  id="staff-phone"
                  type="tel"
                  name="phone"
                  placeholder="Enter phone number (optional)"
                  value={inviteForm.phone}
                  onChange={handleInviteChange}
                />
              </div>
              <p className="invite-note">
                A temporary password will be generated and sent to the staff member's email. They will be required to change it on first login.
              </p>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowInviteModal(false)}>Cancel</button>
                <button type="submit" className="submit-btn" disabled={isInviting}>
                  {isInviting ? 'Sending Invite...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="filters-bar">
        <input
          type="text"
          name="search"
          placeholder="Search by name or email..."
          value={filters.search}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <select name="role" value={filters.role} onChange={handleFilterChange} className="filter-select">
          <option value="">All Roles</option>
          <option value="customer">Customer</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
        <select name="status" value={filters.status} onChange={handleFilterChange} className="filter-select">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {isLoading ? <p>Loading users...</p> : (
        <div className="table-responsive">
          <table className="users-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')}>Name <SortIcon column="name" /></th>
                <th onClick={() => handleSort('email')}>Email <SortIcon column="email" /></th>
                <th onClick={() => handleSort('role')}>Role <SortIcon column="role" /></th>
                <th onClick={() => handleSort('isActive')}>Status <SortIcon column="isActive" /></th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{padding:'1rem', textAlign:'center', color:'#6c757d'}}>
                    No users found.
                    { (filters.role || filters.status || filters.search) && (
                      <>
                        {' '}Try clearing filters. Current filters: 
                        role=<strong>{filters.role || 'all'}</strong>, 
                        status=<strong>{filters.status || 'all'}</strong>, 
                        search=<strong>{filters.search || 'none'}</strong>
                      </>
                    )}
                  </td>
                </tr>
              ) : users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <span className={`status-badge ${
                      user.accountStatus === 'pending_staff_registration' ? 'status-pending' :
                      user.isActive ? 'status-active' : 'status-inactive'
                    }`}>
                      {user.accountStatus === 'pending_staff_registration' ? 'Pending' :
                       user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    {confirmAction?.id === user.id ? (
                      <>
                        <span style={{fontSize:'0.8rem',color:'#e74c3c',fontWeight:600,marginRight:6}}>Confirm?</span>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => {
                            if (confirmAction.type === 'status') handleSetStatus(user.id, confirmAction.payload);
                            else if (confirmAction.type === 'reset') handleResetPassword(user.id);
                            else if (confirmAction.type === 'delete') handleDelete(user.id);
                          }}
                        >Yes</button>
                        <button className="action-btn" onClick={() => setConfirmAction(null)}>No</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setConfirmAction({ type: 'status', id: user.id, payload: !user.isActive })} className="action-btn">
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button onClick={() => setConfirmAction({ type: 'reset', id: user.id })} className="action-btn">Reset Pass</button>
                        <button onClick={() => setConfirmAction({ type: 'delete', id: user.id })} className="action-btn delete-btn">Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
