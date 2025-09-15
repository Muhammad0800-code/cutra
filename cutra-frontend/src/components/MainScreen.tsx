import { useEffect, useState } from 'react'
import { Sparkles, User, Users, Scissors, Palette, Zap, Heart, Star, Crown } from 'lucide-react'

const MainScreen = () => {
  const [showAnimation, setShowAnimation] = useState(false)
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number, size: number, color: string}>>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setShowAnimation(true), 500)
    
    const newParticles = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      size: Math.random() * 3 + 1,
      color: ['blue', 'purple', 'pink', 'cyan', 'yellow'][Math.floor(Math.random() * 5)]
    }))
    setParticles(newParticles)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const FloatingParticle = ({ particle }: { particle: any }) => (
    <div
      key={particle.id}
      className={`absolute rounded-full opacity-70 animate-magical-float animate-sparkle`}
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        width: `${particle.size}px`,
        height: `${particle.size}px`,
        backgroundColor: particle.color === 'blue' ? '#60a5fa' : 
                        particle.color === 'purple' ? '#a855f7' :
                        particle.color === 'pink' ? '#ec4899' :
                        particle.color === 'cyan' ? '#06b6d4' : '#eab308',
        animationDelay: `${particle.delay}s`,
        animationDuration: `${4 + Math.random() * 2}s`
      }}
    />
  )

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/30 to-pink-900/20"></div>
      
      {/* Dynamic Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-2xl animate-pulse delay-1500"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none z-5">
        {particles.map(particle => (
          <FloatingParticle key={particle.id} particle={particle} />
        ))}
      </div>

      {/* Mouse Follow Effect */}
      <div 
        className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl pointer-events-none transition-all duration-300 ease-out z-5"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />
      
      <div className="relative z-10 min-h-screen flex items-center justify-between px-8">
        {/* Female Character Card - Enhanced */}
        <div className="flex-1 flex justify-center">
          <div 
            className="text-center group cursor-pointer"
            onMouseEnter={() => setHoveredCard('female')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className={`w-56 h-80 bg-gradient-to-b from-pink-400/30 to-purple-600/30 rounded-3xl flex flex-col items-center justify-center backdrop-blur-lg border border-white/20 shadow-2xl transition-all duration-500 hover-lift hover-glow ${hoveredCard === 'female' ? 'transform scale-110 shadow-pink-500/50' : ''}`}>
              <div className="relative">
                <User className="w-32 h-32 text-pink-400 mb-4 transition-all duration-300 group-hover:text-pink-300 animate-breathe" />
                <div className="absolute -top-2 -right-2">
                  <Crown className="w-8 h-8 text-yellow-400 animate-bounce" />
                </div>
              </div>
              <div className="flex space-x-2 mb-4">
                <Scissors className="w-6 h-6 text-pink-300 animate-pulse" />
                <Palette className="w-6 h-6 text-purple-300 animate-pulse delay-300" />
                <Heart className="w-6 h-6 text-pink-400 animate-pulse delay-600" />
              </div>
              <div className="text-center">
                <h3 className="text-white font-bold text-xl mb-2 neon-glow">Женский стиль</h3>
                <p className="text-pink-200/80 text-sm">Элегантность и красота</p>
              </div>
            </div>
            {hoveredCard === 'female' && (
              <div className="mt-4 p-4 glass rounded-2xl border border-pink-500/20 animate-fade-in">
                <p className="text-pink-200 text-sm">✨ Откройте мир женственности</p>
              </div>
            )}
          </div>
        </div>

        {/* Center Logo - Ultra Enhanced */}
        <div className="flex-1 flex justify-center">
          <div className="text-center relative">
            <div className={`transition-all duration-3000 ${showAnimation ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-75'}`}>
              {/* Rotating Ring Effect */}
              <div className="absolute inset-0 w-full h-full">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-2 border-purple-500 rounded-full animate-spin opacity-20" style={{ animationDuration: '20s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-blue-500 rounded-full animate-spin opacity-10" style={{ animationDuration: '30s', animationDirection: 'reverse' }}></div>
              </div>
              
              <div className="mb-6 relative z-10 flex flex-col items-center">
                <dotlottie-wc 
                  src="https://lottie.host/124b1bd1-e055-4520-8a09-be2b15989966/6PfZqrSKdc.lottie" 
                  style={{ width: '250px', height: '250px' }}
                  speed="0.5" 
                  autoplay 
                  loop
                />
                <h1 
                  className="text-8xl font-bold mt-4 hover:scale-110 transition-transform duration-300"
                  style={{ 
                    fontFamily: 'Pacifico, cursive',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #ffc0cb 75%, #667eea 100%)',
                    backgroundSize: '400% 400%',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    animation: 'gradient-shift 5s ease infinite',
                    textShadow: '0 0 80px rgba(102, 126, 234, 0.8)'
                  }}
                >
                  cutra
                </h1>
              </div>
              
              {/* Enhanced Sparkles */}
              <div className="flex justify-center space-x-4 mb-6">
                <Sparkles className="w-10 h-10 text-blue-400 animate-spin" />
                <Star className="w-8 h-8 text-purple-400 animate-twinkle" />
                <Zap className="w-10 h-10 text-pink-400 animate-bounce" />
                <Star className="w-6 h-6 text-cyan-400 animate-twinkle delay-500" />
                <Sparkles className="w-10 h-10 text-pink-400 animate-spin" style={{ animationDirection: 'reverse' }} />
              </div>
              
              <p className="text-white/90 text-2xl font-medium mb-4 animate-fade-in">
                Искусственный интеллект для вашего стиля
              </p>
              
              <div className="flex justify-center space-x-6 text-white/70">
                <div className="flex items-center space-x-2 hover-lift">
                  <Scissors className="w-5 h-5 text-blue-400 animate-float" />
                  <span>Стрижки</span>
                </div>
                <div className="flex items-center space-x-2 hover-lift">
                  <Palette className="w-5 h-5 text-purple-400 animate-float delay-300" />
                  <span>Окрашивание</span>
                </div>
                <div className="flex items-center space-x-2 hover-lift">
                  <Zap className="w-5 h-5 text-pink-400 animate-float delay-600" />
                  <span>Укладки</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Male Character Card - Enhanced */}
        <div className="flex-1 flex justify-center">
          <div 
            className="text-center group cursor-pointer"
            onMouseEnter={() => setHoveredCard('male')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className={`w-56 h-80 bg-gradient-to-b from-blue-400/30 to-indigo-600/30 rounded-3xl flex flex-col items-center justify-center backdrop-blur-lg border border-white/20 shadow-2xl transition-all duration-500 hover-lift hover-glow ${hoveredCard === 'male' ? 'transform scale-110 shadow-blue-500/50' : ''}`}>
              <div className="relative">
                <Users className="w-32 h-32 text-blue-400 mb-4 transition-all duration-300 group-hover:text-blue-300 animate-breathe" />
                <div className="absolute -top-2 -right-2">
                  <Zap className="w-8 h-8 text-yellow-400 animate-bounce" />
                </div>
              </div>
              <div className="flex space-x-2 mb-4">
                <Scissors className="w-6 h-6 text-blue-300 animate-pulse" />
                <Palette className="w-6 h-6 text-indigo-300 animate-pulse delay-300" />
                <Star className="w-6 h-6 text-blue-400 animate-pulse delay-600" />
              </div>
              <div className="text-center">
                <h3 className="text-white font-bold text-xl mb-2 neon-glow">Мужской стиль</h3>
                <p className="text-blue-200/80 text-sm">Сила и харизма</p>
              </div>
            </div>
            {hoveredCard === 'male' && (
              <div className="mt-4 p-4 glass rounded-2xl border border-blue-500/20 animate-fade-in">
                <p className="text-blue-200 text-sm">⚡ Раскройте свой потенциал</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainScreen
