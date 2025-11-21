'use client'
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Briefcase, Edit, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";

interface Service {
  id: number;
  name: string;
  duration_minutes: string;
  price: string;
  status: "active" | "inactive";
}

export default function ServiceOverview({ initialServices}:any) {
  const [ services, setServices] = useState<Service[]>( initialServices );
     // Edit service states
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editName, setEditName] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStatus, setEditStatus] = useState<"active" | "inactive">("active");
  
  // Add service states
  const [isAddingService, setIsAddingService] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDuration, setNewDuration] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newStatus, setNewStatus] = useState<"active" | "inactive">("active");

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setEditName(service.name);
    setEditDuration(service.duration_minutes);
    setEditPrice(service.price);
    setEditStatus(service.status);
  };

  const handleSaveEdit = () => {
    if (!editingService || !editName || !editDuration || !editPrice) return;

    const updatedServices = services.map(s => 
      s.id === editingService.id 
        ? { ...s, name: editName, duration: editDuration, price: editPrice, status: editStatus }
        : s
    );
    
    setServices(updatedServices);
    setEditingService(null);
    resetEditForm();
  };

  const handleAddService = () => {
    if (!newName || !newDuration || !newPrice) return;

    const newService: Service = {
      id: Math.max(...services.map(s => s.id)) + 1,
      name: newName,
      duration_minutes: newDuration,
      price: newPrice,
      status: newStatus
    };

    setServices([...services, newService]);
    setIsAddingService(false);
    resetAddForm();
  };

  const handleDeleteService = (serviceId: number) => {
    setServices(services.filter(s => s.id !== serviceId));
  };

  const resetEditForm = () => {
    setEditName("");
    setEditDuration("");
    setEditPrice("");
    setEditStatus("active");
  };

  const resetAddForm = () => {
    setNewName("");
    setNewDuration("");
    setNewPrice("");
    setNewStatus("active");
  };

  return (
 

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Overview */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-purple-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-100">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                      <Briefcase className="h-5 w-5 text-white" />
                    </div>
                    Service Overview
                  </div>
                  <Dialog open={isAddingService} onOpenChange={setIsAddingService}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Service
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Service</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="new-name">Service Name</Label>
                          <Input
                            id="new-name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="e.g., 60 Minute Personal Training"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="new-duration">Duration</Label>
                          <Input
                            id="new-duration"
                            value={newDuration}
                            onChange={(e) => setNewDuration(e.target.value)}
                            placeholder="e.g., 60 min"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="new-price">Price</Label>
                          <Input
                            id="new-price"
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            placeholder="e.g., $80"
                          />
                        </div>
                        
                        <div className="flex gap-2 pt-4">
                          <Button 
                            onClick={handleAddService}
                            disabled={!newName || !newDuration || !newPrice}
                            className="flex-1 bg-black text-white hover:bg-gray-800"
                          >
                            Add Service
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setIsAddingService(false);
                              resetAddForm();
                            }}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {services.map((service, index) => {
                    const gradients = [
                      { bg: 'from-orange-50 to-pink-50', border: 'border-orange-200', badge: 'from-orange-500 to-pink-500' },
                      { bg: 'from-purple-50 to-blue-50', border: 'border-purple-200', badge: 'from-purple-500 to-blue-500' },
                      { bg: 'from-green-50 to-emerald-50', border: 'border-green-200', badge: 'from-green-500 to-emerald-500' }
                    ];
                    const gradient = gradients[index % gradients.length];
                    
                    return (
                    <div key={service.id} className={`bg-gradient-to-r ${gradient.bg} border-2 ${gradient.border} rounded-lg p-4 hover:shadow-md transition-all duration-300`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-black">{service.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge className={`bg-gradient-to-r ${gradient.badge} text-white border-0`}>
                            {service.status}
                          </Badge>
                          <div className="flex gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleEditService(service)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Service</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="edit-name">Service Name</Label>
                                    <Input
                                      id="edit-name"
                                      value={editName}
                                      onChange={(e) => setEditName(e.target.value)}
                                    />
                                  </div>
                                  
                                  <div>
                                    <Label htmlFor="edit-duration">Duration</Label>
                                    <Input
                                      id="edit-duration"
                                      value={editDuration}
                                      onChange={(e) => setEditDuration(e.target.value)}
                                    />
                                  </div>
                                  
                                  <div>
                                    <Label htmlFor="edit-price">Price</Label>
                                    <Input
                                      id="edit-price"
                                      value={editPrice}
                                      onChange={(e) => setEditPrice(e.target.value)}
                                    />
                                  </div>
                                  
                                  <div className="flex gap-2 pt-4">
                                    <Button 
                                      onClick={handleSaveEdit}
                                      disabled={!editName || !editDuration || !editPrice}
                                      className="flex-1 bg-black text-white hover:bg-gray-800"
                                    >
                                      Save Changes
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      onClick={() => {
                                        setEditingService(null);
                                        resetEditForm();
                                      }}
                                      className="flex-1"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Service</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete {service.name}? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteService(service.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>⏱️ {service.duration_minutes}</span>
                        <span>💰 {service.price}</span>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
  )
}

