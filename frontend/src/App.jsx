import Header from './components/Header'
import Sidebar from './components/Sidebar'

const App = ({ page }) => {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <main className="flex-1">
        <Header />
        <div className="p-4">{page}</div>
      </main>
    </div>
  )
}

export default App
