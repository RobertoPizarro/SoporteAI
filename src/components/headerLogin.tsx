"use client"

import Link from "next/link"
import { Icons } from "@/components/icons"

export default function Header() {
  return (
    <header className="flex items-center h-20 px-4 md:px-8 bg-card border-b">
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
        <Icons.logo className="h-6 w-6 text-foreground" />
        <span className="font-bold font-headline text-lg">SoporteAI</span>
      </Link>
    </header>
  )
}