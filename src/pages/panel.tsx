import { useCallback, useState } from 'react'
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  Panel,
} from '@xyflow/react'

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
]

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }]

function PanelTester() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Panel 显示控制状态
  const [showTopLeftPanel, setShowTopLeftPanel] = useState(true)
  const [showTopRightPanel, setShowTopRightPanel] = useState(true)
  const [showBottomLeftPanel, setShowBottomLeftPanel] = useState(true)
  const [showBottomRightPanel, setShowBottomRightPanel] = useState(true)

  // Panel 内容控制
  const [panelContent, setPanelContent] = useState('default')
  const [panelColor, setPanelColor] = useState('white')

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  )

  return (
    <div className="h-screen w-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls />
        <Background />

        {showTopLeftPanel && (
          <Panel position="top-left">
            <div className={`p-4 rounded-lg shadow-lg border min-w-48 ${panelColor === 'white' ? 'bg-white' : 'bg-gray-800 text-white'}`}>
              <h3 className="text-lg font-semibold mb-2">Top Left Panel</h3>
              <p className="text-sm">This is a panel in the top-left corner.</p>
            </div>
          </Panel>
        )}

        {showTopRightPanel && (
          <Panel position="top-right">
            <div className={`p-4 rounded-lg shadow-lg border min-w-48 ${panelColor === 'white' ? 'bg-white' : 'bg-gray-800 text-white'}`}>
              <h3 className="text-lg font-semibold mb-2">Top Right Panel</h3>
              <p className="text-sm">This is a panel in the top-right corner.</p>
            </div>
          </Panel>
        )}

        {showBottomLeftPanel && (
          <Panel position="bottom-left">
            <div className={`p-4 rounded-lg shadow-lg border min-w-48 ${panelColor === 'white' ? 'bg-white' : 'bg-gray-800 text-white'}`}>
              <h3 className="text-lg font-semibold mb-2">Bottom Left Panel</h3>
              <p className="text-sm">This is a panel in the bottom-left corner.</p>
            </div>
          </Panel>
        )}

        {showBottomRightPanel && (
          <Panel position="bottom-right">
            <div className={`p-4 rounded-lg shadow-lg border min-w-48 ${panelColor === 'white' ? 'bg-white' : 'bg-gray-800 text-white'}`}>
              <h3 className="text-lg font-semibold mb-2">Bottom Right Panel</h3>
              <p className="text-sm">This is a panel in the bottom-right corner.</p>
            </div>
          </Panel>
        )}

        <Panel position="top-right" style={{ top: 120 }}>
          <div className="bg-white p-4 rounded-lg shadow-lg border min-w-60">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Panel Settings</h3>

            <div className="space-y-4">
              {/* 显示/隐藏 Panels */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="show-top-left"
                    checked={showTopLeftPanel}
                    onChange={(e) => setShowTopLeftPanel(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label htmlFor="show-top-left" className="text-sm font-medium text-gray-700">
                    Top Left
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="show-top-right"
                    checked={showTopRightPanel}
                    onChange={(e) => setShowTopRightPanel(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label htmlFor="show-top-right" className="text-sm font-medium text-gray-700">
                    Top Right
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="show-bottom-left"
                    checked={showBottomLeftPanel}
                    onChange={(e) => setShowBottomLeftPanel(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label htmlFor="show-bottom-left" className="text-sm font-medium text-gray-700">
                    Bottom Left
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="show-bottom-right"
                    checked={showBottomRightPanel}
                    onChange={(e) => setShowBottomRightPanel(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label htmlFor="show-bottom-right" className="text-sm font-medium text-gray-700">
                    Bottom Right
                  </label>
                </div>
              </div>

              {/* Panel 内容选择 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Panel Content</label>
                <select
                  value={panelContent}
                  onChange={(e) => setPanelContent(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="default">Default Content</option>
                  <option value="custom">Custom Content</option>
                  <option value="info">Information</option>
                </select>
              </div>

              {/* Panel 颜色主题 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Panel Theme</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPanelColor('white')}
                    className={`w-8 h-8 rounded-full border-2 ${panelColor === 'white' ? 'border-blue-500' : 'border-gray-300'}`}
                    style={{ backgroundColor: 'white' }}
                    title="Light Theme"
                  />
                  <button
                    onClick={() => setPanelColor('dark')}
                    className={`w-8 h-8 rounded-full border-2 ${panelColor === 'dark' ? 'border-blue-500' : 'border-gray-300'}`}
                    style={{ backgroundColor: 'rgb(31, 41, 55)' }}
                    title="Dark Theme"
                  />
                </div>
              </div>

              {/* 说明文本 */}
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="text-xs text-gray-600">
                  Use these controls to configure the ReactFlow Panel components.
                  Panels can be positioned in the four corners of the flow area.
                </p>
              </div>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )
}

export default PanelTester
