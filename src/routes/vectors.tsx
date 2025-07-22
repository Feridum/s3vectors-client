import { createFileRoute } from '@tanstack/react-router'
import { getBucketVectors } from '../api/getBucketVectors'
import { VectorsView } from '../features/vectors/VectorsView'

export const Route = createFileRoute('/vectors')({ 
  loaderDeps: ({ search: { region, bucket, index } }) => ({ region, bucket, index }),
  loader: async ({ deps: { region, bucket, index } }) => {
    if (!bucket || !index) {
      throw new Error('Bucket and index parameters are required')
    }

    const vectorsList = await getBucketVectors(region || 'us-east-1', bucket, index)
    return { vectorsList, bucket, index }
  },
  component: VectorsPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      region: search.region as string || undefined,
      bucket: search.bucket as string,
      index: search.index as string
    }
  },
})

function VectorsPage() {
  const { vectorsList, bucket, index } = Route.useLoaderData()
  const { region } = Route.useSearch()

  return (
    <VectorsView
      vectorsList={vectorsList}
      bucket={bucket}
      index={index}
      region={region || 'us-east-1'}
    />
  )
}
