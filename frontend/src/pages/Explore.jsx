import React, { useState, useEffect } from 'react';
import { 
  Zap, Rocket, Play, Sparkles, Trophy, Flame, Swords, Cpu,
  BrainCircuit, Code2, GraduationCap, Users, Check, GitBranch,
  BookOpen, MessageSquare, Clock, Star, ChevronDown, Lightbulb,
  Target, Medal, Coins, Calendar, UserCheck, FileText, Globe,
  Shield, TrendingUp, Heart, CircleDashed, BadgeCheck, Terminal,
  Bot, Code, FileCode, Laptop, Notebook, Puzzle, GitPullRequest,
  Award, BarChart, Database, Server, ShieldCheck, Timer
} from 'lucide-react';

const Explore = () => {
  const [activeJourney, setActiveJourney] = useState('competitive');
  const [activeFeature, setActiveFeature] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [animatedStats, setAnimatedStats] = useState({
    users: 0,
    problems: 0,
    offers: 0,
    streaks: 0
  });

  // Animated counting effect
  useEffect(() => {
    const duration = 1800;
    const startValues = { users: 0, problems: 0, offers: 0, streaks: 0 };
    const targetValues = { users: 35892, problems: 215673, offers: 1243, streaks: 18765 };
    
    const animate = (startTime) => {
      const now = Date.now();
      const progress = Math.min(1, (now - startTime) / duration);
      
      setAnimatedStats({
        users: Math.floor(progress * targetValues.users),
        problems: Math.floor(progress * targetValues.problems),
        offers: Math.floor(progress * targetValues.offers),
        streaks: Math.floor(progress * targetValues.streaks)
      });

      if (progress < 1) requestAnimationFrame(() => animate(startTime));
    };

    animate(Date.now());
  }, []);

  // Feature categories organized by developer journey
  const journeyFeatures = {
    competitive: [
      {
        id: 'arena',
        title: 'Code Arena',
        icon: Swords,
        description: 'Real-time coding battles',
        status: 'LIVE',
        statusColor: 'bg-red-500',
        stats: '3.2K active now',
        details: 'Compete in algorithm duels with live leaderboards and instant feedback. Our matchmaking system pairs you with coders at your skill level.',
        highlights: [
          'Head-to-head matches',
          '15+ programming languages',
          'Dynamic difficulty',
          'Weekly tournaments'
        ],
        difficulty: 'Beginner → Expert'
      },
      {
        id: 'leaderboards',
        title: 'Dynamic Leaderboards',
        icon: Trophy,
        description: 'Track your progress',
        status: 'POPULAR',
        statusColor: 'bg-amber-500',
        stats: '25K+ ranked',
        details: 'Real-time rankings across multiple dimensions - daily, weekly, monthly, and by technology stack.',
        highlights: [
          'College rankings',
          'Skill-based tiers',
          'Achievement badges',
          'Seasonal rewards'
        ],
        difficulty: 'All Levels'
      }
    ],
    learning: [
      {
        id: 'ai-mentor',
        title: 'AI Mentor Pro',
        icon: BrainCircuit,
        description: 'Personalized guidance',
        status: 'BETA',
        statusColor: 'bg-purple-500',
        stats: '8.4K testers',
        details: 'Get 1:1 mentorship from our AI that learns your coding style and provides tailored recommendations.',
        highlights: [
          'Adaptive learning paths',
          'Code review assistant',
          'Interview simulator',
          'Debugging companion'
        ],
        difficulty: 'Adaptive'
      },
      {
        id: 'interactive-courses',
        title: 'Interactive Courses',
        icon: BookOpen,
        description: 'Learn by doing',
        status: 'NEW',
        statusColor: 'bg-blue-500',
        stats: '12K+ learners',
        details: 'Project-based courses with instant feedback and real-world applications.',
        highlights: [
          'Algorithm mastery',
          'System design',
          'Web3 curriculum',
          'Cloud computing'
        ],
        difficulty: 'Beginner → Advanced'
      }
    ],
    professional: [
      {
        id: 'interview-prep',
        title: 'Interview Dojo',
        icon: UserCheck,
        description: 'FAANG-level prep',
        status: 'LIVE',
        statusColor: 'bg-emerald-500',
        stats: '2K+ hires',
        details: 'Comprehensive interview preparation with company-specific question banks and mock interviews.',
        highlights: [
          'Resume-based simulations',
          'Behavioral coaching',
          'Whiteboard practice',
          'Offer negotiation'
        ],
        difficulty: 'Job Seekers'
      },
      {
        id: 'project-labs',
        title: 'Project Labs',
        icon: GitPullRequest,
        description: 'Portfolio builder',
        status: 'NEW',
        statusColor: 'bg-indigo-500',
        stats: '5K+ projects',
        details: 'Build real-world applications with guided tutorials and deployment support.',
        highlights: [
          'Full-stack projects',
          'Open-source contributions',
          'DevOps integration',
          'Team collaboration'
        ],
        difficulty: 'Intermediate+'
      }
    ],
    community: [
      {
        id: 'hackathons',
        title: 'Hackathon Hub',
        icon: Timer,
        description: 'Build and compete',
        status: 'LIVE',
        statusColor: 'bg-orange-500',
        stats: '500+ events',
        details: 'Regular hackathons with industry partners and prize pools.',
        highlights: [
          'Team formation',
          'Judging criteria',
          'Sponsor challenges',
          'Career opportunities'
        ],
        difficulty: 'All Levels'
      },
      {
        id: 'code-collab',
        title: 'Live Collaboration',
        icon: GitBranch,
        description: 'Pair programming',
        status: 'BETA',
        statusColor: 'bg-cyan-500',
        stats: '1K+ sessions',
        details: 'Real-time collaborative coding environment with video and chat.',
        highlights: [
          'Shared workspaces',
          'Code review tools',
          'Interview practice',
          'Mentor matching'
        ],
        difficulty: 'All Levels'
      }
    ]
  };

  const testimonials = [
    {
      name: "Aarav Patel",
      role: "SWE at Microsoft",
      content: "Codexa's Arena helped me go from beginner to Google interview-ready in 4 months. The streak system kept me accountable every single day.",
      rating: 5,
      avatar: "AP",
      result: "3 FAANG offers"
    },
    {
      name: "Sophia Zhang",
      role: "CS Student at MIT",
      content: "The AI Mentor is revolutionary - it explains concepts better than most professors. I've doubled my problem-solving speed since joining.",
      rating: 5,
      avatar: "SZ",
      result: "ICPC Regional Finalist"
    },
    {
      name: "Kwame Ofori",
      role: "Bootcamp Graduate",
      content: "As a career changer, Codexa gave me the structured path I needed. Landed my first dev job after completing the Full Stack track.",
      rating: 5,
      avatar: "KO",
      result: "Hired in 3 months"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center bg-gradient-to-r from-orange-500/20 to-orange-500/10 border border-orange-500/30 rounded-full px-5 py-2 mb-6 backdrop-blur-sm">
            <Sparkles className="w-5 h-5 text-orange-300 mr-2" />
            <span className="text-sm font-medium text-orange-200">YOUR CODING JOURNEY STARTS HERE</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-orange-300 to-orange-500 bg-clip-text text-transparent">Master</span> 
            <span className="text-white">. </span>
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Build</span>
            <span className="text-white">. </span>
            <span className="bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">Dominate</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-10 leading-relaxed">
            The only platform that adapts to your coding journey - whether you're prepping for competitions, interviews, or building real-world projects.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="relative overflow-hidden group bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30">
              <span className="relative z-10 flex items-center gap-2">
                <Rocket className="w-5 h-5" />
                Start Free Challenge
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
            
            <button className="relative overflow-hidden group bg-gray-900 hover:bg-gray-800 border-2 border-gray-700 hover:border-orange-500 text-white font-medium py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3">
              <span className="relative z-10 flex items-center gap-2">
                <Play className="w-5 h-5" />
                Watch Demo
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-b from-gray-900/80 to-gray-950/80 backdrop-blur-sm border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { 
                value: animatedStats.users, 
                label: "Active Coders", 
                icon: Users,
                color: "from-orange-400 to-amber-500" 
              },
              { 
                value: animatedStats.problems, 
                label: "Problems Solved", 
                icon: Check,
                color: "from-emerald-400 to-teal-500" 
              },
              { 
                value: animatedStats.offers, 
                label: "Job Offers", 
                icon: BadgeCheck,
                color: "from-blue-400 to-cyan-500" 
              },
              { 
                value: animatedStats.streaks, 
                label: "Active Streaks", 
                icon: Flame,
                color: "from-red-400 to-orange-500" 
              }
            ].map((stat, i) => (
              <div key={i} className="relative p-6 bg-gray-900/50 border border-gray-800 rounded-2xl hover:border-orange-500/50 transition-all duration-300">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10 rounded-2xl`}></div>
                <div className="relative z-10">
                  <div className={`w-14 h-14 mb-4 mx-auto flex items-center justify-center rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700`}>
                    <stat.icon className={`w-6 h-6 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
                  </div>
                  <div className={`text-3xl font-extrabold mb-1 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value.toLocaleString()}+
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Organized by Developer Journey */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">Choose Your Path</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              We've organized everything based on where you are in your coding journey
            </p>
          </div>

          {/* Journey Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              { id: 'competitive', label: 'Competitive Coding', icon: Trophy },
              { id: 'learning', label: 'Skill Building', icon: BookOpen },
              { id: 'professional', label: 'Career Prep', icon: UserCheck },
              { id: 'community', label: 'Community', icon: Users }
            ].map((journey) => (
              <button
                key={journey.id}
                onClick={() => setActiveJourney(journey.id)}
                className={`flex items-center px-6 py-3 rounded-xl transition-all duration-300 border ${
                  activeJourney === journey.id 
                    ? 'bg-gradient-to-br from-orange-500/20 to-orange-500/10 border-orange-500/30 text-orange-300 shadow-lg shadow-orange-500/10' 
                    : 'border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
                }`}
              >
                <journey.icon className="w-5 h-5 mr-2" />
                {journey.label}
              </button>
            ))}
          </div>

          {/* Feature Grid */}
          <div className="grid gap-8 md:grid-cols-2">
            {journeyFeatures[activeJourney].map((feature) => (
              <div 
                key={feature.id}
                className={`relative overflow-hidden bg-gradient-to-b from-gray-900/50 to-gray-950/50 border rounded-2xl p-8 transition-all duration-500 ${
                  activeFeature === feature.id 
                    ? 'border-orange-500/70 shadow-lg shadow-orange-500/10' 
                    : 'border-gray-800 hover:border-orange-500/50'
                }`}
                onClick={() => setActiveFeature(activeFeature === feature.id ? null : feature.id)}
              >
                <div className="relative z-10">
                  <div className="flex items-start gap-5">
                    <div className={`flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-xl ${
                      activeFeature === feature.id 
                        ? 'bg-gradient-to-br from-orange-500 to-red-500' 
                        : 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700'
                    }`}>
                      <feature.icon className={`w-6 h-6 ${
                        activeFeature === feature.id ? 'text-white' : 'text-orange-400'
                      }`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-2xl font-bold">{feature.title}</h3>
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${feature.statusColor}`}>
                          {feature.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-400 mb-4">{feature.description}</p>
                      
                      <div className="flex flex-wrap gap-3 text-sm mb-4">
                        <span className="flex items-center gap-2 px-3 py-1 bg-gray-800/50 rounded-full">
                          <Target className="w-4 h-4 text-orange-400" />
                          {feature.difficulty}
                        </span>
                        <span className="flex items-center gap-2 px-3 py-1 bg-gray-800/50 rounded-full">
                          <Users className="w-4 h-4 text-blue-400" />
                          {feature.stats}
                        </span>
                      </div>
                      
                      {activeFeature === feature.id && (
                        <div className="mt-6 pt-6 border-t border-gray-800 space-y-5">
                          <p className="text-gray-300">{feature.details}</p>
                          
                          <div className="space-y-3">
                            {feature.highlights.map((highlight, i) => (
                              <div key={i} className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-0.5">
                                  <div className="w-5 h-5 rounded-full bg-orange-500/10 flex items-center justify-center">
                                    <Check className="w-3 h-3 text-orange-400" />
                                  </div>
                                </div>
                                <span className="text-gray-300">{highlight}</span>
                              </div>
                            ))}
                          </div>
                          
                          <button className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2">
                            <Zap className="w-5 h-5" />
                            {feature.status === 'COMING SOON' ? 'Join Waitlist' : 'Try Now'}
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <ChevronDown className={`w-6 h-6 text-gray-500 transition-transform duration-300 flex-shrink-0 ${
                      activeFeature === feature.id ? 'rotate-180 text-orange-400' : ''
                    }`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Features Carousel */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-8 text-center">More Powerful Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Flame, name: 'Daily Streaks', stat: '18K+ active' },
                { icon: Bot, name: 'AI Assistant', stat: 'Unlimited help' },
                { icon: FileCode, name: 'Code Sheets', stat: '5K+ created' },
                { icon: Puzzle, name: 'Challenges', stat: '1K+ daily' }
              ].map((item, i) => (
                <div key={i} className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-orange-500/50 transition-colors">
                  <div className="w-10 h-10 mb-3 flex items-center justify-center rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700">
                    <item.icon className="w-5 h-5 text-orange-400" />
                  </div>
                  <h4 className="font-medium mb-1">{item.name}</h4>
                  <p className="text-sm text-gray-400">{item.stat}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-b from-gray-900/80 to-gray-950/80 border-y border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-20">
            <span className="bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">Transformations</span> Not Just Testimonials
          </h2>
          
          <div className="relative">
            {testimonials.map((testimonial, i) => (
              <div 
                key={i}
                className={`transition-opacity duration-500 ${
                  currentTestimonial === i ? 'opacity-100' : 'opacity-0 absolute top-0 left-0 w-full'
                }`}
              >
                <div className="bg-gray-900/70 border border-gray-800 rounded-3xl p-8 md:p-10 backdrop-blur-sm">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-shrink-0">
                      <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-3xl font-bold text-white">
                        {testimonial.avatar}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-6 h-6 text-amber-400 fill-current" />
                        ))}
                      </div>
                      <blockquote className="text-xl md:text-2xl italic text-gray-300 mb-6">
                        "{testimonial.content}"
                      </blockquote>
                      <div>
                        <div className="font-bold text-lg">{testimonial.name}</div>
                        <div className="text-orange-400">{testimonial.role}</div>
                        <div className="mt-2 text-sm bg-gray-800 text-emerald-400 px-3 py-1 rounded-full inline-block">
                          {testimonial.result}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex justify-center mt-8 gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentTestimonial === i ? 'bg-orange-500 w-6' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-gradient-to-br from-gray-950 to-gray-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center bg-gradient-to-r from-orange-500/20 to-orange-500/10 border border-orange-500/30 rounded-full px-5 py-2 mb-6 backdrop-blur-sm">
            <Lightbulb className="w-5 h-5 text-orange-300 mr-2" />
            <span className="text-sm font-medium text-orange-200">READY TO LEVEL UP?</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Start <span className="bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">Your Journey</span> Today
          </h2>
          
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Join thousands of developers who've transformed their skills and careers with Codexa
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="relative overflow-hidden group bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 px-10 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30">
              <span className="relative z-10 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Get Started Free
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
            
            <button className="relative overflow-hidden group bg-gray-900 hover:bg-gray-800 border-2 border-gray-700 hover:border-orange-500 text-white font-medium py-4 px-10 rounded-xl transition-all duration-300 flex items-center justify-center gap-3">
              <span className="relative z-10 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Join Community
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Explore;