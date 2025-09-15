import { useEffect, useState } from 'react'
import { Sparkles, Star, Heart, Crown, Zap, Scissors, Palette } from 'lucide-react'

interface WelcomeScreenProps {
  onComplete: () => void
}

const WelcomeScreen = ({ onComplete }: WelcomeScreenProps) => {
  const [showText, setShowText] = useState(false)
  const [showStars, setShowStars] = useState(false)
  const [showIcons, setShowIcons] = useState(false)
  const [textIndex, setTextIndex] = useState(0)
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number, size: number}>>([])

  const welcomeTexts = [
    "Добро пожаловать в cutra",
    "Искусственный интеллект",
    "для вашего стиля",
    "Начинаем магию..."
  ]

  useEffect(() => {
    const newParticles = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      size: Math.random() * 4 + 2
    }))
    setParticles(newParticles)

    const timer1 = setTimeout(() => setShowText(true), 500)
    const timer2 = setTimeout(() => setShowStars(true), 1000)
    const timer3 = setTimeout(() => setShowIcons(true), 1500)
    
    const textTimer = setInterval(() => {
      setTextIndex(prev => (prev + 1) % welcomeTexts.length)
    }, 800)

    const timer4 = setTimeout(() => {
      clearInterval(textTimer)
      onComplete()
    }, 6000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
      clearInterval(textTimer)
    }
  }, [onComplete])

  const MagicalParticle = ({ particle }: { particle: any }) => (
    <div
      key={particle.id}
      className="absolute bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full opacity-70"
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        width: `${particle.size}px`,
        height: `${particle.size}px`,
        animationDelay: `${particle.delay}s`,
        animation: `magicalFloat 4s ease-in-out infinite ${particle.delay}s, sparkle 2s ease-in-out infinite ${particle.delay}s`
      }}
    />
  )

  const FloatingIcon = ({ Icon, delay, className }: { Icon: any, delay: number, className: string }) => (
    <Icon 
      className={`absolute w-8 h-8 ${className} animate-bounce opacity-80`}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: '2s'
      }}
    />
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Enhanced Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/30 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-10 right-20 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-yellow-500/20 rounded-full blur-2xl animate-pulse delay-1500"></div>
      </div>

      {/* Magical Particles */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {particles.map(particle => (
          <MagicalParticle key={particle.id} particle={particle} />
        ))}
      </div>

      {/* Floating Stars */}
      {showStars && (
        <div className="absolute inset-0 z-15">
          {[...Array(30)].map((_, i) => (
            <Star
              key={i}
              className="absolute text-white/70 animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                fontSize: `${Math.random() * 15 + 8}px`,
                animation: `twinkle 2s ease-in-out infinite ${Math.random() * 2}s, float 6s ease-in-out infinite ${Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Floating Icons */}
      {showIcons && (
        <div className="absolute inset-0 z-15 pointer-events-none">
          <FloatingIcon Icon={Scissors} delay={0} className="top-20 left-20 text-blue-400" />
          <FloatingIcon Icon={Palette} delay={0.5} className="top-32 right-32 text-purple-400" />
          <FloatingIcon Icon={Crown} delay={1} className="bottom-40 left-40 text-yellow-400" />
          <FloatingIcon Icon={Heart} delay={1.5} className="bottom-20 right-20 text-pink-400" />
          <FloatingIcon Icon={Zap} delay={2} className="top-1/2 left-10 text-cyan-400" />
          <FloatingIcon Icon={Sparkles} delay={2.5} className="top-1/3 right-10 text-white" />
        </div>
      )}

      <div className={`${showText ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
        <div className="text-center space-y-8">
          <div className="mx-auto w-40 h-40 rounded-full flex items-center justify-center relative animate-pulse">
            <img 
              src="/images/cutra-logo.png" 
              alt="Cutra Logo" 
              className="w-full h-full object-cover rounded-full shadow-2xl"
            />
          </div>
          <Sparkles className="w-24 h-24 text-white mx-auto animate-spin relative z-10" style={{ animationDuration: '2s' }} />
        </div>
        
        {/* Dynamic Text Animation */}
        <div className={`transition-all duration-1000 ${showText ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
          <h1 
            className="text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-6 animate-pulse"
            style={{ 
              fontFamily: 'Pacifico, cursive',
              textShadow: '0 0 30px rgba(147, 51, 234, 0.8)',
              backgroundSize: '200% 200%',
              animation: 'gradient 3s ease infinite, textGlow 2s ease-in-out infinite'
            }}
          >
            {welcomeTexts[textIndex]}
          </h1>
          
          <div className="flex justify-center space-x-4 mb-6">
            <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="w-4 h-4 bg-purple-400 rounded-full animate-pulse delay-300"></div>
            <div className="w-4 h-4 bg-pink-400 rounded-full animate-pulse delay-600"></div>
          </div>
          
          <p className="text-white/90 text-2xl font-medium animate-fade-in">
            Магия стиля ждет вас...
          </p>
        </div>

        {/* Enhanced Loading Animation */}
        <div className="mt-16">
          <div className="flex justify-center space-x-3 mb-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              ></div>
            ))}
          </div>
          <p className="text-white/60 text-lg">Подготавливаем ваш персональный стиль...</p>
        </div>
      </div>

    </div>
  )
}

export default WelcomeScreen
