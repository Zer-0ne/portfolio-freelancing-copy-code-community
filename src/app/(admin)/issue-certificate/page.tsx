"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { allPost, allUser, getData } from "@/utils/FetchFromApi"
import { CertificateTemplate, FormStructure, User } from "@/utils/Interfaces"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store/store"
import { fetchEvents } from "@/slices/eventsSlice"

// Types for our data
interface Event {
    _id: { $oid: string }
    title: string
    description: string
    mode: string
    eventDate: string
    status: string
}

interface Certificate {
    _id: { $oid: string }
    name: string
    template: string
    previewUrl: string
}

interface CertificateFormData {
    selectedTemplate: CertificateTemplate | null
    category: string
    certificate: string
    users: User[]
}

// Certificate categories
const CERTIFICATE_CATEGORIES = [
    "Appreciation",
    "Participation",
    "Achievement",
    "Completion",
    "Excellence"
]

export default function CertificatePage() {
    const { toast } = useToast()
    const { events, loading: eventLoading } = useSelector((state: RootState) => state.events)
    const dispatch = useDispatch<AppDispatch>()
    const [loading, setLoading] = useState(false)
    const [templates, setTemplates] = useState<CertificateTemplate[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [selectedTemplate, setSelectedTemplate] = useState<CertificateTemplate | null>(null)
    const [selectAll, setSelectAll] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const [formData, setFormData] = useState<CertificateFormData>({
        selectedTemplate: null,
        category: "",
        certificate: "",
        users: []
    })
    const displayUsers = users?.length > 0 ? users : []

    // Fetch data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const templates = await allPost('certificate-template') as CertificateTemplate[]
                !events.length && dispatch(fetchEvents())
                const users = await allUser('user')

                setTemplates(templates)
                setUsers(users)
            } catch (error) {
                console.error('Error fetching data:', error)
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load data. Please try again later."
                })
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [toast])

    // Handle template selection
    const handleTemplateSelect = (templateId: string) => {
        const template = templates.find(t => t._id === templateId)
        setSelectedTemplate(template || null)
        setFormData({
            ...formData,
            selectedTemplate: template || null
        })
    }

    // Handle form field changes
    const handleSelectChange = (field: keyof CertificateFormData, value: string) => {
        setFormData({
            ...formData,
            [field]: value
        })
    }

    // Filter users based on search query
    const filteredUsers = displayUsers.filter(user =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Handle Select All toggle
    const handleSelectAllToggle = () => {
        const newSelectAll = !selectAll
        setSelectAll(newSelectAll)

        if (newSelectAll) {
            setFormData(prev => ({
                ...prev,
                users: filteredUsers
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                users: []
            }))
        }
    }

    // Handle user selection (checkbox)
    const handleUserToggle = (user: User) => {
        setFormData(prev => {
            const users = prev.users.includes(user)
                ? prev.users.filter(u => u._id !== user._id)
                : [...prev.users, user]

            setSelectAll(filteredUsers.length > 0 && filteredUsers.every(u =>
                users.some(selectedUser => selectedUser._id === u._id)
            ))

            return {
                ...prev,
                users
            }
        })
    }

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)

        if (selectAll) {
            const newFilteredUsers = displayUsers.filter(user =>
                user.name?.toLowerCase().includes(e.target.value.toLowerCase()) ||
                user.email?.toLowerCase().includes(e.target.value.toLowerCase())
            )

            setSelectAll(newFilteredUsers.length > 0 && newFilteredUsers.every(user =>
                formData.users.some(selectedUser => selectedUser._id === user._id)
            ))
        }
    }

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validation
        if (!formData.selectedTemplate) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please select a certificate template."
            })
            return
        }

        if (!formData.category) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please select a certificate category."
            })
            return
        }

        if (!formData.certificate) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please select a certificate."
            })
            return
        }

        if (formData.users?.length === 0) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please select at least one user."
            })
            return
        }

        try {
            setLoading(true)

            let forms = [] as FormStructure[]
            const { get, child, ref } = await import('firebase/database')
            const { realTimeDatabase } = await import('@/utils/Firebase')
            const snapshot = await get(child(ref(realTimeDatabase), `forms/`))
            if (snapshot.exists()) {
                // setData(Object.values(snapshot.val()) || [])
                forms = Object.values(snapshot.val()) || []
            }

            // Make individual API calls for each user using Promise.all
            const promises = formData.users.map(user =>
                fetch('/api/form', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        sheetId: forms.find((form: FormStructure) => form.title.toLowerCase() === 'certificate')?.sheetId,
                        fields: {
                            selectedTemplate: formData.selectedTemplate?._id,
                            certificate: displayEvents.find(e => e._id === formData.certificate)?.title,
                            category: formData.category,
                            Name: user.name,
                            eventDate: new Date(displayEvents.find(e => e._id === formData.certificate)?.eventDate!)
                            
                        },
                        sequence:[{
                            name:'Name',
                        },{
                            name:'selectedTemplate',
                        },{
                            name:'certificate',
                        },{
                            name:'category',
                        },{
                            name:'eventDate'
                        }],
                        user
                    }),
                })
            )

            const responses = await Promise.all(promises)

            // Check if all responses are successful
            const failedResponses = responses.filter(res => !res.ok)
            if (failedResponses.length > 0) {
                throw new Error('Some certificate generations failed')
            }

            toast({
                title: "Success",
                description: `Successfully issued ${formData.users?.length} certificates.`
            })

            // Reset form
            setFormData({
                selectedTemplate: null,
                category: "",
                certificate: "",
                users: []
            })
            setSelectedTemplate(null)
            setSelectAll(false)

        } catch (error) {
            console.error('Error issuing certificates:', error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to issue certificates. Please try again."
            })
        } finally {
            setLoading(false)
        }
    }

    // Use mock data if the API hasn't returned yet
    const displayTemplates = templates?.length > 0 ? templates : []
    const displayEvents = events?.length > 0 ? events : []

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Certificate Management</h1>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left column */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>1. Select Certificate Template</CardTitle>
                                <CardDescription>
                                    Choose an existing certificate template
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {displayTemplates.map((template) => (
                                        <div
                                            key={template?._id! as string}
                                            className={`border rounded-lg p-2 cursor-pointer ${formData.selectedTemplate?._id === template._id ? 'border-primary ring-2 ring-primary ring-opacity-50' : 'border-gray-200'
                                                }`}
                                            onClick={() => handleTemplateSelect(template._id! as string)}
                                        >
                                            <div className="relative aspect-[16/9] mb-2">
                                                <img
                                                    src={template.templateUrl || "/api/placeholder/400/320"}
                                                    alt={template.templateUrl}
                                                    className="rounded object-cover w-full h-full"
                                                />
                                            </div>
                                            <div className="text-center font-medium">{template?.createdAt as any}</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>2. Certificate Details</CardTitle>
                                <CardDescription>
                                    Select certificate category and related certificate
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Certificate Category</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) => handleSelectChange('category', value)}
                                    >
                                        <SelectTrigger id="category">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {CERTIFICATE_CATEGORIES.map(category => (
                                                    <SelectItem key={category} value={category}>
                                                        {category}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="certificate">Certificate</Label>
                                    <Select
                                        value={formData.certificate}
                                        onValueChange={(value) => handleSelectChange('certificate', value)}
                                    >
                                        <SelectTrigger id="certificate">
                                            <SelectValue placeholder="Select certificate" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {displayEvents.map(event => (
                                                    <SelectItem key={event._id} value={event._id}>
                                                        {event.title} ({new Date(event.eventDate).toLocaleDateString()})
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right column */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>3. Select Recipients</CardTitle>
                                <CardDescription>
                                    Choose users who will receive this certificate
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4">
                                    <Input
                                        type="text"
                                        placeholder="Search users..."
                                        className="w-full"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                    />
                                </div>

                                <div className="flex items-center mb-4 pb-2 border-b">
                                    <Checkbox
                                        id="select-all"
                                        checked={selectAll && filteredUsers.length > 0}
                                        onCheckedChange={handleSelectAllToggle}
                                        disabled={filteredUsers.length === 0}
                                    />
                                    <Label htmlFor="select-all" className="ml-2 font-medium">
                                        Select All
                                    </Label>
                                </div>

                                <ScrollArea className="h-64 border rounded-md p-4">
                                    <div className="space-y-4">
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map((user) => (
                                                <div key={user._id} className="flex items-center space-x-3">
                                                    <Checkbox
                                                        id={`user-${user._id}`}
                                                        checked={formData.users.some(u => u._id === user._id)}
                                                        onCheckedChange={() => handleUserToggle(user)}
                                                    />
                                                    <div className="flex items-center space-x-3">
                                                        <Avatar>
                                                            <AvatarImage src={user?.image!} alt={user.name} />
                                                            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <Label htmlFor={`user-${user._id!}`} className="font-medium">
                                                                {user.name}
                                                            </Label>
                                                            <div className="text-sm text-gray-500">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-4 text-gray-500">
                                                {searchQuery ? "No users match your search" : "No users available"}
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>

                                <div className="mt-4 text-sm text-gray-500">
                                    Selected: {formData.users?.length} user{formData.users?.length !== 1 ? 's' : ''}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Preview & Submit</CardTitle>
                                <CardDescription>
                                    Review your selections and issue certificates
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {selectedTemplate ? (
                                    <div className="text-center mb-4">
                                        <div className="relative aspect-[16/9] mb-2 mx-auto max-w-sm">
                                            <img
                                                src={selectedTemplate.templateUrl || "/api/placeholder/400/320"}
                                                alt={selectedTemplate.templateUrl}
                                                className="rounded object-cover w-full h-full"
                                            />
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Template: <span className="font-medium">{selectedTemplate.createdAt as any}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center p-8 text-gray-500 italic">
                                        Please select a template to see preview
                                    </div>
                                )}

                                <div className="space-y-2 text-sm mt-4">
                                    {formData.category && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Category:</span>
                                            <span className="font-medium">{formData.category}</span>
                                        </div>
                                    )}

                                    {formData.certificate && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Certificate:</span>
                                            <span className="font-medium">
                                                {displayEvents.find(e => e._id === formData.certificate)?.title}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Recipients:</span>
                                        <span className="font-medium">{formData.users?.length} selected</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={loading || !formData.selectedTemplate || !formData.category || !formData.certificate || formData.users?.length === 0}
                                >
                                    {loading ? "Processing..." : "Issue Certificates"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    )
}