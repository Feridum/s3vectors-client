import { createFileRoute } from '@tanstack/react-router'
import { getBucketIndexes } from '../api/getBucketIndexes'
import {IndexesView} from "../features/indexes/IndexesView.tsx";

export const Route = createFileRoute('/indexes')({ 
  loaderDeps: ({ search: { region, bucket } }) => ({ region, bucket }),
  loader: async ({ deps: { region, bucket } }) => {
    if (!bucket) {
      throw new Error('Bucket parameter is required')
    }

    const indexList = await getBucketIndexes(region || 'us-east-1', bucket)
    return { indexList, bucket }
  },
  component: IndexesPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      region: search.region as string || undefined,
      bucket: search.bucket as string
    }
  },
})

function IndexesPage() {
  const { indexList, bucket } = Route.useLoaderData()
  const { region } = Route.useSearch()

  return (
      <IndexesView indexList={indexList} bucket={bucket} region={region} />
  )
}
