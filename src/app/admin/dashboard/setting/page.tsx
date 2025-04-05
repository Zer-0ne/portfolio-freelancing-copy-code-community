"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Admin Dashboard",
    siteDescription: "A powerful admin panel for managing users and roles",
    supportEmail: "support@example.com",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordExpiry: "90",
    minPasswordLength: "8",
    requireSpecialChars: true,
    sessionTimeout: "30",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    userCreationAlert: true,
    roleChangeAlert: true,
    loginAttemptAlert: false,
    weeklyReports: true,
  })

  const handleGeneralChange = (field:any, value:any) => {
    setGeneralSettings({ ...generalSettings, [field]: value })
  }

  const handleSecurityChange = (field:any, value:any) => {
    setSecuritySettings({ ...securitySettings, [field]: value })
  }

  const handleNotificationChange = (field:any, value:any) => {
    setNotificationSettings({ ...notificationSettings, [field]: value })
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">Settings</h1>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage your site's general configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="site-name">Site Name</Label>
                      <Input
                        id="site-name"
                        value={generalSettings.siteName}
                        onChange={(e) => handleGeneralChange("siteName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="support-email">Support Email</Label>
                      <Input
                        id="support-email"
                        type="email"
                        value={generalSettings.supportEmail}
                        onChange={(e) => handleGeneralChange("supportEmail", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="site-description">Site Description</Label>
                    <Textarea
                      id="site-description"
                      value={generalSettings.siteDescription}
                      onChange={(e) => handleGeneralChange("siteDescription", e.target.value)}
                    />
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={generalSettings.timezone}
                        onValueChange={(value) => handleGeneralChange("timezone", value)}
                      >
                        <SelectTrigger id="timezone">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                          <SelectItem value="CST">Central Time (CST)</SelectItem>
                          <SelectItem value="MST">Mountain Time (MST)</SelectItem>
                          <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date-format">Date Format</Label>
                      <Select
                        value={generalSettings.dateFormat}
                        onValueChange={(value) => handleGeneralChange("dateFormat", value)}
                      >
                        <SelectTrigger id="date-format">
                          <SelectValue placeholder="Select date format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                          <SelectItem value="YYYY/MM/DD">YYYY/MM/DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure security options for your admin panel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Require two-factor authentication for all admin users
                      </p>
                    </div>
                    <Switch
                      id="two-factor"
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) => handleSecurityChange("twoFactorAuth", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                      <Input
                        id="password-expiry"
                        type="number"
                        value={securitySettings.passwordExpiry}
                        onChange={(e) => handleSecurityChange("passwordExpiry", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">Set to 0 for no expiration</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="min-password-length">Minimum Password Length</Label>
                      <Input
                        id="min-password-length"
                        type="number"
                        value={securitySettings.minPasswordLength}
                        onChange={(e) => handleSecurityChange("minPasswordLength", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="special-chars">Require Special Characters</Label>
                      <p className="text-sm text-muted-foreground">Passwords must contain special characters</p>
                    </div>
                    <Switch
                      id="special-chars"
                      checked={securitySettings.requireSpecialChars}
                      onCheckedChange={(checked) => handleSecurityChange("requireSpecialChars", checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Input
                      id="session-timeout"
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => handleSecurityChange("sessionTimeout", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Time before inactive users are logged out</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure when and how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Alert Preferences</h3>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="user-creation">User Creation Alerts</Label>
                      <Switch
                        id="user-creation"
                        checked={notificationSettings.userCreationAlert}
                        onCheckedChange={(checked) => handleNotificationChange("userCreationAlert", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="role-change">Role Change Alerts</Label>
                      <Switch
                        id="role-change"
                        checked={notificationSettings.roleChangeAlert}
                        onCheckedChange={(checked) => handleNotificationChange("roleChangeAlert", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-attempt">Login Attempt Alerts</Label>
                      <Switch
                        id="login-attempt"
                        checked={notificationSettings.loginAttemptAlert}
                        onCheckedChange={(checked) => handleNotificationChange("loginAttemptAlert", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="weekly-reports">Weekly Reports</Label>
                      <Switch
                        id="weekly-reports"
                        checked={notificationSettings.weeklyReports}
                        onCheckedChange={(checked) => handleNotificationChange("weeklyReports", checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

