import React, { FC, ReactNode, useCallback, useEffect, useRef } from 'react'

import { tabbable } from '../Dropdown/tabbable'

type Props = {
  children: ReactNode
}

export const FocusTrap: FC<Props> = ({ children }) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Tab' || ref.current === null) {
      return
    }
    const tabbables = tabbable(ref.current).filter((elm) => elm.tabIndex >= 0)
    if (tabbables.length === 0) {
      return
    }
    const firstTabbale = tabbables[0]
    const lastTabbale = tabbables[tabbables.length - 1]
    const currentFocused = Array.from(tabbables).find((elm) => elm === e.target)
    if (e.shiftKey && currentFocused === firstTabbale) {
      lastTabbale.focus()
      e.preventDefault()
    } else if (!e.shiftKey && currentFocused === lastTabbale) {
      firstTabbale.focus()
      e.preventDefault()
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  useEffect(() => {
    if (ref.current === null) {
      return
    }
    const tabbables = tabbable(ref.current)
    const firstTabbale = tabbables[0]
    if (firstTabbale) {
      firstTabbale.focus()
    }
  })

  return <div ref={ref}>{children}</div>
}
