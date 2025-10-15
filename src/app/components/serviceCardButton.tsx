// 'use client'
// import { Button } from "./ui/button";
// import { ArrowRight } from "lucide-react";
// import Link from "next/link";


// // Define the expected props
// interface ServiceCardButtonProps {
//   serviceId: string;
//   serviceName: string;
//   gradient: string;
//   shadow: string;
// }

// // The new Client Component
// export function ServiceCardButton({ 
//     serviceId, 
//     serviceName, 
//     gradient, 
//     shadow
// }: ServiceCardButtonProps) {
//   return (
//     <Link 
//       href={`/book?serviceId=${serviceId}`}
//       className="w-full"
//       passHref
//     >
//       <Button
//         className={`
//           w-full text-white bg-gradient-to-r ${gradient} 
//           hover:shadow-lg ${shadow} transition-all duration-300 group-hover:scale-105
//         `}
//       >
//         Select {serviceName}
//         <ArrowRight className="ml-2 h-4 w-4" />
//       </Button>
//     </Link>
//   );
// }