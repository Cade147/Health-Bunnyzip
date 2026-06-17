import { useAppStore } from "@/lib/store";
import { useLocation } from "wouter";
import { useTheme } from "@/components/theme-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { LogOut, Moon, Sun, Monitor, Save, Shield, Bug, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  const { user, updateUser, logout } = useAppStore();
  const [, setLocation] = useLocation();
  const { theme, setTheme } = useTheme();
  
  const [name, setName] = useState(user?.name || "");
  const [notifications, setNotifications] = useState(true);

  const handleSaveProfile = () => {
    updateUser({ name });
    toast.success("Profile updated successfully");
  };

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <div className="max-w-3xl mx-auto pb-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-muted-foreground text-lg">Manage your account preferences and app settings.</p>
      </div>

      <div className="grid gap-8">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <div className="flex gap-3">
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="max-w-md"
                />
                <Button onClick={handleSaveProfile} variant="secondary">
                  <Save className="w-4 h-4 mr-2" /> Save
                </Button>
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <Label>Email Address</Label>
              <Input value={user?.email} disabled className="max-w-md bg-secondary/50 text-muted-foreground" />
              <p className="text-xs text-muted-foreground mt-1">Email cannot be changed on demo accounts.</p>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the app looks on your device.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 max-w-md">
              <button
                onClick={() => setTheme("light")}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                  theme === "light" ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50 text-muted-foreground"
                }`}
              >
                <Sun className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">Light</span>
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                  theme === "dark" ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50 text-muted-foreground"
                }`}
              >
                <Moon className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">Dark</span>
              </button>
              <button
                onClick={() => setTheme("system")}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                  theme === "system" ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50 text-muted-foreground"
                }`}
              >
                <Monitor className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">System</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* App Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Manage notifications and data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive reminders and health tips.</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base text-destructive">Sign Out</Label>
                <p className="text-sm text-muted-foreground">Clear your local session data.</p>
              </div>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" /> Sign out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Support & Legal */}
        <Card>
          <CardHeader>
            <CardTitle>Support & Legal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="flex-1 justify-start">
                <MessageSquare className="w-4 h-4 mr-2 text-muted-foreground" /> Provide Feedback
              </Button>
              <Button variant="outline" className="flex-1 justify-start">
                <Bug className="w-4 h-4 mr-2 text-muted-foreground" /> Report a Bug
              </Button>
              <Button variant="outline" className="flex-1 justify-start">
                <Shield className="w-4 h-4 mr-2 text-muted-foreground" /> Privacy Policy
              </Button>
            </div>
            
            <div className="mt-8 p-4 bg-secondary/50 rounded-xl text-xs text-muted-foreground">
              <strong className="block text-foreground mb-1">Medical Disclaimer</strong>
              Health Bunny AI provides general health information and home-care guidance only. It is not a medical diagnosis tool and does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for serious or persistent symptoms.
            </div>

            <div className="text-center text-xs text-muted-foreground pt-4">
              <p>Version 1.0.0</p>
              <p className="mt-1">© 2026 Health Bunny AI. All Rights Reserved.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
