// /src/app/components/BusinessHoursForm.jsx

'use client';
import { useState } from "react";
// Assuming these UI components are defined elsewhere and accessible
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input"; 
import { Clock, Save } from "lucide-react";


// --- Helper Data and Types ---
// Interface for the form state 
interface DayHoursFormState {
  day_of_week: number;
  name: string;
  isOpen: boolean; 
  open_time: string; // HH:MM format
  close_time: string; // HH:MM format
}
// Prop structure matches what is returned from the API route 
interface DbHour {
  day_of_week: number;
  open_time: string; // e.g., "09:00:00"
  close_time: string; // e.g., "17:00:00"
}

const WEEK_DAYS = [
  { id: 1, name: 'Monday' }, { id: 2, name: 'Tuesday' }, { id: 3, name: 'Wednesday' },
  { id: 4, name: 'Thursday' }, { id: 5, name: 'Friday' }, { id: 6, name: 'Saturday' },
  { id: 7, name: 'Sunday' },
];
const DEFAULT_OPEN_TIME = '09:00';
const DEFAULT_CLOSE_TIME = '17:00';

// FIX 1: Renamed prop to initialHours to match Server component
export default function BusinessHoursForm({ initialHours = [] }: { initialHours: DbHour[] }) { 
  // FIX 2: Use functional initializer to correctly map DB data to UI state on first render
  const [hours, setHours] = useState<DayHoursFormState[]>(() => {
    const hoursMap = new Map(
      (initialHours ?? []).map(h => [h.day_of_week, { open_time: h.open_time, close_time: h.close_time }])
    );
    return WEEK_DAYS.map(day => {
      const fetchedHours = hoursMap.get(day.id);
      return {
        day_of_week: day.id, // Use number ID for logic
        name: day.name,
        isOpen: !!fetchedHours, 
        open_time: fetchedHours ? fetchedHours.open_time.substring(0, 5) : DEFAULT_OPEN_TIME,
        close_time: fetchedHours ? fetchedHours.close_time.substring(0, 5) : DEFAULT_CLOSE_TIME,
      };
    });
  });

  const [isLoading, setIsLoading] = useState(false);
  
  // FIX 3: Updated handler signature to use numerical day_of_week and correct fields
  const handleUpdateHours = (
    day_of_week: number,
    field: keyof DayHoursFormState, 
    value: string | boolean
  ) => {
    setHours(
      hours.map((h) => (h.day_of_week === day_of_week ? { ...h, [field]: value } : h) as DayHoursFormState)
    );
  };
  
  // FIX 4: Added handleSubmit function for persistence
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const dataToSubmit = hours.filter(day => day.isOpen).map(day => ({
        day_of_week: day.day_of_week,
        open_time: `${day.open_time}:00`, 
        close_time: `${day.close_time}:00`,
    }));

    // Find closed days that exist in the initial DB data for deletion
    const closedDayIds = hours
        .filter(day => !day.isOpen && initialHours.some(h => h.day_of_week === day.day_of_week))
        .map(day => day.day_of_week);

    try {
      // UPSERT for Open Days (FIX: Use correct route /api/admin/hours)
      const upsertResponse = await fetch('/api/admin/hours', { 
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dataToSubmit),
      });
      
      // DELETE for Explicitly Closed Days 
      if (closedDayIds.length > 0) {
          await fetch('/api/admin/hours/delete', { 
              method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ daysToDelete: closedDayIds }),
          });
      }

      if (upsertResponse.ok) {
        alert('Business hours saved successfully!');
      } else {
        alert('Failed to save hours.');
      }
    } catch (e) {
      console.error('An unexpected error occurred while saving:', e);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="lg:col-span-1">
      <Card className="border-2 border-orange-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-pink-50 border-b border-orange-100">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg">
              <Clock className="h-5 w-5 text-white" />
            </div>
            Set Business Hours
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit}> {/* FIX 5: Wrap in form and connect handler */}
            <div className="space-y-4">
              {hours.map((dayHours, index) => { 
                const gradients = [
                  "from-orange-50 to-pink-50",
                  "from-purple-50 to-blue-50",
                  "from-green-50 to-emerald-50",
                ];
                const gradient = gradients[index % gradients.length];

                return (
                  <div
                    key={dayHours.day_of_week} 
                    className={`bg-gradient-to-r ${gradient} border-2 border-gray-200 rounded-lg p-4`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-black">{dayHours.name}</h3> {/* FIX: Use name property for display */}
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={dayHours.isOpen ?? false} 
                          onChange={(e) =>
                            handleUpdateHours(
                              dayHours.day_of_week,
                              "isOpen",
                              e.target.checked
                            )
                          }
                          className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700">Open</span>
                      </label>
                    </div>

                    {dayHours.isOpen && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label
                            htmlFor={`start-${dayHours.day_of_week}`}
                            className="text-xs text-gray-600"
                          >
                            Start Time
                          </Label>
                          <Input // FIX: Using correct state field name (open_time)
                            id={`start-${dayHours.day_of_week}`}
                            type="time"
                            value={dayHours.open_time} 
                            onChange={(e) =>
                              handleUpdateHours(
                                dayHours.day_of_week,
                                "open_time",
                                e.target.value
                              )
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor={`end-${dayHours.day_of_week}`}
                            className="text-xs text-gray-600"
                          >
                            End Time
                          </Label>
                          <Input // FIX: Using correct state field name (close_time)
                            id={`end-${dayHours.day_of_week}`}
                            type="time"
                            value={dayHours.close_time}
                            onChange={(e) =>
                              handleUpdateHours(
                                dayHours.day_of_week,
                                "close_time",
                                e.target.value
                              )
                            }
                            className="mt-1"
                          />
                        </div>
                      </div>
                    )}

                    {!dayHours.isOpen && (
                      <p className="text-sm text-gray-500 text-center py-2">
                        Closed
                      </p>
                    )}
                  </div>
                );
              })}

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-[1.01] p-3 rounded-lg font-bold disabled:opacity-50 disabled:scale-100"
              >
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? 'Saving...' : 'Save Business Hours'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}