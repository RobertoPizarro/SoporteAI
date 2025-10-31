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
    // Solo proteger los dashboards de NextAuth (user y analyst)
    // Las rutas de admin usan su propia autenticación hardcodeada
    "/user/dashboard/:path*",
    "/analyst/dashboard/:path*",
  ],
};
