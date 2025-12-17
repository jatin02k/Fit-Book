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
import { List, User, Clock, X, Filter, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { AppointmentList } from "@/lib/fetchAdminBookings";

interface FilteredDashboardProps {
  appointmentsList: AppointmentList[];
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
  switch (service) {
    case "Personal Training":
      return "bg-blue-100 text-blue-800";
    case "MMA":
      return "bg-red-100 text-red-800";
    case "Yoga":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
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
    <div className="ml-64 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl text-black mb-2">Upcoming Appointments</h1>
          <p className="text-gray-600">
            View and manage all scheduled appointments
          </p>
        </div>

        {/* Quick Stats Block (The component on the top of the image) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-gray-600">Upcoming</p>
                  <p className="text-2xl text-black">{upcomingCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
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
            <CardContent className="p-6">
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
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5" />
                All Appointments
              </CardTitle>
              {/* Filter Selects */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <Select
                    value={serviceFilter}
                    onValueChange={setServiceFilter}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Services</SelectItem>
                      <SelectItem value="Personal Training">
                        Personal Training
                      </SelectItem>
                      <SelectItem value="MMA">MMA</SelectItem>
                      <SelectItem value="Yoga">Yoga</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                {/* Date Range Filter */}
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                          "w-[250px] justify-start text-left font-normal",
                          !dateRange && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
