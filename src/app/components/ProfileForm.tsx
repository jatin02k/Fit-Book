'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/app/components/ui/button";
import { updateOrganization } from '@/app/actions/updateOrganization';
import { Loader2, Save, Copy, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProfileFormProps {
  initialData: {
    id: string;
    name: string;
    email: string;
    phone: string;
    slug: string;
  };
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [origin, setOrigin] = useState('');
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await updateOrganization(formData);
    
    if (result.error) {
      alert(result.error);
    } else {
      alert("Profile updated successfully!");
      router.refresh();
    }
    setLoading(false);
  }

  const fullUrl = `${origin}/app/${initialData.slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <form action={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
         <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
         <input 
            type="text" 
            name="name" 
            defaultValue={initialData.name}
            className="w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
         />
      </div>
      <div>
         <label className="block text-sm font-medium text-gray-700 mb-1">Public Booking Page</label>
         <div className="flex items-center gap-2">
            <div className="flex-1 text-gray-500 bg-gray-50 px-3 py-2 rounded-md text-sm border border-gray-200 overflow-hidden text-ellipsis whitespace-nowrap">
               {origin ? fullUrl : `/app/${initialData.slug}`}
            </div>
            <Button 
                type="button" 
                variant="outline" 
                size="icon"
                onClick={handleCopy}
                title="Copy Link"
            >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
            </Button>
         </div>
      </div>
      <div>
         <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
         <input 
            type="email" 
            name="email" 
            defaultValue={initialData.email}
            className="w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
         />
      </div>
      <div>
         <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
         <input 
            type="tel" 
            name="phone" 
            defaultValue={initialData.phone}
            className="w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
         />
      </div>

      <div className="col-span-2 pt-4 border-t border-gray-100 flex justify-end">
        <Button 
            type="submit" 
            disabled={loading}
            className="bg-gray-900 hover:bg-gray-800 text-white"
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
        </Button>
      </div>
    </form>
  );
}
