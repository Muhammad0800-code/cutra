import { useState, useEffect } from 'react'
import LoginPage from './components/LoginPage'
import WelcomeScreen from './components/WelcomeScreen'
import MainScreen from './components/MainScreen'
import './App.css'

type AppState = 'login' | 'waiting-confirmation' | 'welcome' | 'main'

function App() {
  const [appState, setAppState] = useState<AppState>('login')
  const [deviceId, setDeviceId] = useState<string>('')

  useEffect(() => {
    const storedDeviceId = localStorage.getItem('cutra-device-id')
    if (storedDeviceId) {
      setDeviceId(storedDeviceId)
    } else {
      const newDeviceId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      setDeviceId(newDeviceId)
      localStorage.setItem('cutra-device-id', newDeviceId)
    }

    // Автоматический полноэкранный режим при загрузке
    const enterFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen()
        } else if ((document.documentElement as any).webkitRequestFullscreen) {
          await (document.documentElement as any).webkitRequestFullscreen()
        } else if ((document.documentElement as any).msRequestFullscreen) {
          await (document.documentElement as any).msRequestFullscreen()
        }
      } catch (err) {
        console.log('Fullscreen request failed:', err)
      }
    }

    // Запускаем полноэкранный режим при первом взаимодействии пользователя
    const handleFirstInteraction = () => {
      enterFullscreen()
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('touchstart', handleFirstInteraction)
    }

    // Пытаемся сразу войти в полноэкранный режим
    enterFullscreen()

    // Если не получилось сразу, ждем первого клика
    document.addEventListener('click', handleFirstInteraction)
    document.addEventListener('touchstart', handleFirstInteraction)

    return () => {
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('touchstart', handleFirstInteraction)
    }
  }, [])

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
    <div className="min-h-screen">
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
