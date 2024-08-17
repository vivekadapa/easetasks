import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ThemeProvider } from "./context/ThemeProvider"
import { ModeToggle } from "./components/ui/mode-toggle"
import Layout from "./components/ui/layout"
import Home from './pages/Home'
import Login from "./pages/Login"
import LogoutButton from "./components/ui/logout"

function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="theme">
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index path="/" element={<Home />} />
            <Route path="/hello" element={<>Hello world</>} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<LogoutButton />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
