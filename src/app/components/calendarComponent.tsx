'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Calendar } from './ui/calendar';
import { Clock, Dumbbell, User } from 'lucide-react';
import { Badge } from './ui/badge';
import { Appointment } from '../admin/dashboard/page';

interface CalendarComponentProps {
  appointments: Appointment[];
}
export function CalendarComponent({appointments}:CalendarComponentProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
    const totalAppointments = appointments.length;
  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(
      (appointment) => new Date(appointment.start).toDateString() === date.toDateString()
    );
  };
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
  const selectedDateAppointments = selectedDate
    ? getAppointmentsForDate(selectedDate)
    : [];
  return (
    <div className="ml-64 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl text-black mb-2">Appointments Calendar</h1>
          <p className="text-gray-600">
            View and manage all scheduled appointments
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
            <Card>
              <CardHeader>
                <CardTitle>Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
            {/* Daily Appointments */}
          
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Appointments for{" "}
                  {selectedDate?.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {totalAppointments === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No appointments scheduled for this date
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedDateAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getServiceIcon(appointment.serviceName)}
                            <div>
                              <h3 className="text-black">
                                {appointment.customerName}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {formatTime(new Date(appointment.start))} -{" "}
                                {formatTime(
                                  new Date(
                                    new Date(appointment.start).getTime() +
                                      appointment.serviceDuration * 60000
                                  )
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={getServiceColor(appointment.serviceName)}
                            >
                              {appointment.serviceName}
                            </Badge>
                            <Badge
                              variant={
                                appointment.status === "confirmed"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {appointment.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
        

        {/* Quick Stats */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
              
                <div>
                  <p className="text-sm text-gray-600">Today's Appointments</p>
                  <p className="text-2xl text-black">
                    {getAppointmentsForDate(new Date()).length}
                  </p>
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
                  <p className="text-sm text-gray-600">Total Appointments</p>
                  <p className="text-2xl text-black">{totalAppointments}</p>
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
                  <p className="text-sm text-gray-600">Pending Confirmations</p>
                  <p className="text-2xl text-black">
                    {appointments.filter(apt => apt.status === 'pending').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
