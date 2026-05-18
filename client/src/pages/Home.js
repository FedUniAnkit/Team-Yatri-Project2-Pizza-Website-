import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiMapPin, FiPhone, FiClock, FiMail } from 'react-icons/fi';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import PromoBanner from '../components/PromoBanner';
import './Home.css';
import heroBackground1 from '../assets/delicious-homemade-pizza-wooden-cutting-board-tomatoes-ketchup-garlics-pepper-oil-bottle-green-bundle-dark-surface.jpg';
import heroBackground2 from '../assets/tasty-cheesy-pizza-blue-with-fresh-vegetables.jpg';
import heroBackground3 from '../assets/delicious-neapolitan-pizza-board.jpg';
import heroBackground4 from '../assets/pizza-dough-stretching-floury-surface_1170794-66878.jpg';
import pineapplePizza from '../assets/pineapple.png';
import veggieImage from '../assets/veggie.jpg';
import meatLoversImage from '../assets/meat lovers.jpg';
import pepperoniImage from '../assets/pepproni.webp';
import margheritaImage from '../assets/margherita-pizza-1080x1080.jpg';
import cateringImage from '../assets/catering.webp';
import deliveryImage from '../assets/pizza-delivery-scooter-and-pizza-courier-driver-free-vector.jpg';
import logo from '../assets/logo.jpg';
import pizza1 from '../assets/pizza-1.jpg';
import pizza2 from '../assets/pizza-2.jpg';
import pizza3 from '../assets/pizza-3.jpg';
import pizza4 from '../assets/pizza-4.jpg';
import pizza5 from '../assets/pizza-5.jpg';
import pizza6 from '../assets/pizza-6.jpg';
import pizza7 from '../assets/pizza-7.jpg';
import pizza8 from '../assets/pizza-8.jpg';
import woodoven from '../assets/woodoven.jpg';
import gfImage from '../assets/gf.png';
import burger1 from '../assets/burger-1.jpg';
import burger2 from '../assets/burger-2.jpg';
import pasta1 from '../assets/pasta-1.jpg';
import pasta2 from '../assets/pasta-2.jpg';
import drink1 from '../assets/drink-1.jpg';
import drink2 from '../assets/drink-2.jpg';
import person1 from '../assets/person_1.jpg';
import person2 from '../assets/person_2.jpg';
import person3 from '../assets/person_3.jpg';
import gallery1 from '../assets/group-young-cheerful-friends-is-sitting-cafe-talking-eating-pizza-lunch-pizzeria_180601-9788.jpg';
import gallery2 from '../assets/ovan.jpg';
import gallery3 from '../assets/Pizza-Prep.jpg';
import gallery4 from '../assets/professional-chefs-working-busy-pizzeria-kitchen_1127-40552.avif';
import ka1 from '../assets/ka1.jpg';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('unsubscribed') === 'true') {
      toast.info('You have been successfully unsubscribed from our newsletter.');
      window.history.replaceState({}, '', '/');
    }
  }, [location.search]);
  
  const heroImages = [
    heroBackground1,
    heroBackground2,
    heroBackground3,
    heroBackground4
  ];

  const testimonialsData = [
    {
      quote: 'Exceptional culinary artistry! The attention to detail in every dish is remarkable. The crust has the perfect char and chew, while the ingredient quality rivals Naples.',
      name: 'Sarah Johnson',
      role: 'Food Blogger',
      rating: 5,
      image: person1,
    },
    {
      quote: 'An extraordinary dining experience from start to finish. The ambiance and knowledgeable staff make each visit feel like a culinary discovery.',
      name: 'Michael Chen',
      role: 'HR Manager',
      rating: 4.5,
      image: person2,
    },
    {
      quote: 'Komorebi strikes the balance between sophisticated cuisine and warmth. Seasonal menus showcase creative interpretations of classic dishes.',
      name: 'Emily Rodriguez',
      role: 'Business Developer',
      rating: 4.5,
      image: person3,
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % heroImages.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const getDashboardLink = () => {
    if (!isAuthenticated) return '/login';
    
    switch (user?.role) {
      case 'admin':
        return '/admin';
      case 'staff':
        return '/staff';
      case 'customer':
        return '/customer';
      default:
        return '/login';
    }
  };

  const renderRating = (value) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (value >= i) {
        stars.push(<FaStar key={i} />);
      } else if (value > i - 1 && value < i) {
        stars.push(<FaStarHalfAlt key={i} />);
      } else {
        stars.push(<FaRegStar key={i} />);
      }
    }
    return stars;
  };

  return (
    <div className="home-container">
      {/* Promo Banner */}
      <PromoBanner />

      {/* Hero Section */}
      <section className="hero" style={{ backgroundImage: `url(${heroImages[currentImageIndex]})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <span>Authentic • Wood-Fired</span>
            </div>
            <h1 className="hero-title">Komorebi Pizza</h1>
            <p className="hero-description">
              Hand-stretched dough, wood-fired at 450°C — delivered hot.
            </p>
            <div className="hero-buttons">
              <Link to={getDashboardLink()} className="btn btn-primary">
                {isAuthenticated ? 'Dashboard' : 'Order Now'}
              </Link>
              <Link to="/menu" className="btn btn-secondary">
                View Menu
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pizzas Gallery */}
      <section className="featured-pizzas">
        <div className="container">
          <h2 className="section-title">Signature Creations</h2>
          <p className="section-subtitle">Award-winning pizzas crafted by our master chefs</p>
          
          <div className="pizza-gallery">
            <div className="pizza-card featured">
              <div className="pizza-image">
                <img src={margheritaImage} alt="Margherita Supreme" />
                <div className="pizza-overlay">
                  <h3>Margherita Supreme</h3>
                  <p>Fresh mozzarella, basil, premium tomatoes</p>
                  <span className="price">$24</span>
                </div>
              </div>
            </div>
            
            <div className="pizza-card">
              <div className="pizza-image">
                <img src={pepperoniImage} alt="Pepperoni Classic" />
                <div className="pizza-overlay">
                  <h3>Pepperoni Classic</h3>
                  <p>Premium pepperoni, mozzarella</p>
                  <span className="price">$22</span>
                </div>
              </div>
            </div>
            
            <div className="pizza-card">
              <div className="pizza-image">
                <img src={meatLoversImage} alt="Meat Lovers" />
                <div className="pizza-overlay">
                  <h3>Meat Lovers</h3>
                  <p>Pepperoni, sausage, bacon, ham</p>
                  <span className="price">$28</span>
                </div>
              </div>
            </div>
            
            <div className="pizza-card">
              <div className="pizza-image">
                <img src={veggieImage} alt="Veggie Delight" />
                <div className="pizza-overlay">
                  <h3>Veggie Delight</h3>
                  <p>Fresh vegetables, herbs, cheese</p>
                  <span className="price">$26</span>
                </div>
              </div>
            </div>
            
            <div className="pizza-card">
              <div className="pizza-image">
                <img src={pineapplePizza} alt="Pineapple Pizza" />
                <div className="pizza-overlay">
                  <h3>Pineapple Pizza</h3>
                  <p>Ham, pineapple, mozzarella</p>
                  <span className="price">$25</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wood Oven Feature Section */}
      <section className="wood-oven-section">
        <div className="container">
          <div className="wood-oven-content">
            <div className="wood-oven-text">
              <h2 className="wood-oven-title">Authentic wood-fired perfection, delivered.</h2>
              <p className="wood-oven-subtitle">Experience the tradition</p>
              <p className="wood-oven-description">
                Authentic 450°F wood-fired oven creates perfect char and smoky flavor. 
                Hand-stretched and baked in 90 seconds for restaurant-quality taste.
              </p>
              <div className="wood-oven-features">
                <div className="oven-feature">
                  <span className="feature-number">450°F</span>
                  <span className="feature-text">Authentic Temperature</span>
                </div>
                <div className="oven-feature">
                  <span className="feature-number">90s</span>
                  <span className="feature-text">Perfect Bake Time</span>
                </div>
                <div className="oven-feature">
                  <span className="feature-number">100%</span>
                  <span className="feature-text">Wood-Fired</span>
                </div>
              </div>
              <Link to="/menu" className="btn btn-primary wood-oven-btn">
                Order Now
              </Link>
            </div>
            <div className="wood-oven-image">
              <img src={woodoven} alt="Wood-fired oven" className="oven-img" />
            </div>
          </div>
        </div>
      </section>

      {/* Dietary Options Section */}
      <section className="dietary-options">
        <div className="container">
          <div className="dietary-grid">
            <div className="dietary-image">
              <img src={gfImage} alt="Gluten-free pizza" />
            </div>
            <div className="dietary-content">
              <h2>Everyone's Welcome</h2>
              <p>Delicious options for every dietary need. Same great taste, crafted with care.</p>
              <div className="dietary-features">
                <div className="feature">
                  <span className="feature-icon">🌱</span>
                  <span>Plant-based options</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🌾</span>
                  <span>Gluten-free crusts</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">❤️</span>
                  <span>Same great taste</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-options">
        <div className="container">
          <div className="services-grid">
            <div className="services-content">
              <h2>Your Way, Your Choice</h2>
              <p>Flexible service options to fit your lifestyle. Fresh pizza delivered exactly how you want it.</p>
              <div className="services-features">
                <div className="feature">
                  <span className="feature-icon">🏪</span>
                  <span>In-store pickup</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🚚</span>
                  <span>Home delivery</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🎉</span>
                  <span>Catering for functions & parties</span>
                </div>
              </div>
            </div>
            <div className="services-images">
              <div className="service-image-item">
                <img src={cateringImage} alt="Catering services" />
                <h4>Catering Services</h4>
              </div>
              <div className="service-image-item">
                <img src={deliveryImage} alt="Pizza delivery" />
                <h4>Delivery & Pickup</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Categories */}
      <section className="menu-categories">
        <div className="container">
          <h2 className="section-title">Culinary Excellence</h2>
          <p className="section-subtitle">A diverse menu celebrating authentic flavors and innovative cuisine</p>
          
          <div className="categories-grid">
            <div className="category-card">
              <div className="category-image">
                <img src={pizza4} alt="Pizzas" />
              </div>
              <div className="category-content">
                <h3>Artisan Pizzas</h3>
                <p>Hand-stretched dough, premium toppings, and wood-fired perfection in every slice</p>
                <Link to="/menu" className="category-link">Explore Pizzas →</Link>
              </div>
            </div>
            
            <div className="category-card">
              <div className="category-image">
                <img src={pasta1} alt="Pasta" />
              </div>
              <div className="category-content">
                <h3>House-Made Pasta</h3>
                <p>Traditional Italian recipes with house-made pasta and carefully crafted sauces</p>
                <Link to="/menu" className="category-link">Explore Pasta →</Link>
              </div>
            </div>
            
            <div className="category-card">
              <div className="category-image">
                <img src={burger1} alt="Burgers" />
              </div>
              <div className="category-content">
                <h3>Signature Burgers</h3>
                <p>Gourmet burgers featuring locally-sourced beef and artisan-baked brioche buns</p>
                <Link to="/menu" className="category-link">Explore Burgers →</Link>
              </div>
            </div>
            
            <div className="category-card">
              <div className="category-image">
                <img src={drink1} alt="Beverages" />
              </div>
              <div className="category-content">
                <h3>Curated Beverages</h3>
                <p>Premium wine selection, craft beers, and specialty non-alcoholic beverages</p>
                <Link to="/menu" className="category-link">Explore Drinks →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="heritage-header">
            <h2 className="section-title">Our Heritage</h2>
            <p className="heritage-tagline">Family-Owned Since 1990</p>
          </div>

          <div className="heritage-story">
            <div className="story-content">
              <div className="story-text">
                <p className="story-intro">
                  Komorebi means "sunlight filtering through leaves." It's our reminder to keep things simple, warm, and real. 
                  From a humble wood-fired oven to a craft we practice every day, we honour slow fermentation, hand-stretched dough, 
                  and ingredients we'd serve to family.
                </p>
                
                <p className="story-paragraph">
                  Started in 1990 by a passionate family who believed that great pizza begins with great ingredients and patient hands, 
                  Komorebi Pizza has grown from a single wood-fired oven into a beloved community gathering place. We've never forgotten 
                  our roots—every pizza still begins with dough that's been given time to develop its character, just like the old days.
                </p>

                <p className="story-paragraph">
                  The glow of the fire, the whisper of the trees, the laughter of families sharing a meal—that's what Komorebi represents. 
                  We're not just making pizza; we're creating moments that bring people together, one perfectly crafted slice at a time.
                </p>
              </div>
              
              <div className="story-image">
                <img src={ka1} alt="Komorebi Heritage - Fresh Ingredients & Craft" className="heritage-main-img" />
                <div className="image-caption">
                  <h4>Our Philosophy</h4>
                  <p>Simple, warm, and real ingredients</p>
                </div>
              </div>
            </div>
          </div>

          <div className="heritage-journey">
            <h3 className="journey-title">Our Journey</h3>
            <div className="journey-timeline">
              <div className="journey-step">
                <div className="step-icon">🌱</div>
                <div className="step-content">
                  <h4>Humble Beginnings</h4>
                  <p>It all started with one wood-fired oven, a handful of treasured family recipes, and an unwavering commitment to quality. 
                  Our founders believed that great food doesn't need complexity—just passion, patience, and the finest ingredients.</p>
                </div>
              </div>
              
              <div className="journey-step">
                <div className="step-icon">☀️</div>
                <div className="step-content">
                  <h4>Finding Our Light</h4>
                  <p>As we grew, we discovered our guiding philosophy in the Japanese concept of "Komorebi"—the interplay of light and shadow, 
                  the beauty in simplicity. This became our compass, inspiring us to create food that's natural, balanced, and warm.</p>
                </div>
              </div>
              
              <div className="journey-step">
                <div className="step-icon">🌿</div>
                <div className="step-content">
                  <h4>Today & Tomorrow</h4>
                  <p>Three decades later, we continue to honor our wood-fired tradition while embracing modern tastes. From seasonal specials 
                  that celebrate local harvests to vegan-friendly options that welcome everyone to our table, we're always evolving while staying true to our craft.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="heritage-pillars">
            <h3 className="pillars-title">The Pillars of Our Craft</h3>
            <div className="pillars-grid">
              <div className="pillar-card">
                <div className="pillar-icon">🔥</div>
                <h4>Fire & Time</h4>
                <p>Our dough ferments slowly for 48 hours, developing complex flavors that can't be rushed. Then it meets the intense heat 
                of our wood-fired oven, creating that perfect balance of crispy exterior and airy, tender interior that defines authentic Neapolitan pizza.</p>
              </div>
              
              <div className="pillar-card">
                <div className="pillar-icon">🌱</div>
                <h4>Thoughtful Sourcing</h4>
                <p>We partner with local farms and trusted suppliers who share our commitment to quality. From San Marzano tomatoes 
                to locally-grown herbs, every ingredient is chosen for its ability to contribute to the harmony of flavors on your plate.</p>
              </div>
              
              <div className="pillar-card">
                <div className="pillar-icon">👐</div>
                <h4>Hands, Not Hacks</h4>
                <p>In an age of automation, we still believe in the human touch. Every pizza is hand-mixed, hand-stretched, and hand-finished 
                by skilled artisans who understand that the subtle variations of handcraft are what make each pizza uniquely delicious.</p>
              </div>
              
              <div className="pillar-card">
                <div className="pillar-icon">🤝</div>
                <h4>Community First</h4>
                <p>Pizza has always been about bringing people together. Whether it's a family celebrating a milestone, friends catching up 
                over dinner, or a quiet date night, we craft our space and our food to foster connection and create lasting memories.</p>
              </div>
            </div>
          </div>

          <div className="heritage-gallery">
            <div className="gallery-grid">
              <div className="gallery-item">
                <img src={gallery1} alt="Friends enjoying pizza together" />
                <div className="gallery-overlay">
                  <h4>Community Gathering</h4>
                  <p>Friends sharing moments</p>
                </div>
              </div>
              <div className="gallery-item">
                <img src={gallery2} alt="Wood Fired Oven" />
                <div className="gallery-overlay">
                  <h4>Wood-Fired Tradition</h4>
                  <p>450°F perfection</p>
                </div>
              </div>
              <div className="gallery-item">
                <img src={gallery3} alt="Pizza preparation process" />
                <div className="gallery-overlay">
                  <h4>Artisan Preparation</h4>
                  <p>Hand-crafted perfection</p>
                </div>
              </div>
              <div className="gallery-item">
                <img src={gallery4} alt="Professional chefs in kitchen" />
                <div className="gallery-overlay">
                  <h4>Expert Craft</h4>
                  <p>Master chefs at work</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="about-stats">
            <div className="stat">
              <span className="stat-number">34+</span>
              <span className="stat-label">Years of Excellence</span>
            </div>
            <div className="stat">
              <span className="stat-number">75k+</span>
              <span className="stat-label">Satisfied Customers</span>
            </div>
            <div className="stat">
              <span className="stat-number">35+</span>
              <span className="stat-label">Signature Dishes</span>
            </div>
            <div className="stat">
              <span className="stat-number">12</span>
              <span className="stat-label">Awards Won</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">Customer Excellence</h2>
          <p className="section-subtitle">Testimonials from our community of food enthusiasts</p>
          <div className="testimonials-grid">
            {testimonialsData.map((testimonial, index) => (
              <div className="testimonial" key={`${testimonial.name}-${index}`}>
                <div className="testimonial-line" />
                <div className="testimonial-avatar">
                  <img src={testimonial.image} alt={testimonial.name} />
                </div>
                <div className="testimonial-body">
                  <h4>{testimonial.name}</h4>
                  <p className="testimonial-role">{testimonial.role}</p>
                  <div className="testimonial-rating">
                    {renderRating(testimonial.rating)}
                  </div>
                  <p className="testimonial-quote">{testimonial.quote}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-heading">
            <p className="contact-eyebrow">Connect With Us</p>
            <h2>CONTACT US</h2>
            <p className="contact-subtext">
              We align leaders around a shared purpose and strategic story that catalyzes their business and brand to take action.
            </p>
          </div>

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
                  <h3>Contact Us</h3>
                  <p>Reach out for catering or private dining.
                    <span className="panel-socials">
                      <a href="https://facebook.com" target="_blank" rel="noreferrer">Fb</a>
                      <a href="https://twitter.com" target="_blank" rel="noreferrer">Tw</a>
                      <a href="https://instagram.com" target="_blank" rel="noreferrer">Ig</a>
                      <a href="https://pinterest.com" target="_blank" rel="noreferrer">Pi</a>
                    </span>
                  </p>
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
      </section>
    </div>
  );
};

export default Home;
