import { useState } from 'react';
import { FiGithub, FiLinkedin } from 'react-icons/fi';

const providers = [
  { id: 'github', label: 'GitHub', icon: FiGithub },
  { id: 'linkedin', label: 'LinkedIn', icon: FiLinkedin },
];

const SocialAccountsSettings = () => {
  const [connected, setConnected] = useState<{ [k: string]: boolean }>({ github: false, linkedin: false });

  const toggle = (id: string) => {
    // placeholder – integrate with real API later
    setConnected((c) => ({ ...c, [id]: !c[id] }));
  };

  return (
    <div className="space-y-6 p-6 bg-gray-900/60 border border-gray-800 rounded-xl">
      <h1 className="text-2xl font-bold text-white">Connected Social Accounts</h1>
      <p className="text-gray-300 max-w-lg">Link your accounts to quickly sign in and showcase credibility.</p>

      {providers.map(({ id, label, icon: Icon }) => (
        <div key={id} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <Icon className="text-xl text-code-green" />
            <span className="text-gray-200">{label}</span>
          </div>
          <button
            onClick={() => toggle(id)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              connected[id] ? 'bg-red-500/90 text-white' : 'bg-code-green text-black'
            }`}
          >
            {connected[id] ? 'Disconnect' : 'Connect'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default SocialAccountsSettings;
