import React, { useEffect , useState } from 'react'
import { Route, Routes , Navigate } from 'react-router'
import Homepage from './pages/Homepage'
import Login from './components/common/Login'
import Signup from './components/common/Signup'
import { useDispatch , useSelector } from 'react-redux'
import { checkAuth } from './slice/authSlice'
import Problem from './pages/Problem'
import Navbar from './components/common/Navbar'
import CodeEditor from './components/common/CodeEditor'
import AdminDashboard from './components/Dashboards/AdminDashboard'
import AnimatedBackground from './components/background/AnimatedBackground'


const App = ({children, className = ""}) => {

  // authenticated when the user opens website then first authentication doing
  const {isAuthenticated , loading , user} = useSelector((state) => state.auth)
  const dispatch = useDispatch();
    const [stars, setStars] = useState([]);
    const [particles, setParticles] = useState([]);
  
    useEffect(() => {
      // Generate random stars
      const generateStars = () => {
        const newStars = [];
        for (let i = 0; i < 50; i++) {
          newStars.push({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.8 + 0.2,
            animationDelay: Math.random() * 4,
            animationDuration: Math.random() * 3 + 2,
          });
        }
        setStars(newStars);
      };
  
      // Generate floating particles
      const generateParticles = () => {
        const newParticles = [];
        for (let i = 0; i < 20; i++) {
          newParticles.push({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 6 + 2,
            color: i % 3 === 0 ? '#f59e0b' : i % 3 === 1 ? '#ef4444' : '#8b5cf6',
            animationDelay: Math.random() * 5,
            animationDuration: Math.random() * 8 + 6,
            direction: Math.random() > 0.5 ? 1 : -1,
          });
        }
        setParticles(newParticles);
      };
  
      generateStars();
      generateParticles();
    }, []);
  


  useEffect(() =>{
   dispatch(checkAuth());
  },[dispatch])


  
   if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }


  return (
 <div className={`relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden ${className}`}>
      
      {/* Animated Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDelay: `${star.animationDelay}s`,
            animationDuration: `${star.animationDuration}s`,
          }}
        />
      ))}

      {/* Floating Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-bounce"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: 0.6,
            animationDelay: `${particle.animationDelay}s`,
            animationDuration: `${particle.animationDuration}s`,
            filter: 'blur(1px)',
          }}
        />
      ))}

      {/* Moving Orbs */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Floating Animation Keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(120deg); }
          66% { transform: translateY(10px) rotate(240deg); }
        }
        
        @keyframes drift {
          0% { transform: translateX(0px) translateY(0px); }
          25% { transform: translateX(50px) translateY(-30px); }
          50% { transform: translateX(-30px) translateY(-60px); }
          75% { transform: translateX(-60px) translateY(-20px); }
          100% { transform: translateX(0px) translateY(0px); }
        }

        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
        
        .drift-animation {
          animation: drift 12s ease-in-out infinite;
        }
      `}</style>

      {/* Additional Floating Elements */}
      <div className="absolute top-10 right-10 w-2 h-2 bg-orange-400 rounded-full float-animation opacity-60"></div>
      <div className="absolute top-1/3 left-10 w-1.5 h-1.5 bg-red-400 rounded-full float-animation opacity-50" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 right-1/3 w-2.5 h-2.5 bg-purple-400 rounded-full float-animation opacity-70" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-2/3 right-20 w-1 h-1 bg-yellow-400 rounded-full float-animation opacity-80" style={{ animationDelay: '3s' }}></div>
      <div className="absolute bottom-1/3 left-20 w-3 h-3 bg-pink-400 rounded-full drift-animation opacity-40"></div>
      <div className="absolute top-1/2 left-2/3 w-1.5 h-1.5 bg-cyan-400 rounded-full drift-animation opacity-60" style={{ animationDelay: '4s' }}></div>

      {/* Gradient Overlay for Depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

   

{/* //routes  */}
       <div>
      <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={ <Signup/>} />
        <Route path='/problems' element={isAuthenticated ? <Problem></Problem> : <Navigate to="/signup"></Navigate>} />
        <Route path='/codeEditor' element={isAuthenticated ? <CodeEditor/> : <Navigate to="/login"></Navigate>} />
        {/* <Route
        path='/admin'
        element={isAuthenticated && user?.role==="admin" ? <AdminDashboard/> : <Navigate to="/login"></Navigate>}
        ></Route> */}
      </Routes>
    </div> 
    </div>
  )
}

export default App


