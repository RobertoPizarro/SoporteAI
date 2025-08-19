"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, Eye, LogIn } from "lucide-react"
import Header from "@/components/headerLogin";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
        <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm mx-auto shadow-lg rounded-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">Accede a tu cuenta</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-2 relative">
              <Label htmlFor="email">Correo corporativo</Label>
              <Mail className="absolute right-3 top-8 h-5 w-5 text-muted-foreground" />
              <Input id="email" type="email" placeholder="nombre@empresa.com" required className="pl-4 pr-10" />
            </div>
            <div className="grid gap-2 relative">
              <Label htmlFor="password">Contraseña</Label>
              <Eye className="absolute right-3 top-8 h-5 w-5 text-muted-foreground" />
              <Input id="password" type="password" required defaultValue="password" className="pl-4 pr-10" />
            </div>
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember" className="font-normal">Mantener sesión iniciada</Label>
                </div>
            </div>
            <Link href="/" passHref>
                <Button className="w-full">
                    <LogIn className="mr-2 h-4 w-4" />
                    Iniciar sesión
                </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
