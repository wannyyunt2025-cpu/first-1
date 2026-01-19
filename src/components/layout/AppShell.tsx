import { Outlet } from "react-router-dom"

import { FloatingHomeButton } from "@/components/layout/FloatingHomeButton"

export function AppShell() {
  return (
    <>
      <Outlet />
      <FloatingHomeButton />
    </>
  )
}

