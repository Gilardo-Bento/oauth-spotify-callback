export async function handleCallback() {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  const returnedState = urlParams.get('state')

  const storedState = sessionStorage.getItem('oauth_state')
  const codeVerifier = sessionStorage.getItem('code_verifier')

  if (!code) {
    return { error: 'missing_code', error_description: 'Authorization code ausente na URL' }
  }

  if (returnedState !== storedState) {
    throw new Error('CSRF: state inválido')
  }

  // Troca do code pelo token
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: 'https://Gilardo-Bento.github.io/oauth-spotify-callback/callback',
    client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    code_verifier: codeVerifier
  })

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  })

  const data = await res.json()
  // limpar dados sensíveis da sessionStorage
  sessionStorage.removeItem('code_verifier')
  sessionStorage.removeItem('oauth_state')
  return data
}
