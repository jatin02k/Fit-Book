import { AppointmentList, fetchAdminBookings } from "@/app/api/admin/appointments/route";
import { FilteredDashboard } from "@/app/(public)/components/FilteredDashboard";

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