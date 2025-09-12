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
    "/user/:path*",
    "/analyst/:path*",
    // Excluye las páginas de login
    "/((?!api|_next/static|_next/image|favicon.ico|analyst/login|user/login|$).*)",
  ],
};
