# Spotify PKCE SPA (Viewer)

Projeto simples em React + Vite que implementa OAuth2 Authorization Code with PKCE
para visualizar a música que está tocando no Spotify (`user-read-playback-state` scope).

## Configuração rápida

1. Crie um app no [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
   - Adicione a Redirect URI (exemplo):
     `https://SEU_USUARIO.github.io/oauth-spotify-callback/callback`
   - Copie o Client ID.

2. No repositório GitHub:
   - Adicione um Secret chamado `AUTH_CLIENT_ID` contendo o Client ID do Spotify.

3. Ajuste `vite.config.js` base se seu repo tiver outro nome.
   Por padrão está `'/oauth-spotify-callback/'`.

4. Commit e push. O workflow `.github/workflows/deploy.yml` injeta o Client ID
   como `VITE_SPOTIFY_CLIENT_ID` durante o build.

5. Após deploy (GitHub Pages), abra a página e clique em **Login com Spotify**.

## Arquivos importantes
- `src/auth/pkce.js` - geração de code_verifier / code_challenge
- `src/auth/login.js` - redirecionamento para autorização
- `src/auth/callback.js` - troca do code pelo access_token
- `src/components/PlayerInfo.jsx` - chama a API `/v1/me/player/currently-playing`

## Observações de segurança
- Tokens são mantidos apenas em memória da aplicação (estado React) ou `sessionStorage`
  apenas para `code_verifier` e `state`.
- Não armazene `access_token` em `localStorage`.
