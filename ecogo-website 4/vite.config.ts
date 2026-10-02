import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

const ROUTES = ['/', '/about', '/solutions', '/power-bank', '/contact']

/**
 * Resolves the public site URL at build time and uses it for:
 *  - absolute Open Graph / canonical URLs in index.html (social crawlers need absolute URLs)
 *  - sitemap.xml and robots.txt
 *
 * Order of precedence: VITE_SITE_URL (set this once the Ecogo domain is live),
 * then Netlify's built-in URL variable, then empty (relative URLs, fine for local dev).
 */
function siteMeta(siteUrl: string): Plugin {
  const base = siteUrl.replace(/\/$/, '')
  return {
    name: 'ecogo-site-meta',
    transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', base),
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\nDisallow: /admin\n${base ? `\nSitemap: ${base}/sitemap.xml\n` : ''}`,
      })
      if (base) {
        const urls = ROUTES.map((r) => `  <url><loc>${base}${r === '/' ? '' : r}</loc></url>`).join('\n')
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
        })
      }
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = env.VITE_SITE_URL || process.env.URL || ''
  return {
    plugins: [react(), tailwindcss(), siteMeta(siteUrl)],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    build: { target: 'es2022', sourcemap: false },
  }
})
