import { generateCodeVerifier, generateCodeChallenge } from './pkce'

export async function login() {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID
  if (!clientId) {
    alert('VITE_SPOTIFY_CLIENT_ID não está definido. Verifique seus secrets e workflow.')
    return
  }

  const verifier = generateCodeVerifier()
  const challenge = await generateCodeChallenge(verifier)
  const state = crypto.randomUUID()

  sessionStorage.setItem('code_verifier', verifier)
  sessionStorage.setItem('oauth_state', state)

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: 'https://Gilardo-Bento.github.io/oauth-spotify-callback/callback',
    scope: 'user-read-playback-state',
    state,
    code_challenge_method: 'S256',
    code_challenge: challenge
  })

  window.location = 'https://accounts.spotify.com/authorize?' + params.toString()
}
