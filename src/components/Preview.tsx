import { useEffect, useRef, useState, type RefObject } from 'react'
import PoemPage from './PoemPage'
import { FORMAT_BY_ID } from '../lib/formats'
import type { PoemState } from '../lib/poem'

export default function Preview({
  state,
  pageRef,
}: {
  state: PoemState
  pageRef: RefObject<HTMLDivElement | null>
}) {
  const boxRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.2)
  const format = FORMAT_BY_ID.get(state.formatId)!

  useEffect(() => {
    const box = boxRef.current
    if (!box) return
    const fit = () => {
      const { width, height } = box.getBoundingClientRect()
      if (!width || !height) return
      setScale(Math.min(width / format.w, height / format.h))
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(box)
    return () => ro.disconnect()
  }, [format.w, format.h])

  return (
    <div ref={boxRef} className="flex h-full w-full items-center justify-center p-4 md:p-8">
      <div
        style={{ width: format.w * scale, height: format.h * scale }}
        className="anim-pop relative shrink-0 rounded-[3px] shadow-[0_18px_50px_-12px_rgba(60,40,20,0.35)] ring-1 ring-black/10 transition-[width,height] duration-300 ease-page"
      >
        <div
          style={{
            width: format.w,
            height: format.h,
            transform: `scale(${scale})`,
            transformOrigin: 'top right',
            position: 'absolute',
            top: 0,
            right: 0,
          }}
        >
          <PoemPage ref={pageRef} state={state} />

        </div>

      </div>

    </div>

  )
}
