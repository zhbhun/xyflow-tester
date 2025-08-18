import { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  type Connection,
  type Edge,
  type Node,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

// 初始节点数据
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Input Node' },
    position: { x: 250, y: 25 },
    style: {
      background: '#60a5fa',
      color: 'white',
      border: '1px solid #3b82f6',
      borderRadius: '8px',
    },
  },
  {
    id: '2',
    type: 'default',
    data: { label: 'Default Node 1' },
    position: { x: 100, y: 125 },
    style: {
      background: '#fbbf24',
      color: 'white',
      border: '1px solid #f59e0b',
      borderRadius: '8px',
    },
  },
  {
    id: '3',
    type: 'default',
    data: { label: 'Default Node 2' },
    position: { x: 400, y: 125 },
    style: {
      background: '#fbbf24',
      color: 'white',
      border: '1px solid #f59e0b',
      borderRadius: '8px',
    },
  },
  {
    id: '4',
    type: 'output',
    data: { label: 'Output Node' },
    position: { x: 250, y: 225 },
    style: {
      background: '#34d399',
      color: 'white',
      border: '1px solid #10b981',
      borderRadius: '8px',
    },
  },
  {
    id: '5',
    type: 'group',
    data: { label: 'Group Node' },
    position: { x: 50, y: 300 },
    style: {
      background: 'rgba(147, 51, 234, 0.1)',
      color: '#7c3aed',
      border: '2px dashed #7c3aed',
      borderRadius: '12px',
      width: 450,
      height: 150,
    },
  },
  {
    id: '6',
    type: 'default',
    data: { label: 'Grouped Node 1' },
    position: { x: 80, y: 350 },
    parentId: '5',
    extent: 'parent',
    style: {
      background: '#8b5cf6',
      color: 'white',
      border: '1px solid #7c3aed',
      borderRadius: '8px',
    },
  },
  {
    id: '7',
    type: 'default',
    data: { label: 'Grouped Node 2' },
    position: { x: 280, y: 350 },
    parentId: '5',
    extent: 'parent',
    style: {
      background: '#8b5cf6',
      color: 'white',
      border: '1px solid #7c3aed',
      borderRadius: '8px',
    },
  },
];

// 初始边数据
const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    style: { stroke: '#3b82f6' },
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    animated: true,
    style: { stroke: '#3b82f6' },
  },
  {
    id: 'e2-4',
    source: '2',
    target: '4',
    animated: true,
    style: { stroke: '#f59e0b' },
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    animated: true,
    style: { stroke: '#f59e0b' },
  },
  {
    id: 'e6-7',
    source: '6',
    target: '7',
    animated: true,
    style: { stroke: '#7c3aed' },
  },
];

export default function NodeTypeTest() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="w-full h-screen">
      <div className="p-4 bg-gray-100 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          XY Flow React - Node Types Test
        </h1>
        <p className="text-gray-600">
          这个示例展示了 XY Flow React 的四种内置节点类型：
        </p>
        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-400 rounded mr-2"></div>
            <span>Input Node - 输入节点</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-400 rounded mr-2"></div>
            <span>Default Node - 默认节点</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-400 rounded mr-2"></div>
            <span>Output Node - 输出节点</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-400 rounded mr-2"></div>
            <span>Group Node - 分组节点</span>
          </div>
        </div>
      </div>

      <div className="w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          style={{ background: '#f8fafc' }}
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}
