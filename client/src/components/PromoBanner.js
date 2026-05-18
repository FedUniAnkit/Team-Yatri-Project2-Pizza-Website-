import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './PromoBanner.css';

const PromoBanner = () => {
  const [banner, setBanner] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await api.get('/promo-banner/active');
        if (response.data.success && response.data.data) {
          // Check if user already dismissed this banner
          const dismissedId = sessionStorage.getItem('dismissed_promo_banner');
          if (dismissedId !== response.data.data.id?.toString()) {
            setBanner(response.data.data);
          }
        }
      } catch (error) {
        // No active banner - that's fine
      }
    };
    fetchBanner();
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    if (banner?.id) {
      sessionStorage.setItem('dismissed_promo_banner', banner.id.toString());
    }
  };

  if (!banner || dismissed) return null;

  const ctaText = banner.ctaText || 'Order Now';
  const ctaLink = banner.ctaLink || '/menu';
  const isExternal = /^https?:\/\//i.test(ctaLink);

  const bannerStyle = banner.imageUrl
    ? {
        backgroundImage: `linear-gradient(120deg, rgba(0,0,0,0.75), rgba(0,0,0,0.45)), url(${banner.imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {};

  return (
    <div
      className={`promo-banner promo-banner-${banner.style || 'gradient'} ${banner.imageUrl ? 'promo-banner-image' : ''}`}
      style={bannerStyle}
    >
      <div className="promo-banner-content">
        <div className="promo-banner-sparkle">✨</div>
        <div className="promo-banner-text">
          <span className="promo-banner-title">{banner.title}</span>
          <span className="promo-banner-message">{banner.message}</span>
          {banner.promoCode && (
            <span className="promo-banner-code">
              Use code: <strong>{banner.promoCode}</strong>
            </span>
          )}
        </div>
        {isExternal ? (
          <a href={ctaLink} target="_blank" rel="noopener noreferrer" className="promo-banner-cta">
            {ctaText}
          </a>
        ) : (
          <Link to={ctaLink} className="promo-banner-cta">
            {ctaText}
          </Link>
        )}
      </div>
      <button className="promo-banner-close" onClick={handleDismiss} aria-label="Dismiss">
        ✕
      </button>
    </div>
  );
};

export default PromoBanner;
