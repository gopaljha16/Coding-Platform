import React, { useState, useEffect } from 'react';
import { ChevronDown, Trophy, Flame, Bot, Code, GraduationCap, FileText, UserCheck, Users, Medal, Coins, Calendar, MessageCircle, Zap, Star, ArrowRight, Play, Check, Target, Sparkles, TrendingUp, Clock, Globe, Award, Heart, Lightbulb } from 'lucide-react';

const Explore = () => {
  const [activeFeature, setActiveFeature] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const features = [
    {
      id: 'contests',
      title: 'Daily Contests',
      icon: Trophy,
      description: 'Join daily coding contests created by admins. Test your skills against other coders and climb the leaderboard.',
      badge: 'Live',
      badgeColor: 'bg-green-500',
      details: 'Participate in algorithmically challenging contests every day. Compete with thousands of users globally and win exciting prizes.',
      benefits: ['Daily challenges', 'Global rankings', 'Skill assessment', 'Prizes & rewards'],
      difficulty: 'All Levels',
      participants: '5K+ daily'
    },
    {
      id: 'streaks',
      title: 'Daily Streaks',
      icon: Flame,
      description: 'Build your coding habit with unique daily streaks. Solve problems daily and maintain your momentum.',
      badge: 'Popular',
      badgeColor: 'bg-orange-500',
      details: 'Maintain your coding streak with personalized challenges that adapt to your skill level and help build consistent habits.',
      benefits: ['Habit building', 'Personalized challenges', 'Progress tracking', 'Motivation system'],
      difficulty: 'Adaptive',
      participants: '15K+ active'
    },
    {
      id: 'ai-assistant',
      title: 'AI Assistant',
      icon: Bot,
      description: 'Get help from our AI assistant. Unlimited access for premium users with advanced debugging and explanations.',
      badge: 'Premium',
      badgeColor: 'bg-yellow-500',
      details: 'Advanced AI that helps debug code, explains algorithms, provides coding suggestions, and acts as your personal coding mentor.',
      benefits: ['Code debugging', 'Algorithm explanations', 'Real-time help', 'Learning assistance'],
      difficulty: 'All Levels',
      participants: '8K+ users'
    },
    {
      id: 'hackathons',
      title: 'Hackathons',
      icon: Code,
      description: 'Participate in coding hackathons and build innovative projects. Collaborate with teams globally.',
      badge: 'Upcoming',
      badgeColor: 'bg-blue-500',
      details: 'Join team-based hackathons and build innovative projects with developers worldwide. Win prizes and gain recognition.',
      benefits: ['Team collaboration', 'Project building', 'Innovation challenges', 'Network building'],
      difficulty: 'Intermediate+',
      participants: '3K+ teams'
    },
    {
      id: 'courses',
      title: 'Interactive Courses',
      icon: GraduationCap,
      description: 'Learn from structured courses covering algorithms, data structures, and programming languages.',
      badge: 'New',
      badgeColor: 'bg-purple-500',
      details: 'Comprehensive learning paths designed by industry experts and competitive programmers with hands-on practice.',
      benefits: ['Structured learning', 'Expert content', 'Hands-on practice', 'Progress tracking'],
      difficulty: 'Beginner to Advanced',
      participants: '12K+ learners'
    },
    {
      id: 'sheets',
      title: 'Personal Sheets',
      icon: FileText,
      description: 'Create and organize your personal coding sheets. Track your progress and notes in one place.',
      badge: 'Essential',
      badgeColor: 'bg-emerald-500',
      details: 'Organize your coding journey with customizable sheets, progress tracking, and collaborative features.',
      benefits: ['Personal organization', 'Progress tracking', 'Note taking', 'Custom categories'],
      difficulty: 'All Levels',
      participants: '20K+ users'
    },
    {
      id: 'interview',
      title: 'AI Interview Prep',
      icon: UserCheck,
      description: 'Practice with AI-powered interview sessions. Upload your resume and get personalized mock interviews.',
      badge: 'Beta',
      badgeColor: 'bg-green-400',
      details: 'Advanced AI interviewer that adapts to your resume and provides realistic interview experience with detailed feedback.',
      benefits: ['Mock interviews', 'Resume analysis', 'Feedback system', 'Industry-specific prep'],
      difficulty: 'Job Seekers',
      participants: '2K+ interviews'
    },
    {
      id: 'live-solving',
      title: 'Live Problem Solving',
      icon: Users,
      description: 'See who\'s currently solving the same problem as you. Connect and collaborate in real-time.',
      badge: 'Live',
      badgeColor: 'bg-green-500',
      details: 'Real-time collaboration features that connect you with other problem solvers for peer learning and support.',
      benefits: ['Real-time collaboration', 'Peer learning', 'Live discussions', 'Problem sharing'],
      difficulty: 'All Levels',
      participants: '1K+ online'
    },
    {
      id: 'leaderboards',
      title: 'Multi-tier Leaderboards',
      icon: Medal,
      description: 'Daily, college-wise, and global leaderboards. Earn points based on problem difficulty and compete for prizes.',
      badge: 'Competitive',
      badgeColor: 'bg-amber-500',
      details: 'Comprehensive ranking system with multiple leaderboard categories and seasonal competitions.',
      benefits: ['Multiple rankings', 'College competitions', 'Global leaderboards', 'Seasonal prizes'],
      difficulty: 'Competitive',
      participants: '25K+ ranked'
    },
    {
      id: 'points-shop',
      title: 'Points & Shop',
      icon: Coins,
      description: 'Earn coins by solving problems and spend them in our shop. Buy themes, badges, and exclusive content.',
      badge: 'Rewarding',
      badgeColor: 'bg-yellow-600',
      details: 'Comprehensive reward system with virtual currency, exclusive items, and customization options.',
      benefits: ['Earn rewards', 'Exclusive items', 'Theme customization', 'Achievement system'],
      difficulty: 'All Levels',
      participants: '18K+ shoppers'
    },
    {
      id: 'events',
      title: 'Custom Events',
      icon: Calendar,
      description: 'Join custom events created by educators and institutions. Participate in specialized competitions.',
      badge: 'Educational',
      badgeColor: 'bg-indigo-500',
      details: 'Participate in custom coding events designed for educational institutions and specialized learning.',
      benefits: ['Educational events', 'Institution support', 'Specialized competitions', 'Learning focused'],
      difficulty: 'All Levels',
      participants: '500+ events'
    },
    {
      id: 'community',
      title: 'Community Hall',
      icon: MessageCircle,
      description: 'Join our community chat room. Discuss problems, share knowledge, and connect with fellow coders.',
      badge: 'Social',
      badgeColor: 'bg-pink-500',
      details: 'Vibrant community space for discussions, help, networking, and sharing coding experiences.',
      benefits: ['Community discussions', 'Knowledge sharing', 'Networking', 'Help & support'],
      difficulty: 'All Levels',
      participants: '30K+ members'
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer at Google",
      content: "Codexa's daily contests helped me improve my problem-solving skills dramatically. The AI assistant is incredibly helpful!",
      rating: 5,
      avatar: "PS"
    },
    {
      name: "Rahul Verma",
      role: "Student at IIT Delhi",
      content: "The streak feature kept me motivated to code every day. I've solved over 500 problems in the last 6 months!",
      rating: 5,
      avatar: "RV"
    },
    {
      name: "Ananya Patel",
      role: "Full Stack Developer",
      content: "The interview prep feature is amazing. I cracked my dream job interview thanks to the AI mock interviews.",
      rating: 5,
      avatar: "AP"
    }
  ];

  const achievements = [
    { icon: Globe, title: "Global Reach", desc: "Users from 50+ countries", color: "text-blue-400" },
    { icon: Clock, title: "24/7 Active", desc: "Round-the-clock coding", color: "text-green-400" },
    { icon: TrendingUp, title: "Growing Fast", desc: "500% growth this year", color: "text-orange-400" },
    { icon: Heart, title: "Community Love", desc: "4.9/5 user rating", color: "text-red-400" }
  ];

  const stats = [
    { value: '25K+', label: 'Active Users', icon: Users },
    { value: '100K+', label: 'Problems Solved', icon: Check },
    { value: '1K+', label: 'Daily Contests', icon: Trophy },
    { value: '200+', label: 'Colleges', icon: GraduationCap }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const FeatureCard = ({ feature, index }) => {
    const isActive = activeFeature === feature.id;
    
    return (
      <div
        className={`group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:border-orange-500/50 hover:bg-slate-800/70 ${
          isActive ? 'border-orange-500 bg-slate-800/70' : ''
        }`}
        onClick={() => setActiveFeature(isActive ? null : feature.id)}
        style={{
          animationDelay: `${index * 0.1}s`
        }}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <feature.icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${feature.badgeColor}`}>
                {feature.badge}
              </span>
            </div>
            <p className="text-gray-300 text-sm mb-3">{feature.description}</p>
            
            <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
              <span className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                {feature.difficulty}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {feature.participants}
              </span>
            </div>
            
            {isActive && (
              <div className="space-y-4 border-t border-slate-700 pt-4">
                <p className="text-gray-400">{feature.details}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {feature.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" />
                  Try Now
                </button>
              </div>
            )}
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 ${
            isActive ? 'rotate-180' : ''
          }`} />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(251,146,60,0.1),transparent_70%)]"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-gray-300">Explore Amazing Features</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Unleash Your{' '}
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Coding Potential
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              From daily coding contests to AI-powered interview prep, discover our comprehensive suite of features designed to accelerate your coding journey and unlock new opportunities.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105">
                <Zap className="w-5 h-5" />
                Start Exploring
              </button>
              <button className="border border-slate-600 text-gray-300 px-8 py-3 rounded-lg font-medium hover:border-orange-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-xl md:text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Features & Services</h2>
          <p className="text-lg md:text-xl text-gray-300">Everything you need to excel in competitive programming</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-slate-800/30 backdrop-blur-sm border-y border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">What Our Users Say</h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative min-h-[200px]">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`transition-all duration-500 ${
                    index === currentTestimonial ? 'opacity-100' : 'opacity-0 absolute top-0 left-0 w-full'
                  }`}
                >
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center">
                    <div className="flex justify-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-300 text-base md:text-lg mb-6 italic">"{testimonial.content}"</p>
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{testimonial.name}</div>
                        <div className="text-gray-400 text-sm">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-6 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-orange-500' : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-full px-4 py-2 mb-6">
            <Lightbulb className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-gray-300">Ready to Start?</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Level Up Your Coding?</h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8">Join thousands of developers who are already improving their skills with Codexa</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105">
              <Award className="w-5 h-5" />
              Get Started Free
            </button>
            <button className="border border-slate-600 text-gray-300 px-8 py-3 rounded-lg font-medium hover:border-orange-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
              <Users className="w-5 h-5" />
              Join Community
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;