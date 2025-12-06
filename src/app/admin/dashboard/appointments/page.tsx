import { FilteredDashboard } from "@/app/components/FilteredDashboard";
import { AppointmentList, fetchAdminBookings } from "@/lib/fetchAdminBookings";

export default async function AppointmentsPage() {
  
  let appointmentsList: AppointmentList[] = [];
  
  try {
    appointmentsList = await fetchAdminBookings();
    
  } catch (error) {
    console.log("Failed to load appointments for dashboard:", error);
  }
  console.log('appointmentsL:',appointmentsList)
  return (
    <FilteredDashboard appointmentsList={appointmentsList} />
  );
}