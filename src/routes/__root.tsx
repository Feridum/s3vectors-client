import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
    component: () => (
        <>
            <nav className="bg-gray-800 text-white p-4">
                <div className="container mx-auto flex gap-6">
                    <Link to="/" className="hover:text-gray-300 [&.active]:font-bold">
                        Home
                    </Link>
                    <Link to="/buckets" search={{region: undefined}} className="hover:text-gray-300 [&.active]:font-bold">
                        Buckets
                    </Link>
                </div>
            </nav>
            <main className="container mx-auto pt-4">
                <Outlet />
            </main>
            <TanStackRouterDevtools />
        </>
    ),
})