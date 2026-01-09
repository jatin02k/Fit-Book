import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { StaffSidebar } from "@/app/components/StaffSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
  params: { slug: string };
}

export default async function AdminLayout({ children, params }: AdminLayoutProps) {
  const supabase = await createClient();
  const { slug } = await params;
  
  // 1. Get User
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/admin/login");

  // 2. Get User's Organization
  const { data: org } = await supabase
    .from("organizations")
    .select("slug")
    .eq("owner_id", user.id)
    .single();

  if (!org) {
     return <div>Error: No Organization found for this user.</div>;
  }

  // 3. Strict Check: Does URL Slug match User's Org Slug?
  if (slug !== org.slug) {
      // Wrong Tenant! Redirect to their own dashboard.
      const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
      const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
      const correctUrl = `${protocol}://${org.slug}.${rootDomain}/admin/dashboard`;
      
      console.log(`Mismatch! URL: ${slug}, Org: ${org.slug}. Redirecting to ${correctUrl}`);
      redirect(correctUrl);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <StaffSidebar slug={org.slug} /> 
      
      <main className="pt-16 p-4">
        {children}
      </main>
    </div>
  );
}