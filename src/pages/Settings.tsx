import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Building2, Bell, Database, Shield, Zap, Lock } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

interface SettingsState {
  // General
  campusName: string;
  timezone: string;
  currency: string;
  tariff: string;
  darkMode: boolean;
  autoRefresh: boolean;
  refreshInterval: string;
  
  // Monitoring
  warningThreshold: string;
  criticalThreshold: string;
  tempThreshold: string;
  efficiencyTarget: string;
  retentionPeriod: string;
  autoBackup: boolean;
  
  // Notifications
  emailNotif: boolean;
  anomalyAlert: boolean;
  thresholdAlert: boolean;
  deviceOffline: boolean;
  weeklyReport: boolean;
  adminEmail: string;
  managerEmail: string;
  
  // Security
  twoFactor: boolean;
  sessionTimeout: boolean;
  timeoutDuration: string;
  passwordPolicy: string;
  logLogins: boolean;
  logChanges: boolean;
}

const defaultSettings: SettingsState = {
  campusName: "Institut Teknologi PLN",
  timezone: "wib",
  currency: "idr",
  tariff: "1467",
  darkMode: false,
  autoRefresh: true,
  refreshInterval: "30",
  warningThreshold: "40",
  criticalThreshold: "45",
  tempThreshold: "28",
  efficiencyTarget: "85",
  retentionPeriod: "365",
  autoBackup: true,
  emailNotif: true,
  anomalyAlert: true,
  thresholdAlert: true,
  deviceOffline: true,
  weeklyReport: false,
  adminEmail: "admin@itpln.ac.id",
  managerEmail: "manager@itpln.ac.id",
  twoFactor: false,
  sessionTimeout: true,
  timeoutDuration: "30",
  passwordPolicy: "medium",
  logLogins: true,
  logChanges: true,
};

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);

  // Role-based permissions
  const canEditCampusInfo = ['admin', 'manajer'].includes(user?.role || '');
  const canEditMonitoring = ['admin', 'teknisi', 'manajer'].includes(user?.role || '');
  const canEditNotifications = ['admin', 'manajer'].includes(user?.role || '');
  const canEditSecurity = user?.role === 'admin';

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("systemSettings");
    if (savedSettings) {
      try {
        const loaded = JSON.parse(savedSettings);
        setSettings(loaded);
        // Sync dark mode with theme context
        if (loaded.darkMode !== (theme === 'dark')) {
          setTheme(loaded.darkMode ? 'dark' : 'light');
        }
      } catch {
        // Failed to parse, use defaults
      }
    } else {
      // If no saved settings, sync with current theme
      setSettings(prev => ({ ...prev, darkMode: theme === 'dark' }));
    }
  }, []);

  const handleChange = (field: keyof SettingsState, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    
    // If changing dark mode, apply immediately
    if (field === 'darkMode') {
      setTheme(value ? 'dark' : 'light');
    }
  };

  const handleSaveSettings = () => {
    localStorage.setItem("systemSettings", JSON.stringify(settings));
    setHasChanges(false);
    toast.success("Settings saved successfully");
  };

  const handleResetToDefaults = () => {
    setSettings(defaultSettings);
    localStorage.removeItem("systemSettings");
    setHasChanges(false);
    setTheme(defaultSettings.darkMode ? 'dark' : 'light');
    toast.info("Settings reset to defaults");
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">System Settings</h1>
            <p className="text-muted-foreground mt-1">
              Configure system preferences and monitoring parameters
            </p>
          </div>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-2 lg:grid-cols-4 lg:w-auto">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-bold text-foreground">Campus Information</h2>
                  </div>
                  {!canEditCampusInfo && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Lock className="h-3 w-3" />
                      <span>Admin/Manajer only</span>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="campus-name">Campus Name</Label>
                    <Input 
                      id="campus-name" 
                      value={settings.campusName}
                      onChange={(e) => handleChange('campusName', e.target.value)}
                      disabled={!canEditCampusInfo}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={settings.timezone} onValueChange={(v) => handleChange('timezone', v)} disabled={!canEditCampusInfo}>
                      <SelectTrigger id="timezone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wib">WIB (UTC+7)</SelectItem>
                        <SelectItem value="wita">WITA (UTC+8)</SelectItem>
                        <SelectItem value="wit">WIT (UTC+9)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={settings.currency} onValueChange={(v) => handleChange('currency', v)} disabled={!canEditCampusInfo}>
                      <SelectTrigger id="currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="idr">IDR (Indonesian Rupiah)</SelectItem>
                        <SelectItem value="usd">USD (US Dollar)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tariff">Electricity Tariff (per kWh)</Label>
                    <Input 
                      id="tariff" 
                      type="number" 
                      value={settings.tariff}
                      onChange={(e) => handleChange('tariff', e.target.value)}
                      disabled={!canEditCampusInfo}
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Display Preferences</h3>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <Label htmlFor="theme">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Toggle dark/light theme</p>
                    </div>
                    <Switch 
                      id="theme" 
                      checked={settings.darkMode}
                      onCheckedChange={(v) => handleChange('darkMode', v)}
                    />
                  </div>
                  <Separator />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <Label htmlFor="auto-refresh">Auto Refresh Dashboard</Label>
                      <p className="text-sm text-muted-foreground">Update data automatically</p>
                    </div>
                    <Switch 
                      id="auto-refresh" 
                      checked={settings.autoRefresh}
                      onCheckedChange={(v) => handleChange('autoRefresh', v)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="refresh-interval">Refresh Interval</Label>
                    <Select value={settings.refreshInterval} onValueChange={(v) => handleChange('refreshInterval', v)}>
                      <SelectTrigger id="refresh-interval">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 seconds</SelectItem>
                        <SelectItem value="30">30 seconds</SelectItem>
                        <SelectItem value="60">1 minute</SelectItem>
                        <SelectItem value="300">5 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Monitoring Settings */}
            <TabsContent value="monitoring" className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-bold text-foreground">Monitoring Thresholds</h2>
                  </div>
                  {!canEditMonitoring && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Lock className="h-3 w-3" />
                      <span>Admin/Teknisi/Manajer only</span>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="warning-threshold">Warning Threshold (kW)</Label>
                    <Input 
                      id="warning-threshold" 
                      type="number" 
                      value={settings.warningThreshold}
                      onChange={(e) => handleChange('warningThreshold', e.target.value)}
                      disabled={!canEditMonitoring}
                    />
                    <p className="text-xs text-muted-foreground">Alert when consumption exceeds this value</p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="critical-threshold">Critical Threshold (kW)</Label>
                    <Input 
                      id="critical-threshold" 
                      type="number" 
                      value={settings.criticalThreshold}
                      onChange={(e) => handleChange('criticalThreshold', e.target.value)}
                      disabled={!canEditMonitoring}
                    />
                    <p className="text-xs text-muted-foreground">Critical alert level</p>
                  </div>
                  <Separator />
                  <div className="grid gap-2">
                    <Label htmlFor="temp-threshold">Temperature Alert (°C)</Label>
                    <Input 
                      id="temp-threshold" 
                      type="number" 
                      value={settings.tempThreshold}
                      onChange={(e) => handleChange('tempThreshold', e.target.value)}
                      disabled={!canEditMonitoring}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="efficiency-target">Efficiency Target (%)</Label>
                    <Input 
                      id="efficiency-target" 
                      type="number" 
                      value={settings.efficiencyTarget}
                      onChange={(e) => handleChange('efficiencyTarget', e.target.value)}
                      disabled={!canEditMonitoring}
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Data Retention</h3>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="retention-period">Keep Historical Data For</Label>
                    <Select value={settings.retentionPeriod} onValueChange={(v) => handleChange('retentionPeriod', v)} disabled={!canEditMonitoring}>
                      <SelectTrigger id="retention-period">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="90">3 months</SelectItem>
                        <SelectItem value="180">6 months</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                        <SelectItem value="730">2 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <Label htmlFor="backup">Automatic Backup</Label>
                      <p className="text-sm text-muted-foreground">Daily backup of all data</p>
                    </div>
                    <Switch 
                      id="backup" 
                      checked={settings.autoBackup}
                      onCheckedChange={(v) => handleChange('autoBackup', v)}
                      disabled={!canEditMonitoring}
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Notifications Settings */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-bold text-foreground">Notification Preferences</h2>
                  </div>
                  {!canEditNotifications && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Lock className="h-3 w-3" />
                      <span>Admin/Manajer only</span>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <Label htmlFor="email-notif">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                    </div>
                    <Switch 
                      id="email-notif" 
                      checked={settings.emailNotif}
                      onCheckedChange={(v) => handleChange('emailNotif', v)}
                      disabled={!canEditNotifications}
                    />
                  </div>
                  <Separator />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <Label htmlFor="anomaly-alert">Anomaly Detection Alerts</Label>
                      <p className="text-sm text-muted-foreground">Notify on unusual patterns</p>
                    </div>
                    <Switch 
                      id="anomaly-alert" 
                      checked={settings.anomalyAlert}
                      onCheckedChange={(v) => handleChange('anomalyAlert', v)}
                      disabled={!canEditNotifications}
                    />
                  </div>
                  <Separator />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <Label htmlFor="threshold-alert">Threshold Alerts</Label>
                      <p className="text-sm text-muted-foreground">Alert when limits exceeded</p>
                    </div>
                    <Switch 
                      id="threshold-alert" 
                      checked={settings.thresholdAlert}
                      onCheckedChange={(v) => handleChange('thresholdAlert', v)}
                      disabled={!canEditNotifications}
                    />
                  </div>
                  <Separator />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <Label htmlFor="device-offline">Device Offline Alerts</Label>
                      <p className="text-sm text-muted-foreground">Notify when devices disconnect</p>
                    </div>
                    <Switch 
                      id="device-offline" 
                      checked={settings.deviceOffline}
                      onCheckedChange={(v) => handleChange('deviceOffline', v)}
                      disabled={!canEditNotifications}
                    />
                  </div>
                  <Separator />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <Label htmlFor="weekly-report">Weekly Summary Report</Label>
                      <p className="text-sm text-muted-foreground">Email weekly statistics</p>
                    </div>
                    <Switch 
                      id="weekly-report" 
                      checked={settings.weeklyReport}
                      onCheckedChange={(v) => handleChange('weeklyReport', v)}
                      disabled={!canEditNotifications}
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Notification Recipients</h3>
                <div className="space-y-3">
                  <div className="grid gap-2">
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <Input 
                      id="admin-email" 
                      type="email" 
                      value={settings.adminEmail}
                      onChange={(e) => handleChange('adminEmail', e.target.value)}
                      disabled={!canEditNotifications}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="manager-email">Manager Email</Label>
                    <Input 
                      id="manager-email" 
                      type="email" 
                      value={settings.managerEmail}
                      onChange={(e) => handleChange('managerEmail', e.target.value)}
                      disabled={!canEditNotifications}
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-bold text-foreground">Security Settings</h2>
                  </div>
                  {!canEditSecurity && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Lock className="h-3 w-3" />
                      <span>Admin only</span>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
                    </div>
                    <Switch 
                      id="two-factor" 
                      checked={settings.twoFactor}
                      onCheckedChange={(v) => handleChange('twoFactor', v)}
                      disabled={!canEditSecurity}
                    />
                  </div>
                  <Separator />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <Label htmlFor="session-timeout">Auto Logout</Label>
                      <p className="text-sm text-muted-foreground">Logout after inactivity</p>
                    </div>
                    <Switch 
                      id="session-timeout" 
                      checked={settings.sessionTimeout}
                      onCheckedChange={(v) => handleChange('sessionTimeout', v)}
                      disabled={!canEditSecurity}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="timeout-duration">Session Timeout Duration</Label>
                    <Select value={settings.timeoutDuration} onValueChange={(v) => handleChange('timeoutDuration', v)} disabled={!canEditSecurity}>
                      <SelectTrigger id="timeout-duration">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator />
                  <div className="grid gap-2">
                    <Label htmlFor="password-policy">Password Policy</Label>
                    <Select value={settings.passwordPolicy} onValueChange={(v) => handleChange('passwordPolicy', v)} disabled={!canEditSecurity}>
                      <SelectTrigger id="password-policy">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (min 6 chars)</SelectItem>
                        <SelectItem value="medium">Medium (min 8 chars + numbers)</SelectItem>
                        <SelectItem value="high">High (min 12 chars + special)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Activity Logging</h3>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <Label htmlFor="log-logins">Log User Logins</Label>
                      <p className="text-sm text-muted-foreground">Track all login attempts</p>
                    </div>
                    <Switch 
                      id="log-logins" 
                      checked={settings.logLogins}
                      onCheckedChange={(v) => handleChange('logLogins', v)}
                      disabled={!canEditSecurity}
                    />
                  </div>
                  <Separator />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <Label htmlFor="log-changes">Log Configuration Changes</Label>
                      <p className="text-sm text-muted-foreground">Track system modifications</p>
                    </div>
                    <Switch 
                      id="log-changes" 
                      checked={settings.logChanges}
                      onCheckedChange={(v) => handleChange('logChanges', v)}
                      disabled={!canEditSecurity}
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
            <Button 
              variant="outline"
              onClick={handleResetToDefaults}
              className="w-full sm:w-auto"
            >
              Reset to Defaults
            </Button>
            <Button 
              onClick={handleSaveSettings}
              disabled={!hasChanges}
              className="w-full sm:w-auto"
            >
              {hasChanges ? 'Save Changes' : 'No Changes'}
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
