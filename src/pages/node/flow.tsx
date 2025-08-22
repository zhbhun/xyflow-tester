import { useCallback, useRef, useState } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
  addEdge,
  BackgroundVariant,
  ConnectionLineType,
  type Connection,
  type Edge,
  type Node,
  type ReactFlowInstance,
  type OnConnectEnd,
  type OnConnectStart,
  type OnConnectStartParams,
} from '@xyflow/react'

// 工作流节点数据
const initialNodes: Node[] = [
  // Input 节点 - 流程起始
  {
    id: 'start',
    type: 'input',
    data: {
      label: '开始处理',
      description: '工作流入口点'
    },
    position: { x: 250, y: 50 },
    style: {
      background: '#3b82f6',
      color: 'white',
      border: '1px solid #2563eb',
      borderRadius: '6px',
      padding: '8px 12px',
      minWidth: '100px',
    },
  },

  // Default 节点 - 数据验证
  {
    id: 'validate',
    type: 'default',
    data: {
      label: '数据验证',
      description: '验证输入数据的有效性'
    },
    position: { x: 100, y: 150 },
    style: {
      background: '#f97316',
      color: 'white',
      border: '1px solid #ea580c',
      borderRadius: '6px',
      padding: '8px 12px',
      minWidth: '100px',
    },
  },

  // Default 节点 - 数据处理
  {
    id: 'process',
    type: 'default',
    data: {
      label: '数据处理',
      description: '执行业务逻辑处理'
    },
    position: { x: 400, y: 150 },
    style: {
      background: '#f97316',
      color: 'white',
      border: '1px solid #ea580c',
      borderRadius: '6px',
      padding: '8px 12px',
      minWidth: '100px',
    },
  },

  // Default 节点 - 结果生成
  {
    id: 'generate',
    type: 'default',
    data: {
      label: '结果生成',
      description: '生成处理结果'
    },
    position: { x: 250, y: 250 },
    style: {
      background: '#f97316',
      color: 'white',
      border: '1px solid #ea580c',
      borderRadius: '6px',
      padding: '8px 12px',
      minWidth: '100px',
    },
  },

  // Output 节点 - 流程结束
  {
    id: 'end',
    type: 'output',
    data: {
      label: '完成输出',
      description: '工作流输出点'
    },
    position: { x: 250, y: 350 },
    style: {
      background: '#10b981',
      color: 'white',
      border: '1px solid #059669',
      borderRadius: '6px',
      padding: '8px 12px',
      minWidth: '100px',
    },
  },
]

// 工作流连接边数据
const initialEdges: Edge[] = [
  {
    id: 'start-validate',
    source: 'start',
    target: 'validate',
    animated: true,
        style: {
      stroke: '#6b7280',
      strokeWidth: 2,
    },
    markerEnd: {
      type: 'arrowclosed',
      color: '#6b7280',
    },
    label: '输入数据',
    labelBgStyle: {
      fill: '#f8fafc',
      color: '#374151',
    },
  },
  {
    id: 'start-process',
    source: 'start',
    target: 'process',
    animated: true,
        style: {
      stroke: '#6b7280',
      strokeWidth: 2,
    },
    markerEnd: {
      type: 'arrowclosed',
      color: '#6b7280',
    },
    label: '并行处理',
    labelBgStyle: {
      fill: '#f8fafc',
      color: '#374151',
    },
  },
  {
    id: 'validate-generate',
    source: 'validate',
    target: 'generate',
    animated: true,
        style: {
      stroke: '#6b7280',
      strokeWidth: 2,
    },
    markerEnd: {
      type: 'arrowclosed',
      color: '#6b7280',
    },
    label: '验证通过',
    labelBgStyle: {
      fill: '#f8fafc',
      color: '#374151',
    },
  },
  {
    id: 'process-generate',
    source: 'process',
    target: 'generate',
    animated: true,
        style: {
      stroke: '#6b7280',
      strokeWidth: 2,
    },
    markerEnd: {
      type: 'arrowclosed',
      color: '#6b7280',
    },
    label: '处理完成',
    labelBgStyle: {
      fill: '#f8fafc',
      color: '#374151',
    },
  },
  {
    id: 'generate-end',
    source: 'generate',
    target: 'end',
    animated: true,
        style: {
      stroke: '#6b7280',
      strokeWidth: 2,
    },
    markerEnd: {
      type: 'arrowclosed',
      color: '#6b7280',
    },
    label: '输出结果',
    labelBgStyle: {
      fill: '#f8fafc',
      color: '#374151',
    },
  },
]

// 节点颜色配置 - 简洁版
const nodeColors = {
  default: {
    background: '#f97316',
    color: 'white',
    border: '1px solid #ea580c',
  },
  input: {
    background: '#3b82f6',
    color: 'white',
    border: '1px solid #2563eb',
  },
  output: {
    background: '#10b981',
    color: 'white',
    border: '1px solid #059669',
  },
}

function FlowDemoInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [nodeId, setNodeId] = useState(8) // 下一个节点的ID计数器
  const connectingNodeId = useRef<string | null>(null)

  const { screenToFlowPosition } = useReactFlow()

  // 生成新节点
  const createNewNode = useCallback((position: { x: number; y: number }, type: string = 'default') => {
    const newNode: Node = {
      id: `node-${nodeId}`,
      type,
      position,
      data: {
        label: `新节点 ${nodeId}`,
        description: `动态创建的${type}节点`
      },
      style: {
        ...nodeColors[type as keyof typeof nodeColors],
        borderRadius: '6px',
        padding: '8px 12px',
        minWidth: '100px',
      },
    }

    setNodes((nds) => nds.concat(newNode))
    setNodeId((id) => id + 1)
    return newNode
  }, [nodeId, setNodes])

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  )

  // 连接开始时记录源节点
  const onConnectStart = useCallback<OnConnectStart>((_, params: OnConnectStartParams) => {
    connectingNodeId.current = params.nodeId
  }, [])

  // 连接结束时检查是否需要创建新节点
  const onConnectEnd = useCallback<OnConnectEnd>((event) => {
    if (!connectingNodeId.current) return

    const targetIsPane = (event.target as Element).classList.contains('react-flow__pane')

    if (targetIsPane) {
      // 拖拽到空白区域，创建新节点
      const position = screenToFlowPosition({
        x: (event as MouseEvent).clientX,
        y: (event as MouseEvent).clientY,
      })

      const newNode = createNewNode(position)

      // 创建连接边
      const newEdge: Edge = {
        id: `${connectingNodeId.current}-${newNode.id}`,
        source: connectingNodeId.current,
        target: newNode.id,
        animated: true,
        style: {
          stroke: '#6b7280',
          strokeWidth: 2,
        },
        markerEnd: {
          type: 'arrowclosed',
          color: '#6b7280',
        },
        label: '新连接',
        labelBgStyle: {
          fill: '#f8fafc',
          color: '#374151',
        },
      }

      setEdges((eds) => eds.concat(newEdge))
    }

    connectingNodeId.current = null
  }, [screenToFlowPosition, createNewNode, setEdges])

  const onInit = useCallback((instance: ReactFlowInstance) => {
    console.log('XY Flow instance initialized:', instance)
  }, [])

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50">
      {/* 标题区域 */}
      <div className="border-b border-gray-300 bg-white shadow-sm p-6">
        <h1 className="mb-3 text-3xl font-bold text-gray-800">
          XY Flow 工作流节点示例
        </h1>
        <p className="text-gray-600 mb-4">
          展示 XY Flow 中三种基础节点类型的工作流程：输入节点(Input) → 默认节点(Default) → 输出节点(Output)
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>💡 新功能：</strong> 从任意节点的连接点拖拽到空白区域，即可自动创建新节点并连接！
              </p>
            </div>
          </div>
        </div>

        {/* 节点类型说明 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center p-3 bg-gray-50 rounded border">
            <div className="mr-3 h-4 w-4 rounded bg-blue-500"></div>
            <div>
              <div className="font-medium text-gray-800">Input Node</div>
              <div className="text-gray-600">流程起始点</div>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded border">
            <div className="mr-3 h-4 w-4 rounded bg-orange-500"></div>
            <div>
              <div className="font-medium text-gray-800">Default Node</div>
              <div className="text-gray-600">处理节点</div>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded border">
            <div className="mr-3 h-4 w-4 rounded bg-green-500"></div>
            <div>
              <div className="font-medium text-gray-800">Output Node</div>
              <div className="text-gray-600">流程终点</div>
            </div>
          </div>
        </div>
      </div>

      {/* Flow 区域 */}
      <div className="h-full w-full flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          fitView
          style={{
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          }}
          proOptions={{
            hideAttribution: true,
          }}
          onInit={onInit}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          minZoom={0.2}
          maxZoom={ 2}
          connectionLineStyle={{
            stroke: '#6b7280',
            strokeWidth: 1,
          }}
          connectionLineType={ConnectionLineType.Bezier}
        >
          <Controls
            position="top-left"
            style={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <MiniMap
            nodeColor={(node) => {
              switch (node.type) {
                case 'input': return '#3b82f6'
                case 'output': return '#10b981'
                default: return '#f97316'
              }
            }}
            position="bottom-right"
            style={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1.5}
            color="#94a3b8"
          />
        </ReactFlow>
      </div>
    </div>
  )
}

export default function FlowDemo() {
  return (
    <ReactFlowProvider>
      <FlowDemoInner />
    </ReactFlowProvider>
  )
}
