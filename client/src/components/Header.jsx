function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-4 px-6 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md">
            <span className="text-blue-600 font-bold text-lg">RR</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">ResumeRadar</h1>
            <p className="text-blue-200 text-xs">Resume Analysis & Job Matching 🎯</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <p className="text-white/80 text-sm font-medium">AI Live</p>
        </div>
      </div>
    </header>
  )
}

export default Header