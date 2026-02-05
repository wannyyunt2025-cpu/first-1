import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProjectDetail from "./pages/project/ProjectDetail";
import Admin from "./pages/admin";
import Login from "./pages/login";
import Retro from "./pages/Retro";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AppShell } from "./components/layout/AppShell";

export const routers = [
    {
      path: "/",
      element: <AppShell />,
      children: [
        {
          index: true,
          name: 'home',
          element: <Index />,
        },
        {
          path: "project/:id",
          name: 'project-detail',
          element: <ProjectDetail />,
        },
        {
          path: "retro",
          name: 'project-retro',
          element: <Retro />,
        },
        {
          path: "login",
          name: 'login',
          element: <Login />,
        },
        {
          path: "admin",
          name: 'admin',
          element: (
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          ),
        },
        /* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */
        {
          path: "*",
          name: '404',
          element: <NotFound />,
        },
      ],
    },
];

declare global {
  interface Window {
    __routers__: typeof routers;
  }
}

window.__routers__ = routers;
