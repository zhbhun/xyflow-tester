import { useCallback, useState, useRef, type PointerEvent } from 'react'
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Background,
  Panel,
  NodeResizer,
  NodeToolbar,
  useReactFlow,
  useOnSelectionChange,
  type Node,
  type NodeProps,
  type XYPosition,
  type Connection,
  type Edge,
  type Viewport,
} from '@xyflow/react'

// ===== PathNode 组件 =====
export type PathNodeType = Node<
  {
    path: string
    color: string
    strokeWidth: number
  },
  'path'
>

const colorOptions = [
  '#000000', // black
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#64748b', // gray
]

const strokeWidthOptions = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20]

export function PathNode({
  id,
  selected,
  dragging,
  data: { path, color, strokeWidth },
}: NodeProps<PathNodeType>) {
  const { updateNodeData } = useReactFlow()

  const [multipleNodesSelected, setMultipleNodesSelected] = useState(false)

  const onSelectionChange = useCallback(
    ({ nodes }: { nodes: Node[] }) => {
      if (nodes.length > 1) {
        setMultipleNodesSelected(true)
      } else {
        setMultipleNodesSelected(false)
      }
    },
    [setMultipleNodesSelected],
  )

  useOnSelectionChange({ onChange: onSelectionChange })

  const handleColorChange = (newColor: string) => {
    updateNodeData(id, { color: newColor })
  }

  const handleStrokeWidthChange = (newStrokeWidth: number) => {
    updateNodeData(id, { strokeWidth: newStrokeWidth })
  }

  return (
    <>
      <NodeResizer isVisible={selected && !dragging} />
      <NodeToolbar
        isVisible={selected && !dragging && !multipleNodesSelected}
        className="nopan"
      >
        <div className="flex flex-col gap-2">
          {/* 画笔颜色 */}
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
            <div className="mr-2 text-xs font-medium text-gray-500">
              Color:
            </div>
            {colorOptions.map((colorOption) => (
              <button
                key={colorOption}
                onClick={() => handleColorChange(colorOption)}
                className={`h-6 w-6 cursor-pointer rounded-full transition-transform hover:scale-110 ${
                  color === colorOption
                    ? 'ring-2 ring-blue-500 ring-offset-1'
                    : 'border border-gray-200'
                }`}
                style={{ backgroundColor: colorOption }}
                title={`Set stroke color to ${colorOption}`}
              />
            ))}
          </div>

          {/* 画笔粗细 */}
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
            <div className="mr-2 text-xs font-medium text-gray-500">Width:</div>
            {strokeWidthOptions.map((widthOption) => (
              <button
                key={widthOption}
                onClick={() => handleStrokeWidthChange(widthOption)}
                className={`cursor-pointer rounded border border-gray-200 px-2 py-1 text-xs font-medium transition-colors ${
                  strokeWidth === widthOption
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                title={`Set stroke width to ${widthOption}px`}
              >
                {widthOption}
              </button>
            ))}
          </div>
        </div>
      </NodeToolbar>
      <div className="h-full w-full">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none"
        >
          <path
            d={path}
            stroke={color}
            strokeWidth={strokeWidth / 10}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </>
  )
}

// ===== PathTool 组件 =====
export function PathTool() {
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentScreenPath, setCurrentScreenPath] = useState<XYPosition[]>([])
  const [currentStrokeWidth, setCurrentStrokeWidth] = useState(3)
  const [currentColor, setCurrentColor] = useState('#000000')

  const { screenToFlowPosition, setNodes } = useReactFlow()
  const pathRef = useRef<XYPosition[]>([])

  function handlePointerDown(e: PointerEvent) {
    e.preventDefault()
    e.stopPropagation()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)

    const flowPosition = screenToFlowPosition({ x: e.pageX, y: e.pageY })
    const screenPosition = { x: e.pageX, y: e.pageY }

    pathRef.current = [flowPosition]
    setCurrentScreenPath([screenPosition])
    setIsDrawing(true)
  }

  function handlePointerMove(e: PointerEvent) {
    e.preventDefault()
    e.stopPropagation()

    if (!isDrawing || e.buttons !== 1) return

    const flowPosition = screenToFlowPosition({ x: e.pageX, y: e.pageY })
    const screenPosition = { x: e.pageX, y: e.pageY }

    // 添加平滑度控制，避免过密的点
    const lastPoint = pathRef.current[pathRef.current.length - 1]
    if (lastPoint) {
      const distance = Math.sqrt(
        Math.pow(flowPosition.x - lastPoint.x, 2) + Math.pow(flowPosition.y - lastPoint.y, 2)
      )
      if (distance < 2) return // 最小距离阈值
    }

    pathRef.current = [...pathRef.current, flowPosition]
    setCurrentScreenPath(prev => [...prev, screenPosition])
  }

  function handlePointerUp(e: PointerEvent) {
    e.preventDefault()
    e.stopPropagation()

    if (!isDrawing || pathRef.current.length < 2) {
      setIsDrawing(false)
      setCurrentScreenPath([])
      pathRef.current = []
      return
    }

    // 计算路径的边界框
    const minX = Math.min(...pathRef.current.map(p => p.x))
    const maxX = Math.max(...pathRef.current.map(p => p.x))
    const minY = Math.min(...pathRef.current.map(p => p.y))
    const maxY = Math.max(...pathRef.current.map(p => p.y))

    const width = maxX - minX
    const height = maxY - minY

    // 如果路径太小，不创建节点
    if (width < 10 || height < 10) {
      setIsDrawing(false)
      setCurrentScreenPath([])
      pathRef.current = []
      return
    }

    // 将路径坐标转换为相对于边界框的坐标，并归一化到 0-100 范围
    const normalizedPath = pathRef.current.map(point => ({
      x: ((point.x - minX) / width) * 100,
      y: ((point.y - minY) / height) * 100,
    }))

    // 生成 SVG 路径字符串
    const pathString = normalizedPath.reduce((acc, point, index) => {
      if (index === 0) {
        return `M ${point.x.toFixed(2)} ${point.y.toFixed(2)}`
      }
      return `${acc} L ${point.x.toFixed(2)} ${point.y.toFixed(2)}`
    }, '')

    // 创建路径节点
    setNodes((nodes) => [
      ...nodes,
      {
        id: crypto.randomUUID(),
        type: 'path',
        position: { x: minX, y: minY },
        width,
        height,
        data: {
          path: pathString,
          color: currentColor,
          strokeWidth: currentStrokeWidth,
        },
      },
    ])

    setIsDrawing(false)
    setCurrentScreenPath([])
    pathRef.current = []
  }

  // 计算当前路径的屏幕坐标，用于预览
  const getScreenPath = () => {
    if (currentScreenPath.length < 2) return ''

    return currentScreenPath.reduce((acc, point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`
      }
      return `${acc} L ${point.x} ${point.y}`
    }, '')
  }

  return (
    <>
      <div
        className="nopan nodrag pointer-events-auto absolute inset-0 z-[5] cursor-crosshair"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />
      {isDrawing && currentScreenPath.length > 1 && (
        <svg className="pointer-events-none absolute inset-0 z-[6]" style={{ width: '100vw', height: '100vh' }}>
          <path
            d={getScreenPath()}
            fill="none"
            stroke={currentColor}
            strokeWidth={currentStrokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            opacity="0.7"
          />
        </svg>
      )}

      {/* 画笔设置面板 */}
      <Panel position="top-right">
        <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-lg min-w-[240px]">
          <div className="text-sm font-medium text-gray-700 mb-1">
            🎨 Brush Settings
          </div>

          {/* 画笔颜色 */}
          <div className="flex flex-col gap-2">
            <div className="text-xs font-medium text-gray-500">Color:</div>
            <div className="flex items-center gap-1 flex-wrap">
              {colorOptions.map((colorOption) => (
                <button
                  key={colorOption}
                  onClick={() => setCurrentColor(colorOption)}
                  className={`h-8 w-8 cursor-pointer rounded-full transition-all hover:scale-110 ${
                    currentColor === colorOption
                      ? 'ring-2 ring-blue-500 ring-offset-2 shadow-md'
                      : 'border-2 border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: colorOption }}
                  title={`Set brush color to ${colorOption}`}
                />
              ))}
            </div>
          </div>

          {/* 画笔粗细 */}
          <div className="flex flex-col gap-2">
            <div className="text-xs font-medium text-gray-500">
              Width: {currentStrokeWidth}px
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              {strokeWidthOptions.slice(0, 8).map((widthOption) => (
                <button
                  key={widthOption}
                  onClick={() => setCurrentStrokeWidth(widthOption)}
                  className={`cursor-pointer rounded border px-3 py-1 text-xs font-medium transition-colors min-w-[32px] ${
                    currentStrokeWidth === widthOption
                      ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                  title={`Set brush width to ${widthOption}px`}
                >
                  {widthOption}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              {strokeWidthOptions.slice(8).map((widthOption) => (
                <button
                  key={widthOption}
                  onClick={() => setCurrentStrokeWidth(widthOption)}
                  className={`cursor-pointer rounded border px-3 py-1 text-xs font-medium transition-colors min-w-[32px] ${
                    currentStrokeWidth === widthOption
                      ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                  title={`Set brush width to ${widthOption}px`}
                >
                  {widthOption}
                </button>
              ))}
            </div>
          </div>

          {/* 当前预览 */}
          <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
            <div className="text-xs font-medium text-gray-500">Preview:</div>
            <div className="flex items-center justify-center bg-gray-50 rounded p-3">
              <svg width="80" height="20">
                <path
                  d="M 10 10 L 70 10"
                  stroke={currentColor}
                  strokeWidth={currentStrokeWidth}
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </Panel>
    </>
  )
}

// ===== 主流程组件 =====
const initialNodes = [
  {
    id: '1',
    type: 'path',
    position: { x: 250, y: 50 },
    width: 150,
    height: 100,
    data: {
      path: 'M 10 50 Q 30 10 50 50 Q 70 90 90 50',
      color: '#3b82f6',
      strokeWidth: 3,
    },
  },
]
const initialEdges: Edge[] = []

const nodeTypes = {
  path: PathNode,
}

export default function PathFlow() {
  const [nodes, _, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((els) => addEdge(params, els)),
    [setEdges],
  )

  const [isPathActive, setIsPathActive] = useState(true)

  const [viewport, setViewport] = useState<Viewport>({
    x: 0,
    y: 0,
    zoom: 1,
  })

  return (
    <div className="h-screen w-screen">
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        edges={edges}
        maxZoom={2}
        minZoom={0.5}
        viewport={viewport}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onViewportChange={setViewport}
      >
        <Controls />
        <Background />

        {isPathActive && <PathTool />}

        <Panel position="top-left">
          <div className="flex gap-2">
            <button
              className={`cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm font-medium transition-colors ${
                isPathActive
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setIsPathActive(true)}
            >
              Path Mode
            </button>
            <button
              className={`cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm font-medium transition-colors ${
                !isPathActive
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setIsPathActive(false)}
            >
              Selection Mode
            </button>
          </div>
        </Panel>

        <Panel position="bottom-right">
          <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg max-w-[200px]">
            <div className="text-sm font-medium text-gray-700 mb-2">
              💡 Tips
            </div>
            <div className="text-xs text-gray-500">
              • Click and drag to draw paths<br/>
              • Adjust brush settings above<br/>
              • Switch to Selection Mode to edit nodes
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )
}
