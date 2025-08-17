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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { ListFilter, Search } from "lucide-react"

const requests = [
  { id: "TKT-001", subject: "Problema de acceso a la VPN", status: "In Progress", updated: "Hace 2 horas" },
  { id: "TKT-002", subject: "Fallo en la impresora de la oficina", status: "In Progress", updated: "Hace 1 día" },
  { id: "TKT-003", subject: "No puedo acceder a mi correo electrónico", status: "New", updated: "Hace 2 días" },
  { id: "TKT-000", subject: "Solicitud de nuevo monitor", status: "Resolved", updated: "Hace 1 semana" },
]

export default function MyRequestsPage() {
  return (
    <Card className="animate-in fade-in-50">
      <CardHeader>
        <CardTitle className="font-headline">Mis Solicitudes</CardTitle>
        <CardDescription>
          Aquí puedes ver y gestionar todas tus solicitudes de soporte.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4 mb-4">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por asunto..." className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]" />
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-1">
                        <ListFilter className="h-3.5 w-3.5" />
                        <span className="sm:whitespace-nowrap">
                            Filtrar
                        </span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filtrar por estado</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Todos</DropdownMenuItem>
                    <DropdownMenuItem>New</DropdownMenuItem>
                    <DropdownMenuItem>In Progress</DropdownMenuItem>
                    <DropdownMenuItem>Resolved</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Ticket N°</TableHead>
              <TableHead>Asunto</TableHead>
              <TableHead className="w-[120px]">Estado</TableHead>
              <TableHead className="w-[180px]">Última Actualización</TableHead>
              <TableHead className="w-[120px]">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.id}</TableCell>
                <TableCell>{request.subject}</TableCell>
                <TableCell>
                  <Badge variant={
                      request.status === 'Resolved' ? 'default' : 
                      request.status === 'In Progress' ? 'secondary' : 'destructive'
                  } className="text-xs">{request.status}</Badge>
                </TableCell>
                <TableCell>{request.updated}</TableCell>
                <TableCell>
                  <Link href={`/my-requests/${request.id}`}>
                    <Button variant="outline" size="sm">Ver Detalles</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </CardContent>
    </Card>
  )
}
