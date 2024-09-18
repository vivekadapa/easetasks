import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ThemeProvider } from "./context/ThemeProvider"
import Layout from "./components/layout"
// import Home from './pages/Home'
import { CustomKanban } from "./pages/Home"
import AuthComponent from "./components/AuthComponent"
import { AuthProvider } from "./context/AuthProvider"


function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark" storageKey="theme">
          <Routes>
            <Route element={<Layout />}>
              <Route index path="/" element={<CustomKanban />} />
            </Route>
            <Route path="/login" element={<AuthComponent isLogin={true} />} />
            <Route path="/register" element={<AuthComponent isLogin={false} />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
