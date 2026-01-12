'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/app/components/ui/button';
import { Sparkles, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';

interface SubscriptionPageProps {
  params: Promise<{ slug: string }>;
}

export default function SubscriptionPage({ params }: SubscriptionPageProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  
  // Unwrap params safely
  const [slug, setSlug] = useState<string>('');

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    
    async function fetchStatus() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: org } = await supabase
        .from('organizations')
        .select('subscription_status')
        .eq('slug', slug)
        .single();

      if (org) {
        setStatus(org.subscription_status || 'inactive');
      }
      setLoading(false);
    }
    fetchStatus();
  }, [slug, supabase]);

  const handleSubscribe = async () => {
    setProcessing(true);
    try {
      const response = await fetch('/api/admin/subscription/create', { method: 'POST' });
      const data = await response.json();

      if (data.error) {
        alert(data.error);
        setProcessing(false);
        return;
      }

      const options = {
        key: data.key_id,
        subscription_id: data.subscription_id,
        name: "Appointor Premium",
        description: "Monthly Subscription",
        handler: async function (response: any) {
             // Payment successful
             // We can optimistically set status or reload
             setStatus('active');
             alert('Subscription successful!');
             router.refresh();
        },
        prefill: {
          name: "FitBook Owner",
          email: "owner@example.com", // Ideally fetch from user
          contact: ""
        },
        theme: {
          color: "#F37254"
        },
        modal: {
          ondismiss: function() {
            setProcessing(false);
          }
        }
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.on('payment.failed', function (response: any){
              alert(response.error.description);
              setProcessing(false);
      });
      rzp1.open();

    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  const isActive = status === 'active';

  return (
    <div className="p-4 md:p-8 md:ml-64 mt-16 md:mt-0 min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div className="w-full max-w-5xl mx-auto">
        <div className="text-center mb-12">
           <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Upgrade to <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Pro</span>
           </h1>
           <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Unlock the full potential of Appointor. Unlimited bookings, advanced appointments management, and premium support.
           </p>
        </div>

        {/* Current Status Banner (only if active) */}
        {isActive && (
           <div className="mb-8 flex justify-center">
             <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium border border-green-200 shadow-sm animate-in fade-in slide-in-from-bottom-4">
               <CheckCircle className="w-4 h-4 mr-2" />
               Your Pro Plan is Active
             </div>
           </div>
        )}

        {/* Pricing Card */}
        <div className="relative w-full max-w-md mx-auto">
             {/* Glow Effect */}
             <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
             
             <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-8 bg-gray-900 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                       <Sparkles className="w-32 h-32" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 relative z-10">Pro Plan</h3>
                    <div className="flex justify-center items-baseline mb-1 relative z-10">
                       <span className="text-5xl font-extrabold tracking-tight">₹999</span>
                       <span className="text-lg text-gray-400 ml-2">/month</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-2 relative z-10">All-inclusive pricing. No hidden fees.</p>
                </div>

                {/* Features */}
                <div className="p-8 flex-1 bg-white">
                   <ul className="space-y-4 mb-8">
                     {[
                       "Unlimited Services & Appointments",
                       "Advanced Appointment Management",
                       "Public Customer Booking Page",
                       "Manual Booking",
                       "Email reminders and confirmations",
                       "Priority Technical Support"
                     ].map((feature, i) => (
                       <li key={i} className="flex items-start">
                          <CheckCircle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                       </li>
                     ))}
                   </ul>

                   {!isActive && (
                     <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6 rounded-r-md">
                        <p className="text-sm text-orange-800">
                           <span className="font-bold">Note:</span> Your subscription is currently inactive. Subscribe now to access all features.
                        </p>
                     </div>
                   )}
                   
                   {isActive ? (
                      <Button className="w-full py-6 text-lg bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 shadow-none cursor-default font-semibold">
                         <div className="flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                            Currently Active
                         </div>
                      </Button>
                   ) : (
                      <Button 
                        onClick={handleSubscribe} 
                        disabled={processing}
                        className="w-full py-7 text-lg bg-gradient-to-r from-gray-900 to-black hover:from-orange-600 hover:to-pink-600 text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] transform transition-all duration-300 rounded-xl"
                      >
                        {processing ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />}
                        Subscribe Now
                      </Button>
                   )}
                   
                   <p className="text-xs text-center text-gray-400 mt-4">
                      Secure payment via Razorpay. Cancel anytime.
                   </p>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
}
