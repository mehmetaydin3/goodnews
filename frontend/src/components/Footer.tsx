import { Link } from 'react-router-dom'
import { Heart, Zap } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">✨</span>
              <span className="text-white font-bold text-lg">GoodNews</span>
            </div>
            <p className="text-sm leading-relaxed">
              Real stories. Real joy. We curate the most uplifting, inspiring,
              and positive news from around the world — every single day.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
              Explore
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Latest Stories
                </Link>
              </li>
              <li>
                <Link
                  to="/category/science-nature"
                  className="hover:text-white transition-colors"
                >
                  Science & Nature
                </Link>
              </li>
              <li>
                <Link
                  to="/category/health-medicine"
                  className="hover:text-white transition-colors"
                >
                  Health & Medicine
                </Link>
              </li>
              <li>
                <Link
                  to="/category/environment"
                  className="hover:text-white transition-colors"
                >
                  Environment
                </Link>
              </li>
              <li>
                <Link
                  to="/category/community-society"
                  className="hover:text-white transition-colors"
                >
                  Community
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
              About
            </h3>
            <p className="text-sm leading-relaxed mb-4">
              GoodNews is powered by a multi-agent AI pipeline that continuously
              discovers, deduplicates, classifies, and summarizes positive stories
              from hundreds of sources.
            </p>
            <div className="flex items-center gap-1.5 text-sm">
              <Zap size={14} className="text-amber-400" />
              <span>Powered by</span>
              <span className="text-white font-medium">Claude AI</span>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">
            &copy; {year} GoodNews. Spreading positivity, one story at a time.
          </p>
          <p className="flex items-center gap-1.5 text-xs">
            Made with <Heart size={12} className="text-rose-400 fill-rose-400" /> for a better world
          </p>
        </div>
      </div>
    </footer>
  )
}
