import { useCallback, useState } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
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
  type Connection,
  type Edge,
} from '@xyflow/react'

// ===== GroupNode 组件 =====
export type GroupNodeType = Node<
  {
    label: string
    backgroundColor: string
    borderColor: string
    borderWidth: number
    borderStyle: 'solid' | 'dashed' | 'dotted'
    opacity: number
  },
  'group'
>

const backgroundColorOptions = [
  'rgba(59, 130, 246, 0.1)', // blue
  'rgba(34, 197, 94, 0.1)',  // green
  'rgba(239, 68, 68, 0.1)',  // red
  'rgba(249, 115, 22, 0.1)', // orange
  'rgba(139, 92, 246, 0.1)', // purple
  'rgba(236, 72, 153, 0.1)', // pink
  'rgba(100, 116, 139, 0.1)', // gray
  'rgba(245, 158, 11, 0.1)', // amber
]

const borderColorOptions = [
  '#3b82f6', // blue
  '#22c55e', // green
  '#ef4444', // red
  '#f97316', // orange
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#64748b', // gray
  '#f59e0b', // amber
]

const borderWidthOptions = [1, 2, 3, 4, 5]

const borderStyleOptions: {
  value: 'solid' | 'dashed' | 'dotted'
  label: string
}[] = [
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' },
]

export function GroupNode({
  id,
  selected,
  dragging,
  data: { label, backgroundColor, borderColor, borderWidth, borderStyle, opacity },
}: NodeProps<GroupNodeType>) {
  const { updateNodeData } = useReactFlow()
  const [isEditing, setIsEditing] = useState(false)
  const [editLabel, setEditLabel] = useState(label)
  const [multipleNodesSelected, setMultipleNodesSelected] = useState(false)

  const onSelectionChange = useCallback(
    ({ nodes }: { nodes: Node[] }) => {
      setMultipleNodesSelected(nodes.length > 1)
    },
    [],
  )

  useOnSelectionChange({ onChange: onSelectionChange })

  // 双击编辑标签
  const handleDoubleClick = useCallback(() => {
    setIsEditing(true)
    setEditLabel(label)
  }, [label])

  // 保存编辑
  const saveEdit = useCallback(() => {
    updateNodeData(id, { label: editLabel })
    setIsEditing(false)
  }, [id, editLabel, updateNodeData])

  // 取消编辑
  const cancelEdit = useCallback(() => {
    setEditLabel(label)
    setIsEditing(false)
  }, [label])

  // 处理键盘事件
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        saveEdit()
      } else if (e.key === 'Escape') {
        cancelEdit()
      }
      e.stopPropagation()
    },
    [saveEdit, cancelEdit],
  )

  // 工具栏处理函数
  const handleBackgroundColorChange = (newColor: string) => {
    updateNodeData(id, { backgroundColor: newColor })
  }

  const handleBorderColorChange = (newColor: string) => {
    updateNodeData(id, { borderColor: newColor })
  }

  const handleBorderWidthChange = (newWidth: number) => {
    updateNodeData(id, { borderWidth: newWidth })
  }

  const handleBorderStyleChange = (newStyle: 'solid' | 'dashed' | 'dotted') => {
    updateNodeData(id, { borderStyle: newStyle })
  }

  const handleOpacityChange = (newOpacity: number) => {
    updateNodeData(id, { opacity: newOpacity })
  }

  return (
    <>
      <NodeResizer isVisible={selected && !dragging && !isEditing} />
      <NodeToolbar
        isVisible={selected && !dragging && !multipleNodesSelected && !isEditing}
        className="nopan"
      >
        <div className="flex flex-col gap-2">
          {/* 背景颜色 */}
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
            <div className="mr-2 text-xs font-medium text-gray-500">Background:</div>
            {backgroundColorOptions.map((color, index) => (
              <button
                key={color}
                onClick={() => handleBackgroundColorChange(color)}
                className={`h-6 w-6 cursor-pointer rounded-full border transition-transform hover:scale-110 ${
                  backgroundColor === color
                    ? 'ring-2 ring-blue-500 ring-offset-1'
                    : 'border-gray-200'
                }`}
                style={{ backgroundColor: borderColorOptions[index] }}
                title={`Set background color`}
              />
            ))}
          </div>

          {/* 边框颜色 */}
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
            <div className="mr-2 text-xs font-medium text-gray-500">Border:</div>
            {borderColorOptions.map((color) => (
              <button
                key={color}
                onClick={() => handleBorderColorChange(color)}
                className={`h-6 w-6 cursor-pointer rounded-full border transition-transform hover:scale-110 ${
                  borderColor === color
                    ? 'ring-2 ring-blue-500 ring-offset-1'
                    : 'border-gray-200'
                }`}
                style={{ backgroundColor: color }}
                title={`Set border color to ${color}`}
              />
            ))}
          </div>

          {/* 边框宽度和样式 */}
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
            <div className="mr-2 text-xs font-medium text-gray-500">Style:</div>
            {borderWidthOptions.map((width) => (
              <button
                key={width}
                onClick={() => handleBorderWidthChange(width)}
                className={`cursor-pointer rounded border px-2 py-1 text-xs font-medium transition-colors ${
                  borderWidth === width
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
                title={`Set border width to ${width}px`}
              >
                {width}
              </button>
            ))}
            {borderStyleOptions.map((style) => (
              <button
                key={style.value}
                onClick={() => handleBorderStyleChange(style.value)}
                className={`cursor-pointer rounded border px-2 py-1 text-xs font-medium transition-colors ${
                  borderStyle === style.value
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
                title={`Set border style to ${style.label}`}
              >
                {style.label}
              </button>
            ))}
          </div>

          {/* 透明度 */}
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
            <div className="text-xs font-medium text-gray-500">Opacity:</div>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={opacity}
              onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
              className="h-2 flex-1 cursor-pointer rounded-lg bg-gray-200"
            />
            <span className="text-xs text-gray-600">{Math.round(opacity * 100)}%</span>
          </div>
        </div>
      </NodeToolbar>

      <div
        className="flex h-full w-full items-start justify-start p-2"
        style={{
          backgroundColor,
          border: `${borderWidth}px ${borderStyle} ${borderColor}`,
          borderRadius: '8px',
          opacity,
        }}
        onDoubleClick={handleDoubleClick}
      >
        {isEditing ? (
          <input
            value={editLabel}
            onChange={(e) => setEditLabel(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={saveEdit}
            className="nodrag nopan bg-transparent text-sm font-semibold outline-none"
            style={{ color: borderColor }}
            autoFocus
          />
        ) : (
          <span
            className="text-sm font-semibold"
            style={{ color: borderColor }}
          >
            {label}
          </span>
        )}
      </div>
    </>
  )
}

// ===== 主组件 =====
const initialNodes: Node[] = [
  // 顶层分组 - 项目团队
  {
    id: 'group-team',
    type: 'group',
    position: { x: 50, y: 50 },
    data: {
      label: '项目团队',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: '#3b82f6',
      borderWidth: 2,
      borderStyle: 'solid' as const,
      opacity: 1,
    },
    style: {
      width: 700,
      height: 400,
    },
  },

  // 前端开发组
  {
    id: 'group-frontend',
    type: 'group',
    position: { x: 70, y: 100 },
    parentId: 'group-team',
    extent: 'parent',
    data: {
      label: '前端开发组',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      borderColor: '#22c55e',
      borderWidth: 2,
      borderStyle: 'dashed' as const,
      opacity: 0.8,
    },
    style: {
      width: 300,
      height: 150,
    },
  },

  // 前端开发人员
  {
    id: 'dev-1',
    type: 'default',
    position: { x: 90, y: 140 },
    parentId: 'group-frontend',
    extent: 'parent',
    data: { label: 'React 开发' },
    style: {
      background: '#22c55e',
      color: 'white',
      border: '1px solid #16a34a',
      borderRadius: '6px',
      width: 100,
      height: 40,
    },
  },
  {
    id: 'dev-2',
    type: 'default',
    position: { x: 210, y: 140 },
    parentId: 'group-frontend',
    extent: 'parent',
    data: { label: 'UI/UX 设计' },
    style: {
      background: '#22c55e',
      color: 'white',
      border: '1px solid #16a34a',
      borderRadius: '6px',
      width: 100,
      height: 40,
    },
  },

  // 后端开发组
  {
    id: 'group-backend',
    type: 'group',
    position: { x: 400, y: 100 },
    parentId: 'group-team',
    extent: 'parent',
    data: {
      label: '后端开发组',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderColor: '#ef4444',
      borderWidth: 2,
      borderStyle: 'dashed' as const,
      opacity: 0.8,
    },
    style: {
      width: 270,
      height: 150,
    },
  },

  // 后端开发人员
  {
    id: 'dev-3',
    type: 'default',
    position: { x: 420, y: 140 },
    parentId: 'group-backend',
    extent: 'parent',
    data: { label: 'API 开发' },
    style: {
      background: '#ef4444',
      color: 'white',
      border: '1px solid #dc2626',
      borderRadius: '6px',
      width: 100,
      height: 40,
    },
  },
  {
    id: 'dev-4',
    type: 'default',
    position: { x: 540, y: 140 },
    parentId: 'group-backend',
    extent: 'parent',
    data: { label: '数据库' },
    style: {
      background: '#ef4444',
      color: 'white',
      border: '1px solid #dc2626',
      borderRadius: '6px',
      width: 100,
      height: 40,
    },
  },

  // 测试组
  {
    id: 'group-qa',
    type: 'group',
    position: { x: 200, y: 280 },
    parentId: 'group-team',
    extent: 'parent',
    data: {
      label: '质量保证组',
      backgroundColor: 'rgba(249, 115, 22, 0.1)',
      borderColor: '#f97316',
      borderWidth: 2,
      borderStyle: 'dotted' as const,
      opacity: 0.9,
    },
    style: {
      width: 300,
      height: 100,
    },
  },

  // 测试人员
  {
    id: 'qa-1',
    type: 'default',
    position: { x: 220, y: 320 },
    parentId: 'group-qa',
    extent: 'parent',
    data: { label: '自动化测试' },
    style: {
      background: '#f97316',
      color: 'white',
      border: '1px solid #ea580c',
      borderRadius: '6px',
      width: 100,
      height: 40,
    },
  },
  {
    id: 'qa-2',
    type: 'default',
    position: { x: 340, y: 320 },
    parentId: 'group-qa',
    extent: 'parent',
    data: { label: '手工测试' },
    style: {
      background: '#f97316',
      color: 'white',
      border: '1px solid #ea580c',
      borderRadius: '6px',
      width: 100,
      height: 40,
    },
  },

  // 独立的外部协作组
  {
    id: 'group-external',
    type: 'group',
    position: { x: 800, y: 100 },
    data: {
      label: '外部协作',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      borderColor: '#8b5cf6',
      borderWidth: 3,
      borderStyle: 'solid' as const,
      opacity: 0.7,
    },
    style: {
      width: 200,
      height: 150,
    },
  },

  // 外部协作人员
  {
    id: 'external-1',
    type: 'default',
    position: { x: 820, y: 140 },
    parentId: 'group-external',
    extent: 'parent',
    data: { label: '客户代表' },
    style: {
      background: '#8b5cf6',
      color: 'white',
      border: '1px solid #7c3aed',
      borderRadius: '6px',
      width: 80,
      height: 40,
    },
  },
  {
    id: 'external-2',
    type: 'default',
    position: { x: 910, y: 140 },
    parentId: 'group-external',
    extent: 'parent',
    data: { label: '顾问' },
    style: {
      background: '#8b5cf6',
      color: 'white',
      border: '1px solid #7c3aed',
      borderRadius: '6px',
      width: 70,
      height: 40,
    },
  },
]

const initialEdges: Edge[] = [
  // 前端到后端的协作
  {
    id: 'e1',
    source: 'dev-1',
    target: 'dev-3',
    animated: true,
    style: { stroke: '#6b7280', strokeWidth: 2 },
    label: 'API 对接',
  },

  // 设计到前端开发
  {
    id: 'e2',
    source: 'dev-2',
    target: 'dev-1',
    animated: true,
    style: { stroke: '#22c55e', strokeWidth: 2 },
    label: '设计稿',
  },

  // 后端内部协作
  {
    id: 'e3',
    source: 'dev-3',
    target: 'dev-4',
    animated: true,
    style: { stroke: '#ef4444', strokeWidth: 2 },
    label: '数据接口',
  },

  // 开发到测试
  {
    id: 'e4',
    source: 'dev-1',
    target: 'qa-1',
    style: { stroke: '#f97316', strokeWidth: 2 },
    label: '提交测试',
  },
  {
    id: 'e5',
    source: 'dev-3',
    target: 'qa-2',
    style: { stroke: '#f97316', strokeWidth: 2 },
    label: '功能测试',
  },

  // 外部协作
  {
    id: 'e6',
    source: 'dev-2',
    target: 'external-1',
    style: { stroke: '#8b5cf6', strokeWidth: 2 },
    label: '需求确认',
  },
  {
    id: 'e7',
    source: 'external-2',
    target: 'qa-1',
    style: { stroke: '#8b5cf6', strokeWidth: 2 },
    label: '测试策略',
  },
]

const nodeTypes = {
  group: GroupNode,
}

function GroupFlowInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const { screenToFlowPosition } = useReactFlow()

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((els) => addEdge(params, els)),
    [setEdges],
  )

  // 添加新的组
  const addNewGroup = useCallback(() => {
    const position = screenToFlowPosition({ x: 100, y: 100 })
    const newNode: Node = {
      id: `group-${Date.now()}`,
      type: 'group',
      position,
      data: {
        label: '新建分组',
        backgroundColor: 'rgba(100, 116, 139, 0.1)',
        borderColor: '#64748b',
        borderWidth: 2,
        borderStyle: 'solid' as const,
        opacity: 0.8,
      },
      style: {
        width: 200,
        height: 150,
      },
    }
    setNodes((nds) => [...nds, newNode])
  }, [screenToFlowPosition, setNodes])

  // 添加新的节点
  const addNewNode = useCallback(() => {
    const position = screenToFlowPosition({ x: 200, y: 200 })
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'default',
      position,
      data: { label: '新节点' },
      style: {
        background: '#64748b',
        color: 'white',
        border: '1px solid #475569',
        borderRadius: '6px',
        width: 100,
        height: 40,
      },
    }
    setNodes((nds) => [...nds, newNode])
  }, [screenToFlowPosition, setNodes])

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

        <Panel position="top-left">
          <div className="flex flex-col gap-2">
            <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
              <h3 className="mb-2 text-sm font-semibold text-gray-800">
                Group 节点测试
              </h3>
              <p className="mb-3 text-xs text-gray-600">
                展示分组节点的创建、嵌套和管理功能
              </p>
              <div className="flex gap-2">
                <button
                  onClick={addNewGroup}
                  className="rounded border border-blue-600 bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
                >
                  添加分组
                </button>
                <button
                  onClick={addNewNode}
                  className="rounded border border-gray-600 bg-gray-600 px-3 py-1 text-xs text-white hover:bg-gray-700"
                >
                  添加节点
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
              <h4 className="mb-2 text-xs font-semibold text-gray-800">功能说明</h4>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>• 双击分组标签可编辑名称</li>
                <li>• 选中分组可调整样式和大小</li>
                <li>• 拖拽节点到分组内可建立父子关系</li>
                <li>• 支持分组嵌套和多层级结构</li>
                <li>• 可自定义背景色、边框和透明度</li>
              </ul>
            </div>
          </div>
        </Panel>

        <Panel position="bottom-right">
          <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
            <h4 className="mb-2 text-xs font-semibold text-gray-800">示例说明</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded border-2 border-blue-500 bg-blue-100"></div>
                <span>项目团队总组</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded border-2 border-dashed border-green-500 bg-green-100"></div>
                <span>前端/后端开发子组</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded border-2 border-dotted border-orange-500 bg-orange-100"></div>
                <span>QA测试组</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded border-2 border-purple-500 bg-purple-100"></div>
                <span>外部协作组</span>
              </div>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )
}

export default function GroupFlow() {
  return (
    <ReactFlowProvider>
      <GroupFlowInner />
    </ReactFlowProvider>
  )
}
