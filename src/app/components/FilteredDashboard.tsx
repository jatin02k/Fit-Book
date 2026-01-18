"use client";

import { useState, useMemo } from "react";
// Import all necessary UI components (Card, Table, Button, Select, etc.)
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { List, User, Clock, X, Filter, CalendarIcon, Mail } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { AppointmentList } from "@/lib/fetchAdminBookings";

interface FilteredDashboardProps {
  appointmentsList: AppointmentList[];
  services: string[];
}

const formatDateTime = (startTime: string) => {
  const date = new Date(startTime);
  return {
    date: date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
  };
};

const getServiceColor = (service: string) => {
  // Simple hashing or cyclical selection for consistent colors could be better,
  // but for now, let's keep it simple or default to gray/blue.
  // We can't easily switch on dynamic strings without a known list.
  return "bg-blue-100 text-blue-800";
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "canceled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function FilteredDashboard({
  appointmentsList,
  services,
}: FilteredDashboardProps) {
  const [appointments, setAppointments] = useState(appointmentsList);
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isDefaultView, setIsDefaultView] = useState(true);

  const handleToggleStatus = async (appointmentId: string, currentStatus: string) => {
  // 1. Toggle logic (e.g., if pending -> confirmed, if confirmed -> pending)
  const nextStatus = currentStatus === "pending" ? "confirmed" : "pending";

  // 2. Optimistic Update (update UI immediately)
  const previousAppointments = [...appointments]; // Keep backup for rollback
  setAppointments((prev) =>
    prev.map((apt) =>
      apt.id === appointmentId ? { ...apt, status: nextStatus } : apt
    )
  );

  try {
    // 3. Update Backend
    const response = await fetch("/api/admin/appointments", {
      method: "PATCH", // Using PATCH for updates
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: appointmentId, status: nextStatus }),
    });

    if (!response.ok) throw new Error("Failed to update status");
    
    console.log(`Appointment ${appointmentId} set to ${nextStatus}`);
  } catch (error) {
    console.error(error);
    // 4. Rollback UI if the database update fails
    setAppointments(previousAppointments);
    alert("Could not update status. Please try again.");
  }
};
  
  const handleCancelAppointment = async (appointmentId: string) => {
    setAppointments(appointments.filter((apt) => apt.id !== appointmentId));
    // TODO: Add actual API call here to notify the backend/Supabase
    const response = await fetch("/api/admin/appointments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: appointmentId }),
    });
    if (response.status === 204) {
      console.log(`Appointment ${appointmentId} successfully cancelled.`);
    } else {
      let errorMessage = "Failed to cancel Appointment (Unknown error).";

      // ONLY attempt to read JSON if status is something that might contain a body (e.g., 400, 500)
      if (response.headers.get("content-type")?.includes("application/json")) {
        try {
          const errorBody = await response.json();
          errorMessage = errorBody.error || errorMessage;
        } catch (e) {
          // If parsing fails (i.e., it was HTML), fall back to a generic message
          errorMessage = `Server returned an invalid response (Status: ${response.status}).`;
          console.error("Could not parse error response body:", e);
        }
      } else {
        // If the response is not JSON (i.e., an HTML error page)
        errorMessage = `Server returned a generic error page (Status: ${response.status}).`;
      }

      throw new Error(errorMessage);
    }
  };

  const { sortedAppointments, upcomingCount, confirmedCount, pendingCount } =
    useMemo(() => {
      // Define the start of today for consistent filtering and counting
      const now = new Date();
      const startOfToday = new Date(now);
      startOfToday.setHours(0, 0, 0, 0); // Set time to 00:00:00.000 today
      const startOfTodayMs = startOfToday.getTime();

      // 1. Base filter on service and status
      let filtered = appointments.filter((appointment) => {
        const serviceMatch =
          serviceFilter === "all" || appointment.serviceName === serviceFilter;
        const statusMatch =
          statusFilter === "all" || appointment.status === statusFilter;
        return serviceMatch && statusMatch;
      });

      // 2. Apply Date Range Filter (including default "Today and Upcoming" view)
      if (isDefaultView || (!dateRange?.from && !dateRange?.to)) {
        filtered = filtered.filter(
          (apt) => new Date(apt.start_time).getTime() >= startOfTodayMs
        );
      } else if (dateRange?.from) {
        const filterStart = new Date(dateRange.from);
        filterStart.setHours(0, 0, 0, 0);

        const filterEnd = dateRange.to
          ? new Date(dateRange.to)
          : new Date(dateRange.from);
        filterEnd.setHours(23, 59, 59, 999);

        const filterStartMs = filterStart.getTime();
        const filterEndMs = filterEnd.getTime();

        filtered = filtered.filter((apt) => {
          const aptTime = new Date(apt.start_time).getTime();
          return aptTime >= filterStartMs && aptTime <= filterEndMs;
        });
      }

      // 3. Sort the final filtered list
      const sorted = filtered.sort((a, b) => {
        return (
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        );
      });

      // 4. Recalculate counts based on the FULL appointments list
      // The Upcoming count also uses the new "Start of Today" logic for consistency
      const upcoming = appointments.filter(
        (apt) => new Date(apt.start_time).getTime() >= startOfTodayMs
      ).length;

      const confirmed = appointments.filter(
        (apt) => apt.status === "confirmed"
      ).length;
      const pending = appointments.filter(
        (apt) => apt.status === "pending"
      ).length;

      return {
        sortedAppointments: sorted,
        upcomingCount: upcoming,
        confirmedCount: confirmed,
        pendingCount: pending,
      };
    }, [appointments, serviceFilter, statusFilter, dateRange, isDefaultView]);

  return (
    <div className="md:ml-64 p-4 md:p-8 md:mt-0 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl text-black mb-2">Upcoming Appointments</h1>
          <p className="text-gray-600">
            View and manage all scheduled appointments
          </p>
        </div>

        {/* Quick Stats Block (The component on the top of the image) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <CalendarIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Upcoming</p>
                  <p className="text-2xl text-black">{upcomingCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <User className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Confirmed</p>
                  <p className="text-2xl text-black">{confirmedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl text-black">{pendingCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2 self-start md:self-center">
                <List className="h-5 w-5" />
                All Appointments
              </CardTitle>
              {/* Filter Selects */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Filter className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <Select
                    value={serviceFilter}
                    onValueChange={setServiceFilter}
                  >
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue placeholder="Filter by service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Services</SelectItem>
                      {services.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div >
                <div className="flex items-center gap-2 w-full md:w-auto">

                <Filter className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                </div>
                {/* Date Range Filter */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <CalendarIcon className=" h-4 w-4 text-gray-500 flex-shrink-0 " />

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                          "w-3/4 md:w-[250px] justify-start text-left font-normal",
                          !dateRange && "text-muted-foreground"
                        )}
                      >
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "LLL dd, y")} -{" "}
                              {format(dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Date Range Filter</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-fit sm:w-[500px] p-0"
                      align="end"
                    >
                      <Calendar
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={(range) => {
                          setDateRange(range);
                          setIsDefaultView(false);
                        }}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                  {/* Optional: Clear Button for the filter */}
                  {dateRange && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setDateRange(undefined); // Clear range
                        setIsDefaultView(true); // Return to default upcoming view
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Mobile View: Cards */}
            <div className="md:hidden space-y-4">
               {sortedAppointments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                     No appointments found.
                  </div>
               ) : (
                  sortedAppointments.map((appointment) => {
                     const { date, time } = formatDateTime(appointment.start_time);
                     return (
                        <div key={appointment.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-3">
                           <div className="flex justify-between items-start">
                              <div>
                                 <p className="font-semibold text-black">{appointment.customerName}</p>
                                 <p className="text-sm text-gray-500">{appointment.serviceName}</p>
                              </div>
                              <Badge className={getStatusColor(appointment.status)}>
                                 {appointment.status}
                              </Badge>
                           </div>
                           
                           <div className="flex items-center gap-2 text-sm text-gray-600">
                              <CalendarIcon className="w-4 h-4" />
                              <span>{date} at {time}</span>
                           </div>
                           
                           <div className="text-sm text-gray-600 space-y-1 pt-2 border-t border-gray-100">
                              <div className="flex items-center gap-2">
                                <Mail className="w-3 h-3" /> {appointment.email}
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="w-3 h-3" /> {appointment.phone_number}
                              </div>
                           </div>

                           <div className="pt-2 flex justify-end gap-2 flex-wrap">
                              {/* Mobile Actions */}
                              <Button 
                                 size="sm" 
                                 variant="outline"
                                 onClick={() => handleToggleStatus(appointment.id, appointment.status)}
                              >
                                 Toggle Status
                              </Button>
                              
                               <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                className="bg-red-600 text-white hover:bg-red-700"
                              >
                                Cancel
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Cancel Appointment
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to cancel the
                                  appointment for {appointment.customerName}?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  Keep
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleCancelAppointment(appointment.id)
                                  }
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Cancel
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                           </div>
                        </div>
                     );
                  })
               )}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                        <p className="text-xl font-semibold text-gray-700">
                          No Appointments Found
                        </p>
                        <Button
                          variant="link"
                          onClick={() => {
                            setDateRange(undefined); // Clear range
                            setIsDefaultView(true); // Return to default upcoming view
                          }}
                          className="mt-3"
                        >
                          Clear Filters
                          <X className="h-10 w-10" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedAppointments.map((appointment) => {
                    const { date, time } = formatDateTime(
                      appointment.start_time
                    );

                    return (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <p className="text-black">
                            {appointment.customerName}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getServiceColor(appointment.serviceName)}
                          >
                            {appointment.serviceName}
                          </Badge>
                        </TableCell>
                        <TableCell>{date}</TableCell>
                        <TableCell>{time}</TableCell>
                        <TableCell>
                          <Badge
                            className={`${getStatusColor(
                              appointment.status
                            )} cursor-pointer hover:opacity-80 transition-all`}
                            onClick={() =>
                              handleToggleStatus(
                                appointment.id,
                                appointment.status
                              )
                            }
                          >
                            {appointment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="text-gray-600">{appointment.email}</p>
                            <p className="text-gray-600">
                              {appointment.phone_number}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {/* Cancellation Dialog/Button */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="mr-1 h-3 w-3" />
                                Cancel
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Cancel Appointment
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to cancel the
                                  appointment for {appointment.customerName} on{" "}
                                  {date} at {time}? This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  Keep Appointment
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleCancelAppointment(appointment.id)
                                  }
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Cancel Appointment
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
