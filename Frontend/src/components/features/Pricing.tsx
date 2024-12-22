import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiInfo } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for freelancers just starting out',
      price: billingCycle === 'monthly' ? '₹999' : '₹9,990',
      period: billingCycle === 'monthly' ? '/month' : '/year',
      savings: billingCycle === 'annual' ? 'Save ₹1,998' : null,
      features: [
        'Up to 10 active projects',
        'Basic project search',
        'Standard support',
        'Secure payments',
        'Basic analytics',
        '2% transaction fee'
      ],
      cta: 'Start Free Trial',
      popular: false
    },
    {
      name: 'Professional',
      description: 'Ideal for growing freelancers',
      price: billingCycle === 'monthly' ? '₹2,499' : '₹24,990',
      period: billingCycle === 'monthly' ? '/month' : '/year',
      savings: billingCycle === 'annual' ? 'Save ₹4,998' : null,
      features: [
        'Up to 50 active projects',
        'Advanced project search',
        'Priority support',
        'Secure payments',
        'Advanced analytics',
        '1% transaction fee',
        'Custom profile branding',
        'Featured listings'
      ],
      cta: 'Get Started',
      popular: true
    },
    {
      name: 'Business',
      description: 'For agencies and large teams',
      price: billingCycle === 'monthly' ? '₹4,999' : '₹49,990',
      period: billingCycle === 'monthly' ? '/month' : '/year',
      savings: billingCycle === 'annual' ? 'Save ₹9,998' : null,
      features: [
        'Unlimited active projects',
        'Advanced project search',
        '24/7 priority support',
        'Secure payments',
        'Custom analytics',
        '0.5% transaction fee',
        'Custom branding',
        'Featured listings',
        'Team management',
        'API access',
        'Dedicated account manager'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-20">
      {/* Background Patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px] opacity-5"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px] opacity-5"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Choose the perfect plan for your freelancing journey. All plans include core features to help you succeed.
          </motion.p>

          {/* Billing Toggle */}
          <div className="mt-8 flex justify-center items-center space-x-4">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                billingCycle === 'monthly'
                  ? 'bg-code-green text-gray-900'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                billingCycle === 'annual'
                  ? 'bg-code-green text-gray-900'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Annual
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 inset-x-0 flex justify-center">
                  <span className="px-4 py-1 bg-code-green text-gray-900 text-sm font-medium rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-code-green/20 to-transparent p-[1px]">
                <div className="relative bg-gray-900/90 backdrop-blur-xl p-8 rounded-[11px] h-full flex flex-col">
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-400 text-sm">{plan.description}</p>
                  </div>
                  
                  <div className="mb-8">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      <span className="ml-2 text-gray-400">{plan.period}</span>
                    </div>
                    {plan.savings && (
                      <span className="text-code-green text-sm mt-2 block">{plan.savings}</span>
                    )}
                  </div>

                  <div className="space-y-4 mb-8 flex-grow">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <FiCheck className="h-5 w-5 text-code-green shrink-0 mt-0.5" />
                        <span className="ml-3 text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to={plan.name === 'Business' ? '/contact' : '/register'}
                    className={`w-full text-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      plan.popular
                        ? 'bg-code-green text-gray-900 hover:bg-code-green/90'
                        : 'bg-gray-800/50 text-white hover:bg-gray-700/50'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-code-green/20 to-transparent p-[1px]">
              <div className="relative bg-gray-900/90 backdrop-blur-xl p-6 rounded-[11px]">
                <h3 className="text-lg font-medium text-white mb-2">What's included in the transaction fee?</h3>
                <p className="text-gray-400">The transaction fee covers payment processing, platform maintenance, and secure payment protection for both freelancers and clients.</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-code-green/20 to-transparent p-[1px]">
              <div className="relative bg-gray-900/90 backdrop-blur-xl p-6 rounded-[11px]">
                <h3 className="text-lg font-medium text-white mb-2">Can I upgrade my plan later?</h3>
                <p className="text-gray-400">Yes, you can upgrade your plan at any time. The new pricing will be prorated based on your remaining subscription period.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enterprise CTA */}
        <div className="mt-20">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-code-green/20 to-transparent p-[1px]">
            <div className="relative bg-gray-900/90 backdrop-blur-xl p-8 rounded-[11px] text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Need a Custom Solution?</h3>
              <p className="text-gray-400 mb-6">Contact our sales team for custom pricing and features tailored to your business needs.</p>
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-code-green text-gray-900 font-medium hover:bg-code-green/90 transition-all duration-200"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
