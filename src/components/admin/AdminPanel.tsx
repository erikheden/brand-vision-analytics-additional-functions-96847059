import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, Database, Settings } from 'lucide-react';
import { UserRoleManagement } from './UserRoleManagement';
import { useUserRoles } from '@/hooks/useUserRoles';

export const AdminPanel: React.FC = () => {
  const { isAdmin, isLoading } = useUserRoles();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!isAdmin()) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Access Denied
            </CardTitle>
            <CardDescription>
              You need administrator privileges to access this panel.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Administration Panel</h1>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users & Roles
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data Access
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <UserRoleManagement />
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Overview</CardTitle>
              <CardDescription>
                Monitor security status and recent activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Row Level Security</h3>
                    <p className="text-sm text-muted-foreground">All sensitive tables protected</p>
                  </div>
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Role-Based Access</h3>
                    <p className="text-sm text-muted-foreground">User roles system active</p>
                  </div>
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Authentication Required</h3>
                    <p className="text-sm text-muted-foreground">All business data requires login</p>
                  </div>
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Access Control</CardTitle>
              <CardDescription>
                Overview of data access permissions and restrictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium text-sm">Survey Respondent Data</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Researchers and Admins only
                    </p>
                    <div className="mt-2 text-xs">
                      <span className="px-2 py-1 bg-secondary rounded">Restricted</span>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium text-sm">Business Intelligence</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Authenticated users only
                    </p>
                    <div className="mt-2 text-xs">
                      <span className="px-2 py-1 bg-primary/10 rounded">Auth Required</span>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium text-sm">User Profiles</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Own profile only
                    </p>
                    <div className="mt-2 text-xs">
                      <span className="px-2 py-1 bg-green-100 rounded">Self Access</span>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium text-sm">Waitlist Data</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Admins only
                    </p>
                    <div className="mt-2 text-xs">
                      <span className="px-2 py-1 bg-destructive/10 rounded">Admin Only</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configuration and maintenance options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                System settings will be available in future updates.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};