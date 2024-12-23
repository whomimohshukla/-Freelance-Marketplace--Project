import React from 'react';

function Community() {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-24 px-6">
      <div className="max-w-5xl mx-auto bg-gradient-to-r from-gray-800 to-gray-900 p-10 rounded-lg shadow-xl">
        <h1 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-code-green to-[#80FFF2] text-transparent bg-clip-text">Community</h1>
        <p className="text-gray-300 mb-6">
          Welcome to the SkillBridge Community! Here, freelancers and clients can connect, share ideas, and collaborate on projects.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Join Discussions</h2>
            <p className="text-gray-300">
              Engage in meaningful discussions with other freelancers and clients. Share your experiences and learn from others.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Collaborate on Projects</h2>
            <p className="text-gray-300">
              Find collaborators for your projects or join existing teams to work on exciting new opportunities.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Share Resources</h2>
            <p className="text-gray-300">
              Share useful resources, tools, and tips with the community to help others succeed in their freelance journey.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Events & Meetups</h2>
            <p className="text-gray-300">
              Stay updated on upcoming events and meetups. Network with like-minded individuals and grow your professional circle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Community;
