import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAllUsersWithRoles, useRoleManagement, type AppRole } from '@/hooks/useUserRoles';
import { toast } from 'sonner';

const ROLE_COLORS = {
  admin: 'destructive',
  researcher: 'secondary',
  user: 'outline',
} as const;

const ROLE_DESCRIPTIONS = {
  admin: 'Full system access, can manage users and roles',
  researcher: 'Can access survey respondent data and research features',
  user: 'Basic access to authenticated features',
} as const;

export const UserRoleManagement: React.FC = () => {
  const { data: users = [], isLoading } = useAllUsersWithRoles();
  const { assignRole, removeRole } = useRoleManagement();
  const [selectedRole, setSelectedRole] = React.useState<AppRole>('user');

  const handleAssignRole = async (userId: string, role: AppRole) => {
    try {
      await assignRole.mutateAsync({ userId, role });
      toast.success(`${role} role assigned successfully`);
    } catch (error) {
      toast.error(`Failed to assign role: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleRemoveRole = async (userId: string, role: AppRole) => {
    try {
      await removeRole.mutateAsync({ userId, role });
      toast.success(`${role} role removed successfully`);
    } catch (error) {
      toast.error(`Failed to remove role: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Role Management</CardTitle>
          <CardDescription>Loading users...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Role Management</CardTitle>
          <CardDescription>
            Manage user roles and permissions. Be careful when assigning admin roles.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Role Descriptions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(ROLE_DESCRIPTIONS).map(([role, description]) => (
              <div key={role} className="flex items-center gap-2">
                <Badge variant={ROLE_COLORS[role as AppRole]}>{role}</Badge>
                <span className="text-sm text-muted-foreground">{description}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">{user.email}</CardTitle>
                  <CardDescription className="text-xs">User ID: {user.id}</CardDescription>
                </div>
                <div className="flex flex-wrap gap-1">
                  {user.roles.length > 0 ? (
                    user.roles.map((role) => (
                      <Badge key={role} variant={ROLE_COLORS[role]}>
                        {role}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline">No roles assigned</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2">
                <Select
                  value={selectedRole}
                  onValueChange={(value: AppRole) => setSelectedRole(value)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="researcher">Researcher</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  size="sm"
                  onClick={() => handleAssignRole(user.id, selectedRole)}
                  disabled={user.roles.includes(selectedRole) || assignRole.isPending}
                >
                  Assign Role
                </Button>

                {user.roles.map((role) => (
                  <Button
                    key={role}
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemoveRole(user.id, role)}
                    disabled={removeRole.isPending}
                  >
                    Remove {role}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};