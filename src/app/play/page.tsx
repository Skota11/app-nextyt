import { Suspense } from 'react'
import PlayClient from './playClient'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export default function PlayPage() {
  return (
    <NuqsAdapter>
      <Suspense fallback={<div>Loading...</div>}>
        <PlayClient />
      </Suspense>
    </NuqsAdapter>
  )
}