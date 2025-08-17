"use client"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Search, PlusCircle, CheckCircle2, LayoutGrid, Calendar, Clock, Check, ChevronLeft, ChevronRight } from "lucide-react"

const requests = [
  { id: "TCK-2025-00005", subject: "Error al iniciar sesión en SSO", application: "SSO", updated: "hace 2h", status: "Abierta" },
  { id: "TCK-2025-00189", subject: "Reporte de pagos incompleto", application: "Pagos", updated: "Ayer", status: "Resuelta" },
  { id: "TCK-2025-00188", subject: "No se cargan métricas", application: "Analytics", updated: "Hace 3 días", status: "Resuelta" },
  { id: "TCK-2025-00085", subject: "Consulta de facturación", application: "Portal Web", updated: "Hace 5 días", status: "Abierta" },
]

export default function MyRequestsPage() {
  return (
    <div className="flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">Mis solicitudes</h1>
      <Link href="/new-request">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nueva solicitud
        </Button>
      </Link>
    </div>
    <Card className="animate-in fade-in-50">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Palabra clave" className="pl-8 w-full" />
            </div>
            <Select>
                <SelectTrigger>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Estado" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="abierta">Abierta</SelectItem>
                    <SelectItem value="resuelta">Resuelta</SelectItem>
                    <SelectItem value="en-progreso">En Progreso</SelectItem>
                </SelectContent>
            </Select>
            <Select>
                <SelectTrigger>
                    <div className="flex items-center gap-2">
                        <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Aplicación" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Portal Web">Portal Web</SelectItem>
                  <SelectItem value="SSO">SSO</SelectItem>
                  <SelectItem value="Pagos">Pagos</SelectItem>
                  <SelectItem value="Analytics">Analytics</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
            </Select>
            <Select>
                <SelectTrigger>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Seleccionar rango de fechas" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="hoy">Hoy</SelectItem>
                    <SelectItem value="ayer">Ayer</SelectItem>
                    <SelectItem value="last-7">Últimos 7 días</SelectItem>
                    <SelectItem value="last-30">Últimos 30 días</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Ticket</TableHead>
              <TableHead>Asunto</TableHead>
              <TableHead>Aplicación</TableHead>
              <TableHead>Actualizado</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.id}</TableCell>
                <TableCell>{request.subject}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal">{request.application}</Badge>
                </TableCell>
                <TableCell>{request.updated}</TableCell>
                <TableCell>
                  <Badge 
                    variant={request.status === 'Resuelta' ? 'success' : 'open'} 
                    className="gap-2 font-normal"
                  >
                    {request.status === 'Abierta' && <Clock className="h-3 w-3" />}
                    {request.status === 'Resuelta' && <Check className="h-3 w-3" />}
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                <Link 
                  href={`/my-requests/${encodeURIComponent(request.id)}?subject=${encodeURIComponent(request.subject)}&application=${encodeURIComponent(request.application)}&status=${encodeURIComponent(request.status)}`}>
                  <Button variant="outline" size="sm">Ver Detalle</Button>
                </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4">
        <span className="text-sm text-muted-foreground">
            Mostrando 1-4 de 24
        </span>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4" />
                <span className="ml-1">Anterior</span>
            </Button>
            <Button variant="outline" size="sm">
                <span className="mr-1">Siguiente</span>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
      </CardFooter>
    </Card>
    </div>
  )
}
