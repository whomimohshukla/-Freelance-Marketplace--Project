import React from "react";
import { DocSection, UserRegistration, ProjectMatch, PaymentProcess } from "./types";
import { CodeBlock } from "./DocContent";

export const documentationSections: DocSection[] = [
  {
    title: "Getting Started",
    items: [
      {
        title: "Welcome to SkillBridge",
        path: "/documentation/introduction",
        content: (
          <>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-code-green to-blue-400 bg-clip-text text-transparent mb-6">
              Welcome to SkillBridge
            </h2>
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 mb-8">
              <p className="text-lg text-gray-300 leading-relaxed">
                Your gateway to the future of freelancing. Our platform
                connects skilled professionals with innovative projects, creating
                opportunities for growth and success in the digital economy.
              </p>
            </div>

            <h3 className="text-2xl font-semibold text-white mb-6">Platform Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <div className="text-3xl mb-4">🎯</div>
                <h4 className="text-lg font-semibold text-white mb-2">AI-Powered Matching</h4>
                <p className="text-gray-300 text-sm">Advanced algorithms ensure perfect project-talent matches</p>
              </div>
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <div className="text-3xl mb-4">🔒</div>
                <h4 className="text-lg font-semibold text-white mb-2">Secure Payments</h4>
                <p className="text-gray-300 text-sm">Multi-layered payment protection with escrow service</p>
              </div>
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <div className="text-3xl mb-4">💬</div>
                <h4 className="text-lg font-semibold text-white mb-2">Real-time Collaboration</h4>
                <p className="text-gray-300 text-sm">Integrated messaging and project management tools</p>
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-white mb-6">Platform Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-code-green mb-2">50K+</div>
                <div className="text-gray-400">Active Freelancers</div>
              </div>
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-code-green mb-2">10K+</div>
                <div className="text-gray-400">Completed Projects</div>
              </div>
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-code-green mb-2">95%</div>
                <div className="text-gray-400">Client Satisfaction</div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
              <h4 className="text-xl font-semibold text-blue-400 mb-4">Start Your Journey</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-white mb-3">For Freelancers</h5>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">→</span>
                      <span className="text-gray-300">Create your professional profile</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">→</span>
                      <span className="text-gray-300">Showcase your portfolio</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">→</span>
                      <span className="text-gray-300">Start bidding on projects</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-white mb-3">For Clients</h5>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">→</span>
                      <span className="text-gray-300">Post your project</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">→</span>
                      <span className="text-gray-300">Review proposals</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">→</span>
                      <span className="text-gray-300">Hire top talent</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        ),
      },
      {
        title: "Quick Start Guide",
        path: "/documentation/quick-start",
        content: (
          <>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-code-green to-blue-400 bg-clip-text text-transparent mb-6">
              Quick Start Guide
            </h2>
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 mb-8">
              <p className="text-lg text-gray-300 leading-relaxed">
                Get started with SkillBridge in minutes. Follow our step-by-step guide to
                set up your account and begin your journey.
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="text-code-green text-2xl mr-2">1</span>
                  Create Your Account
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-300">
                    Setting up your account is the first step to accessing our platform's features:
                  </p>
                  <CodeBlock
                    language="typescript"
                    code={`// Example user registration
const registerUser = async (userData: UserRegistration) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error);
  }
}`}
                  />
                </div>
              </div>

              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="text-code-green text-2xl mr-2">2</span>
                  Complete Your Profile
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">Essential Information</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-code-green mr-2">•</span>
                        <span className="text-gray-300">Professional photo</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-code-green mr-2">•</span>
                        <span className="text-gray-300">Bio and skills</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-code-green mr-2">•</span>
                        <span className="text-gray-300">Portfolio items</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-3">Additional Details</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-code-green mr-2">•</span>
                        <span className="text-gray-300">Hourly rate</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-code-green mr-2">•</span>
                        <span className="text-gray-300">Availability</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-code-green mr-2">•</span>
                        <span className="text-gray-300">Languages</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="text-code-green text-2xl mr-2">3</span>
                  Explore the Platform
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <div className="text-2xl mb-2">🔍</div>
                    <h4 className="font-semibold text-white mb-2">Browse Projects</h4>
                    <p className="text-gray-300 text-sm">Find opportunities that match your skills</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <div className="text-2xl mb-2">📝</div>
                    <h4 className="font-semibold text-white mb-2">Submit Proposals</h4>
                    <p className="text-gray-300 text-sm">Create compelling project proposals</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <div className="text-2xl mb-2">💼</div>
                    <h4 className="font-semibold text-white mb-2">Start Working</h4>
                    <p className="text-gray-300 text-sm">Begin your first project</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mt-8">
              <h4 className="text-xl font-semibold text-yellow-500 mb-4">Important Notes</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">!</span>
                  <span className="text-gray-300">Keep your profile information up to date</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">!</span>
                  <span className="text-gray-300">Enable two-factor authentication for security</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">!</span>
                  <span className="text-gray-300">Review platform guidelines regularly</span>
                </li>
              </ul>
            </div>
          </>
        ),
      },
    ],
  },
  {
    title: "Account Management",
    items: [
      {
        title: "Profile Optimization",
        path: "/documentation/profile-setup",
        content: (
          <>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-code-green to-blue-400 bg-clip-text text-transparent mb-6">
              Optimizing Your Profile
            </h2>
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 mb-8">
              <p className="text-lg text-gray-300 leading-relaxed">
                Your profile is your digital identity on SkillBridge. Creating a compelling
                profile is crucial for standing out in the competitive freelance marketplace
                and attracting high-quality clients.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="text-code-green text-2xl mr-2">✓</span>
                  Profile Completion Tips
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-code-green mr-2">•</span>
                    <span className="text-gray-300">Complete all sections thoroughly</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-code-green mr-2">•</span>
                    <span className="text-gray-300">Use keywords relevant to your skills</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-code-green mr-2">•</span>
                    <span className="text-gray-300">Keep information up-to-date</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-code-green mr-2">•</span>
                    <span className="text-gray-300">Highlight your achievements</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="text-yellow-500 text-2xl mr-2">⚠</span>
                  Common Mistakes to Avoid
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span className="text-gray-300">Generic or vague descriptions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span className="text-gray-300">Outdated portfolio items</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span className="text-gray-300">Missing contact information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span className="text-gray-300">Unprofessional profile photo</span>
                  </li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-white mb-6">Profile Structure</h3>
            <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 mb-8">
              <CodeBlock
                language="typescript"
                code={`interface Profile {
  // Basic Information
  fullName: string;
  title: string;
  bio: string;
  location: string;
  
  // Professional Details
  skills: {
    name: string;
    level: 'Beginner' | 'Intermediate' | 'Expert';
    verified: boolean;
  }[];
  
  // Portfolio
  portfolio: {
    title: string;
    description: string;
    images: string[];
    category: string;
    technologies: string[];
    link?: string;
  }[];
  
  // Work History
  experience: {
    title: string;
    company: string;
    duration: string;
    description: string;
  }[];
}`}
              />
            </div>

            <h3 className="text-2xl font-semibold text-white mb-6">Best Practices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <div className="text-3xl mb-4">📸</div>
                <h4 className="font-semibold text-white mb-2">Professional Photo</h4>
                <p className="text-gray-300 text-sm">Use a clear, well-lit headshot with a neutral background</p>
              </div>

              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <div className="text-3xl mb-4">✍️</div>
                <h4 className="font-semibold text-white mb-2">Compelling Bio</h4>
                <p className="text-gray-300 text-sm">Write a concise, engaging summary of your expertise and goals</p>
              </div>

              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <div className="text-3xl mb-4">🎯</div>
                <h4 className="font-semibold text-white mb-2">Skill Verification</h4>
                <p className="text-gray-300 text-sm">Complete skill assessments to earn verification badges</p>
              </div>

              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <div className="text-3xl mb-4">💼</div>
                <h4 className="font-semibold text-white mb-2">Portfolio Quality</h4>
                <p className="text-gray-300 text-sm">Showcase your best and most relevant work samples</p>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mt-8">
              <h4 className="text-xl font-semibold text-blue-400 mb-4">Pro Tips</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">→</span>
                  <span className="text-gray-300">Update your profile regularly to reflect new skills and experiences</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">→</span>
                  <span className="text-gray-300">Use metrics and numbers to quantify your achievements</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">→</span>
                  <span className="text-gray-300">Customize your portfolio based on the type of projects you're seeking</span>
                </li>
              </ul>
            </div>
          </>
        ),
      },
      {
        title: "Security & Privacy",
        path: "/documentation/security",
        content: (
          <>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-code-green to-blue-400 bg-clip-text text-transparent mb-6">
              Security & Privacy Guide
            </h2>
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 mb-8">
              <p className="text-lg text-gray-300 leading-relaxed">
                Protecting your account and personal information is our top priority.
                Follow these guidelines to maintain optimal security.
              </p>
            </div>

            <h3 className="text-2xl font-semibold text-white mb-6">Two-Factor Authentication (2FA)</h3>
            <p className="text-gray-300">
              Enable 2FA for an additional layer of security:
            </p>
            <CodeBlock
              language="typescript"
              code={`// 2FA Verification Process
const verify2FA = async (
  userId: string,
  code: string
): Promise<boolean> => {
  const user = await getUser(userId);
  const isValid = await verify2FAToken(
    user.secretKey,
    code
  );
  
  if (isValid) {
    await updateUserSession(userId, {
      twoFactorVerified: true
    });
  }
  
  return isValid;
}`}
            />

            <h3 className="text-2xl font-semibold text-white mb-6">Privacy Settings</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-code-green mr-2">•</span>
                <span className="text-gray-300">Control who can view your profile</span>
              </li>
              <li className="flex items-start">
                <span className="text-code-green mr-2">•</span>
                <span className="text-gray-300">Manage notification preferences</span>
              </li>
              <li className="flex items-start">
                <span className="text-code-green mr-2">•</span>
                <span className="text-gray-300">Set communication preferences</span>
              </li>
              <li className="flex items-start">
                <span className="text-code-green mr-2">•</span>
                <span className="text-gray-300">Control data sharing options</span>
              </li>
            </ul>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 my-6">
              <h4 className="text-yellow-500 font-semibold mb-2">
                Security Tips
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">!</span>
                  <span className="text-gray-300">Use a strong, unique password</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">!</span>
                  <span className="text-gray-300">Enable 2FA for all account actions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">!</span>
                  <span className="text-gray-300">Regularly review account activity</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">!</span>
                  <span className="text-gray-300">Never share sensitive information</span>
                </li>
              </ul>
            </div>
          </>
        ),
      },
    ],
  },
  {
    title: "Project Management",
    items: [
      {
        title: "Finding Projects",
        path: "/documentation/finding-projects",
        content: (
          <>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-code-green to-blue-400 bg-clip-text text-transparent mb-6">
              Finding the Perfect Projects
            </h2>
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 mb-8">
              <p className="text-lg text-gray-300 leading-relaxed">
                Learn how to use our advanced search and filtering system to discover
                projects that align with your skills and career goals.
              </p>
            </div>

            <h3 className="text-2xl font-semibold text-white mb-6">Search Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Basic Filters</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-code-green mr-2">•</span>
                    <div>
                      <span className="text-white">Project Category</span>
                      <p className="text-sm text-gray-400">Filter by industry or type</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-code-green mr-2">•</span>
                    <div>
                      <span className="text-white">Budget Range</span>
                      <p className="text-sm text-gray-400">Set min and max budget</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-code-green mr-2">•</span>
                    <div>
                      <span className="text-white">Project Duration</span>
                      <p className="text-sm text-gray-400">Short-term or long-term</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Advanced Filters</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-code-green mr-2">•</span>
                    <div>
                      <span className="text-white">Client Rating</span>
                      <p className="text-sm text-gray-400">Filter by client reputation</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-code-green mr-2">•</span>
                    <div>
                      <span className="text-white">Required Skills</span>
                      <p className="text-sm text-gray-400">Match your expertise</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-code-green mr-2">•</span>
                    <div>
                      <span className="text-white">Location Preference</span>
                      <p className="text-sm text-gray-400">Remote or location-specific</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-white mb-6">AI-Powered Matching</h3>
            <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 mb-8">
              <CodeBlock
                language="typescript"
                code={`interface ProjectMatch {
  projectId: string;
  matchScore: number; // 0-100
  matchFactors: {
    skillMatch: number;
    experienceMatch: number;
    rateMatch: number;
    availabilityMatch: number;
  };
  recommendations: {
    title: string;
    reason: string;
  }[];
}`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <div className="text-3xl mb-4">🎯</div>
                <h4 className="font-semibold text-white mb-2">Smart Matching</h4>
                <p className="text-gray-300 text-sm">AI analyzes your profile and suggests the best matches</p>
              </div>
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <div className="text-3xl mb-4">📊</div>
                <h4 className="font-semibold text-white mb-2">Match Score</h4>
                <p className="text-gray-300 text-sm">See how well you match with each project</p>
              </div>
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <div className="text-3xl mb-4">🔔</div>
                <h4 className="font-semibold text-white mb-2">Alerts</h4>
                <p className="text-gray-300 text-sm">Get notified about perfect matches</p>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
              <h4 className="text-xl font-semibold text-blue-400 mb-4">Search Tips</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">→</span>
                  <span className="text-gray-300">Use specific keywords related to your skills</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">→</span>
                  <span className="text-gray-300">Save searches for quick access</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">→</span>
                  <span className="text-gray-300">Set up email alerts for new matches</span>
                </li>
              </ul>
            </div>
          </>
        ),
      },
      {
        title: "Proposal Writing",
        path: "/documentation/proposals",
        content: (
          <>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-code-green to-blue-400 bg-clip-text text-transparent mb-6">
              Writing Winning Proposals
            </h2>
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 mb-8">
              <p className="text-lg text-gray-300 leading-relaxed">
                Learn how to create proposals that stand out and win projects. Our
                guide covers best practices and proven strategies.
              </p>
            </div>

            <h3 className="text-2xl font-semibold text-white mb-6">Proposal Structure</h3>
            <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 mb-8">
              <CodeBlock
                language="typescript"
                code={`interface Proposal {
  // Cover Letter
  introduction: string;
  approach: string;
  experience: string;
  
  // Project Details
  timeline: {
    duration: string;
    milestones: {
      title: string;
      deliverables: string[];
      duration: string;
    }[];
  };
  
  // Pricing
  budget: {
    totalAmount: number;
    breakdown: {
      item: string;
      amount: number;
    }[];
    paymentSchedule: string;
  };
  
  // Additional Information
  attachments: File[];
  questions: string[];
}`}
              />
            </div>

            <h3 className="text-2xl font-semibold text-white mb-6">Tips for Success</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Do's</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-code-green mr-2">✓</span>
                    <span className="text-gray-300">Personalize each proposal</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-code-green mr-2">✓</span>
                    <span className="text-gray-300">Address client requirements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-code-green mr-2">✓</span>
                    <span className="text-gray-300">Provide relevant examples</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-code-green mr-2">✓</span>
                    <span className="text-gray-300">Be clear and concise</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Don'ts</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">✗</span>
                    <span className="text-gray-300">Use generic templates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">✗</span>
                    <span className="text-gray-300">Oversell your capabilities</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">✗</span>
                    <span className="text-gray-300">Ignore project details</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">✗</span>
                    <span className="text-gray-300">Submit without proofreading</span>
                  </li>
                </ul>
              </div>
            </div>
          </>
        ),
      },
    ],
  },
  {
    title: "Payments & Billing",
    items: [
      {
        title: "Payment System",
        path: "/documentation/payment-methods",
        content: (
          <>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-code-green to-blue-400 bg-clip-text text-transparent mb-6">
              Payment System Overview
            </h2>
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 mb-8">
              <p className="text-lg text-gray-300 leading-relaxed">
                Understanding our secure payment system and available payment methods.
              </p>
            </div>

            <h3 className="text-2xl font-semibold text-white mb-6">Supported Payment Methods</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/50 text-center">
                <div className="text-2xl mb-2">💳</div>
                <div className="font-semibold">Credit Card</div>
              </div>
              <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/50 text-center">
                <div className="text-2xl mb-2">🏦</div>
                <div className="font-semibold">Bank Transfer</div>
              </div>
              <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/50 text-center">
                <div className="text-2xl mb-2">📱</div>
                <div className="font-semibold">PayPal</div>
              </div>
              <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/50 text-center">
                <div className="text-2xl mb-2">⚡</div>
                <div className="font-semibold">Crypto</div>
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-white mb-6">Payment Security</h3>
            <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 mb-8">
              <CodeBlock
                language="typescript"
                code={`// Payment Processing Flow
interface PaymentProcess {
  // Escrow System
  initiateEscrow: (amount: number) => Promise<string>;
  releasePayment: (escrowId: string) => Promise<void>;
  
  // Payment Verification
  verifyPayment: (
    paymentId: string,
    amount: number
  ) => Promise<{
    status: 'success' | 'pending' | 'failed';
    transactionId: string;
    timestamp: Date;
  }>;
  
  // Dispute Resolution
  createDispute: (
    paymentId: string,
    reason: string
  ) => Promise<string>;
}`}
              />
            </div>
          </>
        ),
      },
      {
        title: "Billing & Fees",
        path: "/documentation/billing",
        content: (
          <>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-code-green to-blue-400 bg-clip-text text-transparent mb-6">
              Understanding Billing & Fees
            </h2>
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 mb-8">
              <p className="text-lg text-gray-300 leading-relaxed">
                A comprehensive guide to our billing system, fee structure, and
                payment processes.
              </p>
            </div>

            <h3 className="text-2xl font-semibold text-white mb-6">Fee Structure</h3>
            <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden mb-12">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800/50">
                    <th className="px-6 py-4 text-left">Project Value</th>
                    <th className="px-6 py-4 text-left">Platform Fee</th>
                    <th className="px-6 py-4 text-left">Processing Fee</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-700/50">
                    <td className="px-6 py-4">$0 - $500</td>
                    <td className="px-6 py-4">5%</td>
                    <td className="px-6 py-4">2.9% + $0.30</td>
                  </tr>
                  <tr className="border-t border-gray-700/50">
                    <td className="px-6 py-4">$501 - $10,000</td>
                    <td className="px-6 py-4">4%</td>
                    <td className="px-6 py-4">2.5% + $0.30</td>
                  </tr>
                  <tr className="border-t border-gray-700/50">
                    <td className="px-6 py-4">$10,001+</td>
                    <td className="px-6 py-4">3%</td>
                    <td className="px-6 py-4">2.2% + $0.30</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-2xl font-semibold text-white mb-6">Fee Calculator</h3>
            <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 mb-8">
              <CodeBlock
                language="typescript"
                code={`// Fee Calculator
const calculateFees = (amount: number): {
  platformFee: number;
  processingFee: number;
  totalFee: number;
  netAmount: number;
} => {
  let platformFeeRate = 0.05; // Default 5%
  
  if (amount > 10000) {
    platformFeeRate = 0.03;
  } else if (amount > 500) {
    platformFeeRate = 0.04;
  }
  
  const platformFee = amount * platformFeeRate;
  const processingFee = amount * 0.029 + 0.30;
  const totalFee = platformFee + processingFee;
  
  return {
    platformFee,
    processingFee,
    totalFee,
    netAmount: amount - totalFee
  };
}`}
              />
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 my-6">
              <h4 className="text-blue-400 font-semibold mb-2">
                Pro Tip: Enterprise Solutions
              </h4>
              <p className="text-gray-300">
                For enterprise clients with high transaction volumes, we offer
                custom fee structures and dedicated support. Contact our enterprise
                team for more information.
              </p>
            </div>
          </>
        ),
      },
    ],
  },
];
