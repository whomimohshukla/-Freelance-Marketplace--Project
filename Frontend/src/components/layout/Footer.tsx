import React from 'react'

function Footer() {
  return (
    <footer className="bg-light-blue py-12 border-t border-code-green/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">SkillBridge</h3>
            <p className="text-gray-400 text-sm">
              Connect with top talent and grow your business with our AI-powered freelancing platform.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">For Clients</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-code-green text-sm transition-colors">Find Freelancers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-code-green text-sm transition-colors">Post a Project</a></li>
              <li><a href="#" className="text-gray-400 hover:text-code-green text-sm transition-colors">Project Management</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">For Freelancers</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-code-green text-sm transition-colors">Find Work</a></li>
              <li><a href="#" className="text-gray-400 hover:text-code-green text-sm transition-colors">Create Profile</a></li>
              <li><a href="#" className="text-gray-400 hover:text-code-green text-sm transition-colors">Community</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-code-green text-sm transition-colors">Help & Support</a></li>
              <li><a href="#" className="text-gray-400 hover:text-code-green text-sm transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-code-green text-sm transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-code-green/20 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; 2024 SkillBridge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
