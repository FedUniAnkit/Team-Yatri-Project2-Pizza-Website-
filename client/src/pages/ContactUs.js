import React, { useState } from 'react';
import { FiMapPin, FiMail, FiPhone, FiClock, FiSend } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './ContactUs.css';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      toast.success('Message sent successfully! We will get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
      setSending(false);
    }, 1000);
  };

  return (
    <div className="contact-page">
      {/* Hero */}
      <div className="contact-hero">
        <p className="contact-eyebrow">Connect With Us</p>
        <h1>CONTACT US</h1>
        <p className="contact-subtext">
          We align leaders around a shared purpose and strategic story that catalyzes their business and brand to take action.
        </p>
      </div>

      {/* Info Cards + Map */}
      <div className="contact-content">
        <div className="contact-layout">
          <div className="contact-panel">
            <div className="panel-item">
              <FiMapPin />
              <div>
                <h3>Address</h3>
                <p>IIBIT Adelaide<br />127 Rundle Mall<br />Adelaide SA 5000</p>
              </div>
            </div>
            <div className="panel-item">
              <FiMail />
              <div>
                <h3>Email</h3>
                <p>hello@komorebi-pizza.com<br />support@komorebi-pizza.com</p>
              </div>
            </div>
            <div className="panel-item">
              <FiPhone />
              <div>
                <h3>Call Us</h3>
                <p>(08) 8123 4567<br />(08) 8123 4568</p>
              </div>
            </div>
            <div className="panel-item">
              <FiClock />
              <div>
                <h3>Opening Hours</h3>
                <p>Mon – Fri: 11:00 AM – 10:00 PM<br />Sat – Sun: 10:00 AM – 11:00 PM</p>
              </div>
            </div>
          </div>

          <div className="contact-map">
            <iframe
              title="Komorebi Adelaide"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3201.6562517933873!2d138.59796447648017!3d-34.922169873290724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ab0ced7031e1ef1%3A0x2908b1dd7c10a19d!2s127%20Rundle%20Mall%2C%20Adelaide%20SA%205000!5e0!3m2!1sen!2sau!4v1715620000000!5m2!1sen!2sau"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="contact-form-section">
        <h2>Send Us a Message</h2>
        <p className="form-subtitle">Have a question, feedback, or a catering request? Fill out the form below.</p>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Your Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="How can we help?"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Write your message here..."
              rows="6"
              required
            />
          </div>
          <button type="submit" className="contact-submit-btn" disabled={sending}>
            {sending ? 'Sending...' : <><FiSend /> Send Message</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
