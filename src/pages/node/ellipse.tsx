import { useCallback, useState, type PointerEvent } from 'react'
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
} from '@xyflow/react'

// ===== EllipseNode 组件 =====
export type BorderType = 'inside' | 'center' | 'outside'

export type EllipseNodeType = Node<
  {
    color: string
    borderColor: string
    borderWidth: number
    borderType: BorderType
  },
  'ellipse'
>

const colorOptions = [
  '#f5efe9', // very light warm grey
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#64748b', // gray
]

const borderColorOptions = [
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

const borderWidthOptions = [0, 1, 2, 3, 4, 5, 6, 8, 10]

const borderTypeOptions: {
  value: BorderType
  label: string
  description: string
}[] = [
  {
    value: 'inside',
    label: 'Inside',
    description: 'Border inside the element',
  },
  {
    value: 'center',
    label: 'Center',
    description: 'Border centered on the edge',
  },
  {
    value: 'outside',
    label: 'Outside',
    description: 'Border outside the element',
  },
]

export function EllipseNode({
  id,
  selected,
  dragging,
  data: { color, borderColor, borderWidth, borderType },
}: NodeProps<EllipseNodeType>) {
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

  const handleBorderColorChange = (newBorderColor: string) => {
    updateNodeData(id, { borderColor: newBorderColor })
  }

  const handleBorderWidthChange = (newBorderWidth: number) => {
    updateNodeData(id, { borderWidth: newBorderWidth })
  }

  const handleBorderTypeChange = (newBorderType: BorderType) => {
    updateNodeData(id, { borderType: newBorderType })
  }

  // 获取动态样式和类名
  const getNodeStyles = () => {
    const dynamicStyles: React.CSSProperties = {
      backgroundColor: color,
      borderRadius: '50%', // 关键区别：使椭圆形状
    }

    // 根据边框类型应用样式
    if (borderWidth > 0) {
      switch (borderType) {
        case 'inside':
          dynamicStyles.outline = `${borderWidth}px solid ${borderColor}`
          dynamicStyles.outlineOffset = `${-borderWidth}px`
          break
        case 'center':
          dynamicStyles.outline = `${borderWidth}px solid ${borderColor}`
          dynamicStyles.outlineOffset = `${-borderWidth / 2}px`
          break
        case 'outside':
          dynamicStyles.outline = `${borderWidth}px solid ${borderColor}`
          dynamicStyles.outlineOffset = '0px'
          break
        default:
          dynamicStyles.outline = `${borderWidth}px solid ${borderColor}`
          break
      }
    }

    return dynamicStyles
  }

  return (
    <>
      <NodeResizer isVisible={selected && !dragging} />
      <NodeToolbar
        isVisible={selected && !dragging && !multipleNodesSelected}
        className="nopan"
      >
        <div className="flex flex-col gap-2">
          {/* 背景颜色 */}
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
            <div className="mr-2 text-xs font-medium text-gray-500">
              Background:
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
                title={`Set background color to ${colorOption}`}
              />
            ))}
          </div>

          {/* 边框颜色 */}
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
            <div className="mr-2 text-xs font-medium text-gray-500">
              Border:
            </div>
            {borderColorOptions.map((borderColorOption) => (
              <button
                key={borderColorOption}
                onClick={() => handleBorderColorChange(borderColorOption)}
                className={`h-6 w-6 cursor-pointer rounded-full transition-transform hover:scale-110 ${
                  borderColor === borderColorOption
                    ? 'ring-2 ring-blue-500 ring-offset-1'
                    : 'border border-gray-200'
                }`}
                style={{ backgroundColor: borderColorOption }}
                title={`Set border color to ${borderColorOption}`}
              />
            ))}
          </div>

          {/* 边框粗细 */}
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
            <div className="mr-2 text-xs font-medium text-gray-500">Width:</div>
            {borderWidthOptions.map((widthOption) => (
              <button
                key={widthOption}
                onClick={() => handleBorderWidthChange(widthOption)}
                className={`cursor-pointer rounded border border-gray-200 px-2 py-1 text-xs font-medium transition-colors ${
                  borderWidth === widthOption
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                title={
                  widthOption === 0
                    ? 'No border'
                    : `Set border width to ${widthOption}px`
                }
              >
                {widthOption === 0 ? '⌀' : widthOption}
              </button>
            ))}
          </div>

          {/* 边框类型 */}
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
            <div className="mr-2 text-xs font-medium text-gray-500">Type:</div>
            {borderTypeOptions.map((typeOption) => (
              <button
                key={typeOption.value}
                onClick={() => handleBorderTypeChange(typeOption.value)}
                className={`min-w-14 cursor-pointer rounded border border-gray-200 px-2 py-1 text-xs font-medium transition-colors ${
                  borderType === typeOption.value
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                title={typeOption.description}
              >
                {typeOption.label}
              </button>
            ))}
          </div>
        </div>
      </NodeToolbar>
      <div className="flex h-full w-full items-center justify-center" style={getNodeStyles()} />
    </>
  )
}

// ===== EllipseTool 组件 =====
function getPosition(start: XYPosition, end: XYPosition) {
  return {
    x: Math.min(start.x, end.x),
    y: Math.min(start.y, end.y),
  }
}

function getDimensions(start: XYPosition, end: XYPosition, zoom: number = 1) {
  return {
    width: Math.abs(end.x - start.x) / zoom,
    height: Math.abs(end.y - start.y) / zoom,
  }
}

const colors = [
  '#D14D41',
  '#DA702C',
  '#D0A215',
  '#879A39',
  '#3AA99F',
  '#4385BE',
  '#8B7EC8',
  '#CE5D97',
]

function getRandomColor(): string {
  return colors[Math.floor(Math.random() * colors.length)]
}

export function EllipseTool() {
  const [start, setStart] = useState<XYPosition | null>(null)
  const [end, setEnd] = useState<XYPosition | null>(null)

  const { screenToFlowPosition, getViewport, setNodes } = useReactFlow()

  function handlePointerDown(e: PointerEvent) {
    e.preventDefault()
    e.stopPropagation()
    ;(e.target as HTMLCanvasElement).setPointerCapture(e.pointerId)
    setStart({ x: e.pageX, y: e.pageY })
  }

  function handlePointerMove(e: PointerEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (e.buttons !== 1) return
    setEnd({ x: e.pageX, y: e.pageY })
  }

  function handlePointerUp(e: PointerEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!start || !end) return
    const position = screenToFlowPosition(getPosition(start, end))
    const dimension = getDimensions(start, end, getViewport().zoom)

    // 只有当椭圆足够大时才创建节点
    if (dimension.width > 10 && dimension.height > 10) {
      setNodes((nodes) => [
        ...nodes,
        {
          id: crypto.randomUUID(),
          type: 'ellipse',
          position,
          ...dimension,
          data: {
            color: getRandomColor(),
            borderColor: '#000000',
            borderWidth: 0,
            borderType: 'center' as BorderType,
          },
        },
      ])
    }

    setStart(null)
    setEnd(null)
  }

  const ellipse =
    start && end
      ? {
          position: getPosition(start, end),
          dimension: getDimensions(start, end),
        }
      : null

  return (
    <div
      className="nopan nodrag pointer-events-auto absolute inset-0 z-[5] cursor-crosshair"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {ellipse && (
        <div
          className="pointer-events-none absolute border-2 border-dashed border-blue-600/80 bg-blue-600/10"
          style={{
            width: ellipse.dimension.width,
            height: ellipse.dimension.height,
            borderRadius: '50%', // 椭圆形状的预览
            transform: `translate(${ellipse.position.x}px, ${ellipse.position.y}px)`,
          }}
        ></div>
      )}
    </div>
  )
}

// ===== 主流程组件 =====
const initialNodes = [
  {
    id: '1',
    type: 'ellipse',
    position: { x: 250, y: 5 },
    data: {
      color: '#ff7000',
      borderColor: '#000000',
      borderWidth: 0,
      borderType: 'center' as BorderType,
    },
    width: 150,
    height: 100,
  },
]
const initialEdges: Edge[] = []

const nodeTypes = {
  ellipse: EllipseNode,
}

export default function EllipseFlow() {
  const [nodes, _, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((els) => addEdge(params, els)),
    [setEdges],
  )

  const [isEllipseActive, setIsEllipseActive] = useState(true)

  return (
    <div className="h-screen w-screen">
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <Background />

        {isEllipseActive && <EllipseTool />}

        <Panel position="top-left">
          <div className="flex gap-2">
            <button
              className={`cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm font-medium transition-colors ${
                isEllipseActive
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setIsEllipseActive(true)}
            >
              Ellipse Mode
            </button>
            <button
              className={`cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm font-medium transition-colors ${
                !isEllipseActive
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setIsEllipseActive(false)}
            >
              Selection Mode
            </button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )
}
