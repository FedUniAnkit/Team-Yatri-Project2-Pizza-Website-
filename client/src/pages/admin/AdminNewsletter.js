import React, { useState, useEffect, useCallback } from 'react';
import newsletterService from '../../services/newsletterService';
import { toast } from 'react-toastify';
import './AdminNewsletter.css';

const AdminNewsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [isLoadingSubscribers, setIsLoadingSubscribers] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [emailData, setEmailData] = useState({ subject: '', content: '' });

  const fetchSubscribers = useCallback(async () => {
    try {
      setIsLoadingSubscribers(true);
      const response = await newsletterService.getAllSubscribers();
      setSubscribers(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch subscribers.');
    } finally {
      setIsLoadingSubscribers(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmailData(prev => ({ ...prev, [name]: value }));
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!emailData.subject || !emailData.content) {
      toast.warn('Please provide a subject and content for the email.');
      return;
    }
    
    setIsSending(true);
    try {
      const response = await newsletterService.sendMarketingEmail(emailData);
      toast.success(response.message || 'Marketing email sent successfully!');
      setEmailData({ subject: '', content: '' }); // Clear form
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send email.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="admin-newsletter-container">
      <h2>Newsletter Management</h2>

      <div className="newsletter-section">
        <h3>Send Marketing Email</h3>
        <form onSubmit={handleSendEmail} className="email-form">
          <input
            type="text"
            name="subject"
            placeholder="Email Subject"
            value={emailData.subject}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="content"
            placeholder="Email Content (HTML is supported)"
            rows="10"
            value={emailData.content}
            onChange={handleInputChange}
            required
          ></textarea>
          <button type="submit" disabled={isSending || subscribers.length === 0}>
            {isSending ? 'Sending...' : `Send to ${subscribers.length} Subscribers`}
          </button>
        </form>
      </div>

      <div className="newsletter-section">
        <h3>Active Subscribers ({subscribers.length})</h3>
        {isLoadingSubscribers ? (
          <p>Loading subscribers...</p>
        ) : (
          <div className="subscribers-list">
            {subscribers.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Subscribed On</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map(sub => (
                    <tr key={sub.id}>
                      <td>{sub.email}</td>
                      <td>{new Date(sub.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No active subscribers found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNewsletter;
