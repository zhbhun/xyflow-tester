import { useCallback, useState, useRef, useEffect, type PointerEvent } from 'react'
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
  type Connection,
  type Edge,
} from '@xyflow/react'

// ===== TextNode 组件 =====
export type TextNodeType = Node<
  {
    text: string
    fontSize: number
    fontWeight: 'normal' | 'bold'
    color: string
    backgroundColor: string
    borderColor: string
    borderWidth: number
    textAlign: 'left' | 'center' | 'right'
  },
  'text'
>

const fontSizeOptions = [12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64]
const fontWeightOptions: { value: 'normal' | 'bold'; label: string }[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'bold', label: 'Bold' },
]

const textAlignOptions: { value: 'left' | 'center' | 'right'; label: string }[] = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
]

const colorOptions = [
  '#000000', // black
  '#ffffff', // white
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#64748b', // gray
]

const backgroundColorOptions = [
  'transparent',
  '#ffffff', // white
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
  'transparent',
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

const borderWidthOptions = [0, 1, 2, 3, 4, 5]

export function TextNode({
  id,
  selected,
  dragging,
  data: {
    text,
    fontSize,
    fontWeight,
    color,
    backgroundColor,
    borderColor,
    borderWidth,
    textAlign
  },
}: NodeProps<TextNodeType>) {
  const { updateNodeData } = useReactFlow()
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(text)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
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

  // 双击进入编辑模式
  const handleDoubleClick = useCallback(() => {
    setIsEditing(true)
    setEditText(text)
  }, [text])

  // 保存编辑内容
  const saveEdit = useCallback(() => {
    updateNodeData(id, { text: editText })
    setIsEditing(false)
  }, [id, editText, updateNodeData])

  // 取消编辑
  const cancelEdit = useCallback(() => {
    setEditText(text)
    setIsEditing(false)
  }, [text])

  // 处理键盘事件
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        // Ctrl+Enter 保存
        e.preventDefault()
        saveEdit()
      } else if (e.key === 'Escape') {
        // Escape 取消
        e.preventDefault()
        cancelEdit()
      }
      // 阻止事件冒泡，避免影响节点拖拽
      e.stopPropagation()
    },
    [saveEdit, cancelEdit],
  )

  // 自动调整 textarea 高度
  const adjustTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [])

  // 自动调整 textarea 宽度
  const adjustTextareaWidth = useCallback(() => {
    if (textareaRef.current) {
      const textToMeasure = editText || '双击编辑文本'
      const lines = textToMeasure.split('\n')

      // 创建一个临时的测量元素
      const measureElement = document.createElement('span')
      measureElement.style.visibility = 'hidden'
      measureElement.style.position = 'absolute'
      measureElement.style.fontSize = `${fontSize}px`
      measureElement.style.fontWeight = fontWeight
      measureElement.style.fontFamily = 'inherit'
      measureElement.style.whiteSpace = 'pre'

      document.body.appendChild(measureElement)

      // 找到最宽的行
      let maxWidth = 20 // 最小宽度
      lines.forEach(line => {
        measureElement.textContent = line || ' ' // 空行用空格占位
        maxWidth = Math.max(maxWidth, measureElement.offsetWidth)
      })

      document.body.removeChild(measureElement)

      textareaRef.current.style.width = `${maxWidth + 8}px` // 加8px容错
    }
  }, [editText, fontSize, fontWeight])

  // 自动聚焦到编辑框并调整尺寸
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.select()
      adjustTextareaHeight()
      adjustTextareaWidth()
    }
  }, [isEditing, adjustTextareaHeight, adjustTextareaWidth])

  // 当文本内容变化时调整尺寸
  useEffect(() => {
    if (isEditing) {
      adjustTextareaHeight()
      adjustTextareaWidth()
    }
  }, [editText, isEditing, adjustTextareaHeight, adjustTextareaWidth])

  // 处理工具栏选项变更
  const handleFontSizeChange = (newFontSize: number) => {
    updateNodeData(id, { fontSize: newFontSize })
  }

  const handleFontWeightChange = (newFontWeight: 'normal' | 'bold') => {
    updateNodeData(id, { fontWeight: newFontWeight })
  }

  const handleColorChange = (newColor: string) => {
    updateNodeData(id, { color: newColor })
  }

  const handleBackgroundColorChange = (newBackgroundColor: string) => {
    updateNodeData(id, { backgroundColor: newBackgroundColor })
  }

  const handleBorderColorChange = (newBorderColor: string) => {
    updateNodeData(id, { borderColor: newBorderColor })
  }

  const handleBorderWidthChange = (newBorderWidth: number) => {
    updateNodeData(id, { borderWidth: newBorderWidth })
  }

  const handleTextAlignChange = (newTextAlign: 'left' | 'center' | 'right') => {
    updateNodeData(id, { textAlign: newTextAlign })
  }

  // 获取动态样式
  const getTextStyles = (): React.CSSProperties => {
    return {
      fontSize: `${fontSize}px`,
      fontWeight,
      color,
      backgroundColor: backgroundColor === 'transparent' ? 'transparent' : backgroundColor,
      border: borderWidth > 0 && borderColor !== 'transparent' ? `${borderWidth}px solid ${borderColor}` : 'none',
      textAlign,
      borderRadius: '4px',
      minWidth: '20px',
      minHeight: '1.2em',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      lineHeight: '1.2',
    }
  }

  return (
    <>
      <NodeResizer isVisible={selected && !dragging && !isEditing} />
      <NodeToolbar
        isVisible={selected && !dragging && !multipleNodesSelected && !isEditing}
        className="nopan"
      >
        <div className="flex flex-col gap-2">
          {/* 字体大小和粗细 */}
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
            <div className="text-xs font-medium text-gray-500">Font:</div>
            <select
              value={fontSize}
              onChange={(e) => handleFontSizeChange(Number(e.target.value))}
              className="text-xs border border-gray-200 rounded px-2 py-1"
            >
              {fontSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}px
                </option>
              ))}
            </select>
            {fontWeightOptions.map((weightOption) => (
              <button
                key={weightOption.value}
                onClick={() => handleFontWeightChange(weightOption.value)}
                className={`cursor-pointer rounded border border-gray-200 px-2 py-1 text-xs font-medium transition-colors ${
                  fontWeight === weightOption.value
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                title={`Set font weight to ${weightOption.label}`}
              >
                {weightOption.label === 'Bold' ? 'B' : 'N'}
              </button>
            ))}
          </div>

          {/* 文本对齐 */}
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
            <div className="mr-2 text-xs font-medium text-gray-500">Align:</div>
            {textAlignOptions.map((alignOption) => (
              <button
                key={alignOption.value}
                onClick={() => handleTextAlignChange(alignOption.value)}
                className={`cursor-pointer rounded border border-gray-200 px-2 py-1 text-xs font-medium transition-colors ${
                  textAlign === alignOption.value
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                title={`Align text ${alignOption.label.toLowerCase()}`}
              >
                {alignOption.label.charAt(0)}
              </button>
            ))}
          </div>

          {/* 文字颜色 */}
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
            <div className="mr-2 text-xs font-medium text-gray-500">Color:</div>
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
                title={`Set text color to ${colorOption}`}
              />
            ))}
          </div>

          {/* 背景颜色 */}
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
            <div className="mr-2 text-xs font-medium text-gray-500">Background:</div>
            {backgroundColorOptions.map((bgOption) => (
              <button
                key={bgOption}
                onClick={() => handleBackgroundColorChange(bgOption)}
                className={`h-6 w-6 cursor-pointer rounded-full transition-transform hover:scale-110 ${
                  backgroundColor === bgOption
                    ? 'ring-2 ring-blue-500 ring-offset-1'
                    : 'border border-gray-200'
                }`}
                style={{
                  backgroundColor: bgOption === 'transparent' ? 'transparent' : bgOption,
                  backgroundImage: bgOption === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : 'none',
                  backgroundSize: bgOption === 'transparent' ? '8px 8px' : 'auto',
                  backgroundPosition: bgOption === 'transparent' ? '0 0, 0 4px, 4px -4px, -4px 0px' : 'auto'
                }}
                title={`Set background color to ${bgOption}`}
              />
            ))}
          </div>

          {/* 边框 */}
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
            <div className="mr-2 text-xs font-medium text-gray-500">Border:</div>
            {borderColorOptions.slice(0, 5).map((borderOption) => (
              <button
                key={borderOption}
                onClick={() => handleBorderColorChange(borderOption)}
                className={`h-6 w-6 cursor-pointer rounded-full transition-transform hover:scale-110 ${
                  borderColor === borderOption
                    ? 'ring-2 ring-blue-500 ring-offset-1'
                    : 'border border-gray-200'
                }`}
                style={{
                  backgroundColor: borderOption === 'transparent' ? 'transparent' : borderOption,
                  backgroundImage: borderOption === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : 'none',
                  backgroundSize: borderOption === 'transparent' ? '8px 8px' : 'auto',
                  backgroundPosition: borderOption === 'transparent' ? '0 0, 0 4px, 4px -4px, -4px 0px' : 'auto'
                }}
                title={`Set border color to ${borderOption}`}
              />
            ))}
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
        </div>
      </NodeToolbar>

      <div
        className="nodrag nopan cursor-text"
        style={getTextStyles()}
        onDoubleClick={handleDoubleClick}
      >
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={editText}
            onChange={(e) => {
              setEditText(e.target.value)
              // 输入时实时调整尺寸
              setTimeout(() => {
                adjustTextareaHeight()
                adjustTextareaWidth()
              }, 0)
            }}
            onKeyDown={handleKeyDown}
            onBlur={saveEdit}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontSize: `${fontSize}px`,
              fontWeight,
              color,
              textAlign,
              fontFamily: 'inherit',
              lineHeight: '1.2',
              overflow: 'hidden',
              minWidth: '20px',
              minHeight: '1.2em',
            }}
            placeholder="输入文本..."
          />
        ) : (
          <span>{text || '双击编辑文本'}</span>
        )}
      </div>
    </>
  )
}

// ===== TextTool 组件 =====
export function TextTool() {
  const { screenToFlowPosition, setNodes } = useReactFlow()

  function handleClick(e: PointerEvent) {
    e.preventDefault()
    e.stopPropagation()

    const position = screenToFlowPosition({ x: e.clientX, y: e.clientY })

    setNodes((nodes) => [
      ...nodes,
      {
        id: crypto.randomUUID(),
        type: 'text',
        position,
        data: {
          text: '新文本',
          fontSize: 16,
          fontWeight: 'normal' as const,
          color: '#000000',
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          borderWidth: 0,
          textAlign: 'left' as const,
        },
      },
    ])
  }

  return (
    <div
      className="nopan nodrag pointer-events-auto absolute inset-0 z-[5] cursor-text"
      onPointerDown={handleClick}
    />
  )
}

// ===== 主流程组件 =====
const initialNodes = [
  {
    id: '1',
    type: 'text',
    position: { x: 250, y: 100 },
    data: {
      text: '这是一个示例文本节点\n双击可以编辑内容',
      fontSize: 16,
      fontWeight: 'normal' as const,
      color: '#000000',
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      borderWidth: 0,
      textAlign: 'left' as const,
    },
  },
  {
    id: '2',
    type: 'text',
    position: { x: 100, y: 200 },
    data: {
      text: '标题文本',
      fontSize: 24,
      fontWeight: 'bold' as const,
      color: '#1f2937',
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      borderWidth: 0,
      textAlign: 'left' as const,
    },
  },
  {
    id: '3',
    type: 'text',
    position: { x: 400, y: 150 },
    data: {
      text: '多行文本示例\n第二行\n第三行比较长一些',
      fontSize: 14,
      fontWeight: 'normal' as const,
      color: '#374151',
      backgroundColor: '#fef3c7',
      borderColor: '#f59e0b',
      borderWidth: 1,
      textAlign: 'center' as const,
    },
  },
]

const initialEdges: Edge[] = []

const nodeTypes = {
  text: TextNode,
}

export default function TextFlow() {
  const [nodes, _, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((els) => addEdge(params, els)),
    [setEdges],
  )

  const [isTextActive, setIsTextActive] = useState(true)

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

        {isTextActive && <TextTool />}

        <Panel position="top-left">
          <div className="flex gap-2">
            <button
              className={`cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm font-medium transition-colors ${
                isTextActive
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setIsTextActive(true)}
            >
              Text Mode
            </button>
            <button
              className={`cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm font-medium transition-colors ${
                !isTextActive
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setIsTextActive(false)}
            >
              Selection Mode
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-600">
            Text Mode: 点击画布添加文本节点<br/>
            双击文本节点进行编辑 (Ctrl+Enter保存, Esc取消)
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )
}
