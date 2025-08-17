import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export type AppRole = 'admin' | 'researcher' | 'user';

interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

interface UserWithRoles {
  id: string;
  email: string;
  roles: AppRole[];
}

export const useUserRoles = () => {
  const { user } = useAuth();
  
  // Get current user's roles
  const { data: userRoles = [], isLoading } = useQuery({
    queryKey: ['user-roles', user?.id],
    queryFn: async (): Promise<UserRole[]> => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const roles = userRoles.map(ur => ur.role);
  
  const hasRole = (role: AppRole): boolean => {
    return roles.includes(role);
  };

  const isAdmin = (): boolean => hasRole('admin');
  const isResearcher = (): boolean => hasRole('researcher') || isAdmin();

  return {
    roles,
    userRoles,
    hasRole,
    isAdmin,
    isResearcher,
    isLoading,
  };
};

export const useAllUsersWithRoles = () => {
  const { isAdmin } = useUserRoles();
  
  return useQuery({
    queryKey: ['all-users-roles'],
    queryFn: async (): Promise<UserWithRoles[]> => {
      // Get all profiles with their associated roles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email');
      
      if (profilesError) throw profilesError;
      
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');
      
      if (rolesError) throw rolesError;
      
      // Combine profiles with their roles
      return profiles?.map(profile => ({
        id: profile.id,
        email: profile.email,
        roles: roles?.filter(role => role.user_id === profile.id)
          .map(role => role.role as AppRole) || []
      })) || [];
    },
    enabled: isAdmin(),
  });
};

export const useRoleManagement = () => {
  const queryClient = useQueryClient();
  
  const assignRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      queryClient.invalidateQueries({ queryKey: ['all-users-roles'] });
    },
  });

  const removeRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      queryClient.invalidateQueries({ queryKey: ['all-users-roles'] });
    },
  });

  return {
    assignRole,
    removeRole,
  };
};