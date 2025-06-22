import React, { useEffect, useState } from 'react';

/**
 * Simple cookie consent banner. It checks localStorage for the key `cookieConsent`.
 * If not present, a banner is displayed at the bottom of the screen asking the user
 * to accept the cookie policy. Once accepted, the banner disappears and the choice
 * is persisted in localStorage so it won't appear again.
 */
const CookieConsentBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-gray-800/95 backdrop-blur-md text-gray-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl border-t border-gray-700">
      <p className="text-sm text-center sm:text-left max-w-3xl">
        We use cookies to personalize content, provide social media features and to analyse our traffic. By clicking
        "Accept", you consent to the use of cookies in accordance with our <a href="/privacy-policy" className="underline text-code-green hover:text-code-green/90">Privacy&nbsp;Policy</a>.
      </p>
      <button
        onClick={acceptCookies}
        className="px-6 py-2 rounded-md font-semibold bg-code-green text-black hover:bg-code-green/90 transition-colors"
      >
        Accept
      </button>
    </div>
  );
};

export default CookieConsentBanner;
