import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MapPin, ArrowRightLeft } from "lucide-react"

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Land Services</span>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant={pathname === "/my-land" ? "default" : "ghost"} asChild>
              <Link href="/my-land" className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>My Land</span>
              </Link>
            </Button>

            <Button variant={pathname === "/transfers" ? "default" : "ghost"} asChild>
              <Link href="/transfers" className="flex items-center space-x-2">
                <ArrowRightLeft className="h-4 w-4" />
                <span>Transfers</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
