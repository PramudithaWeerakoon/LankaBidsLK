// Import React library
import React from 'react';
// Import FontAwesome CSS for icons
import '@fortawesome/fontawesome-free/css/all.min.css';

// Define the Footer component
const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#2b2b2b', color: '#fff', padding: '20px 0', fontSize: '14px', position: 'fixed', bottom: '0', width: '100%' }}>
      {/* Social media icons */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
        <a href="#" style={{ margin: '0 20px' }}><i className="fab fa-facebook" style={{ color: '#fff', fontSize: '24px' }}></i></a>
        <a href="#" style={{ margin: '0 20px' }}><i className="fab fa-twitter" style={{ color: '#fff', fontSize: '24px' }}></i></a>
        <a href="#" style={{ margin: '0 20px' }}><i className="fab fa-google-plus-g" style={{ color: '#fff', fontSize: '24px' }}></i></a>
        <a href="#" style={{ margin: '0 20px' }}><i className="fab fa-youtube" style={{ color: '#fff', fontSize: '24px' }}></i></a>
        <a href="#" style={{ margin: '0 20px' }}><i className="fab fa-instagram" style={{ color: '#fff', fontSize: '24px' }}></i></a>
        <a href="#" style={{ margin: '0 20px' }}><i className="fab fa-linkedin-in" style={{ color: '#fff', fontSize: '24px' }}></i></a>
      </div>

      {/* Footer links and sections */}
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '0 20px' }}>
        {/* Bid Platform section */}
        <div>
          <h4 style={{ color: '#f90', fontSize: '18px', marginBottom: '10px' }}>Bid Platform</h4>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li><a href="#" style={{ color: '#fff' }}>How It Works</a></li>
            <li><a href="#" style={{ color: '#fff' }}>Pricing</a></li>
            <li><a href="#" style={{ color: '#fff' }}>Bidding Guidelines</a></li>
            <li><a href="#" style={{ color: '#fff' }}>Support</a></li>
            <li><a href="#" style={{ color: '#fff' }}>Terms of Use</a></li>
          </ul>
        </div>

        {/* Bidding Strategies section */}
        <div>
          <h4 style={{ color: '#f90', fontSize: '18px', marginBottom: '10px' }}>Bidding Strategies</h4>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li><a href="#" style={{ color: '#fff' }}>Maximize Your Bids</a></li>
            <li><a href="#" style={{ color: '#fff' }}>Understand Bid Timing</a></li>
            <li><a href="#" style={{ color: '#fff' }}>Analyze Competitor Bids</a></li>
            <li><a href="#" style={{ color: '#fff' }}>Winning Strategies</a></li>
          </ul>
        </div>

        {/* Service section */}
        <div>
          <h4 style={{ color: '#f90', fontSize: '18px', marginBottom: '10px' }}>Service</h4>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li><a href="#" style={{ color: '#fff' }}>Compare</a></li>
            <li><a href="#" style={{ color: '#fff' }}>Download</a></li>
            <li><a href="#" style={{ color: '#fff' }}>Feedback</a></li>
            <li><a href="#" style={{ color: '#fff' }}>Bug Report</a></li>
          </ul>
        </div>

        {/*<div>
          <h4 style={{ fontSize: '18px', marginBottom: '10px' }}>Social</h4>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li><a href="#" style={{ color: '#fff' }}><i className="fab fa-facebook-f" style={{ marginRight: '8px' }}></i>Facebook</a></li>
            <li><a href="#" style={{ color: '#fff' }}><i className="fab fa-twitter" style={{ marginRight: '8px' }}></i>Twitter</a></li>
            <li><a href="#" style={{ color: '#fff' }}><i className="fab fa-youtube" style={{ marginRight: '8px' }}></i>YouTube</a></li>
          </ul>
        </div>*/}

        {/* Activity section */}
        <div>
          <h4 style={{ color: '#f90', fontSize: '18px', marginBottom: '10px' }}>Activity</h4>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li><a href="#" style={{ color: '#fff' }}>Influencers</a></li>
            <li><a href="#" style={{ color: '#fff' }}>Affiliate</a></li>
            <li><a href="#" style={{ color: '#fff' }}>Co-branding</a></li>
            <li><a href="#" style={{ color: '#fff' }}>Honor</a></li>
            <li><a href="#" style={{ color: '#fff' }}>Giveaway</a></li>
          </ul>
        </div>

        {/* Contact Us section */}
        <div>
          <h4 style={{ color: '#f90', fontSize: '18px', marginBottom: '10px' }}>Contact Us</h4>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li><a href="mailto:support@bidplatform.com" style={{ color: '#fff' }}>Email: support@bidplatform.com</a></li>
            <li><a href="tel:+1234567890" style={{ color: '#fff' }}>Phone: +1 (234) 567-890</a></li>
            <li><a href="#" style={{ color: '#fff' }}>Contact Form</a></li>
          </ul>
        </div>

        {/* Newsletter Subscription section */}
        <div>
          <h4 style={{ color: '#f90', fontSize: '18px', marginBottom: '10px' }}>Newsletter Subscription</h4>
          <form>
            <input type="email" placeholder="Subscribe to our newsletter" style={{ padding: '10px', border: 'none', width: '200px' }} />
            <button type="submit" style={{ padding: '10px', backgroundColor: '#f90', border: 'none', color: '#fff' }}>Subscribe</button>
          </form>
        </div>
      </div>
      
      {/* Copyright section */}
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <p>Copyright © 2024 Bid Platform. All rights reserved.</p>
      </div>
    </footer>
  );
};

// Export the Footer component
export default Footer;
