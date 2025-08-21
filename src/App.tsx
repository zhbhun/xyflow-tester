import { Routes, Route } from 'react-router'
import Home from './pages/home'
import Hello from './pages/hello'
import ControlsTester from './pages/controls'
import PanelTester from './pages/panel'
import NodeTypeTest from './pages/node/type'
import RectangleFlow from './pages/node/rect'
import EllipseFlow from './pages/node/ellipse'
import PathFlow from './pages/node/path'
import TextFlow from './pages/node/text'
import CrossBackground from './pages/background/cross'
import DotsBackground from './pages/background/dots'
import LinesBackground from './pages/background/lines'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/hello" element={<Hello />} />
      <Route path="/controls" element={<ControlsTester />} />
      <Route path="/panel" element={<PanelTester />} />
      <Route path="/node/type" element={<NodeTypeTest />} />
      <Route path="/node/rect" element={<RectangleFlow />} />
      <Route path="/node/ellipse" element={<EllipseFlow />} />
      <Route path="/node/path" element={<PathFlow />} />
      <Route path="/node/text" element={<TextFlow />} />
      <Route path="/background/cross" element={<CrossBackground />} />
      <Route path="/background/dots" element={<DotsBackground />} />
      <Route path="/background/lines" element={<LinesBackground />} />
    </Routes>
  )
}

export default App