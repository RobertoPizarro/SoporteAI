"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6">
        <div className="flex items-center gap-2">
          <Icons.logo className="h-6 w-6 text-primary" />
          <span className="font-semibold text-xl font-headline">SoporteAI</span>
        </div>
        <div className="ml-auto">
          <p className="text-lg font-medium font-headline">Welcome</p>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Log In</CardTitle>
            <CardDescription>
              Enter your corporate email below to log in to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Corporate Email</Label>
              <Input id="email" type="email" placeholder="name@company.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <Link href="/" passHref>
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Log In</Button>
            </Link>
            <div className="mt-4 text-center text-sm">
              <Link href="#" className="underline text-primary">
                Forgot your password?
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
