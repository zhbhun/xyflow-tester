import { useCallback, useState } from 'react'
import {
  ReactFlow,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  Panel,
} from '@xyflow/react'

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
]

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }]

function ControlsTester() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Controls 显示控制状态
  const [showControls, setShowControls] = useState(true)
  const [showZoom, setShowZoom] = useState(true)
  const [showFitView, setShowFitView] = useState(true)
  const [showInteractive, setShowInteractive] = useState(true)
  const [controlsPosition, setControlsPosition] = useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>('bottom-left')

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
        onViewportChange={(viewport) => {
          console.log('>>', viewport)
        }}
      >
        {showControls && (
          <Controls
            position={controlsPosition}
            showZoom={showZoom}
            showFitView={showFitView}
            showInteractive={showInteractive}
          />
        )}
        <Panel position="top-right">
          <div className="bg-white p-4 rounded-lg shadow-lg border min-w-60">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Controls 设置</h3>

            <div className="space-y-4">
              {/* 显示/隐藏 Controls */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="show-controls"
                  checked={showControls}
                  onChange={(e) => setShowControls(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="show-controls" className="text-sm font-medium text-gray-700">
                  显示 Controls
                </label>
              </div>

              {/* Controls 位置 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Controls 位置</label>
                <select
                  value={controlsPosition}
                  onChange={(e) => setControlsPosition(e.target.value as 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right')}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  disabled={!showControls}
                >
                  <option value="top-left">左上角</option>
                  <option value="top-right">右上角</option>
                  <option value="bottom-left">左下角</option>
                  <option value="bottom-right">右下角</option>
                </select>
              </div>

              {/* 缩放控制 */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="show-zoom"
                  checked={showZoom}
                  onChange={(e) => setShowZoom(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                  disabled={!showControls}
                />
                <label htmlFor="show-zoom" className="text-sm font-medium text-gray-700">
                  显示缩放按钮
                </label>
              </div>

              {/* 适应视图控制 */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="show-fit-view"
                  checked={showFitView}
                  onChange={(e) => setShowFitView(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                  disabled={!showControls}
                />
                <label htmlFor="show-fit-view" className="text-sm font-medium text-gray-700">
                  显示适应视图按钮
                </label>
              </div>

              {/* 交互模式控制 */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="show-interactive"
                  checked={showInteractive}
                  onChange={(e) => setShowInteractive(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                  disabled={!showControls}
                />
                <label htmlFor="show-interactive" className="text-sm font-medium text-gray-700">
                  显示锁定/解锁按钮
                </label>
              </div>

              {/* 说明文本 */}
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="text-xs text-gray-600">
                  通过上面的选项可以控制 ReactFlow Controls 组件的显示和功能。
                </p>
              </div>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )
}

export default ControlsTester
