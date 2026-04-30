import React, { useState, useEffect, useCallback } from 'react';
import newsletterService from '../../services/newsletterService';
import { toast } from 'react-toastify';
import './AdminNewsletter.css';

const AdminNewsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [isLoadingSubscribers, setIsLoadingSubscribers] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [emailData, setEmailData] = useState({ subject: '', content: '', promoCode: '', audience: 'all' });
  const [recipientCounts, setRecipientCounts] = useState({ customers: 0, subscribers: 0, all: 0 });

  const fetchSubscribers = useCallback(async () => {
    try {
      setIsLoadingSubscribers(true);
      const [subsResponse, countsResponse] = await Promise.all([
        newsletterService.getAllSubscribers(),
        newsletterService.getRecipientCounts(),
      ]);
      setSubscribers(subsResponse.data || []);
      setRecipientCounts(countsResponse.data || { customers: 0, subscribers: 0, all: 0 });
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
      const response = await newsletterService.sendPromotionalEmail(emailData);
      toast.success(response.message || 'Promotional email sent successfully!');
      if (response.details) {
        toast.info(`Sent to ${response.details.successful} recipients. Failed: ${response.details.failed}`);
      }
      setEmailData({ subject: '', content: '', promoCode: '', audience: 'all' }); // Clear form
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send email.');
    } finally {
      setIsSending(false);
    }
  };

  const getRecipientCount = () => {
    if (emailData.audience === 'subscribers') return recipientCounts.subscribers;
    if (emailData.audience === 'customers') return recipientCounts.customers;
    return recipientCounts.all;
  };

  return (
    <div className="admin-newsletter-container">
      <h2>Newsletter Management</h2>

      <div className="newsletter-section">
        <h3>Send Promotional Email</h3>
        <form onSubmit={handleSendEmail} className="email-form">
          <div className="form-group">
            <label>Audience</label>
            <select
              name="audience"
              value={emailData.audience}
              onChange={handleInputChange}
              className="audience-select"
            >
              <option value="all">All (Customers + Subscribers)</option>
              <option value="customers">Registered Customers Only</option>
              <option value="subscribers">Newsletter Subscribers Only</option>
            </select>
            <small>Recipients: ~{getRecipientCount()}</small>
          </div>

          <div className="form-group">
            <label>Email Subject *</label>
            <input
              type="text"
              name="subject"
              placeholder="e.g., 🍕 Special Offer: 20% Off Your Next Order!"
              value={emailData.subject}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Promo Code (Optional)</label>
            <input
              type="text"
              name="promoCode"
              placeholder="e.g., SAVE20"
              value={emailData.promoCode}
              onChange={handleInputChange}
            />
            <small>If provided, will be displayed prominently in the email</small>
          </div>

          <div className="form-group">
            <label>Email Content * (HTML supported)</label>
            <textarea
              name="content"
              placeholder="Enter your promotional message here. HTML is supported for formatting."
              rows="10"
              value={emailData.content}
              onChange={handleInputChange}
              required
            ></textarea>
            <small>Tip: Use &lt;strong&gt; for bold, &lt;em&gt; for italic, &lt;br&gt; for line breaks</small>
          </div>

          <button type="submit" disabled={isSending || getRecipientCount() === 0} className="send-button">
            {isSending ? '📧 Sending...' : `📧 Send to ${getRecipientCount()} Recipients`}
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
