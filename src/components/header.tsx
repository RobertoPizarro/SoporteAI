"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, LifeBuoy, LogOut, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/icons"

const navItems = [
    { label: "Inicio", href: "/" },
    { label: "Nueva Solicitud", href: "/new-request" },
    { label: "Mis Solicitudes", href: "/my-requests" },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 z-50">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Icons.logo className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline">SoporteAI</span>
        </Link>
        {navItems.map((item) => (
            <Link
                key={item.href}
                href={item.href}
                className={cn(
                    "transition-colors hover:text-foreground",
                    pathname === item.href ? "text-foreground" : "text-muted-foreground"
                )}
            >
                {item.label}
            </Link>
        ))}
      </nav>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border-2 border-primary">
                <AvatarImage src="https://placehold.co/100x100.png" alt="@juanperez" data-ai-hint="profile person" />
                <AvatarFallback>JP</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Juan Pérez</p>
                <p className="text-xs leading-none text-muted-foreground">
                  juan.perez@company.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4 text-primary" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4 text-primary" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LifeBuoy className="mr-2 h-4 w-4 text-primary" />
                <span>Support</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <Link href="/login">
                <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4 text-primary" />
                <span>Log out</span>
                </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
