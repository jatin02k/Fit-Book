import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-3xl mx-auto px-4 text-center">
        
        <h1 className="text-4xl font-bold text-gray-800 mb-12">Contact Us</h1>
        
        <div className="flex flex-col items-center space-y-8 text-xl text-gray-600">
          
          {/* Address */}
          <div className="flex items-center space-x-4">
            <MapPin className="h-6 w-6 text-red-500" />
            <p className="text-gray-700">123 Fitness Street, Health City, HC 12345</p>
          </div>
          
          {/* Phone */}
          <div className="flex items-center space-x-4">
            <Phone className="h-6 w-6 text-blue-500" />
            <p className="text-gray-700">(555) 123-4567</p>
          </div>
          
          {/* Email */}
          <div className="flex items-center space-x-4">
            <Mail className="h-6 w-6 text-orange-500" />
            <a href="mailto:info@fitbook.com" className="text-blue-600 hover:underline">
              info@fitbook.com
            </a>
          </div>
          
          {/* Business Hours */}
          <div className="flex flex-col items-center pt-4 border-t border-gray-200 w-full">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-6 w-6 text-green-500" />
              <p className="text-gray-700 font-semibold">Business Hours</p>
            </div>
            <p className="text-base text-gray-600">
              <span className="font-medium">Mon-Fri:</span> 6AM-10PM 
              <span className="mx-2">|</span> 
              <span className="font-medium">Sat-Sun:</span> 7AM-8PM
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}