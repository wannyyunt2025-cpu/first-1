import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Home } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function FloatingHomeButton() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)

  const shouldAlwaysShow = useMemo(() => location.pathname !== "/", [location.pathname])

  useEffect(() => {
    const onScroll = () => {
      const threshold = window.innerHeight * 0.9
      setIsVisible(window.scrollY > threshold)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const show = shouldAlwaysShow || isVisible

  const handleClick = () => {
    if (location.pathname !== "/") {
      navigate("/")
      return
    }

    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-[90] transition-all duration-200 ease-out sm:bottom-24",
        show ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-2"
      )}
    >
      <Button
        type="button"
        size="icon"
        aria-label="返回首页"
        onClick={handleClick}
        className="shadow-lg"
      >
        <Home className="h-5 w-5" />
      </Button>
    </div>
  )
}

