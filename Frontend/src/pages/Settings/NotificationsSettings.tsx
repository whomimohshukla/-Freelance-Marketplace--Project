import { useState } from 'react';

const NotificationsSettings = () => {
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);

  return (
    <div className="space-y-6 p-6 bg-gray-900/60 border border-gray-800 rounded-xl">
      <h1 className="text-2xl font-bold text-white">Notification Preferences</h1>

      <div className="flex items-center justify-between">
        <span className="text-gray-200">Email notifications</span>
        <input
          type="checkbox"
          checked={emailNotif}
          onChange={() => setEmailNotif((v) => !v)}
          className="toggle toggle-success"
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-200">Push notifications</span>
        <input
          type="checkbox"
          checked={pushNotif}
          onChange={() => setPushNotif((v) => !v)}
          className="toggle toggle-success"
        />
      </div>
      <p className="text-sm text-gray-400">(Preferences are local only for demo)</p>
    </div>
  );
};

export default NotificationsSettings;
