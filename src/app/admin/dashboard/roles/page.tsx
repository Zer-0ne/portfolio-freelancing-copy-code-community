"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"

// Define types
interface Permission {
  view: boolean;
  edit: boolean;
  delete?: boolean;
}

interface Permissions {
  dashboard: Permission;
  users: Permission;
  roles: Permission;
  settings: Permission;
}

interface Role {
  id: number;
  name: string;
  description: string;
  userCount: number;
  permissions: Permissions;
}

interface PermissionItem {
  id: string;
  label: string;
}

interface PermissionSection {
  name: string;
  label: string;
  permissions: PermissionItem[];
}

// Initial roles data
const initialRoles: Role[] = [
  {
    id: 1,
    name: "User",
    description: "Regular user with basic access",
    userCount: 86,
    permissions: {
      dashboard: { view: true, edit: false },
      users: { view: false, edit: false, delete: false },
      roles: { view: false, edit: false, delete: false },
      settings: { view: false, edit: false },
    },
  },
  {
    id: 2,
    name: "Editor",
    description: "Can edit content but not manage users",
    userCount: 24,
    permissions: {
      dashboard: { view: true, edit: true },
      users: { view: true, edit: false, delete: false },
      roles: { view: false, edit: false, delete: false },
      settings: { view: true, edit: false },
    },
  },
  {
    id: 3,
    name: "Moderator",
    description: "Can manage users but not roles",
    userCount: 12,
    permissions: {
      dashboard: { view: true, edit: true },
      users: { view: true, edit: true, delete: true },
      roles: { view: true, edit: false, delete: false },
      settings: { view: true, edit: false },
    },
  },
  {
    id: 4,
    name: "Admin",
    description: "Full access to all features",
    userCount: 6,
    permissions: {
      dashboard: { view: true, edit: true },
      users: { view: true, edit: true, delete: true },
      roles: { view: true, edit: true, delete: true },
      settings: { view: true, edit: true },
    },
  },
]

// Permission sections
const permissionSections: PermissionSection[] = [
  {
    name: "dashboard",
    label: "Dashboard",
    permissions: [
      { id: "view", label: "View Dashboard" },
      { id: "edit", label: "Edit Dashboard" },
    ],
  },
  {
    name: "users",
    label: "Users Management",
    permissions: [
      { id: "view", label: "View Users" },
      { id: "edit", label: "Edit Users" },
      { id: "delete", label: "Delete Users" },
    ],
  },
  {
    name: "roles",
    label: "Roles & Permissions",
    permissions: [
      { id: "view", label: "View Roles" },
      { id: "edit", label: "Edit Roles" },
      { id: "delete", label: "Delete Roles" },
    ],
  },
  {
    name: "settings",
    label: "Settings",
    permissions: [
      { id: "view", label: "View Settings" },
      { id: "edit", label: "Edit Settings" },
    ],
  },
]

export default function RolesPage(): JSX.Element {
  const [roles, setRoles] = useState<Role[]>(initialRoles)
  const [selectedRole, setSelectedRole] = useState<Role>(roles[0])
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
  const [isNewRoleDialogOpen, setIsNewRoleDialogOpen] = useState<boolean>(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [newRole, setNewRole] = useState<Omit<Role, 'id' | 'userCount'>>({
    name: "",
    description: "",
    permissions: {
      dashboard: { view: false, edit: false },
      users: { view: false, edit: false, delete: false },
      roles: { view: false, edit: false, delete: false },
      settings: { view: false, edit: false },
    },
  })

  // Handle role selection
  const handleRoleSelect = (roleId: number): void => {
    const role = roles.find((r) => r.id === roleId)
    if (role) {
      setSelectedRole(role)
    }
  }

  // Handle permission change
  const handlePermissionChange = (section: string, permission: string, checked: boolean): void => {
    const updatedRole = { ...selectedRole }
    updatedRole.permissions[section as keyof Permissions][permission as keyof Permission] = checked
    setSelectedRole(updatedRole)
    setRoles(roles.map((role) => (role.id === updatedRole.id ? updatedRole : role)))
  }

  // Handle edit role
  const handleEditRole = (role: Role): void => {
    setEditingRole({ ...role })
    setIsEditDialogOpen(true)
  }

  // Handle save edited role
  const handleSaveEdit = (): void => {
    if (editingRole) {
      setRoles(roles.map((role) => (role.id === editingRole.id ? editingRole : role)))
      if (selectedRole.id === editingRole.id) {
        setSelectedRole(editingRole)
      }
      setIsEditDialogOpen(false)
    }
  }

  // Handle delete role
  const handleDeleteRole = (roleId: number): void => {
    const updatedRoles = roles.filter((role) => role.id !== roleId)
    setRoles(updatedRoles)
    if (selectedRole.id === roleId && updatedRoles.length > 0) {
      setSelectedRole(updatedRoles[0])
    }
  }

  // Handle add new role
  const handleAddRole = (): void => {
    const newId = Math.max(...roles.map((role) => role.id)) + 1
    const roleToAdd = { ...newRole, id: newId, userCount: 0 }
    setRoles([...roles, roleToAdd])
    setNewRole({
      name: "",
      description: "",
      permissions: {
        dashboard: { view: false, edit: false },
        users: { view: false, edit: false, delete: false },
        roles: { view: false, edit: false, delete: false },
        settings: { view: false, edit: false },
      },
    })
    setIsNewRoleDialogOpen(false)
  }

  // Handle new role permission change
  const handleNewRolePermissionChange = (section: string, permission: string, checked: boolean): void => {
    const updatedRole = { ...newRole }
    updatedRole.permissions[section as keyof Permissions][permission as keyof Permission] = checked
    setNewRole(updatedRole)
  }

  // Handle editing role permission change
  const handleEditingRolePermissionChange = (section: string, permission: string, checked: boolean): void => {
    if (editingRole) {
      const updatedRole = { ...editingRole }
      updatedRole.permissions[section as keyof Permissions][permission as keyof Permission] = checked
      setEditingRole(updatedRole)
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Roles & Permissions</h1>
          <Dialog open={isNewRoleDialogOpen} onOpenChange={setIsNewRoleDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
                <DialogDescription>Define a new role with specific permissions.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role-name" className="text-right">
                    Role Name
                  </Label>
                  <Input
                    id="role-name"
                    value={newRole.name}
                    onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role-description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="role-description"
                    value={newRole.description}
                    onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 pt-4">
                  <h3 className="font-medium">Permissions</h3>
                  {permissionSections.map((section) => (
                    <div key={section.name} className="space-y-2">
                      <h4 className="font-medium text-sm">{section.label}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {section.permissions.map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`new-${section.name}-${permission.id}`}
                              checked={newRole.permissions[section.name as keyof Permissions][permission.id as keyof Permission] || false}
                              onCheckedChange={(checked) =>
                                handleNewRolePermissionChange(section.name, permission.id, checked === true)
                              }
                            />
                            <Label htmlFor={`new-${section.name}-${permission.id}`}>{permission.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewRoleDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddRole}>Create Role</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Available Roles</CardTitle>
                <CardDescription>Select a role to manage its permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {roles.map((role) => (
                    <div
                      key={role.id}
                      className={`flex items-center justify-between p-3 rounded-md cursor-pointer hover:bg-muted ${
                        selectedRole?.id === role.id ? "bg-muted" : ""
                      }`}
                      onClick={() => handleRoleSelect(role.id)}
                    >
                      <div>
                        <div className="font-medium">{role.name}</div>
                        <div className="text-sm text-muted-foreground">{role.description}</div>
                      </div>
                      <Badge variant="outline">{role.userCount} users</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            {selectedRole && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedRole.name} Role</CardTitle>
                      <CardDescription>{selectedRole.description}</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditRole(selectedRole)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {roles.length > 1 && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteRole(selectedRole.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="permissions">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="permissions">Permissions</TabsTrigger>
                      <TabsTrigger value="users">Users with this Role</TabsTrigger>
                    </TabsList>
                    <TabsContent value="permissions" className="space-y-4 pt-4">
                      {permissionSections.map((section) => (
                        <div key={section.name} className="space-y-2">
                          <h3 className="font-medium">{section.label}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {section.permissions.map((permission) => (
                              <div key={permission.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${section.name}-${permission.id}`}
                                  checked={selectedRole.permissions[section.name as keyof Permissions][permission.id as keyof Permission] || false}
                                  onCheckedChange={(checked) =>
                                    handlePermissionChange(section.name, permission.id, checked === true)
                                  }
                                />
                                <Label htmlFor={`${section.name}-${permission.id}`}>{permission.label}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                    <TabsContent value="users">
                      <div className="pt-4">
                        <p className="text-sm text-muted-foreground mb-4">
                          There are currently <strong>{selectedRole.userCount} users</strong> with the{" "}
                          {selectedRole.name} role.
                        </p>
                        <Button variant="outline">View Users with this Role</Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <p className="text-sm text-muted-foreground">Last updated: 2 days ago</p>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Edit Role Dialog */}
      {editingRole && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Role</DialogTitle>
              <DialogDescription>Make changes to role details and permissions.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role-name" className="text-right">
                  Role Name
                </Label>
                <Input
                  id="edit-role-name"
                  value={editingRole.name}
                  onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role-description" className="text-right">
                  Description
                </Label>
                <Input
                  id="edit-role-description"
                  value={editingRole.description}
                  onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 pt-4">
                <h3 className="font-medium">Permissions</h3>
                {permissionSections.map((section) => (
                  <div key={section.name} className="space-y-2">
                    <h4 className="font-medium text-sm">{section.label}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {section.permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`edit-${section.name}-${permission.id}`}
                            checked={editingRole.permissions[section.name as keyof Permissions][permission.id as keyof Permission] || false}
                            onCheckedChange={(checked) =>
                              handleEditingRolePermissionChange(section.name, permission.id, checked === true)
                            }
                          />
                          <Label htmlFor={`edit-${section.name}-${permission.id}`}>{permission.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}