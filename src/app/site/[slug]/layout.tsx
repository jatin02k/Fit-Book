import Navigation from "@/app/components/navigation";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen">
      {/* The Navigation Bar is rendered first for all public routes */}
      <Navigation />
      
      {/* The main content (pages like /, /services, /bookings) is wrapped here.
        The 'pt-16' padding shifts the content down to prevent it from being hidden
        under the fixed-height Navbar.
      */}
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}