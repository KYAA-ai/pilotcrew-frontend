import { useState, useEffect } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { useNavigate } from 'react-router-dom';
import { GenericDataTable } from '@/components/generic-data-table';
import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { MultiSelect } from '@/components/ui/multi-select';
import { toast } from 'sonner';
import apiClient from '@/lib/api';
import { Shield, Users, Search, Lock, UserCheck } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Permission {
  value: string;
  label: string;
  description: string;
}

export default function AutoEvalAdminPage() {
  const { isAdmin, hasPermission } = useProfile();
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingRow, setEditingRow] = useState<{
    id: string;
    name: string;
    email: string;
    permissions: string[];
    isAdmin: boolean;
  } | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<{
    id: string;
    name: string;
    email: string;
    permissions: string[];
    isAdmin: boolean;
  } | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0
  });

  const canEditPermissions = hasPermission('SUPER_ADMIN');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [permissionsResponse, statsResponse] = await Promise.all([
          apiClient.get('/v1/autoeval/admin/permissions'),
          apiClient.get('/v1/autoeval/admin/stats')
        ]);
        
        setPermissions(permissionsResponse.data.permissions);
        setStats(statsResponse.data.stats);
      } catch (error) {
        console.error('Failed to load data:', error);
        toast.error('Failed to load admin data');
      }
    };

    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);


  const stopEditing = () => {
    setEditingRow(null);
  };

  const updateEditingRow = (updates: Partial<{ permissions: string[]; isAdmin: boolean }>) => {
    if (editingRow) {
      setEditingRow({ ...editingRow, ...updates });
    }
  };

  const handleSubmitUserChanges = async () => {
    if (!editingRow) return;

    setIsUpdating(true);
    try {
      await apiClient.put(`/v1/autoeval/admin/users/${editingRow.id}/permissions`, {
        permissions: editingRow.permissions,
        isAdmin: editingRow.isAdmin,
      });

      toast.success('User permissions updated successfully');
      stopEditing();
      window.location.reload();
    } catch (error) {
      console.error('Failed to update permissions:', error);
      toast.error('Failed to update user permissions');
    } finally {
      setIsUpdating(false);
    }
  };

  const userColumns: ColumnDef<Record<string, unknown>>[] = [
    {
      accessorKey: 'id',
      header: '',
      cell: ({ row }) => (
        <div className="font-medium hidden">{row.getValue('id') as string}</div>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('name') as string}</div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">{row.getValue('email') as string}</div>
      ),
    },
    {
      accessorKey: 'isAdmin',
      header: 'Admin',
      cell: ({ row }) => {
        const isUserAdmin = (row.getValue('isAdmin') as boolean) || false;
        const userId = row.getValue('id') as string;
        const isEditing = editingRow?.id === userId;
        
        if (!canEditPermissions) {
          return (
            <div className="flex items-center space-x-2">
              <Checkbox checked={isUserAdmin} disabled />
              <span className="text-sm">Admin</span>
            </div>
          );
        }

        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={isEditing && editingRow ? editingRow.isAdmin : isUserAdmin}
              onCheckedChange={(checked) => {
                if (isEditing) {
                  updateEditingRow({ isAdmin: checked as boolean });
                } else {
                  setEditingRow({ id: userId, name: row.getValue('name') as string, email: row.getValue('email') as string, permissions: row.getValue('permissions') as string[], isAdmin: checked as boolean });
                }
              }}
              disabled={isUpdating}
            />
            <span className="text-sm">Admin</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'permissions',
      header: 'Permissions',
      cell: ({ row }) => {
        const userPermissions = (row.getValue('permissions') as string[]) || [];
        const userId = row.getValue('id') as string;
        const isEditing = editingRow?.id === userId;
        
        if (!canEditPermissions) {
          return (
            <div className="flex flex-wrap gap-1">
              {userPermissions.map(permission => {
                const permissionInfo = permissions.find(p => p.value === permission);
                return (
                  <Badge key={permission} variant="secondary" className="mr-1 mb-1">
                    {permissionInfo?.label || permission}
                  </Badge>
                );
              })}
              {userPermissions.length === 0 && (
                <span className="text-sm text-muted-foreground">No permissions</span>
              )}
            </div>
          );
        }

        const permissionOptions = permissions.map(p => ({
          value: p.value,
          label: p.label
        }));

        if (isEditing) {
          return (
            <MultiSelect
              key={`${userId}-editing`}
              options={permissionOptions}
              defaultValue={editingRow ? editingRow.permissions : []}
              onValueChange={(values: string[]) => {
                updateEditingRow({ permissions: values });
              }}
              placeholder="Select permissions..."
            />
          );
        } else {
          return (
            <div className="flex flex-wrap gap-1">
              {userPermissions.map(permission => {
                const permissionInfo = permissions.find(p => p.value === permission);
                return (
                  <Badge key={permission} variant="secondary" className="mr-1 mb-1">
                    {permissionInfo?.label || permission}
                  </Badge>
                );
              })}
              {userPermissions.length === 0 && (
                <span className="text-sm text-muted-foreground">No permissions</span>
              )}
            </div>
          );
        }
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {new Date(row.getValue('createdAt') as string).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const userId = row.getValue('id') as string;
        const isEditing = editingRow?.id === userId;
        const originalPermissions = (row.getValue('permissions') as string[]) || [];
        const originalIsAdmin = (row.getValue('isAdmin') as boolean) || false;
        const hasChanges = isEditing && editingRow && (
          JSON.stringify(editingRow.permissions) !== JSON.stringify(originalPermissions) ||
          editingRow.isAdmin !== originalIsAdmin
        );
        
        if (!canEditPermissions) {
          return <span className="text-sm text-muted-foreground">No access</span>;
        }

        return (
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  onClick={handleSubmitUserChanges}
                  disabled={isUpdating || !hasChanges}
                  variant={hasChanges ? "default" : "outline"}
                  className={hasChanges ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                >
                  {isUpdating ? 'Saving...' : hasChanges ? 'Save Changes' : 'No Changes'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={stopEditing}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditingUser({
                    id: row.original.id as string,
                    name: row.original.name as string,
                    email: row.original.email as string,
                    permissions: row.original.permissions as string[],
                    isAdmin: row.original.isAdmin as boolean
                  });
                  setIsEditModalOpen(true);
                }}
                disabled={isUpdating}
              >
                Edit
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  // Search component for server-driven search
  const SearchComponent = () => (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search by name or email..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 w-full max-w-sm"
      />
    </div>
  );

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-2">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-gray-600 dark:text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Access Restricted
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              You don't have permission to access the admin dashboard. Please contact an administrator if you need access.
            </p>
            <Button 
              onClick={() => navigate('/autoeval')} 
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <div className="p-6 w-full">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4 flex-shrink-0">
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/autoeval" className="text-sm text-muted-foreground hover:text-foreground">
                AutoEval
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Admin</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800/30 dark:to-gray-700/20 border-gray-300 dark:border-gray-700">
            <CardContent className="px-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Total Users</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300">All registered users</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.totalUsers}</div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Growing community</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800/30 dark:to-gray-700/20 border-gray-300 dark:border-gray-700">
            <CardContent className="px-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-green-100 dark:bg-green-900/50 rounded-lg">
                  <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Admins</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300">Super admin users</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.adminUsers}</div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">System administrators</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800/30 dark:to-gray-700/20 border-gray-300 dark:border-gray-700">
            <CardContent className="px-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                  <UserCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Regular Users</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300">Standard access</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.regularUsers}</div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Evaluation users</p>
            </CardContent>
          </Card>
        </div>

        {/* Content area */}
        <div className="w-full">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">User Management</h2>
          </div>
          <GenericDataTable
            endpoint="/v1/autoeval/admin/users"
            dataKey="users"
            title=""
            enableSelection={false}
            customColumns={userColumns}
            serverSidePagination={true}
            searchBarElement={<SearchComponent />}
            externalFilters={searchQuery ? { search: searchQuery } : undefined}
          />
        </div>
      </div>

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="pb-6">
            <DialogTitle>Edit User Permissions</DialogTitle>
            <DialogDescription>
              Update permissions and admin status for {editingUser?.name}
            </DialogDescription>
          </DialogHeader>
          
          {editingUser && (
            <div className="space-y-6 ">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                <Input value={editingUser.name} disabled className="h-10 mt-1.5" />
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <Input value={editingUser.email} disabled className="h-10 mt-1.5" />
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Admin Status</label>
                <div className="flex items-center space-x-3 p-3 border rounded-md mt-1.5">
                  <Checkbox
                    checked={editingUser.isAdmin}
                    onCheckedChange={(checked) => {
                      setEditingUser(prev => prev ? { ...prev, isAdmin: checked as boolean } : null);
                    }}
                    disabled={isUpdating}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Grant admin privileges</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Permissions</label>
                <MultiSelect
                  options={permissions.map(p => ({
                    value: p.value,
                    label: p.label
                  }))}
                  defaultValue={editingUser.permissions}
                  onValueChange={(values: string[]) => {
                    setEditingUser(prev => prev ? { ...prev, permissions: values } : null);
                  }}
                  placeholder="Select permissions..."
                  className="mt-1.5"
                />
              </div>
            </div>
          )}
          
          <DialogFooter className="pt-6 space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingUser(null);
              }}
              disabled={isUpdating}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (!editingUser) return;
                
                setIsUpdating(true);
                try {
                  await apiClient.put(`/v1/autoeval/admin/users/${editingUser.id}/permissions`, {
                    permissions: editingUser.permissions,
                    isAdmin: editingUser.isAdmin,
                  });

                  toast.success('User permissions updated successfully');
                  setIsEditModalOpen(false);
                  setEditingUser(null);
                  window.location.reload();
                } catch (error) {
                  console.error('Failed to update permissions:', error);
                  toast.error('Failed to update user permissions');
                } finally {
                  setIsUpdating(false);
                }
              }}
              disabled={isUpdating}
              className="px-6"
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
