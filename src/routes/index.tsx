import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
    component: Index,
})

function Index() {
    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-6">S3 Vectors Explorer</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="text-xl font-semibold mb-3">Buckets</h2>
                    <p className="mb-4 text-gray-600">View and manage your S3 Vector Buckets across regions.</p>
                    <Link 
                        to="/buckets"
                        search={{region: undefined}}
                        className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                        Browse Buckets
                    </Link>
                </div>

                <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="text-xl font-semibold mb-3">Indexes</h2>
                    <p className="mb-4 text-gray-600">Explore indexes within your buckets for vector operations.</p>
                    <p className="text-sm text-gray-500 italic">Select a bucket first to view its indexes</p>
                </div>

                <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="text-xl font-semibold mb-3">Vectors</h2>
                    <p className="mb-4 text-gray-600">View and analyze vectors stored in your indexes.</p>
                    <p className="text-sm text-gray-500 italic">Select a bucket and index to view vectors</p>
                </div>
            </div>
        </div>
    )
}