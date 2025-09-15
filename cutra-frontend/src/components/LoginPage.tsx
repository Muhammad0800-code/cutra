import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Lock, User, Sparkles, Crown, Zap, Heart, Star, Scissors, Palette, Wand2, Gem } from 'lucide-react'

interface LoginPageProps {
  onLoginSuccess: () => void
  deviceId: string
}

const LoginPage = ({ onLoginSuccess, deviceId }: LoginPageProps) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number, size: number, color: string}>>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [ripples, setRipples] = useState<Array<{id: number, x: number, y: number}>>([])

  useEffect(() => {
    const colors = ['from-blue-400', 'from-purple-400', 'from-pink-400', 'from-cyan-400', 'from-yellow-400', 'from-green-400']
    const newParticles = Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      size: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)]
    }))
    setParticles(newParticles)

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      
      if (Math.random() > 0.95) {
        const newRipple = { id: Date.now(), x: e.clientX, y: e.clientY }
        setRipples(prev => [...prev, newRipple])
        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== newRipple.id))
        }, 600)
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (username === 'muhammad-mehroj' && password === 'muhammad-mehroj.ai') {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/device/request-confirmation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            device_id: deviceId,
            frontend_session_token: 'frontend-session'
          }),
        })

        if (response.ok) {
          setTimeout(() => {
            onLoginSuccess()
          }, 1000)
        } else {
          setError('Ошибка подключения к серверу')
        }
      } catch (err) {
        setError('Ошибка подключения к серверу')
      }
    } else {
      setError('Неверные учетные данные')
    }
    
    setIsLoading(false)
  }

  const MagicalParticle = ({ particle }: { particle: any }) => (
    <div
      key={particle.id}
      className={`absolute bg-gradient-to-r ${particle.color} to-transparent rounded-full opacity-70 animate-magical-float`}
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        width: `${particle.size}px`,
        height: `${particle.size}px`,
        animationDelay: `${particle.delay}s`,
        animationDuration: `${4 + Math.random() * 2}s`
      }}
    />
  )

  const FloatingIcon = ({ Icon, delay, className, style }: { Icon: any, delay: number, className: string, style?: any }) => (
    <Icon 
      className={`absolute w-6 h-6 ${className} animate-float opacity-40 hover-glow`}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: '4s',
        ...style
      }}
    />
  )

  const RippleEffect = ({ ripple }: { ripple: any }) => (
    <div
      key={ripple.id}
      className="absolute border-2 border-white/20 rounded-full animate-ripple pointer-events-none"
      style={{
        left: ripple.x - 20,
        top: ripple.y - 20,
        width: 40,
        height: 40,
      }}
    />
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/30"></div>
      
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse animate-morph-shape"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse animate-breathe" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse animate-color-shift" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-10 right-20 w-32 h-32 bg-cyan-500/15 rounded-full blur-2xl animate-pulse animate-rotate-hue" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-yellow-500/15 rounded-full blur-2xl animate-pulse animate-breathe" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/3 left-1/6 w-24 h-24 bg-green-500/15 rounded-full blur-xl animate-pulse animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="absolute inset-0 pointer-events-none z-5">
        {particles.map(particle => (
          <MagicalParticle key={particle.id} particle={particle} />
        ))}
      </div>

      <div 
        className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl pointer-events-none transition-all duration-500 ease-out animate-rotate-hue"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      <div className="absolute inset-0 pointer-events-none z-5">
        {ripples.map(ripple => (
          <RippleEffect key={ripple.id} ripple={ripple} />
        ))}
      </div>

      <div className="absolute inset-0 z-5 pointer-events-none">
        <FloatingIcon Icon={Scissors} delay={0} className="top-20 left-20 text-blue-400 neon-glow" />
        <FloatingIcon Icon={Palette} delay={1} className="top-32 right-32 text-purple-400 neon-glow" />
        <FloatingIcon Icon={Crown} delay={2} className="bottom-40 left-40 text-yellow-400 neon-glow" />
        <FloatingIcon Icon={Heart} delay={3} className="bottom-20 right-20 text-pink-400 neon-glow" />
        <FloatingIcon Icon={Zap} delay={4} className="top-1/2 left-10 text-cyan-400 neon-glow" />
        <FloatingIcon Icon={Star} delay={5} className="top-1/3 right-10 text-white neon-glow" />
        <FloatingIcon Icon={Wand2} delay={6} className="top-3/4 left-1/4 text-purple-300 neon-glow" />
        <FloatingIcon Icon={Gem} delay={7} className="top-1/6 right-1/3 text-pink-300 neon-glow" />
      </div>

      <Card className="w-full max-w-md mx-4 glass-ultra shadow-2xl relative z-10 hover-lift hover-glow transition-all duration-500 mirror-effect">
        <CardHeader className="text-center space-y-6">
          <div className="mx-auto flex flex-col items-center justify-center">
            <dotlottie-wc 
              src="https://lottie.host/124b1bd1-e055-4520-8a09-be2b15989966/6PfZqrSKdc.lottie" 
              style={{ width: '180px', height: '180px' }}
              speed="0.5" 
              autoplay 
              loop
            />
            <h1 
              className="text-6xl font-bold mt-4 animate-pulse"
              style={{ 
                fontFamily: 'Pacifico, cursive',
                background: 'linear-gradient(45deg, #FF006E, #FB5607, #FFBE0B, #8338EC, #3A86FF)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                animation: 'gradient-shift 3s ease infinite',
                textShadow: '0 0 40px rgba(255, 0, 110, 0.5)'
              }}
            >
              cutra
            </h1>
          </div>
          
          <CardDescription className="text-white/90 text-xl font-medium animate-fade-in">
            Добро пожаловать в будущее стиля
          </CardDescription>
          
          <div className="flex justify-center space-x-4">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse animate-breathe"></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse animate-breathe" style={{ animationDelay: '0.3s' }}></div>
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse animate-breathe" style={{ animationDelay: '0.6s' }}></div>
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse animate-breathe" style={{ animationDelay: '0.9s' }}></div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="relative group">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-6 h-6 group-focus-within:text-blue-400 transition-all duration-300 animate-pulse" />
                <Input
                  type="text"
                  placeholder="Имя пользователя"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-12 py-4 glass border-white/30 text-white placeholder-white/70 focus:border-blue-400 focus:ring-blue-400 focus:glass-strong transition-all duration-300 hover:glass-strong text-lg rounded-xl hover-glow"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-6 h-6 group-focus-within:text-purple-400 transition-all duration-300 animate-pulse" />
                <Input
                  type="password"
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 py-4 glass border-white/30 text-white placeholder-white/70 focus:border-purple-400 focus:ring-purple-400 focus:glass-strong transition-all duration-300 hover:glass-strong text-lg rounded-xl hover-glow"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-300 text-sm text-center glass p-4 rounded-xl border border-red-500/30 animate-shake neon-glow">
                <div className="flex items-center justify-center space-x-2">
                  <Zap className="w-4 h-4 text-red-400" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full holographic text-white font-bold py-5 rounded-xl transition-all duration-500 hover-lift hover-glow disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden text-lg shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              {isLoading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-white"></div>
                  <span className="text-xl">Магия входа...</span>
                  <Sparkles className="w-6 h-6 animate-sparkle" />
                </div>
              ) : (
                <span className="text-xl flex items-center justify-center space-x-3">
                  <Wand2 className="w-6 h-6 animate-float" />
                  <span>Войти в Cutra</span>
                  <Gem className="w-6 h-6 animate-sparkle" />
                </span>
              )}
            </Button>
          </form>

          <div className="text-center space-y-3">
            <div className="flex justify-center space-x-6 text-white/60 text-sm">
              <div className="flex items-center space-x-1">
                <Scissors className="w-4 h-4 text-blue-400" />
                <span>AI Стрижки</span>
              </div>
              <div className="flex items-center space-x-1">
                <Palette className="w-4 h-4 text-purple-400" />
                <span>Умное окрашивание</span>
              </div>
              <div className="flex items-center space-x-1">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span>Королевский стиль</span>
              </div>
            </div>
            <p className="text-white/50 text-xs">
              Искусственный интеллект • Персональный стиль • Магия красоты
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage
