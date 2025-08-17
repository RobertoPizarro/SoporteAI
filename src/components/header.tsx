"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, LogOut } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"

const navItems = [
    { label: "Inicio", href: "/" },
    { label: "Nueva Solicitud", href: "/new-request" },
    { label: "Mis Solicitudes", href: "/my-requests" },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="flex items-center h-20 px-4 md:px-8 bg-card border-b">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <Icons.logo className="h-6 w-6 text-foreground" />
            <span className="font-bold font-headline text-lg">SoporteAI</span>
        </Link>
        <nav className="flex-1 flex justify-center">
            <div className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-8">
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "transition-colors text-base font-medium",
                        pathname === item.href ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    {pathname === item.href ? (
                        <Button size="sm" className="px-4 py-2 h-auto">
                            {item.label}
                        </Button>
                    ) : (
                        <span>{item.label}</span>
                    )}
                </Link>
            ))}
            </div>
        </nav>
        <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <User className="h-4 w-4" />
                  Juan Pérez
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                 <Link href="/login">
                    <DropdownMenuItem>
                        <LogOut className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                 </Link>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </header>
  )
}
