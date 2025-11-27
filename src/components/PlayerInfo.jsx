import React, { useEffect, useState } from 'react'

export default function PlayerInfo({ token }) {
  const [track, setTrack] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function loadPlayback() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.status === 204) {
        setTrack(null)
        setLoading(false)
        return
      }

      if (!res.ok) {
        const txt = await res.text()
        throw new Error('Spotify API error: ' + txt)
      }

      const data = await res.json()
      setTrack(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPlayback()
    // opcional: poll a cada 15s
    const id = setInterval(loadPlayback, 15000)
    return () => clearInterval(id)
  }, [])

  if (loading) return <p>Carregando...</p>
  if (error) return <p style={{color: 'red'}}>Erro: {error}</p>
  if (!track) return <p>Nada tocando no momento...</p>

  return (
    <div>
      <h2>Tocando agora:</h2>
      <p><strong>{track.item?.name}</strong> — {track.item?.artists?.map(a => a.name).join(', ')}</p>
      {track.item?.album?.images?.[0] && (
        <img src={track.item.album.images[0].url} alt="Capa" width="240" />
      )}
      <p>Progresso: {Math.round((track.progress_ms||0)/1000)}s / {Math.round((track.item?.duration_ms||0)/1000)}s</p>
      <button onClick={loadPlayback} style={{marginTop: 12}}>Atualizar</button>
    </div>
  )
}
