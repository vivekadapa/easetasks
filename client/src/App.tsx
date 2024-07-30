import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ThemeProvider } from "./context/ThemeProvider"
import { ModeToggle } from "./components/ui/mode-toggle"
import Layout from "./components/ui/layout"

function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="theme">
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index path="/" element={<>home page</>} />
            <Route path="/hello" element={<>Hello world</>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
