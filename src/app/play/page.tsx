import { Suspense } from 'react'
import PlayClient from './playClient'

export default function PlayPage() {
  return (
      <Suspense fallback={null}>
        <PlayClient />
      </Suspense>
  )
}