import { createFileRoute } from '@tanstack/react-router'
import { getBucketList } from '../api/getBucketList'
import { useState } from 'react'
import {BucketsView} from "../features/buckets/BucketsView.tsx";

export const Route = createFileRoute('/buckets')({ 
  loaderDeps: ({ search: { region } }) => ({ region }),
  loader: async ({ deps: { region } }) => {
    const bucketList = await getBucketList(region || 'us-east-1')
    return { bucketList }
  },
  component: BucketsPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      region: search.region as string || undefined
    }
  },
})

function BucketsPage() {
  const { bucketList } = Route.useLoaderData()
  const { region } = Route.useSearch()
  const [newRegion, setNewRegion] = useState(region || 'us-east-1')
  const navigate = Route.useNavigate()

  const handleRefresh = (region:string) => {
    navigate({ search: { region } })
  }

  return (
      <BucketsView
          bucketList={bucketList}
          region={region || 'us-east-1'}
          newRegion={newRegion}
          onRegionChange={setNewRegion}
          onRefresh={handleRefresh}
      />
  )
}
