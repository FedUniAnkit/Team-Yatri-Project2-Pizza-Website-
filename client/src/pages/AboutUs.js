import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import aboutImage from '../assets/about.jpg';
import woodovenImage from '../assets/woodoven.jpg';
import logo from '../assets/logo.jpg';
import './AboutUs.css';

const REVIEWS = [
  { name: 'Sarah M.', rating: 5, text: 'Absolutely the best pizza in Adelaide! The wood-fired crust is perfection and the toppings are always fresh. My family orders here every Friday.' },
  { name: 'James T.', rating: 5, text: 'The attention to detail here is incredible. You can taste the quality in every bite. Komorebi has ruined all other pizza for me!' },
  { name: 'Priya K.', rating: 5, text: 'Love the fusion concept — Italian soul with Japanese precision. The delivery is always fast and the pizza arrives piping hot.' },
  { name: 'Daniel W.', rating: 4, text: 'Great flavours, generous toppings, and the dough is perfect. The truffle mushroom pizza is a must-try. Will keep coming back.' },
  { name: 'Emma L.', rating: 5, text: 'The gluten-free options are incredible — finally a place that doesn\'t compromise on taste. Five stars!' },
  { name: 'Raj P.', rating: 5, text: 'Ordered for a party of 20. Every single person loved it. The variety and quality is unmatched. Thank you Komorebi!' },
];

const JOURNEY_STEPS = [
  { year: '2020', title: 'The Spark', desc: 'A dream was born during a trip through Naples and Tokyo — to blend Italian tradition with Japanese craftsmanship.' },
  { year: '2021', title: 'First Oven Lit', desc: 'Our custom wood-fired oven was built and the first Komorebi pizza was served to friends and family.' },
  { year: '2022', title: 'Doors Open', desc: 'We opened our first location in Adelaide, bringing authentic wood-fired pizza to the community.' },
  { year: '2023', title: 'Growing Love', desc: 'Word spread fast. We expanded our menu, introduced online ordering, and hit 10,000 pizzas served.' },
  { year: '2024', title: '50K Milestone', desc: 'Over 50,000 pizzas delivered. We launched catering services and partnered with local farms.' },
  { year: '2025', title: 'The Future', desc: 'Continuing to innovate — new seasonal menus, sustainability initiatives, and community events.' },
];

const AboutUs = () => {
  return (
    <div className="about-page">
      {/* Hero */}
      <div className="about-hero" style={{ backgroundImage: `url(${aboutImage})` }}>
        <div className="about-hero-overlay">
          <p className="about-eyebrow">Discover Our Story</p>
          <h1>About Komorebi Pizza</h1>
          <p className="about-tagline">
            Where Italian soul meets Japanese artistry — handcrafted pizza made with passion, tradition, and the finest ingredients.
          </p>
        </div>
      </div>

      {/* Our Heritage */}
      <section className="about-section">
        <div className="about-content-grid">
          <div className="about-text">
            <h2>Our Heritage</h2>
            <p>
              The name "Komorebi" is a beautiful Japanese word describing sunlight 
              filtering through the leaves of trees — a moment of natural warmth and beauty. 
              This is the feeling we bring to every pizza we craft.
            </p>
            <p>
              Our heritage is rooted in two worlds: the centuries-old pizza tradition of 
              Naples, Italy, and the meticulous craft culture of Japan. We honour both by 
              using time-tested techniques — 72-hour fermented dough, San Marzano tomatoes, 
              and wood-fired baking at 450°C — while applying the Japanese philosophy of 
              "Kodawari" (an uncompromising devotion to perfection).
            </p>
            <p>
              Every ingredient is chosen with intention. Every pizza is a work of care. 
              This is our heritage, and it lives in every slice we serve.
            </p>
          </div>
          <div className="about-image-block">
            <img src={woodovenImage} alt="Our heritage wood-fired oven" />
          </div>
        </div>
      </section>

      {/* Our Journey - Timeline */}
      <section className="about-journey">
        <h2>Our Journey</h2>
        <p className="journey-subtitle">From a dream to Adelaide's favourite pizza — here's how we got here.</p>
        <div className="journey-timeline">
          {JOURNEY_STEPS.map((step, i) => (
            <div key={i} className="journey-step">
              <div className="journey-year">{step.year}</div>
              <div className="journey-dot"></div>
              <div className="journey-content">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars of Craft */}
      <section className="about-values">
        <h2>Pillars of Craft</h2>
        <p className="pillars-subtitle">The four principles that guide every pizza we make.</p>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">�</div>
            <h3>Premium Ingredients</h3>
            <p>Imported Italian flour, San Marzano tomatoes, fresh mozzarella, and locally sourced seasonal produce — no shortcuts, ever.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">�</div>
            <h3>Wood-Fired Mastery</h3>
            <p>Our custom-built oven reaches 450°C, baking each pizza in 90 seconds for a crispy, charred, pillowy crust you won't forget.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">⏳</div>
            <h3>72-Hour Dough</h3>
            <p>Patience is our secret. Our dough ferments for 72 hours, developing deep flavour and an airy, digestible texture.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">�</div>
            <h3>Sustainable Practice</h3>
            <p>Eco-friendly packaging, zero food waste policy, and partnerships with local farmers — because great pizza should be kind to the planet.</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="about-stats">
        <div className="stat-item">
          <span className="stat-number">5+</span>
          <span className="stat-label">Years Serving Adelaide</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">50K+</span>
          <span className="stat-label">Pizzas Delivered</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">20+</span>
          <span className="stat-label">Menu Items</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">4.8</span>
          <span className="stat-label">Average Rating</span>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="about-reviews">
        <h2>What Our Customers Say</h2>
        <p className="reviews-subtitle">Real reviews from real pizza lovers.</p>
        <div className="reviews-grid">
          {REVIEWS.map((review, i) => (
            <div key={i} className="review-card">
              <div className="review-stars">
                {[...Array(review.rating)].map((_, j) => (
                  <FaStar key={j} className="review-star" />
                ))}
              </div>
              <p className="review-text">"{review.text}"</p>
              <span className="review-author">— {review.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <img src={logo} alt="Komorebi Logo" className="about-cta-logo" />
        <h2>Ready to taste the difference?</h2>
        <p>Browse our menu and order your favourite pizza today.</p>
        <div className="about-cta-buttons">
          <Link to="/menu" className="about-btn-primary">View Menu</Link>
          <Link to="/contact" className="about-btn-secondary">Contact Us</Link>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
