'use client'
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

// Define the expected props
interface ServiceCardButtonProps {
  serviceId: string;
  serviceName: string;
  gradient: string;
  shadow: string;
  onSelectService: (serviceId: string) => void;
}

// The new Client Component
export function ServiceCardButton({ 
    serviceId, 
    serviceName, 
    gradient, 
    shadow, 
    onSelectService 
}: ServiceCardButtonProps) {
  return (
    <Button 
      onClick={() => onSelectService(serviceId)}
      className={`w-full bg-gradient-to-r ${gradient} text-white hover:shadow-lg ${shadow} transition-all duration-300 group-hover:scale-105`}
    >
      Select {serviceName}
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  );
}