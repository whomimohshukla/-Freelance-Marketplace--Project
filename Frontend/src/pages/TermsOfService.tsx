import React from 'react';

function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-24 px-6">
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-gray-800 to-gray-900 p-10 rounded-lg shadow-xl">
        <h1 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-code-green to-[#80FFF2] text-transparent bg-clip-text">Terms of Service</h1>
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-gray-300 leading-relaxed">
              These terms and conditions outline the rules and regulations for the use of SkillBridge's website.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Intellectual Property Rights</h2>
            <p className="text-gray-300 leading-relaxed">
              Other than the content you own, under these Terms, SkillBridge and/or its licensors own all the intellectual property rights and materials contained in this Website.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Restrictions</h2>
            <p className="text-gray-300 leading-relaxed">
              You are specifically restricted from all of the following: publishing any Website material in any other media, selling, sublicensing and/or otherwise commercializing any Website material.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Limitation of liability</h2>
            <p className="text-gray-300 leading-relaxed">
              In no event shall SkillBridge, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this Website.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Variation of Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              SkillBridge is permitted to revise these Terms at any time as it sees fit, and by using this Website you are expected to review these Terms on a regular basis.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default TermsOfService;
