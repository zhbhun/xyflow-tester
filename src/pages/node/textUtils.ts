import type { CSSProperties } from 'react'

export const defaultTextStyle: CSSProperties = {
  display: 'block',
  margin: 0,
  height: 'auto',
  border: 'none',
  outline: 'none',
  resize: 'none',
  padding: 0,
  fontSize: 16,
  fontWeight: 'normal',
  lineHeight: '1.25',
  whiteSpace: 'pre-wrap',
  wordBreak: 'normal',
  wordWrap: 'break-word',
  overflowWrap: 'break-word',
  background: 'transparent',
  overflow: 'hidden',
}

export function measureTextWidth(text: string = '', style: CSSProperties = {}) {
  const measureElement = document.createElement('span')
  measureElement.style.visibility = 'hidden'
  measureElement.style.position = 'absolute'

  // 合并默认样式和传入的样式
  const finalStyle = { ...defaultTextStyle, ...style }
  Object.keys(finalStyle).forEach((key) => {
    const value = finalStyle[key as keyof CSSProperties]
    if (typeof value === 'number') {
      ;(measureElement.style as any)[key] = `${value}px`
    } else if (typeof value === 'string') {
      ;(measureElement.style as any)[key] = value
    }
  })

  document.body.appendChild(measureElement)
  let maxWidth = 8
  text.split('\n').forEach((line) => {
    measureElement.textContent = line || ' '
    maxWidth = Math.max(maxWidth, measureElement.offsetWidth)
  })
  document.body.removeChild(measureElement)
  return maxWidth + 4 // 加4px容错
}
