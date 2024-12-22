import React from "react";
import { motion } from "framer-motion";
import { 
  FiCode, FiPenTool, FiBarChart, FiCamera, FiHeadphones, FiLayout, 
  FiArrowRight, FiUser, FiSearch, FiSend, FiDollarSign, FiShield, 
  FiMessageSquare, FiStar, FiClock, FiCheckCircle, FiTrendingUp, FiGlobe,
  FiBook, FiUsers, FiArchive, FiAward, FiZap, FiCreditCard, FiCheck, FiPieChart, FiBookOpen
} from "react-icons/fi";
import { Link } from "react-router-dom";

const BecomeFreelancer = () => {
  const categories = [
    {
      icon: FiCode,
      title: "Development & IT",
      description: "Web, Mobile & Software Development",
      color: "from-blue-500 to-cyan-400",
      count: "2,543 jobs available"
    },
    {
      icon: FiPenTool,
      title: "Design & Creative",
      description: "Design, Animation & Creative Services",
      color: "from-purple-500 to-pink-400",
      count: "1,873 jobs available"
    },
    {
      icon: FiBarChart,
      title: "Sales & Marketing",
      description: "Digital Marketing & Business Growth",
      color: "from-green-500 to-emerald-400",
      count: "1,654 jobs available"
    },
    {
      icon: FiCamera,
      title: "Video & Animation",
      description: "Video Editing & Motion Graphics",
      color: "from-red-500 to-orange-400",
      count: "1,432 jobs available"
    },
    {
      icon: FiHeadphones,
      title: "Music & Audio",
      description: "Voice Over & Sound Design",
      color: "from-yellow-500 to-amber-400",
      count: "987 jobs available"
    },
    {
      icon: FiLayout,
      title: "Writing & Translation",
      description: "Content Writing & Translation Services",
      color: "from-indigo-500 to-violet-400",
      count: "1,765 jobs available"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Complete Your Profile",
      description: "Create a comprehensive profile showcasing your skills, experience, and portfolio",
      icon: FiUser,
      color: "from-blue-500 to-cyan-400"
    },
    {
      number: "02",
      title: "Browse Projects",
      description: "Explore available projects that match your expertise and interests",
      icon: FiSearch,
      color: "from-purple-500 to-pink-400"
    },
    {
      number: "03",
      title: "Submit Proposals",
      description: "Send compelling proposals to clients for projects you're interested in",
      icon: FiSend,
      color: "from-green-500 to-emerald-400"
    },
    {
      number: "04",
      title: "Get Hired & Earn",
      description: "Start working on projects and earn money doing what you love",
      icon: FiDollarSign,
      color: "from-orange-500 to-red-400"
    }
  ];

  const features = [
    {
      icon: FiShield,
      title: "Secure Payments",
      description: "Our escrow system ensures your payments are always protected and released only when you're satisfied",
      color: "from-emerald-500 to-teal-400"
    },
    {
      icon: FiMessageSquare,
      title: "Real-time Messaging",
      description: "Communicate effectively with clients through our built-in messaging system with file sharing",
      color: "from-blue-500 to-indigo-400"
    },
    {
      icon: FiStar,
      title: "Review System",
      description: "Build your reputation with client reviews and showcase your expertise to win more projects",
      color: "from-yellow-500 to-orange-400"
    }
  ];

  const benefits = [
    {
      icon: FiClock,
      title: "Flexible Schedule",
      description: "Work on your own terms and choose projects that fit your schedule",
      stat: "70% of freelancers report better work-life balance"
    },
    {
      icon: FiCheckCircle,
      title: "Quality Projects",
      description: "Access high-quality projects from verified clients worldwide",
      stat: "1000+ new projects posted daily"
    },
    {
      icon: FiTrendingUp,
      title: "Growing Income",
      description: "Set your own rates and increase earnings as you build your reputation",
      stat: "Average 45% income growth in first year"
    }
  ];

  const faqs = [
    {
      question: "How do I get started as a freelancer?",
      answer: "Getting started is easy! Simply create your account, complete your profile with your skills and experience, and start browsing available projects. You can submit proposals to projects that match your expertise."
    },
    {
      question: "How does the payment system work?",
      answer: "We use a secure escrow system. When you're hired, the client deposits the payment into escrow. Once you complete the work and the client approves it, the funds are released to you. This ensures safe transactions for everyone."
    },
    {
      question: "What fees does the platform charge?",
      answer: "Our platform charges a competitive service fee that varies based on your lifetime earnings with each client. The more you work with the same client, the lower your fee becomes."
    },
    {
      question: "How do I stand out from other freelancers?",
      answer: "Complete your profile with portfolio items, maintain a high job success score, earn positive reviews, and keep your skills updated. Being responsive and delivering quality work on time will help you build a strong reputation."
    }
  ];

  const skills = [
    { name: "Web Development", count: "2.5K+ Jobs" },
    { name: "Mobile Apps", count: "1.8K+ Jobs" },
    { name: "UI/UX Design", count: "2.1K+ Jobs" },
    { name: "Content Writing", count: "1.9K+ Jobs" },
    { name: "Digital Marketing", count: "1.7K+ Jobs" },
    { name: "Video Editing", count: "1.4K+ Jobs" },
    { name: "Data Analysis", count: "1.6K+ Jobs" },
    { name: "Graphic Design", count: "2.2K+ Jobs" }
  ];

  const platformStats = [
    {
      label: "Active Projects",
      value: "15K+",
      description: "Live projects ready for proposals",
      icon: FiBarChart
    },
    {
      label: "Total Earnings",
      value: "$150M+",
      description: "Paid out to freelancers in 2023",
      icon: FiDollarSign
    },
    {
      label: "Success Rate",
      value: "95%",
      description: "Projects completed successfully",
      icon: FiCheckCircle
    },
    {
      label: "Global Reach",
      value: "150+",
      description: "Countries with active users",
      icon: FiGlobe
    }
  ];

  const resources = [
    {
      title: "Freelancer Academy",
      description: "Free courses and tutorials to help you succeed",
      icon: FiBook,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Community Forums",
      description: "Connect and learn from experienced freelancers",
      icon: FiUsers,
      color: "from-blue-500 to-teal-500"
    },
    {
      title: "Resource Library",
      description: "Templates, guides, and best practices",
      icon: FiArchive,
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Skill Assessments",
      description: "Verify your expertise with certified tests",
      icon: FiAward,
      color: "from-green-500 to-emerald-500"
    }
  ];

  const successMetrics = [
    {
      metric: "Average Project Value",
      value: "$2,500",
      growth: "+25%",
      period: "vs last year"
    },
    {
      metric: "Client Satisfaction",
      value: "4.8/5",
      growth: "+12%",
      period: "vs industry average"
    },
    {
      metric: "Project Success Rate",
      value: "95%",
      growth: "+15%",
      period: "year over year"
    }
  ];

  const platformFeatures = [
    {
      title: "Smart Matching",
      description: "AI-powered project recommendations based on your skills and experience",
      icon: FiZap
    },
    {
      title: "Instant Payments",
      description: "Get paid within 24 hours of project completion",
      icon: FiCreditCard
    },
    {
      title: "Dispute Protection",
      description: "Dedicated support team to resolve any issues",
      icon: FiShield
    },
    {
      title: "Skills Verification",
      description: "Showcase your expertise with verified badges",
      icon: FiCheck
    },
    {
      title: "Project Analytics",
      description: "Track your performance and earnings in real-time",
      icon: FiPieChart
    },
    {
      title: "Learning Hub",
      description: "Access to premium courses and certifications",
      icon: FiBookOpen
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#00f5c410,transparent_50%)]"></div>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px] bg-opacity-20"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px] bg-opacity-20"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center rounded-full px-4 py-1 text-sm font-medium bg-code-green/10 text-code-green ring-1 ring-inset ring-code-green/20 mb-6"
            >
              <svg className="mr-1.5 h-2 w-2 fill-code-green">
                <circle cx="1" cy="1" r="1" />
              </svg>
              Start Earning Today
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
            >
              Turn Your Skills Into{" "}
              <span className="bg-gradient-to-r from-code-green to-[#80FFF2] bg-clip-text text-transparent">
                Success
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto"
            >
              Join thousands of freelancers who are building successful careers and working with clients worldwide.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/register"
                className="group w-full sm:w-auto bg-code-green hover:bg-code-green/90 text-black px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center"
              >
                Start Freelancing
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="w-full sm:w-auto border border-code-green/20 hover:border-code-green/40 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:bg-code-green/5">
                Watch How It Works
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
            >
              Explore Popular Categories
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-400"
            >
              Find the perfect category that matches your expertise
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group cursor-pointer"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r bg-opacity-50 rounded-2xl blur-xl transition-all duration-300 group-hover:opacity-100 opacity-0"
                  style={{ background: `linear-gradient(to right, ${category.color.split(" ")[1]}, ${category.color.split(" ")[3]})` }}
                ></div>
                <div className="relative bg-gray-800/50 backdrop-blur-xl p-8 rounded-2xl border border-gray-700/50 group-hover:border-gray-600/50 transition-all duration-300">
                  <div className="flex items-start justify-between mb-6">
                    <category.icon className="h-12 w-12 text-code-green" />
                    <span className="text-sm text-gray-400">{category.count}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{category.title}</h3>
                  <p className="text-gray-400 mb-4">{category.description}</p>
                  <div className="flex items-center text-code-green group-hover:text-code-green/90 transition-colors">
                    <span className="text-sm font-medium">View Projects</span>
                    <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
            >
              How It Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-400"
            >
              Your journey to successful freelancing starts here
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div 
                  className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-2xl opacity-0 group-hover:opacity-10 transition-all duration-300 blur-xl`}
                />
                <div className="relative h-full bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 group-hover:border-gray-600/50 transition-all duration-300">
                  <div className="flex items-start justify-between mb-8">
                    <div className="p-3 bg-gray-700/50 rounded-xl group-hover:bg-gray-700/70 transition-colors duration-300">
                      <step.icon className="h-8 w-8 text-code-green" />
                    </div>
                    <span className="text-5xl font-bold text-gray-700/50 group-hover:text-code-green/20 transition-colors duration-300">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-code-green transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    {step.description}
                  </p>
                  <div className="absolute bottom-8 left-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
            >
              Powerful Features
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-400 max-w-2xl mx-auto"
            >
              Everything you need to succeed as a freelancer on our platform
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl opacity-0 group-hover:opacity-10 transition-all duration-300 blur-xl`} />
                <div className="relative h-full bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 group-hover:border-gray-600/50 transition-all duration-300">
                  <div className="mb-8">
                    <div className="p-3 bg-gray-700/50 rounded-xl inline-block group-hover:bg-gray-700/70 transition-colors duration-300">
                      <feature.icon className="h-8 w-8 text-code-green" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-code-green transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
            >
              Why Choose Us
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-400 max-w-2xl mx-auto"
            >
              Join thousands of successful freelancers who have transformed their careers
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative h-full bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 group-hover:border-code-green/20 transition-all duration-300">
                  <div className="mb-8">
                    <div className="p-3 bg-code-green/10 rounded-xl inline-block">
                      <benefit.icon className="h-8 w-8 text-code-green" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-400 mb-6">
                    {benefit.description}
                  </p>
                  <div className="pt-6 border-t border-gray-700/50">
                    <p className="text-code-green font-medium">
                      {benefit.stat}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills Showcase Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
            >
              In-Demand Skills
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-400 max-w-2xl mx-auto"
            >
              Browse through the most sought-after skills by clients
            </motion.p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-code-green/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 group-hover:border-code-green/30 transition-all duration-300">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-code-green transition-colors duration-300">
                    {skill.name}
                  </h3>
                  <p className="text-sm text-gray-400">{skill.count}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Statistics Section */}
      <div className="py-20 bg-gray-900/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#00f5c410,transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {platformStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-code-green/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl" />
                <div className="relative bg-gray-800/30 backdrop-blur-xl p-8 rounded-xl border border-gray-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className="h-8 w-8 text-code-green" />
                    <span className="text-3xl font-bold text-white">{stat.value}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{stat.label}</h3>
                  <p className="text-sm text-gray-400">{stat.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-400 max-w-2xl mx-auto"
            >
              Get answers to common questions about freelancing on our platform
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-code-green/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl blur-lg" />
                <div className="relative bg-gray-800/50 backdrop-blur-xl p-8 rounded-xl border border-gray-700/50 group-hover:border-gray-600/50">
                  <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-code-green transition-colors duration-300">
                    {faq.question}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Metrics Section */}
      <div className="py-20 bg-gray-900/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#00f5c410,transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
            >
              Platform Success Metrics
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-400 max-w-2xl mx-auto"
            >
              Real results from our thriving freelancer community
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successMetrics.map((item, index) => (
              <motion.div
                key={item.metric}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-code-green/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl" />
                <div className="relative bg-gray-800/30 backdrop-blur-xl p-8 rounded-xl border border-gray-700/50">
                  <h3 className="text-gray-400 text-sm mb-2">{item.metric}</h3>
                  <div className="flex items-end gap-4 mb-4">
                    <span className="text-4xl font-bold text-white">{item.value}</span>
                    <span className="text-green-400 text-sm mb-1">{item.growth}</span>
                  </div>
                  <p className="text-gray-500 text-sm">{item.period}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Platform Features */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
            >
              Advanced Platform Features
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-400 max-w-2xl mx-auto"
            >
              Tools and features designed to help you succeed
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platformFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-code-green/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl blur" />
                <div className="relative bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-gray-700/50">
                  <feature.icon className="h-8 w-8 text-code-green mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-code-green transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Freelancer Resources */}
      <div className="py-20 bg-gray-900/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#00f5c410,transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
            >
              Resources for Success
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-400 max-w-2xl mx-auto"
            >
              Everything you need to grow your freelance business
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${resource.color} p-1`}>
                  <div className="relative bg-gray-900 backdrop-blur-xl p-6 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-gray-800">
                        <resource.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {resource.title}
                        </h3>
                        <p className="text-gray-400">
                          {resource.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-code-green to-[#80FFF2] opacity-10"></div>
            <div className="relative bg-gray-800/50 backdrop-blur-xl p-12 border border-gray-700/50">
              <div className="max-w-3xl mx-auto text-center">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl sm:text-4xl font-bold text-white mb-6"
                >
                  Ready to Start Your Journey?
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-xl text-gray-400 mb-8"
                >
                  Join our community of successful freelancers and start earning doing what you love.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                  <Link
                    to="/register"
                    className="group w-full sm:w-auto bg-code-green hover:bg-code-green/90 text-black px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center"
                  >
                    Create Your Account
                    <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button className="w-full sm:w-auto border border-code-green/20 hover:border-code-green/40 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:bg-code-green/5">
                    Learn More
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeFreelancer;
