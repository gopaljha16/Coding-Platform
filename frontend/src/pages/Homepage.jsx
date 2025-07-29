import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Code,
  Trophy,
  Users,
  Brain,
  Zap,
  ArrowRight,
  CheckCircle,
  Star,
  Sparkles,
  Rocket,
  BookOpen,
  Terminal,
  GitBranch,
  Timer,
  UserCheck,
  Flame,
  Laptop,
  Swords,
  BrainCircuit,
  Calendar,
  Clock,
  Crown,
  Play,
  TrendingUp,
  Award,
  Globe,
  Shield,
  Lightbulb,
  Target,
  Coffee,
  Code2,
  Database,
  Server,
  Monitor,
  Smartphone,
  Palette,
  Headphones,
  MessageCircle,
  Heart,
  Eye,
  ThumbsUp,
  Share2,
  Download,
  BookMarked,
  Cpu,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  TrendingDown,
  Volume2,
  VolumeX,
  Settings,
  Filter,
  Search,
  Bell,
  Gift,
  Gamepad2,
  Medal,
  Layers,
  Zap as Lightning,
  Briefcase,
  GraduationCap,
  Building,
  MapPin,
  Mail,
  Phone,
  Twitter,
  Github,
  Linkedin,
  Facebook,
  Instagram,
  Youtube
} from 'lucide-react'
import Navbar from '../components/common/Navbar'

// Mock data for demonstration
const mockUser = {
  isAuthenticated: true,
  name: "Alex Chen",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
  level: "Expert",
  streak: 15,
  points: 2340
}

const Homepage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeFeature, setActiveFeature] = useState('arena')
  const [isVisible, setIsVisible] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [animatedStats, setAnimatedStats] = useState({
    users: 0,
    problems: 0,
    contests: 0,
    companies: 0
  })
  
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const statsRef = useRef(null)
  const ctaRef = useRef(null)
  
  // Entry animation
  useEffect(() => {
    setIsVisible(true)
    
    // Animate stats when component loads
    const animateStats = () => {
      const duration = 2000
      const targetValues = { users: 50000, problems: 250000, contests: 750, companies: 200 }
      
      const startTime = Date.now()
      
      const animate = () => {
        const now = Date.now()
        const progress = Math.min(1, (now - startTime) / duration)
        
        setAnimatedStats({
          users: Math.floor(progress * targetValues.users),
          problems: Math.floor(progress * targetValues.problems),
          contests: Math.floor(progress * targetValues.contests),
          companies: Math.floor(progress * targetValues.companies)
        })
        
        if (progress < 1) requestAnimationFrame(animate)
      }
      
      animate()
    }
    
    // Start stats animation after a delay
    const timer = setTimeout(animateStats, 1000)
    
    // Testimonial rotation
    const testimonialTimer = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length)
    }, 5000)
    
    return () => {
      clearTimeout(timer)
      clearInterval(testimonialTimer)
    }
  }, [])
  
  // Features data with enhanced descriptions
  const features = {
    arena: {
      title: 'Code Arena',
      icon: Swords,
      description: 'Real-time coding battles',
      details: 'Compete in algorithm duels with live leaderboards, instant feedback, and ELO-based matchmaking system that pairs you with coders at your skill level.',
      color: 'from-red-500 to-orange-500',
      stats: '10K+ battles daily',
      badge: 'LIVE'
    },
    mentor: {
      title: 'AI Mentor Pro',
      icon: BrainCircuit,
      description: 'Personalized guidance',
      details: 'Get 1:1 mentorship from our advanced AI that learns your coding patterns, identifies weaknesses, and provides tailored improvement roadmaps.',
      color: 'from-purple-500 to-indigo-500',
      stats: '95% success rate',
      badge: 'NEW'
    },
    interview: {
      title: 'Interview Mastery',
      icon: UserCheck,
      description: 'FAANG-level preparation',
      details: 'Comprehensive interview preparation with company-specific question banks, mock interviews, behavioral prep, and real-time feedback from industry experts.',
      color: 'from-blue-500 to-cyan-500',
      stats: '85% hire rate',
      badge: 'HOT'
    },
    contest: {
      title: 'Global Contests',
      icon: Trophy,
      description: 'Compete worldwide',
      details: 'Join weekly coding competitions with global rankings, cash prizes up to $10,000, detailed performance analytics, and career opportunities.',
      color: 'from-amber-500 to-yellow-500',
      stats: '$50K+ in prizes',
      badge: 'PRIZE'
    }
  }
  
  // Testimonials data
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer at Google",
      content: "Codexa helped me land my dream job at Google. The interview prep was incredible!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=60&h=60&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Marcus Johnson",
      role: "Senior Developer at Microsoft",
      content: "The AI mentor feature is game-changing. It's like having a personal coding coach 24/7.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Elena Rodriguez",
      role: "Tech Lead at Meta",
      content: "I've won 3 contests here and improved my algorithmic thinking tremendously.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face",
      rating: 5
    }
  ]
  
  // Upcoming contest data
  const upcomingContest = {
    title: 'CodeJam Weekly #47',
    startTime: new Date(Date.now() + 86400000 * 2), // 2 days from now
    duration: '2.5 hours',
    participants: 1247,
    difficulty: 'Mixed',
    prize: '$2,500',
    problems: 6
  }
  
  // Recent achievements data
  const recentAchievements = [
    { user: "Alex K.", achievement: "Solved 100 problems", time: "2 hours ago", icon: Target },
    { user: "Maria S.", achievement: "Won Weekly Contest", time: "5 hours ago", icon: Trophy },
    { user: "John D.", achievement: "30-day streak", time: "1 day ago", icon: Flame },
    { user: "Lisa W.", achievement: "Algorithm Master", time: "2 days ago", icon: Crown }
  ]
  
  // Learning paths data
  const learningPaths = [
    {
      title: "Data Structures & Algorithms",
      description: "Master the fundamentals",
      progress: 75,
      duration: "8 weeks",
      level: "Beginner to Advanced",
      icon: Database,
      color: "from-blue-500 to-purple-500"
    },
    {
      title: "System Design",
      description: "Scale to millions of users",
      progress: 40,
      duration: "12 weeks",
      level: "Intermediate",
      icon: Server,
      color: "from-green-500 to-teal-500"
    },
    {
      title: "Dynamic Programming",
      description: "Solve complex optimization problems",
      progress: 90,
      duration: "6 weeks",
      level: "Advanced",
      icon: BrainCircuit,
      color: "from-purple-500 to-pink-500"
    }
  ]
  
  // Format date for contest
  const formatContestDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTimeUntil = (date) => {
    const now = new Date()
    const diff = date - now
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    return `${days}d ${hours}h`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Navbar */}
    <Navbar/>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className={`relative min-h-screen flex items-center justify-center px-4 py-20 pt-32 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Hero Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="inline-flex items-center space-x-2 bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-gray-300">Trusted by 50,000+ developers worldwide</span>
              <div className="flex -space-x-2">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 border-2 border-gray-800"></div>
                ))}
              </div>
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">
              Master Coding.
            </span>
            <br />
            <span className="text-white">
              Win Competitions.
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Join the ultimate platform for competitive programmers. Battle in real-time, 
            learn from AI mentors, and compete for prizes up to <span className="text-orange-400 font-bold">$10,000</span>.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button 
              onClick={() => setIsAuthenticated(true)}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-orange-500/30 transition-all duration-300 flex items-center gap-2 group"
            >
              {isAuthenticated ? 'Start Coding' : 'Join for Free'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            <button className="px-8 py-4 bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-sm border border-gray-700 text-white font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center gap-2">
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
          </motion.div>
          
          {/* Live Activity Feed */}
          <motion.div 
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-400" />
                  Live Activity
                </h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-400">Live</span>
                </div>
              </div>
              
              <div className="space-y-3">
                {recentAchievements.map((achievement, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.2 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                        <achievement.icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <span className="text-white font-medium">{achievement.user}</span>
                        <span className="text-gray-300 ml-2">{achievement.achievement}</span>
                      </div>
                    </div>
                    <span className="text-gray-400 text-sm">{achievement.time}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section 
        ref={featuresRef}
        className="py-20 px-4 relative"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
                Everything You Need to Excel
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                From beginner to expert, our comprehensive platform has all the tools you need to master coding and win competitions.
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {Object.entries(features).map(([key, feature], index) => (
              <motion.div 
                key={key}
                className={`relative group cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 ${activeFeature === key ? 'ring-2 ring-offset-4 ring-offset-gray-900 ring-orange-500 scale-105' : 'hover:scale-102'}`}
                onClick={() => setActiveFeature(key)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                
                {/* Glass card */}
                <div className="relative z-10 backdrop-blur-sm bg-gray-800/80 border border-gray-700/50 p-6 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${feature.color} shadow-lg`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <div className={`bg-gradient-to-r ${feature.color} text-white text-xs font-bold px-2 py-1 rounded-full`}>
                        {feature.badge}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-orange-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-3">
                    {feature.description}
                  </p>
                  
                  <div className="text-sm text-orange-400 font-medium mb-4">
                    {feature.stats}
                  </div>
                  
                  <AnimatePresence>
                    {activeFeature === key && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-gray-300 mb-4 text-sm">
                          {feature.details}
                        </p>
                        
                        <button className="inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors duration-300 group/link text-sm font-medium">
                          Explore {feature.title}
                          <ArrowRight className="ml-2 w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Learning Paths Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-2xl font-bold mb-8 text-center text-white">Structured Learning Paths</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {learningPaths.map((path, index) => (
                <div key={index} className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${path.color} flex items-center justify-center`}>
                      <path.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{path.title}</h4>
                      <p className="text-sm text-gray-400">{path.description}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-orange-400 font-medium">{path.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`bg-gradient-to-r ${path.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${path.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-400 mb-4">
                    <span>{path.duration}</span>
                    <span>{path.level}</span>
                  </div>
                  
                  <button className="w-full py-2 bg-gray-700/50 hover:bg-gray-700 text-white rounded-lg transition-colors duration-300">
                    Continue Learning
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Contest Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
              Upcoming Contest
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Compete against the world's best programmers and win amazing prizes.
            </p>
          </motion.div>
          
          <motion.div 
            className="relative max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-2xl blur-xl"></div>
            
            {/* Contest card */}
            <div className="relative backdrop-blur-md bg-gray-800/80 border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-500"></div>
              
              <div className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-2xl font-bold text-white">{upcomingContest.title}</h3>
                      <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                        LIVE IN {formatTimeUntil(upcomingContest.startTime)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-gray-900/50 rounded-lg p-3 text-center">
                        <Gift className="w-5 h-5 mx-auto mb-1 text-orange-400" />
                        <div className="text-sm text-gray-400">Prize Pool</div>
                        <div className="text-white font-medium">{upcomingContest.prize}</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <Code className="w-4 h-4 text-orange-400" />
                        <span>{upcomingContest.problems} Problems</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-orange-400" />
                        <span>{upcomingContest.difficulty} Difficulty</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-orange-400" />
                        <span>Global Leaderboard</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-orange-500/30 transition-all duration-300 flex items-center gap-2 group whitespace-nowrap">
                      <Trophy className="w-5 h-5" />
                      Register Now
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                    
                    <button className="px-6 py-3 bg-gray-700/80 hover:bg-gray-600/80 backdrop-blur-sm border border-gray-600 text-white font-medium rounded-xl transition-all duration-300 flex items-center gap-2 justify-center">
                      <Bell className="w-4 h-4" />
                      Set Reminder
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section 
        ref={statsRef}
        className="py-20 px-4 relative overflow-hidden"
      >
        {/* Background elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
              Join Our Global Community
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Be part of the world's largest competitive programming community.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { 
                value: animatedStats.users, 
                label: 'Active Coders', 
                suffix: '+', 
                icon: Users,
                color: 'from-blue-500 to-cyan-500'
              },
              { 
                value: animatedStats.problems, 
                label: 'Problems Solved', 
                suffix: '+', 
                icon: CheckCircle,
                color: 'from-green-500 to-emerald-500'
              },
              { 
                value: animatedStats.contests, 
                label: 'Contests Hosted', 
                suffix: '+', 
                icon: Trophy,
                color: 'from-yellow-500 to-orange-500'
              },
              { 
                value: animatedStats.companies, 
                label: 'Hiring Partners', 
                suffix: '+', 
                icon: Building,
                color: 'from-purple-500 to-pink-500'
              }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="backdrop-blur-sm bg-gray-800/60 border border-gray-700/50 rounded-2xl p-6 text-center group hover:scale-105 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400 mb-2">
                  {stat.value.toLocaleString()}{stat.suffix}
                </div>
                <div className="text-gray-300 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Testimonials Section */}
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-8 text-center text-white">What Our Community Says</h3>
            
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={testimonials[currentTestimonial].avatar} 
                      alt={testimonials[currentTestimonial].name}
                      className="w-16 h-16 rounded-full border-2 border-orange-500"
                    />
                    <div>
                      <h4 className="font-bold text-white">{testimonials[currentTestimonial].name}</h4>
                      <p className="text-orange-400">{testimonials[currentTestimonial].role}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <blockquote className="text-lg text-gray-300 italic">
                    "{testimonials[currentTestimonial].content}"
                  </blockquote>
                </motion.div>
              </AnimatePresence>
              
              {/* Testimonial indicators */}
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial 
                        ? 'bg-orange-500 scale-110' 
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        ref={ctaRef}
        className="py-20 px-4"
      >
        <div className="max-w-5xl mx-auto relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 to-amber-500/30 rounded-2xl blur-xl"></div>
          
          {/* CTA card */}
          <motion.div 
            className="relative backdrop-blur-md bg-gray-800/80 border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl p-8 md:p-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Ready to Level Up Your Coding Skills?
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Join over 50,000 developers who are mastering algorithms, acing interviews, 
                and winning competitions on Codexa. Start your journey today!
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <button 
                  onClick={() => setIsAuthenticated(true)}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-orange-500/30 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <Rocket className="w-5 h-5" />
                  {isAuthenticated ? 'Continue Journey' : 'Start Free Today'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                
                <button className="w-full sm:w-auto px-8 py-4 bg-gray-700/80 hover:bg-gray-600/80 backdrop-blur-sm border border-gray-600 text-white font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  Upgrade to Premium
                </button>
              </div>
              
              {/* Feature highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center justify-center gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Free forever plan</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Join in 30 seconds</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-16 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Codexa</span>
              </div>
              <p className="text-gray-400 mb-6">
                The ultimate platform for competitive programmers. Master algorithms, 
                ace interviews, and win competitions.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: Twitter, href: "#" },
                  { icon: Github, href: "#" },
                  { icon: Linkedin, href: "#" },
                  { icon: Youtube, href: "#" }
                ].map((social, index) => (
                  <a 
                    key={index}
                    href={social.href} 
                    className="w-10 h-10 bg-gray-800 hover:bg-orange-500 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4">Platform</h3>
              <ul className="space-y-3">
                {['Problems', 'Contests', 'Interview Prep', 'Learning Paths', 'Leaderboards'].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-300 flex items-center gap-2">
                      <ArrowRight className="w-3 h-3" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4">Resources</h3>
              <ul className="space-y-3">
                {['Documentation', 'API Reference', 'Tutorials', 'Blog', 'Community'].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-300 flex items-center gap-2">
                      <ArrowRight className="w-3 h-3" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4">Company</h3>
              <ul className="space-y-3">
                {['About Us', 'Careers', 'Contact', 'Privacy Policy', 'Terms of Service'].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-300 flex items-center gap-2">
                      <ArrowRight className="w-3 h-3" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="pt-8 mt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Codexa. All rights reserved. Built with ❤️ for developers worldwide.
            </p>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Globe className="w-4 h-4 text-blue-400" />
                <span>Global Community</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Homepage