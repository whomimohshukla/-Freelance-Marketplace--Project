import { useEffect, useState } from 'react';
import Spinner from '../../components/ui/Spinner';
import { setup2FA, confirm2FASetup, disable2FA, fetchMyProfile } from '../../api/user';

const TwoFactorSettings = () => {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [disableCode, setDisableCode] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  // Fetch current 2FA status on mount
  useEffect(() => {
    (async () => {
      try {
        const { data } = await fetchMyProfile();
        setEnabled(!!data?.user?.twoFactorEnabled);
      } catch (e) {
        setEnabled(false);
        /* ignore */
      } finally {
        setFetching(false);
      }
    })();
  }, []);

  const clearMessages = () => {
    setMsg('');
    setErr('');
  };

  const handleEnable = async () => {
    clearMessages();
    setLoading(true);
    setErr('');
    try {
      const { data } = await setup2FA();
      if (data.success) {
        setQr(data.data.qrCode);
      }
    } catch (e: any) {
      setErr(e.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (code.length < 6) return setErr('Enter 6-digit code');
    clearMessages();
    setLoading(true);
    try {
      const { data } = await confirm2FASetup(code);
      if (data.success) {
        setEnabled(true);
        setQr(null);
        setMsg('2FA Enabled');
      }
    } catch (e: any) {
      setErr(e.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    if (disableCode.length < 6) return setErr('Enter 6-digit code');
    clearMessages();
    setLoading(true);
    try {
      const { data } = await disable2FA(disableCode);
      if (data.success) {
        setEnabled(false);
        setMsg('2FA Disabled');
      }
    } catch (e: any) {
      setErr(e.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative space-y-6 p-6 bg-gray-900/60 border border-gray-800 rounded-xl min-h-[300px]">
      <h1 className="text-2xl font-bold text-white">Two-Factor Authentication</h1>
      <p className="text-gray-300 max-w-lg">Protect your account with an extra layer of security by requiring a 6-digit verification code when you sign in.</p>

      {fetching && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl z-10">
          <Spinner size={8} />
        </div>
      )}

      {enabled !== true && !qr && !fetching && (
        <button onClick={handleEnable} disabled={loading} className="px-6 py-3 bg-code-green text-black font-semibold rounded-lg">
          {loading ? 'Loading…' : 'Enable 2FA'}
        </button>
      )}

      {qr && (
        <>
          <p className="text-gray-400">Scan this QR with Google Authenticator / Authy and enter the first 6-digit passcode below.</p>
          <div className="space-y-4">
            <img src={qr} alt="QR Code" className="w-40 h-40" />
            <input
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
            />
            <button onClick={handleVerify} disabled={loading} className="px-6 py-3 bg-code-green text-black font-semibold rounded-lg">
              {loading ? 'Verifying…' : 'Verify & Activate'}
            </button>
          </div>
        </>
      )}

      {enabled === true && !fetching && (
        <div className="space-y-4 max-w-xs">
          <input
            placeholder="6-digit code"
            value={disableCode}
            onChange={(e) => setDisableCode(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
          />
          <button
            onClick={handleDisable}
            disabled={loading}
            className="w-full px-6 py-3 bg-red-500/90 hover:bg-red-600 text-white font-semibold rounded-lg mt-2"
          >
            {loading ? 'Disabling…' : 'Disable 2FA'}
          </button>
        </div>
      )}

      {msg && <p className="text-green-500 text-sm">{msg}</p>}
      {err && <p className="text-red-500 text-sm">{err}</p>}
    </div>
  );
};

export default TwoFactorSettings;
