import React, { useEffect, useState } from 'react'
import { login } from './auth/login'
import { handleCallback } from './auth/callback'
import PlayerInfo from './components/PlayerInfo'

export default function App() {
  const [token, setToken] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function checkCallback() {
      try {
        if (window.location.pathname.includes('callback')) {
          const data = await handleCallback()
          if (data.error) {
            setError(data.error_description || data.error)
            return
          }
          setToken(data.access_token)
          // limpa a query string para uma URL limpa da dashboard
          window.history.replaceState({}, '', '/')
        }
      } catch (err) {
        setError(err.message)
      }
    }
    checkCallback()
  }, [])

  return (
    <div className="container">
      <h1>Spotify PKCE Viewer</h1>
      {!token ? (
        <>
          <p>Aplicação demonstrando OAuth2 Authorization Code + PKCE (scope: user-read-playback-state).</p>
          <button onClick={() => login()}>Login com Spotify</button>
          {error && <p style={{color: 'red'}}>{error}</p>}
        </>
      ) : (
        <>
          <p>Autenticado — token carregado na memória.</p>
          <PlayerInfo token={token} />
        </>
      )}
    </div>
  )
}
