import { useEffect, useState } from 'react';
import Spinner from '../../components/ui/Spinner';
import { setup2FA, confirm2FASetup, disable2FA, fetchMyProfile, sendEmail2FACode, confirmEmail2FA } from '../../api/user';

const TwoFactorSettings = () => {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [disableCode, setDisableCode] = useState('');
  const [code, setCode] = useState('');
  const [emailStep, setEmailStep] = useState(false);
  const [emailCode, setEmailCode] = useState('');
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

  // Enable via authenticator
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

  // Enable via email
  const handleEnableEmail = async () => {
    clearMessages();
    setLoading(true);
    try {
      const { data } = await sendEmail2FACode();
      if (data.success) {
        setEmailStep(true);
        setMsg('Verification code sent to your email');
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

  const handleVerifyEmail = async () => {
    if (emailCode.length < 6) return setErr('Enter 6-digit code');
    clearMessages();
    setLoading(true);
    try {
      const { data } = await confirmEmail2FA(emailCode);
      if (data.success) {
        setEnabled(true);
        setEmailStep(false);
        setMsg('Email 2FA Enabled');
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

      {enabled !== true && !qr && !emailStep && !fetching && (
        <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={handleEnable} disabled={loading} className="flex-1 px-6 py-3 bg-code-green text-black font-semibold rounded-lg">
              {loading ? 'Loading…' : 'Enable with Authenticator App'}
            </button>
            <button onClick={handleEnableEmail} disabled={loading} className="flex-1 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg">
              {loading ? 'Loading…' : 'Enable with Email OTP'}
            </button>
          </div>
      )}

      {emailStep && (
        <div className="space-y-4 max-w-xs">
          <input
            placeholder="Enter 6-digit code from email"
            value={emailCode}
            onChange={(e) => setEmailCode(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
          />
          <button onClick={handleVerifyEmail} disabled={loading} className="px-6 py-3 bg-code-green text-black font-semibold rounded-lg">
            {loading ? 'Verifying…' : 'Verify & Activate'}
          </button>
        </div>
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
