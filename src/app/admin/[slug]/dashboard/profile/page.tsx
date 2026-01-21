import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { User, Mail, Building, CreditCard, Calendar, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { BusinessDetailsForm } from "@/app/components/dashboard/BusinessDetailsForm";

interface ProfilePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const supabase = await createClient();
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // 1. Get User
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  // 2. Get Organization & Subscription Details
  const { data: org } = await supabase
    .from("organizations")
    .select("id, name, email, phone, slug, subscription_status, subscription_id, qr_code_url")
    .eq("owner_id", user.id)
    .single();

  if (!org) return <div>Organization not found</div>;

  const isActive = org.subscription_status === 'active';

  return (
    <div className="p-4 md:p-8 md:ml-64 mt-16 md:mt-0 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile & Settings</h1>
          <p className="text-gray-500">Manage your personal and business information.</p>
        </div>

        {/* 1. Admin Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
           <div className="border-b px-6 py-4 bg-gray-50/50 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-500" />
              <h2 className="font-semibold text-gray-700">Admin Details</h2>
           </div>
           <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                 <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                 <div className="flex items-center gap-2 text-gray-900">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {user.email}
                 </div>
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-500 mb-1">User ID</label>
                 <div className="font-mono text-xs bg-gray-100 p-2 rounded inline-block text-gray-600">
                    {user.id}
                 </div>
              </div>
           </div>
        </div>

        {/* 2. Business Details (Editable) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
           <div className="border-b px-6 py-4 bg-gray-50/50 flex items-center gap-2">
              <Building className="w-5 h-5 text-gray-500" />
              <h2 className="font-semibold text-gray-700">Business Profile</h2>
           </div>
           
           <BusinessDetailsForm 
              initialName={org.name}
              initialPhone={org.phone || ''}
            //   initialQrCode={org.qr_code_url}
              orgId={org.id}
              slug={org.slug}
           />
        </div>

        {/* 3. Subscription Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
           
           {!isActive && (
              <div className="absolute top-10 right-0 p-6 pointer-events-none">
                  <div className="opacity-10">
                    <AlertCircle className="w-32 h-32 text-red-500" />
                  </div>
              </div>
           )}

           <div className="border-b px-6 py-4 bg-gray-50/50 flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gray-500" />
                <h2 className="font-semibold text-gray-700">Subscription Status</h2>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                 {isActive ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                 {isActive ? 'ACTIVE PLAN' : 'INACTIVE'}
              </div>
           </div>
           <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <div>
                 <label className="block text-sm font-medium text-gray-500 mb-1">Current Plan</label>
                 <div className="font-medium text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    Pro Plan (₹999/month)
                 </div>
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-500 mb-1">Subscription ID</label>
                 <div className="font-mono text-sm text-gray-600">{org.subscription_id || 'N/A'}</div>
              </div>
              
              <div className="col-span-2 mt-2">
                {isActive ? (
                    <Button variant="outline" className="text-gray-600" disabled>
                        Manage Subscription
                    </Button>
                ) : (
                    <a href={`/app/${org.slug}/admin/dashboard/subscription`}>
                        <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0">
                            Upgrade Now
                        </Button>
                    </a>
                )}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
