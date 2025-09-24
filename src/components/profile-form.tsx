
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

type UserProfileData = {
  fullName: string;
  gpName: string;
  gpContact: string;
  clinicName: string;
  clinicContact: string;
  gpEmail: string;
  healthPlan: string;
};

const LOCAL_STORAGE_KEY = 'emerald-health-profile';

export function ProfileForm() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [profileData, setProfileData] = useState<UserProfileData>({
    fullName: "",
    gpName: "",
    gpContact: "",
    clinicName: "",
    clinicContact: "",
    gpEmail: "",
    healthPlan: "public",
  });
  
  useEffect(() => {
    if (user) {
        const savedDataRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedDataRaw) {
            try {
              const savedData = JSON.parse(savedDataRaw) as UserProfileData;
              setProfileData(savedData);
            } catch (e) {
              console.error("Failed to parse profile data from localStorage", e)
            }
        } else {
            setProfileData(prev => ({ ...prev, fullName: user.displayName || "" }));
        }
    }
  }, [user]);

  const handleInputChange = (field: keyof UserProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profileData));
    toast({
      title: "Profile Saved!",
      description: "Your information has been updated successfully.",
    });
  };

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-h-[70vh] overflow-y-auto p-1 pr-4">
      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Personal Information</h3>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={profileData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={user.email || ""} disabled />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Emergency & GP Details</h3>
          <p className="text-sm text-muted-foreground">This information helps us connect you with care quickly when needed.</p>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <Label htmlFor="gp-name">Your GP's Name</Label>
              <Input id="gp-name" placeholder="e.g. Dr. Jane Smith" value={profileData.gpName} onChange={(e) => handleInputChange('gpName', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gp-contact">GP's Contact Number</Label>
              <Input id="gp-contact" placeholder="e.g. +353 1 234 5678" value={profileData.gpContact} onChange={(e) => handleInputChange('gpContact', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clinic-name">Preferred Clinic Name</Label>
              <Input id="clinic-name" placeholder="e.g. The Dublin Clinic" value={profileData.clinicName} onChange={(e) => handleInputChange('clinicName', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clinic-contact">Clinic's Contact Number</Label>
              <Input id="clinic-contact" placeholder="e.g. +353 1 876 5432" value={profileData.clinicContact} onChange={(e) => handleInputChange('clinicContact', e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="gp-email">GP's Email Address</Label>
              <Input id="gp-email" type="email" placeholder="e.g. dr.jane.smith@health.ie" value={profileData.gpEmail} onChange={(e) => handleInputChange('gpEmail', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Health Plan</h3>
          <Separator />
          <div className="space-y-2 pt-2">
            <Label htmlFor="health-plan">Select your primary health plan</Label>
            <Select value={profileData.healthPlan} onValueChange={(value) => handleInputChange('healthPlan', value)}>
              <SelectTrigger id="health-plan" className="w-full md:w-1/2">
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public Health Service</SelectItem>
                <SelectItem value="medical-card">Medical Card</SelectItem>
                <SelectItem value="private">Private Insurance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button size="lg" onClick={handleSaveChanges}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
