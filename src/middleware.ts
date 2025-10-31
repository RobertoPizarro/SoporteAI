import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Puedes agregar lógica adicional aquí si necesitas
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Si hay token, está autenticado
        return !!token;
      },
    },
  }
);

// Especifica qué rutas proteger
export const config = {
  matcher: [
    // Solo proteger los dashboards específicos, no las páginas de login
    "/user/dashboard/:path*",
    "/analyst/dashboard/:path*", 
    "/admin/dashboard/:path*",
  ],
};
