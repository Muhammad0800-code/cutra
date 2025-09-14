import { useState, useEffect } from 'react'
import { Maximize, Minimize } from 'lucide-react'
import LoginPage from './components/LoginPage'
import WelcomeScreen from './components/WelcomeScreen'
import MainScreen from './components/MainScreen'
import './App.css'

type AppState = 'login' | 'waiting-confirmation' | 'welcome' | 'main'

function App() {
  const [appState, setAppState] = useState<AppState>('login')
  const [deviceId, setDeviceId] = useState<string>('')
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const storedDeviceId = localStorage.getItem('cutra-device-id')
    if (storedDeviceId) {
      setDeviceId(storedDeviceId)
    } else {
      const newDeviceId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      setDeviceId(newDeviceId)
      localStorage.setItem('cutra-device-id', newDeviceId)
    }

    // Слушаем изменения fullscreen состояния
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [])

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen()
        } else if ((document.documentElement as any).webkitRequestFullscreen) {
          await (document.documentElement as any).webkitRequestFullscreen()
        } else if ((document.documentElement as any).msRequestFullscreen) {
          await (document.documentElement as any).msRequestFullscreen()
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen()
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen()
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen()
        }
      }
    } catch (err) {
      console.log('Fullscreen toggle failed:', err)
    }
  }

  const handleLoginSuccess = () => {
    setAppState('waiting-confirmation')
    
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/device/status/${deviceId}`)
        if (response.ok) {
          const data = await response.json()
          if (data.confirmed) {
            clearInterval(pollInterval)
            setAppState('welcome')
          }
        }
      } catch (error) {
        console.error('Error checking device status:', error)
      }
    }, 2000) // Poll every 2 seconds
  }


  const handleWelcomeComplete = () => {
    setAppState('main')
  }

  return (
    <div className="min-h-screen relative">
      {/* Кнопка полноэкранного режима как в YouTube */}
      <button
        onClick={toggleFullscreen}
        className="fixed bottom-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white p-3 rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/20"
        title={isFullscreen ? "Выйти из полноэкранного режима" : "Полноэкранный режим"}
      >
        {isFullscreen ? (
          <Minimize className="w-5 h-5" />
        ) : (
          <Maximize className="w-5 h-5" />
        )}
      </button>

      {appState === 'login' && (
        <LoginPage onLoginSuccess={handleLoginSuccess} deviceId={deviceId} />
      )}
      {appState === 'waiting-confirmation' && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-xl">Ожидание подтверждения устройства...</p>
          </div>
        </div>
      )}
      {appState === 'welcome' && (
        <WelcomeScreen onComplete={handleWelcomeComplete} />
      )}
      {appState === 'main' && (
        <MainScreen />
      )}
    </div>
  )
}

export default App
