import React from 'react';
import '../styles/Team.css';

const Team = () => {
  return (
    <div className="app-container">
      <main className="main-content">
        <div className="main-heading">
          <br />
          <h1 className="bungee-shade-regular">The GameTribe Team</h1>
          <br />
        </div>
        
        <div className="content-wrapper">
          <div className="team-container">
            <div className="team-intro">
              <h2>Meet the Developers</h2>
              <p>We are a passionate team of developers dedicated to creating the ultimate gaming marketplace experience.</p>
            </div>
            
            <div className="team-grid">
              <div className="team-member">
                <div className="member-avatar">
                  <img src="/assets/myotherimages/player_01.jpg" alt="Developer 1" />
                </div>
                <h3>Fuchinanya Akpuokwe</h3>
                <p className="role">Frontend $ Backend Engineer</p>
                <p className="bio">Contributed greatly towards the functionality of not only the Search, and Profiles page but also the Teams page.</p>
              </div>
              
              <div className="team-member">
                <div className="member-avatar">
                  <img src="/assets/myotherimages/player_04.jpg" alt="Developer 2" />
                </div>
                <h3>Iteoluwakishi Osomo</h3>
                <p className="role">Frontend $ Backend Engineer</p>
                <p className="bio">Contributed greatly towards the functionality of not only the Admin, and Shopping page but also the Home page.</p>
              </div>
            </div>
            
            <div className="team-mission">
              <h2>Our Mission</h2>
              <p>GameTribe is more than just a marketplace - it's a community. We're committed to:</p>
              <ul>
                <li>Creating a seamless game discovery experience</li>
                <li>Building a trusted platform for gamers worldwide</li>
                <li>Fostering a vibrant gaming community</li>
              </ul>
            </div>
            
            <div className="contact-section">
              <h2>Get in Touch</h2>
              <p>Have questions or feedback? We'd love to hear from you!</p>
              <div className="contact-info">
                <p><i className="fas fa-envelope"></i> team@gametribe.com</p>
                <p><i className="fab fa-twitter"></i> @GameTribeOfficial</p>
                <p><i className="fab fa-discord"></i> GameTribe Community</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Team;