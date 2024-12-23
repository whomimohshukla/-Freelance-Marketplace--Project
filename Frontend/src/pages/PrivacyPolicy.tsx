import React from 'react';

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-24 px-6">
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-gray-800 to-gray-900 p-10 rounded-lg shadow-xl">
        <h1 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-code-green to-[#80FFF2] text-transparent bg-clip-text">Privacy Policy</h1>
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-gray-300 leading-relaxed">
              This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from SkillBridge.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <p className="text-gray-300 leading-relaxed">
              We collect Device Information using the following technologies: Cookies, Log files, Web beacons, tags, and pixels.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-300 leading-relaxed">
              We use the Order Information that we collect generally to fulfill any orders placed through the Site.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Sharing Your Personal Information</h2>
            <p className="text-gray-300 leading-relaxed">
              We share your Personal Information with third parties to help us use your Personal Information, as described above.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Changes</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
