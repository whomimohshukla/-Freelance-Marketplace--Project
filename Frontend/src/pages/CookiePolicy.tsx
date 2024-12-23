import React from 'react';

function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-24 px-6">
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-gray-800 to-gray-900 p-10 rounded-lg shadow-xl">
        <h1 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-code-green to-[#80FFF2] text-transparent bg-clip-text">Cookie Policy</h1>
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-gray-300 leading-relaxed">
              This Cookie Policy explains how SkillBridge uses cookies and similar technologies to recognize you when you visit our website.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">2. What are cookies?</h2>
            <p className="text-gray-300 leading-relaxed">
              Cookies are small data files that are placed on your computer or mobile device when you visit a website.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">3. How SkillBridge uses cookies</h2>
            <p className="text-gray-300 leading-relaxed">
              We use cookies to improve your browsing experience by remembering your preferences and repeat visits.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Managing cookies</h2>
            <p className="text-gray-300 leading-relaxed">
              You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Changes to this Cookie Policy</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default CookiePolicy;
