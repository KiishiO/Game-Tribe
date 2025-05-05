// TeamPage.jsx - Team information page
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/TeamPage.css';

const TeamPage = () => {
  const [teamData, setTeamData] = useState({
    courseName: 'SE/COM S 3190 – Spring 2025',
    semester: 'Spring 2025',
    lastUpdated: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    members: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would fetch from your backend API
        // For now, we'll use a mock response or fetch from a static JSON file
        
        // Option 1: Mock data directly in the component
        const mockTeamData = {
          courseName: 'SE/COM S 3190 – Spring 2025',
          semester: 'Spring 2025',
          lastUpdated: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          members: [
            {
              name: 'Jane Smith',
              email: 'jsmith@iastate.edu',
              role: 'Frontend Developer',
              contributions: [
                'Designed and implemented the home page UI',
                'Created responsive navigation system',
                'Developed shopping cart functionality',
                'Implemented user profile page'
              ]
            },
            {
              name: 'John Doe',
              email: 'jdoe@iastate.edu',
              role: 'Backend Developer',
              contributions: [
                'Set up MongoDB database and schemas',
                'Developed RESTful API endpoints',
                'Implemented user authentication system',
                'Created game data management system'
              ]
            }
          ]
        };
        
        // Option 2: Fetch from a JSON file or API
        // Uncomment this code and comment out the mockTeamData when you have an actual API
        /*
        const response = await axios.get('/api/team');
        setTeamData(response.data);
        */
        
        setTeamData(mockTeamData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading team data:', err);
        setError('Failed to load team information. Please try again later.');
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  return (
    <div className="container py-5">
      <div className="row mb-5">
        <div className="col-12 text-center">
          <h1 className="bungee-shade-regular">Our Team</h1>
        </div>
      </div>

      {loading ? (
        <div className="text-center">Loading team information...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          <div className="row">
            <div className="col-12">
              <div className="card mb-4">
                <div className="card-body">
                  <h2 className="card-title text-center mb-4">About the Project</h2>
                  <div className="text-center mb-4">
                    <h3>{teamData.courseName}</h3>
                    <p className="mb-2">{teamData.semester}</p>
                    <p className="mb-0">Last Updated: {teamData.lastUpdated}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {teamData.members.map((member, index) => (
              <div className="col-md-6 mb-4" key={index}>
                <div className="card h-100">
                  <div className="card-body">
                    <div className="text-center mb-4">
                      <h3 className="card-title">{member.name}</h3>
                      <p className="card-text">
                        <a href={`mailto:${member.email}`}>{member.email}</a>
                      </p>
                    </div>
                    <div className="mt-3">
                      <h5>Role</h5>
                      <p>{member.role}</p>
                      <h5>Contributions</h5>
                      <ul>
                        {member.contributions.map((contribution, i) => (
                          <li key={i}>{contribution}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TeamPage;