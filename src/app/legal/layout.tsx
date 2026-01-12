import { LandingHeader } from "@/app/components/LandingHeader";
import { LandingFooter } from "@/app/components/LandingFooter";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <LandingHeader />
      <main className="flex-grow pt-24 pb-12">
         {/* Container for legal content */}
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
               {children}
            </div>
         </div>
      </main>
      <LandingFooter />
    </div>
  );
}
