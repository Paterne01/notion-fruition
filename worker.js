const MY_DOMAIN = 'x.paternebalagizi.workers.dev'
const START_PAGE = '2262c15ac38e8021a580f8aa6757fa0a'

const PATHNAME_EXCLUDE = [
  '_worker.js',
  'robots.txt',
  'manifest.json',
  'favicon.ico',
  'apple-touch-icon.png',
  'android-chrome-192x192.png',
  'android-chrome-512x512.png'
]

addEventListener('fetch', event => {
  event.respondWith(fetchAndApply(event.request))
})

async function fetchAndApply(request) {
  const url = new URL(request.url)
  if (PATHNAME_EXCLUDE.some(path => url.pathname.includes(path))) {
    return fetch(request)
  }

  let targetUrl = `https://www.notion.so/${START_PAGE}${url.pathname}`
  const response = await fetch(targetUrl, {
    headers: {
      'User-Agent': request.headers.get('User-Agent') || '',
      'Referer': 'https://www.notion.so/'
    }
  })

  let html = await response.text()

  // Inject titre personnalisé (facultatif)
  html = html.replace(/<title>(.*?)<\/title>/, '<title>Bienvenue sur mon site ✨</title>')

  // Masquer la barre Notion (facultatif)
  html = html.replace('</head>', `<style>
    div.notion-topbar { display: none !important; }
  </style></head>`)

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'Cache-Control': 'no-store'
    }
  })
}
