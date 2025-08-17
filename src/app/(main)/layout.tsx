import Header from "@/components/header";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col p-4 md:p-8">
        {children}
      </main>
    </div>
  )
}
