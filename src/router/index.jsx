import { createBrowserRouter } from "react-router-dom"
import { Suspense, lazy } from "react"
import Layout from "@/components/organisms/Layout"
import Root from "@/layouts/Root"

const Home = lazy(() => import("@/components/pages/Home"))
const Playlists = lazy(() => import("@/components/pages/Playlists"))
const LikedSongs = lazy(() => import("@/components/pages/LikedSongs"))
const Following = lazy(() => import("@/components/pages/Following"))
const PlaylistDetail = lazy(() => import("@/components/pages/PlaylistDetail"))
const NotFound = lazy(() => import("@/components/pages/NotFound"))
const Login = lazy(() => import("@/components/pages/Login"))
const Signup = lazy(() => import("@/components/pages/Signup"))
const Callback = lazy(() => import("@/components/pages/Callback"))
const ErrorPage = lazy(() => import("@/components/pages/ErrorPage"))
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-surface">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>
)

const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Home />
      </Suspense>
    )
  },
  {
    path: "playlists",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Playlists />
      </Suspense>
    )
  },
  {
    path: "playlists/:id",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <PlaylistDetail />
      </Suspense>
    )
  },
  {
    path: "liked-songs",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <LikedSongs />
      </Suspense>
    )
  },
  {
    path: "following",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Following />
      </Suspense>
    )
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <NotFound />
      </Suspense>
    )
  }
]

const authRoutes = [
  {
    path: "login",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Login />
      </Suspense>
    )
  },
  {
    path: "signup",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Signup />
      </Suspense>
    )
  },
  {
    path: "callback",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Callback />
      </Suspense>
    )
  },
  {
    path: "error",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ErrorPage />
      </Suspense>
    )
  }
]

const routes = [
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: mainRoutes
      },
      ...authRoutes
    ]
  }
]
export const router = createBrowserRouter(routes)