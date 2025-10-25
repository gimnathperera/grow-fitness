"use client";

import React, { useState, useEffect } from "react";
import { useUpdateClientMutation } from "@/services/clientsApi";
import { useUpdateKidMutation, useGetKidsQuery } from "@/services/kidsApi";
import { useAuth } from "@/auth/useAuth";
import { KidPayments } from './kid-payments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit2, 
  Save,
  AlertCircle,
  CreditCard,
  ClockIcon,
  CheckCircle2,
  Banknote,
  Wallet,
  DollarSign,
  Clock,
  Download,
} from "lucide-react";
import { PaymentMethod, PaymentStatus } from "@/services/paymentsAPI";

type UserRole = "client" | "coach";

interface Kid {
  _id?: string;
  id?: string;
  name: string;
  age: number;
  gender: "boy" | "girl" | undefined;
  location: string;
  sessionType?: string;
  paymentStatus?: "paid" | "unpaid";
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  kidName?: string;
}

interface TimeSlot {
  id: string;
  day: string;
  time: string;
  available: boolean;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location?: string;
  profilePic?: string;
  role: UserRole;
  kids?: Kid[];
  invoices?: Invoice[];
  timeSlots?: TimeSlot[];
}

interface PaymentFormData {
  amount: number;
  paymentMethod: string;
  dueDate: string;
  description: string;
}

const initialPaymentForm: PaymentFormData = {
  amount: 0,
  paymentMethod: 'credit_card',
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  description: 'Monthly training fee',
};

const PaymentStatusBadge = ({ status }: { status: string }) => {
  const statusMap = {
    [PaymentStatus.PAID]: {
      text: 'Paid',
      className: 'bg-green-100 text-green-800',
      icon: <CheckCircle2 className="h-4 w-4 mr-1" />
    },
    [PaymentStatus.PENDING]: {
      text: 'Pending',
      className: 'bg-yellow-100 text-yellow-800',
      icon: <ClockIcon className="h-4 w-4 mr-1" />
    },
    [PaymentStatus.FAILED]: {
      text: 'Failed',
      className: 'bg-red-100 text-red-800',
      icon: <AlertCircle className="h-4 w-4 mr-1" />
    },
    [PaymentStatus.REFUNDED]: {
      text: 'Refunded',
      className: 'bg-blue-100 text-blue-800',
      icon: <CreditCard className="h-4 w-4 mr-1" />
    },
    [PaymentStatus.CANCELED]: {
      text: 'Canceled',
      className: 'bg-gray-100 text-gray-800',
      icon: <AlertCircle className="h-4 w-4 mr-1" />
    },
  };

  const statusInfo = statusMap[status as keyof typeof statusMap] || { text: status, className: 'bg-gray-100 text-gray-800' };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}>
      {statusInfo.icon}
      {statusInfo.text}
    </span>
  );
};

const PaymentMethodIcon = ({ method }: { method: string }) => {
  const iconMap = {
    [PaymentMethod.CREDIT_CARD]: <CreditCard className="h-4 w-4 mr-1" />,
    [PaymentMethod.DEBIT_CARD]: <CreditCard className="h-4 w-4 mr-1" />,
    [PaymentMethod.BANK_TRANSFER]: <Banknote className="h-4 w-4 mr-1" />,
    [PaymentMethod.PAYPAL]: <Wallet className="h-4 w-4 mr-1" />,
    [PaymentMethod.OTHER]: <DollarSign className="h-4 w-4 mr-1" />,
  };

  return iconMap[method as keyof typeof iconMap] || iconMap[PaymentMethod.OTHER];
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const getStatusColor = (status: string) => {
  switch (status) {
    case "paid":
      return "bg-green-500 text-white";
    case "pending":
      return "bg-yellow-500 text-white";
    case "overdue":
      return "bg-red-600 text-white";
    case "unpaid":
      return "bg-red-600 text-white";
    default:
      return "bg-gray-300 text-gray-700";
  }
};

const ProfilePage: React.FC<{ user: UserProfile }> = ({ user: initialUser }) => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<UserProfile>(initialUser);
  const [activeSection, setActiveSection] = useState<string>("profile");
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: initialUser.name,
    email: initialUser.email,
    location: initialUser.location || '',
  });
  const [updateClient, { isLoading: updatingProfile }] = useUpdateClientMutation();
  const [updateKid, { isLoading: updatingKid }] = useUpdateKidMutation();
  
  // Fetch kids data for the logged-in client
  const { data: kidsData, isLoading: isLoadingKids } = useGetKidsQuery(
    authUser?.role === 'client' ? { parentId: authUser.id } : undefined,
    { skip: !authUser || authUser.role !== 'client' }
  );

  // Update user's kids when data is loaded
  useEffect(() => {
    if (kidsData?.data) {
      setUser(prev => ({
        ...prev,
        kids: kidsData.data
      }));
    }
  }, [kidsData]);

  const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, profilePic: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

const handleSaveProfile = async () => {
  try {
    const response = await updateClient({
      id: user.id,          // client ID
      payload: profileForm, // only allowed fields
    }).unwrap();

    setUser((prev) => ({ ...prev, ...response.data }));
    setEditingProfile(false);
  } catch (error) {
    console.error("Failed to update profile:", error);
  }
};

  const handleKidChange = (kidId: string, field: keyof Kid, value: string | number) => {
    setUser((prev) => ({
      ...prev,
      kids: prev.kids?.map((kid) =>
        kid._id === kidId || kid.id === kidId ? { ...kid, [field]: value } : kid
      ),
    }));
  };

  const handleSaveKid = async (kid: Kid) => {
    try {
      await updateKid({
        id: kid._id || kid.id!,
        payload: {
          name: kid.name,
          gender: kid.gender,
          age: kid.age,
          location: kid.location,
        },
      }).unwrap();
    } catch (error) {
      console.error("Failed to update kid:", error);
    }
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    console.log("Downloading invoice:", invoiceId);
  };

  // Add this mock data near the top of the component (before return)
const mockInvoices: Invoice[] = [
  {
    id: "inv001",
    date: "2025-10-01",
    amount: 150.0,
    status: "paid",
    kidName: "Emma Johnson",
  },
  {
    id: "inv002",
    date: "2025-09-15",
    amount: 120.0,
    status: "pending",
    kidName: "navindu",
  },
  {
    id: "inv003",
    date: "2025-08-20",
    amount: 130.0,
    status: "overdue",
    kidName: "navindu",
  },
];


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 lg:sticky lg:top-8 h-fit">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16 border-2 border-primary">
                    <AvatarImage src={user.profilePic} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <Badge>{user.role === "client" ? "Client" : "Coach"}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <Button
                  variant={activeSection === "profile" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("profile")}
                >
                  <User className="mr-2 h-4 w-4" />
                  My Profile
                </Button>

                {user.role === "client" && (
                  <>
                    <Button
                      variant={activeSection === "kids" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveSection("kids")}
                    >
                      <User className="mr-2 h-4 w-4" />
                      My Kids
                    </Button>
                    <Button
                      variant={activeSection === "invoices" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveSection("invoices")}
                    >
                      <DollarSign className="mr-2 h-4 w-4" />
                      Payment Invoices
                    </Button>
                  </>
                )}

                {user.role === "coach" && (
                  <>
                    <Button
                      variant={activeSection === "timeslots" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveSection("timeslots")}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Time Slots
                    </Button>
                    <Button
                      variant={activeSection === "coachpayments" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveSection("coachpayments")}
                    >
                      <DollarSign className="mr-2 h-4 w-4" />
                      My Payments
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-6">
            {/* Profile Section */}
            {activeSection === "profile" && (
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader className="flex items-center justify-between">
                  <CardTitle>My Profile</CardTitle>
                  {!editingProfile ? (
                    <Button variant="outline" onClick={() => setEditingProfile(true)}>
                      <Edit2 className="mr-2 h-4 w-4" /> Edit
                    </Button>
                  ) : (
                    <Button onClick={handleSaveProfile} disabled={updatingProfile}>
                      <Save className="mr-2 h-4 w-4" />{" "}
                      {updatingProfile ? "Saving..." : "Save"}
                    </Button>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-6 flex-wrap">
                    <Avatar className="h-24 w-24 border-2 border-primary">
                      <AvatarImage src={user.profilePic} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Label htmlFor="profile-pic" className="cursor-pointer text-sm text-primary">
                        Upload Profile Picture
                      </Label>
                      <Input
                        id="profile-pic"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePicUpload}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={profileForm.name}
                        disabled={!editingProfile}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        value={profileForm.email}
                        disabled={!editingProfile}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, email: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={profileForm.location}
                        disabled={!editingProfile}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, location: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input value={user.phone} disabled />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Kids Section */}
            {activeSection === "kids" && user.kids && (
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader>
                  <CardTitle>My Kids</CardTitle>
                  <CardDescription>Manage your kids’ information</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {user.kids.length === 0 ? (
                    <p className="text-muted-foreground">No kids found.</p>
                  ) : (
                    user.kids.map((kid) => (
                      <Card key={kid._id || kid.id} className="p-4 border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label>Name</Label>
                            <Input
                              value={kid.name}
                              onChange={(e) =>
                                handleKidChange(kid._id || kid.id!, "name", e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <Label>Gender</Label>
                            <Input
                              value={kid.gender}
                              onChange={(e) =>
                                handleKidChange(kid._id || kid.id!, "gender", e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <Label>Age</Label>
                            <Input
                              type="number"
                              value={kid.age}
                              onChange={(e) =>
                                handleKidChange(
                                  kid._id || kid.id!,
                                  "age",
                                  Number(e.target.value)
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label>Location</Label>
                            <Input
                              value={kid.location}
                              onChange={(e) =>
                                handleKidChange(
                                  kid._id || kid.id!,
                                  "location",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>

                        <div className="flex justify-end mt-3">
                          <Button
                            size="sm"
                            onClick={() => handleSaveKid(kid)}
                            disabled={updatingKid}
                          >
                            {updatingKid ? "Saving..." : "Save Changes"}
                          </Button>
                        </div>
                        <KidPayments kidId={kid._id || kid.id!} />
                      </Card>
                    ))
                  )}
                </CardContent>
              </Card>
            )}

            {/* Invoices Section */}
            {/* {activeSection === "invoices" && user.invoices && ( */}
            {activeSection === "invoices" && (
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader>
                  <CardTitle>Invoices</CardTitle>
                  <CardDescription>Track your payments</CardDescription>
                </CardHeader>
                {/* <CardContent className="space-y-2">
                  {user.invoices.map((inv) => (
                    <div
                      key={inv.id}
                      className="flex justify-between items-center p-3 border rounded-md border-gray-200"
                    >
                      <div>
                        <p className="font-medium">{inv.kidName || "N/A"}</p>
                        <p className="text-sm text-gray-500">{inv.date}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-2 py-1 rounded text-sm ${getStatusColor(inv.status)}`}>
                          {inv.status}
                        </span>
                        <span>${inv.amount}</span>
                        <Button size="sm" onClick={() => handleDownloadInvoice(inv.id)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent> */}
                <CardContent className="space-y-2">
                  {(user.invoices && user.invoices.length > 0 ? user.invoices : mockInvoices).map((inv) => (
                    <div
                      key={inv.id}
                      className="flex justify-between items-center p-3 border rounded-md border-gray-200"
                    >
                      <div>
                        <p className="font-medium">{inv.kidName || "N/A"}</p>
                        <p className="text-sm text-gray-500">{formatDate(inv.date)}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-2 py-1 rounded text-sm ${getStatusColor(inv.status)}`}>
                          {inv.status}
                        </span>
                        <span>{formatCurrency(inv.amount)}</span>
                        <Button size="sm" onClick={() => handleDownloadInvoice(inv.id)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Coach TimeSlots Section */}
            {activeSection === "timeslots" && user.timeSlots && (
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader>
                  <CardTitle>My Time Slots</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {user.timeSlots.map((ts) => (
                    <div
                      key={ts.id}
                      className="flex justify-between items-center p-3 border rounded-md border-gray-200"
                    >
                      <span>
                        {ts.day} - {ts.time}
                      </span>
                      <Badge variant={ts.available ? "secondary" : "destructive"}>
                        {ts.available ? "Available" : "Booked"}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
