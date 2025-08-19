import { Routes, Route } from 'react-router'
import Home from './pages/home'
import Hello from './pages/hello'
import NodeTypeTest from './pages/node/type'
import RectangleFlow from './pages/node/rect'
import EllipseFlow from './pages/node/ellipse'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/hello" element={<Hello />} />
      <Route path="/node/type" element={<NodeTypeTest />} />
      <Route path="/node/rect" element={<RectangleFlow />} />
      <Route path="/node/ellipse" element={<EllipseFlow />} />
    </Routes>
  )
}

export default App
