"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Calendar } from "./ui/calendar";
import { Clock, Dumbbell, User } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
// Removed circular import
// import { Appointment } from "../admin/[slug]/dashboard/page";


export interface Appointment {
  id: string;
  start: string;
  end: string;
  customerName: string;
  serviceName: string;
  serviceDuration: number;
  cancellationLink: string;
  status: "pending" | "confirmed" | "upcoming";
}

interface CalendarComponentProps {
  appointments: Appointment[];
}
export function CalendarComponent({ appointments }: CalendarComponentProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const totalAppointments = appointments.length;
  console.log('appointments length',totalAppointments);

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(
      (appointment) =>
        new Date(appointment.start).toDateString() === date.toDateString()
    );
  };
  const selectedDateAppointments = selectedDate
    ? getAppointmentsForDate(selectedDate)
    : [];
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case "Private Coach":
        return <User className="h-4 w-4" />;
      case "MMA Class":
        return <Dumbbell className="h-4 w-4" />;
      case "Yoga":
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getServiceColor = (service: string) => {
    switch (service) {
      case "Private Coach":
        return "bg-blue-100 text-blue-800";
      case "MMA Class":
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
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
 
    
  return (
    <div className="md:ml-64 p-4 md:p-8 mt-16 md:mt-0 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Quick Stats - Moved to Top */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Card className="border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Today&apos;s Appointments</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">
                    {getAppointmentsForDate(new Date()).length}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-green-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                   <p className="text-sm font-medium text-gray-500">Total Scheduled</p>
                   <h3 className="text-3xl font-bold text-gray-900 mt-1">{totalAppointments}</h3>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <User className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-yellow-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                 <div>
                    <p className="text-sm font-medium text-gray-500">Pending Actions</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">
                        {appointments.filter((apt) => apt.status === "pending").length}
                    </h3>
                 </div>
                 <div className="bg-yellow-100 p-3 rounded-full">
                   <Clock className="h-6 w-6 text-yellow-600" />
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Picker */}
          <div className="lg:col-span-1">
            <Card className="shadow-sm border-gray-100 h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-gray-900">Calendar</CardTitle>
                <p className="text-sm text-gray-500">Select a date to view details</p>
              </CardHeader>
              <CardContent className="flex justify-center pt-2">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border shadow-none"
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Daily Schedule */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm border-gray-100 h-full min-h-[400px]">
              <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-xl">
                        Schedule
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                            {selectedDate?.toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </p>
                    </div>
                    {/* Add Event Button Placeholder or Icon could go here */}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {totalAppointments === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                       
                        <p>No appointments scheduled</p>
                    </div>
                ) : selectedDateAppointments.length === 0 ? (
                   <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                      <p>No appointments for this specific date.</p>
                      <Button variant="link" className="mt-2" onClick={() => setSelectedDate(undefined)}>View All</Button>
                   </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {selectedDateAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="p-4 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 hover:border-gray-500"
                      >
                        <div className="flex items-start gap-4">
                            <div className={`p-2 rounded-lg ${getServiceColor(appointment.serviceName).split(' ')[0]}`}>
                                {getServiceIcon(appointment.serviceName)}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{appointment.customerName}</h4>
                              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                 <Clock className="h-3 w-3" />
                                 {formatTime(new Date(appointment.start))} - {formatTime(new Date(new Date(appointment.start).getTime() + appointment.serviceDuration * 60000))}
                              </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 self-end sm:self-center">
                            <Badge variant="outline" className="border-gray-200 text-gray-600 bg-white">
                                {appointment.serviceName}
                            </Badge>
                            <Badge className={`${getStatusColor(appointment.status)} border-0`}>
                                {appointment.status} 
                            </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
