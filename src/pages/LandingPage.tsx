import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Brain,
  Users,
  Target,
  Zap,
  ArrowRight,
  // CheckCircle,
  Star,
  Briefcase,
  FileText,
  // Award,
  TrendingUp,
  Shield,
  Globe,
} from "lucide-react";

export const LandingPage: React.FC = () => {
  console.log('LandingPage component is rendering!');

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Matching",
      description:
        "Advanced algorithms match candidates with perfect job opportunities",
    },
    {
      icon: FileText,
      title: "Smart Resume Builder",
      description:
        "Create professional resumes with AI assistance and optimization",
    },
    {
      icon: Target,
      title: "Targeted Job Search",
      description: "Find jobs that perfectly match your skills and preferences",
    },
    {
      icon: TrendingUp,
      title: "Career Analytics",
      description:
        "Track your progress and get insights to advance your career",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security",
    },
    {
      icon: Globe,
      title: "Global Opportunities",
      description: "Access job opportunities from companies worldwide",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      company: "TechCorp",
      content:
        "AI Resume helped me find my dream job in just 2 weeks. The AI matching is incredible!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      company: "StartupXYZ",
      content:
        "The platform made hiring so much easier. We found perfect candidates quickly.",
      rating: 5,
    },
    {
      name: "Emily Davis",
      role: "UX Designer",
      company: "DesignHub",
      content: "Best job platform I've used. The resume builder is fantastic!",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-lg border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">AI Resume</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              The Future of{" "}
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Smart Recruitment
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Connect talent with opportunity using AI-powered matching. Whether
              you're seeking your next role or building your dream team, we make
              it seamless.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/register"
                className="bg-primary-600 text-white px-8 py-4 rounded-xl hover:bg-primary-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Users className="w-5 h-5" />
                Find Talent
              </Link>
              <Link
                to="/register"
                className="bg-white text-primary-600 px-8 py-4 rounded-xl border-2 border-primary-600 hover:bg-primary-50 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Briefcase className="w-5 h-5" />
                Find Jobs
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose AI Resume?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the next generation of recruitment technology designed
              for modern professionals.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">
                50K+
              </div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">
                15K+
              </div>
              <div className="text-gray-600">Jobs Posted</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">
                95%
              </div>
              <div className="text-gray-600">Match Accuracy</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">
                2.5K+
              </div>
              <div className="text-gray-600">Companies</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of professionals who found success with AI Resume.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-6 rounded-xl shadow-sm"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-500 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of professionals who have found their perfect match
            with AI Resume.
          </p>
          <Link
            to="/register"
            className="bg-white text-primary-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors font-medium inline-flex items-center gap-2"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">AI Resume</span>
              </div>
              <p className="text-gray-400">
                The future of smart recruitment, powered by artificial
                intelligence.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Job Seekers</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Create Resume</li>
                <li>Find Jobs</li>
                <li>Skill Assessment</li>
                <li>Career Tips</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Employers</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Post Jobs</li>
                <li>Find Candidates</li>
                <li>Hiring Analytics</li>
                <li>Pricing</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AI Resume. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
