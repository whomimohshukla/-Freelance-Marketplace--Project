import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGoogle, FaGithub, FaLinkedin } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { sendOtp as apiSendOtp } from "../../api/auth";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "freelancer" as "freelancer" | "client",
    skills: [] as string[],
    hourlyRate: "",
    otp: "",
  });
  const [skillsInput, setSkillsInput] = useState("");
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);



  useEffect(() => {
    if (skillsInput.trim().length === 0) {
      setSuggestedSkills([]);
      return;
    }
    let ignore = false;
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          `/api/skills?query=${encodeURIComponent(skillsInput)}`
        );
        const data = await res.json();
        if (!ignore) setSuggestedSkills(data.skills || []);
      } catch (e) {
        if (!ignore) setSuggestedSkills([]);
      }
    };
    fetchSuggestions();
    return () => {
      ignore = true;
    };
  }, [skillsInput]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "skills") {
      setFormData((prev) => ({
        ...prev,
        skills: value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }));
    } else if (name === "hourlyRate") {
      setFormData((prev) => ({
        ...prev,
        hourlyRate: value.replace(/[^0-9.]/g, ""),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  console.log(formData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Flush any text still in the skills input into the skills array
    const pendingSkill = skillsInput.trim();
    const finalSkills =
      pendingSkill && !formData.skills.includes(pendingSkill)
        ? [...formData.skills, pendingSkill]
        : formData.skills;

    const dataToSubmit = { ...formData, skills: finalSkills };

    setLoading(true);
    setError("");
    setSuccess("");

    if (dataToSubmit.password !== dataToSubmit.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    if (dataToSubmit.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }
    if (
      !dataToSubmit.firstName ||
      !dataToSubmit.lastName ||
      !dataToSubmit.email ||
      !dataToSubmit.password
    ) {
      setError("Please fill all required fields");
      setLoading(false);
      return;
    }
    try {
      // Call backend to send OTP
      await apiSendOtp(dataToSubmit.email);
      const { otp, ...details } = dataToSubmit;
      navigate("/verify-otp", { state: details });
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = (provider: string) => {
    console.log(`Signing up with ${provider}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden mt-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,#00f5c410,transparent_50%)]"></div>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px] bg-opacity-20"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px] bg-opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-gray-900 via-gray-900/95 to-gray-900/50"></div>
      </div>

      <div className="relative max-w-xl w-full">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-code-green/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-code-green/10 rounded-full blur-3xl"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-gray-900/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-800/50"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Create Account
            </h2>
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-code-green hover:text-code-green/90 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: FaGoogle, name: "Google" },
                { icon: FaGithub, name: "GitHub" },
                { icon: FaLinkedin, name: "LinkedIn" },
              ].map(({ icon: Icon, name }) => (
                <button
                  key={name}
                  onClick={() => handleSocialSignup(name)}
                  className="group relative flex items-center justify-center p-3 rounded-xl border border-gray-700 bg-gray-800/50 hover:bg-gray-800 transition-all duration-200"
                >
                  <Icon className="h-6 w-6 text-code-green group-hover:scale-110 transition-transform duration-200" />
                  <span className="sr-only">Sign up with {name}</span>
                </button>
              ))}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-900 text-gray-400">
                  or continue with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      First Name
                    </label>

                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-code-green focus:border-transparent transition-all duration-200"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Last Name
                    </label>

                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-code-green focus:border-transparent transition-all duration-200"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-code-green focus:border-transparent transition-all duration-200"
                    placeholder="name@company.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="skills"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Skills{" "}
                      <span className="text-xs text-gray-400">
                        (comma separated)
                      </span>
                    </label>

                    <div className="relative">
                      <input
                        id="skills"
                        name="skills"
                        type="text"
                        value={skillsInput}
                        onChange={(e) => setSkillsInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (
                            (e.key === "Enter" || e.key === ",") &&
                            skillsInput.trim()
                          ) {
                            e.preventDefault();
                            const skill = skillsInput.trim();
                            if (skill && !formData.skills.includes(skill)) {
                              setFormData((prev) => ({
                                ...prev,
                                skills: [...prev.skills, skill],
                              }));
                            }
                            setSkillsInput("");
                            setSuggestedSkills([]);
                          }
                        }}
                        className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-code-green focus:border-transparent transition-all duration-200"
                        placeholder="JavaScript, React"
                        autoComplete="off"
                      />
                      {/* Suggestions dropdown */}
                      {suggestedSkills.length > 0 && (
                        <ul className="absolute left-0 right-0 bg-gray-800 border border-gray-700 rounded-xl mt-1 z-20 max-h-40 overflow-y-auto">
                          {suggestedSkills.map((skill) => (
                            <li
                              key={skill}
                              className="px-4 py-2 cursor-pointer hover:bg-code-green/20 text-white"
                              onClick={() => {
                                if (!formData.skills.includes(skill)) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    skills: [...prev.skills, skill],
                                  }));
                                }
                                setSkillsInput("");
                                setSuggestedSkills([]);
                              }}
                            >
                              {skill}
                            </li>
                          ))}
                        </ul>
                      )}
                      {/* Show current skills as tags */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.skills.map((skill) => (
                          <span
                            key={skill}
                            className="bg-code-green/20 text-code-green px-2 py-1 rounded-full text-xs flex items-center"
                          >
                            {skill}
                            <button
                              type="button"
                              className="ml-1 text-code-green hover:text-red-500"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  skills: prev.skills.filter(
                                    (s) => s !== skill
                                  ),
                                }));
                              }}
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="hourlyRate"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Hourly Rate ($)
                    </label>

                    <input
                      id="hourlyRate"
                      name="hourlyRate"
                      type="number"
                      min="0"
                      value={formData.hourlyRate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-code-green focus:border-transparent transition-all duration-200"
                      placeholder="50"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-code-green focus:border-transparent transition-all duration-200"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-code-green"
                    >
                      {showPassword ? (
                        <AiOutlineEyeInvisible size={20} />
                      ) : (
                        <AiOutlineEye size={20} />
                      )}
                    </button>
                  </div>
                  {formData.password &&
                    formData.password.length > 0 &&
                    formData.password.length < 8 && (
                      <p className="text-red-500 text-sm mt-1">
                        Password must be at least 8 characters.
                      </p>
                    )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-code-green focus:border-transparent transition-all duration-200"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-code-green"
                    >
                      {showConfirmPassword ? (
                        <AiOutlineEyeInvisible size={20} />
                      ) : (
                        <AiOutlineEye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        type="radio"
                        id="freelancer"
                        name="role"
                        value="freelancer"
                        checked={formData.role === "freelancer"}
                        onChange={handleChange}
                        className="peer sr-only"
                      />
                      <label
                        htmlFor="freelancer"
                        className="flex items-center justify-center p-3 w-full text-gray-400 bg-gray-800/50 border border-gray-700 rounded-xl cursor-pointer peer-checked:border-code-green peer-checked:text-code-green hover:bg-gray-800 transition-all duration-200"
                      >
                        Freelancer
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="radio"
                        id="client"
                        name="role"
                        value="client"
                        checked={formData.role === "client"}
                        onChange={handleChange}
                        className="peer sr-only"
                      />
                      <label
                        htmlFor="client"
                        className="flex items-center justify-center p-3 w-full text-gray-400 bg-gray-800/50 border border-gray-700 rounded-xl cursor-pointer peer-checked:border-code-green peer-checked:text-code-green hover:bg-gray-800 transition-all duration-200"
                      >
                        Client
                      </label>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="text-red-500 text-sm mb-2">{error}</div>
                )}
                {success && (
                  <div className="text-green-500 text-sm mb-2">
                    Registration successful!
                  </div>
                )}
                {loading && (
                  <div className="text-gray-400 text-sm mb-2">
                    Registering...
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 rounded-xl text-black font-semibold bg-code-green hover:bg-code-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-code-green focus:ring-offset-gray-900 transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </div>
            </form>

            <p className="text-center text-xs text-gray-400">
              By signing up, you agree to our{" "}
              <Link
                to="/terms"
                className="text-code-green hover:text-code-green/90"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="text-code-green hover:text-code-green/90"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
