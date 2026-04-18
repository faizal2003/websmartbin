import Dashboard from './components/Dashboard'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Dashboard />
        
        <footer className="mt-16 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Smart Trash Bin System. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}

export default App
