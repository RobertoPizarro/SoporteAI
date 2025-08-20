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
import { useState } from "react"

const requests = [
  { id: "TCK-2025-00005", subject: "Error al iniciar sesión en SSO", application: "SSO", updated: "hace 2h", status: "Abierta" },
  { id: "TCK-2025-00189", subject: "Reporte de pagos incompleto", application: "Pagos", updated: "Ayer", status: "Resuelta" },
  { id: "TCK-2025-00188", subject: "No se cargan métricas", application: "Analytics", updated: "Hace 3 días", status: "Resuelta" },
  { id: "TCK-2025-00085", subject: "Consulta de facturación", application: "Portal Web", updated: "Hace 5 días", status: "Abierta" },
]

const itemsPerPage = 4
const totalItems = 24

export default function MyRequestsPage() {
  const [page, setPage] = useState(1)

  const start = (page - 1) * itemsPerPage
  const end = start + itemsPerPage
  const paginatedRequests = requests

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const handlePrev = () => setPage((prev) => (prev > 1 ? prev - 1 : prev))
  const handleNext = () => setPage((prev) => (prev < totalPages ? prev + 1 : prev))

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
                <Input placeholder="Buscar por Asunto" className="pl-8 w-full" />
            </div>
            <Select>
                <SelectTrigger>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Estado" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todas" className="hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white">Todas</SelectItem>
                    <SelectItem value="abierta" className="hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white">Abierta</SelectItem>
                    <SelectItem value="resuelta" className="hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white">Resuelta</SelectItem>
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
                <SelectItem value="Todas" className="hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white">Todas</SelectItem>
                  <SelectItem value="Portal Web" className="hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white">Portal Web</SelectItem>
                  <SelectItem value="SSO" className="hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white">SSO</SelectItem>
                  <SelectItem value="Pagos" className="hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white">Pagos</SelectItem>
                  <SelectItem value="Analytics" className="hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white">Analytics</SelectItem>
                  <SelectItem value="Otro" className="hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white">Otro</SelectItem>
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
                    <SelectItem value="hoy" className="hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white">Hoy</SelectItem>
                    <SelectItem value="ayer" className="hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white">Ayer</SelectItem>
                    <SelectItem value="last-7" className="hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white">Últimos 7 días</SelectItem>
                    <SelectItem value="last-30" className="hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white">Últimos 30 días</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Ticket</TableHead>
              <TableHead>Asunto</TableHead>
              <TableHead className="text-center">Aplicación</TableHead>
              <TableHead className="text-center">Actualizado</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRequests.map((request) => (
              <TableRow key={`${request.id}-${page}`}>
                <TableCell className="font-medium">{request.id}</TableCell>
                <TableCell>{request.subject}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className="font-normal">{request.application}</Badge>
                </TableCell>
                <TableCell className="text-center" >{request.updated}</TableCell>
                <TableCell className="text-center">
                  <Badge 
                    variant={request.status === 'Resuelta' ? 'success' : 'open'} 
                    className="gap-2 font-normal"
                  >
                    {request.status === 'Abierta' && <Clock className="h-3 w-3" />}
                    {request.status === 'Resuelta' && <Check className="h-3 w-3" />}
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                <Link 
                  href={`/my-requests/${encodeURIComponent(request.id)}?subject=${encodeURIComponent(request.subject)}&application=${encodeURIComponent(request.application)}&status=${encodeURIComponent(request.status)}`}>
                  <Button variant="outline" size="sm" className="!bg-white !text-black cursor-pointer">Ver Detalle</Button>
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
          Mostrando {(page - 1) * itemsPerPage + 1}-
          {Math.min(page * itemsPerPage, totalItems)} de {totalItems}
        </span>
        <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrev}
          disabled={page === 1}
          className="!bg-white !text-black"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="ml-1">Anterior</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={page === totalPages}
          className="!bg-white !text-black"
        >
          <span className="mr-1">Siguiente</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
        </div>
      </CardFooter>
    </Card>
    </div>
  )
}
