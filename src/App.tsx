import { Routes, Route } from 'react-router'
import Home from './pages/home'
import Hello from './pages/hello'
import NodeTypeTest from './pages/node/type'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/hello" element={<Hello />} />
      <Route path="/node/type" element={<NodeTypeTest />} />
    </Routes>
  )
}

export default App
