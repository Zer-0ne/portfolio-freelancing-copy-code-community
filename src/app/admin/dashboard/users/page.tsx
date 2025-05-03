"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, Search, UserPlus, Edit, Trash2, ArrowUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { allUser } from "@/utils/FetchFromApi"

// Define types based on your MongoDB schema
interface User {
  _id: string
  name: string
  email: string
  username: string
  role: string
  isAdmin: boolean
  image?: string
  createdAt: string
  followers: Array<{ userId: string }>
  followings: Array<{ userId: string }>
}

interface SortConfig {
  key: keyof User | null
  direction: "ascending" | "descending"
}

export default function UsersPage(): JSX.Element {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
  const [isNewUserDialogOpen, setIsNewUserDialogOpen] = useState<boolean>(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    username: "",
    role: "user",
    isAdmin: false,
    password: "",
  })
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: "ascending" })

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await allUser('user')
        setUsers(response)
        setLoading(false)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred')
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm?.toLowerCase()),
  )

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortConfig.key === null) return 0; // Explicitly check for null
  
    const key = sortConfig.key as keyof User;
    const aVal = a[key];
    const bVal = b[key];
  
    // If either value is undefined, consider them equal
    if (aVal === undefined || bVal === undefined) return 0;
  
    // Handle numeric comparison if needed
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortConfig.direction === "ascending" ? aVal - bVal : bVal - aVal;
    }
  
    // For strings (or converting non-number types to strings)
    const aStr = String(aVal);
    const bStr = String(bVal);
  
    return sortConfig.direction === "ascending"
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });
  

  // Handle sort
  const requestSort = (key: keyof User) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Handle edit user
  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setIsEditDialogOpen(true)
  }

  // Handle save edited user
  const handleSaveEdit = async () => {
    if (editingUser) {
      try {
        const response = await fetch(`/api/user/${editingUser.username}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: editingUser.name,
            email: editingUser.email,
            role: editingUser.role,
            isAdmin: editingUser.isAdmin,
            // Don't include password unless it's being changed
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to update user')
        }

        const updatedUser = await response.json()
        
        // Update the users state with the edited user
        setUsers(users.map((user) => (user.username === updatedUser.username ? updatedUser : user)))
        setIsEditDialogOpen(false)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred')
      }
    }
  }

  // Handle delete user
  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete user')
      }

      // Remove the deleted user from the state
      setUsers(users.filter((user) => user._id !== userId))
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    }
  }

  // Handle add new user
  const handleAddUser = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })

      if (!response.ok) {
        throw new Error('Failed to add user')
      }

      const createdUser = await response.json()
      
      // Add the new user to the state
      setUsers([...users, createdUser])
      
      // Reset form
      setNewUser({
        name: "",
        email: "",
        username: "",
        role: "user",
        isAdmin: false,
        password: "",
      })
      
      setIsNewUserDialogOpen(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 48) {
      return `1 day ago`;
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get role badge color
  const getRoleBadgeColor = (role: string, isAdmin: boolean) => {
    if (isAdmin) return "bg-red-100 text-red-800 hover:bg-red-100";
    
    switch(role) {
      case 'moderator':
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case 'editor':
        return "bg-green-100 text-green-800 hover:bg-green-100";
      default:
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading users...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <div className="container !max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Users Management</h1>
          <Dialog open={isNewUserDialogOpen} onOpenChange={setIsNewUserDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>Create a new user account with specific role and permissions.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="isAdmin" className="text-right">
                    Admin Status
                  </Label>
                  <Select
                    value={newUser.isAdmin ? "true" : "false"}
                    onValueChange={(value) => setNewUser({ ...newUser, isAdmin: value === "true" })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Is admin?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">Not Admin</SelectItem>
                      <SelectItem value="true">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewUserDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUser}>Add User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">
                  <Button variant="ghost" onClick={() => requestSort("name")} className="flex items-center">
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => requestSort("email")} className="flex items-center">
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Username</TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => requestSort("role")} className="flex items-center">
                    Role
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Followers</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.length > 0 ? (
                sortedUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getRoleBadgeColor(user.role, user.isAdmin)}
                      >
                        {user.isAdmin ? "Admin" : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.followers?.length || 0}</TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit User Dialog */}
      {editingUser && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Make changes to user information and role.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role" className="text-right">
                  Role
                </Label>
                <Select
                  value={editingUser.role}
                  onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}
                >
                  <SelectTrigger className="col-span-3" id="edit-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-isAdmin" className="text-right">
                  Admin Status
                </Label>
                <Select
                  value={editingUser.isAdmin ? "true" : "false"}
                  onValueChange={(value) => setEditingUser({ ...editingUser, isAdmin: value === "true" })}
                >
                  <SelectTrigger className="col-span-3" id="edit-isAdmin">
                    <SelectValue placeholder="Is admin?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Not Admin</SelectItem>
                    <SelectItem value="true">Admin</SelectItem>
                  </SelectContent>
                </Select>
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