import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ThemeProvider } from "./context/ThemeProvider"
import { CustomKanban } from "./pages/Home"
import { AuthProvider } from "./context/AuthProvider"
// import Homev2 from "./components/Homev2"
import Landing from "./components/Landing"
import PrivateRoute from "./components/PrivateRoute"
import Layout from "./components/layout"

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark" storageKey="theme">
          <Routes>
            <Route element={<PrivateRoute Component={Layout} />}>
              <Route index path="/" element={<CustomKanban />} />
            </Route>
            <Route path="/landing" element={<Landing />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
