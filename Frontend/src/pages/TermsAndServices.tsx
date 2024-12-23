import React from 'react';

function TermsAndServices() {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-24 px-6">
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-gray-800 to-gray-900 p-10 rounded-lg shadow-xl">
        <h1 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-code-green to-[#80FFF2] text-transparent bg-clip-text">Terms and Services</h1>
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-gray-300 leading-relaxed">
              Welcome to SkillBridge. These terms and conditions outline the rules and regulations for the use of our platform.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">2. User Responsibilities</h2>
            <p className="text-gray-300 leading-relaxed">
              Users are responsible for maintaining the confidentiality of their account and password and for restricting access to their computer.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Service Usage</h2>
            <p className="text-gray-300 leading-relaxed">
              You agree not to use the service for any illegal or unauthorized purpose. You must not, in the use of the service, violate any laws in your jurisdiction.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Termination</h2>
            <p className="text-gray-300 leading-relaxed">
              We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the terms.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Changes to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace these terms at any time. What constitutes a material change will be determined at our sole discretion.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default TermsAndServices;
