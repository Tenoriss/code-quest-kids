import { Link } from "react-router";
import { Heart, Code, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-gray-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                CQ
              </div>
              <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Code Quest Kids
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
              Making coding fun and accessible for kids aged 7-13. Learn about sequences, algorithms, and logical thinking through interactive games and lessons.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <Link to="/" className="text-xs text-gray-400 hover:text-blue-500 transition-colors">Home</Link>
              <Link to="/objectives" className="text-xs text-gray-400 hover:text-blue-500 transition-colors">Objectives</Link>
              <Link to="/quiz" className="text-xs text-gray-400 hover:text-blue-500 transition-colors">Quiz</Link>
              <Link to="/dashboard" className="text-xs text-gray-400 hover:text-blue-500 transition-colors">Dashboard</Link>
            </div>
          </div>

          {/* Learning */}
          <div>
            <h4 className="font-semibold text-sm mb-3 text-gray-800 dark:text-gray-200">Learning</h4>
            <ul className="space-y-2">
              <li><Link to="/sequence" className="text-xs text-gray-500 hover:text-blue-500 transition-colors">What is Sequence?</Link></li>
              <li><Link to="/algorithm" className="text-xs text-gray-500 hover:text-blue-500 transition-colors">What is Algorithm?</Link></li>
              <li><Link to="/daily-life" className="text-xs text-gray-500 hover:text-blue-500 transition-colors">Daily Life Examples</Link></li>
              <li><Link to="/practice" className="text-xs text-gray-500 hover:text-blue-500 transition-colors">Practice</Link></li>
            </ul>
          </div>

          {/* More */}
          <div>
            <h4 className="font-semibold text-sm mb-3 text-gray-800 dark:text-gray-200">More</h4>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="text-xs text-gray-500 hover:text-blue-500 transition-colors">Student Dashboard</Link></li>
              <li><Link to="/certificate" className="text-xs text-gray-500 hover:text-blue-500 transition-colors">Certificate</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200/50 dark:border-gray-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Code Quest Kids. Made with <Heart className="w-3 h-3 inline text-red-500" fill="currentColor" /> for young learners.
          </p>
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Code className="w-3 h-3" /> Built with <Sparkles className="w-3 h-3 text-yellow-500" /> for Sequence & Algorithm
          </p>
        </div>
      </div>
    </footer>
  );
}
