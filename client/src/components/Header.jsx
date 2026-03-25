function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 py-4 px-6 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md">
            <span className="text-blue-600 font-bold text-lg">AI</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Resume Analyzer</h1>
            <p className="text-blue-200 text-xs">Smart career insights in seconds</p>
          </div>
        </div>
        <div className="bg-white/20 px-4 py-1.5 rounded-full">
          <p className="text-white text-sm font-medium">✨ Powered by Groq AI</p>
        </div>
      </div>
    </header>
  )
}

export default Header