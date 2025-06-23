import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, Location } from "react-router-dom";
import { motion } from "framer-motion";
import {
  registerUser,
  resendOtp as apiResendOtp,
  loginUser,
} from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

interface RegisterState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "freelancer" | "client";
  skills: string[];
  hourlyRate?: string;
}

const VerifyOtp: React.FC = () => {
  const { login: ctxLogin } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation() as Location & {
    state: RegisterState | undefined;
  };
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const resendTimer = useRef<NodeJS.Timeout | null>(null);

  // Redirect back to register if state is missing
  useEffect(() => {
    if (!state) {
      navigate("/register");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (resendTimer.current) clearInterval(resendTimer.current);
    };
  }, []);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return; // only digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
    if (!state) return;
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...state,
        hourlyRate: state.hourlyRate ? Number(state.hourlyRate) : undefined,
        otp: otpString,
      } as any;
      const response = await registerUser(payload);
      if (response.data.success) {
        setSuccess("Email verified! Logging you in...");
        try {
          await ctxLogin(
            { email: state.email, password: state.password },
            false
          );
          navigate("/");
        } catch {
          setError("Login failed");
        }
      } else {
        setError(response.data.error || "Verification failed");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!state) return;
    setLoading(true);
    setError("");
    try {
      await apiResendOtp(state.email);
      setSuccess("OTP resent to your email");
      setResendCooldown(60);
      if (resendTimer.current) clearInterval(resendTimer.current);
      resendTimer.current = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            if (resendTimer.current) clearInterval(resendTimer.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Decorative background (matches Register page) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,#00f5c410,transparent_50%)]" />
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px] bg-opacity-20" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px] bg-opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-tl from-gray-900 via-gray-900/95 to-gray-900/50" />
      </div>

      <div className="relative w-full max-w-md">
        {/* glowing orbs */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-code-green/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-code-green/10 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-gray-900/50 backdrop-blur-xl p-8 pt-10 rounded-2xl shadow-2xl border border-gray-800/50"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Verify your Email
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className="w-12 h-12 text-center text-xl font-semibold rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-code-green"
                />
              ))}
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            {success && (
              <p className="text-green-500 text-sm text-center">{success}</p>
            )}
            {loading && (
              <p className="text-gray-400 text-sm text-center">Processing...</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-black font-semibold bg-code-green hover:bg-code-green/90 transition-all"
            >
              Verify & Create Account
            </button>
          </form>

          <button
            type="button"
            onClick={handleResend}
            disabled={loading || resendCooldown > 0}
            className="w-full mt-4 text-sm text-code-green disabled:text-gray-500"
          >
            {resendCooldown > 0
              ? `Resend OTP (${resendCooldown}s)`
              : "Resend OTP"}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyOtp;
