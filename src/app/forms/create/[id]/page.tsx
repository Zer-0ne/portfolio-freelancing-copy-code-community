'use client'
import { RootState } from '@/store/store'
import { Data } from '@/utils/Interfaces'
import { colors } from '@/utils/colors'
import { child, get, ref, set } from 'firebase/database'
import { notFound, useParams } from 'next/navigation'
import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import Image from 'next/image'
import GoogleDrive from '@/assests/svg/drive.svg'

// Shadcn Components
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Icons
import { Trash2, GripVertical, Plus, FolderOpen, Settings, FolderX } from 'lucide-react'

// Drag and Drop
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
    useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/lib/utils'
import { deletePost } from '@/utils/FetchFromApi'

const page = () => {
    const [array, setArray] = useState<Data[]>([])
    const { session } = useSelector((state: RootState) => state.session)
    const [data, setdata] = useState<Data>()
    const [isDisabled, setIsDisabled] = useState<boolean>(false)
    const [currentSelectedField, setCurrentSelectedField] = useState<number>()
    const { id }: any = useParams()
    const [isCreating, setIsCreating] = useState(false)
    const isCertificateForm = data?.title === 'Certificate'
    const [verifiedUser, setVerifiedUser] = useState(true)
    const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false)
    
    // Refs to track debounce timeouts
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const sheetTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const initialLoadRef = useRef(false) // Track if this is initial load

    // Drag and drop sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const addField = () => {
        const newField = { 
            id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: '',
            type: 'text'
        }
        setArray([...array, newField])
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (active.id !== over?.id) {
            setArray((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id)
                const newIndex = items.findIndex((item) => item.id === over?.id)
                
                const newArray = arrayMove(items, oldIndex, newIndex)
                console.log('Drag ended:', {
                    from: oldIndex,
                    to: newIndex,
                    newOrder: newArray.map((f, i) => `${i}: ${f.name || 'unnamed'} (${f.id})`)
                })
                return newArray
            })
        }
    }

    if (!['admin', 'moderator'].includes(session[0]?.role) && session[0]) return notFound()

    // Sheet creation effect - only when title changes and no sheet exists
    useEffect(() => {
        if (!data?.title || data?.sheetId || isCreating || !array.length || !hasInitiallyLoaded) return
        
        // Clear existing timeout
        if (sheetTimeoutRef.current) {
            clearTimeout(sheetTimeoutRef.current)
        }
        
        sheetTimeoutRef.current = setTimeout(async () => {
            setIsCreating(true)
            try {
                const { createNew } = await import('@/utils/FetchFromApi')
                const nameArray = array.map((obj: Data) => obj?.name)
                
                const response = await createNew({
                    functionality: 'create',
                    fields: [...nameArray],
                    title: data.title
                }, 'form', setIsDisabled)
                
                setdata(prev => ({
                    ...prev,
                    sheetId: response.data.spreadsheetId
                }))
            } catch (error) {
                console.error('Sheet creation failed:', error)
            } finally {
                setIsCreating(false)
            }
        }, 2000) // 2 seconds for sheet creation
        
        return () => {
            if (sheetTimeoutRef.current) {
                clearTimeout(sheetTimeoutRef.current)
            }
        }
    }, [data?.title, array.length, hasInitiallyLoaded])

    // Firebase save effect - debounced but skip on initial load
    useEffect(() => {
        // Skip saving during initial load
        if (!data || !array.length || !hasInitiallyLoaded || initialLoadRef.current) {
            if (initialLoadRef.current) {
                initialLoadRef.current = false // Reset after first skip
            }
            return
        }
        
        // Clear existing timeout
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current)
        }
        
        saveTimeoutRef.current = setTimeout(async () => {
            try {
                const { realTimeDatabase } = await import('@/utils/Firebase')
                setCurrentSelectedField(array.length - 1)
                
                await set(ref(realTimeDatabase, `forms/${id}`), {
                    _id: id,
                    'Accepting Response': true,
                    ...data,
                    fields: array,
                    verifiedUser,
                })
                console.log('✅ Saved to Firebase:', { 
                    fields: array.length, 
                    order: array.map((f, i) => `${i}: ${f.name || 'unnamed'} (${f.id})`)
                })
            } catch (error) {
                console.error('Firebase save failed:', error)
            }
        }, 1000) // 1 second for Firebase saves
        
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current)
            }
        }
    }, [array, data, verifiedUser, hasInitiallyLoaded])

    // Initial data fetch - only once
    useEffect(() => {
        const fetch = async () => {
            try {
                const { realTimeDatabase } = await import('@/utils/Firebase')
                const snapshot = await get(child(ref(realTimeDatabase), `forms/${id}`))
                if (snapshot.exists()) {
                    const formData = snapshot.val()
                    setdata(formData)
                    
                    // Ensure each field has a UNIQUE ID for drag and drop
                    const fieldsWithIds = (formData?.fields || []).map((field: Data, index: number) => ({
                        ...field,
                        id: field.id || `field-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`
                    }))
                    
                    console.log('📥 Loaded from Firebase:', { 
                        fields: fieldsWithIds.length, 
                        order: fieldsWithIds.map((f: { name: any; id: any }, i: any) => `${i}: ${f.name || 'unnamed'} (${f.id})`)
                    })
                    
                    setArray(fieldsWithIds)
                    
                    if (typeof formData?.verifiedUser === 'boolean') {
                        setVerifiedUser(formData.verifiedUser)
                    }
                    
                    initialLoadRef.current = true // Mark as initial load
                }
            } catch (error) {
                console.error('Failed to fetch form data:', error)
            } finally {
                setHasInitiallyLoaded(true)
            }
        }
        
        if (id && !hasInitiallyLoaded) {
            fetch()
        }
    }, [id])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setdata((prev?: Data) => ({ ...prev, [name]: value }))
    }

    const handleCreateFolder = async () => {
        if (data && !data['folderId']) {
            const { createNew } = await import('@/utils/FetchFromApi')
            const { folderId } = await createNew({
                folderName: data?.title
            }, 'drive/files/upload')
            setdata(data => ({ ...data, folderId }))
        }
    }

    const handleDeleteFolder = async () => {
        if (data && data['folderId']) {
            try {
                const isDeleted = await deletePost(data?.folderId as string, 'drive/files/get')
                if (isDeleted) {
                    setdata(prev => {
                        const { folderId, ...rest } = prev || {}
                        return rest as Data
                    })
                }
            } catch (error) {
                console.error('Error deleting folder:', error)
            }
        }
    }

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current)
            }
            if (sheetTimeoutRef.current) {
                clearTimeout(sheetTimeoutRef.current)
            }
        }
    }, [])

    return (
        <div className='container max-w-4xl mx-auto my-6 px-4 space-y-6'>
            {/* Header Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-foreground">Form Builder</h1>
                    <Badge
                        variant={verifiedUser ? "default" : "secondary"}
                        className={`text-sm transition-all duration-200 ${verifiedUser
                            ? 'bg-green-500/20 text-green-500 border-green-500/30'
                            : 'bg-secondary text-secondary-foreground border-border'
                            }`}
                    >
                        {verifiedUser ? "Verified Users Only" : "All Users"}
                    </Badge>
                </div>

                {/* Global verified user toggle */}
                <Card className="bg-card border-border hover:border-gray-50 transition-all duration-200 shadow-sm hover:shadow-md">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label htmlFor="verified-user" className="text-base font-medium text-card-foreground">
                                    Verified User Requirement
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Only verified users can submit this form
                                </p>
                            </div>
                            <Switch
                                id="verified-user"
                                checked={verifiedUser}
                                onCheckedChange={setVerifiedUser}
                                disabled={isCertificateForm}
                                className="data-[state=checked]:bg-green-500 focus-visible:ring-2 focus-visible:ring-green-500/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Form Header */}
            <Card className="bg-card border-border hover:border-gray-50 transition-all duration-200 shadow-sm hover:shadow-md">
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-lg font-semibold text-card-foreground">Form Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={data?.title as string || ''}
                            onChange={handleChange}
                            placeholder="Enter form title"
                            className="text-2xl font-bold border-none px-0 focus-visible:ring-0 bg-transparent text-card-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-b-2 focus-visible:border-green-500 transition-all duration-200"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="subtitle" className="text-base font-medium text-card-foreground">Description</Label>
                        <Textarea
                            id="subtitle"
                            name="subtitle"
                            value={data?.subtitle as string || ''}
                            onChange={handleChange}
                            placeholder="Enter form description"
                            rows={3}
                            className="resize-none border-none px-0 focus-visible:ring-0 bg-transparent text-card-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-b-2 focus-visible:border-green-500 transition-all duration-200"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Drag and Drop Fields */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={array.map((item) => item.id as string)} // Use proper IDs
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-4">
                        {array?.map((item: Data, index: number) => (
                            <SortableFieldContainer
                                key={item.id as string} // Use unique ID as key
                                id={item.id as string}
                                handleCreateFolder={handleCreateFolder}
                                handleDeleteFolder={handleDeleteFolder}
                                setCurrentSelectedField={setCurrentSelectedField}
                                currentSelectedField={currentSelectedField}
                                item={item}
                                setArray={setArray}
                                index={index}
                                formData={data}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {/* Add Field Button */}
            <Button
                onClick={addField}
                disabled={isDisabled}
                variant="outline"
                className="w-full h-16 border-dashed border-2 border-green-500/40 text-green-500 hover:bg-green-500/10 hover:border-green-500/60 hover:text-green-500 transition-all duration-200 bg-card focus-visible:ring-2 focus-visible:ring-green-500/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background group"
            >
                <Plus className="w-5 h-5 mr-2 transition-transform duration-200 group-hover:scale-110" />
                Add New Field
            </Button>
        </div>
    )
}

// Rest of components remain the same, but with better key usage
const SortableFieldContainer = ({ id, item, setArray, index, setCurrentSelectedField, currentSelectedField, handleCreateFolder, handleDeleteFolder, formData }: any) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div ref={setNodeRef} style={style}>
            <FieldContainer
                handleCreateFolder={handleCreateFolder}
                handleDeleteFolder={handleDeleteFolder}
                setCurrentSelectedField={setCurrentSelectedField}
                currentSelectedField={currentSelectedField}
                item={item}
                setArray={setArray}
                index={index}
                dragHandleProps={{ ...attributes, ...listeners }}
                formData={formData}
            />
        </div>
    )
}

// FieldContainer remains exactly the same as before...
const FieldContainer = ({ item, setArray, index, setCurrentSelectedField, currentSelectedField, handleCreateFolder, handleDeleteFolder, dragHandleProps, formData }: any) => {
    const [types, setTypes] = useState(item.type || 'text')
    const [data, setData] = useState<Data>()
    const [showAdvanced, setShowAdvanced] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setArray((prevArray: Data[]) => {
            const newArray: Data[] = [...prevArray]
            const updatedItem: Data = {
                ...item,
                [name]: (name === 'required') ? (e.target as any).checked : value,
                type: types
            }
            if (name === 'options') {
                const choicesArray = value.split(',').map((choice: any) => choice.trim())
                updatedItem[name] = choicesArray
            }
            newArray[index] = updatedItem
            return newArray
        })
    }

    useEffect(() => {
        data && setArray((prevArray: Data[]) => {
            const newArray: Data[] = [...prevArray]
            const updatedItem: Data = { ...item, type: types, ...data }
            newArray[index] = updatedItem
            return newArray
        })
    }, [data])

    const deleteField = (index: number) => {
        setArray((array: Data[]) => array.filter((_, i) => i !== index))
    }

    const handleClick = () => {
        setCurrentSelectedField(index)
    }

    const handleTypeChange = (newType: string) => {
        setTypes(newType)
        setArray((prevArray: Data[]) => {
            const newArray = [...prevArray]
            const updatedItem = { ...item, type: newType }
            newArray[index] = updatedItem
            return newArray
        })
    }

    const fieldTypes = [
        { value: 'text', label: 'Short Answer', icon: '📝' },
        { value: 'email', label: 'Email', icon: '📧' },
        { value: 'paragraph', label: 'Paragraph', icon: '📄' },
        { value: 'radio', label: 'Multiple Choice', icon: '🔘' },
        { value: 'file', label: 'File Upload', icon: '📎' },
        { value: 'date', label: 'Date', icon: '📅' },
        { value: 'time', label: 'Time', icon: '⏰' },
    ]

    const fileTypes = {
        image: { label: 'Images', value: 'image/*' },
        document: { label: 'Documents', value: '.doc,.docx' },
        pdf: { label: 'PDF Files', value: 'application/pdf' },
        spreadsheet: { label: 'Spreadsheets', value: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel' },
        video: { label: 'Videos', value: 'video/*' },
        audio: { label: 'Audio', value: 'audio/*' },
        zip: { label: 'ZIP Files', value: 'application/zip' }
    }

    const renderFieldSpecificOptions = () => {
        switch (types) {
            case 'text':
            case 'email':
                return (
                    <Input
                        name="placeholder"
                        value={item.placeholder as string || ''}
                        onChange={handleChange}
                        placeholder="Enter placeholder text"
                        className="mt-2 bg-input/50 text-foreground placeholder:text-muted-foreground focus-visible:border-green-500 focus-visible:ring-2 focus-visible:ring-green-500/20 transition-all duration-200"
                    />
                )
            case 'paragraph':
                return (
                    <Textarea
                        name="placeholder"
                        value={item.placeholder as string || ''}
                        onChange={handleChange}
                        placeholder="Enter placeholder text"
                        rows={3}
                        className="mt-2 bg-input/50 text-foreground placeholder:text-muted-foreground focus-visible:border-green-500 focus-visible:ring-2 focus-visible:ring-green-500/20 transition-all duration-200"
                    />
                )
            case 'radio':
                return (
                    <div className="mt-2 space-y-2">
                        <Label className="text-sm text-card-foreground">Options (comma separated)</Label>
                        <Input
                            name="options"
                            value={(item.options as string[])?.join(', ') || ''}
                            onChange={handleChange}
                            placeholder="Option 1, Option 2, Option 3"
                            className="bg-input/50 text-foreground placeholder:text-muted-foreground focus-visible:border-green-500 focus-visible:ring-2 focus-visible:ring-green-500/20 transition-all duration-200"
                        />
                    </div>
                )
            case 'file':
                return (
                    <div className="mt-4 space-y-4 p-4 bg-card rounded-lg border">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium text-card-foreground">File Upload Settings</Label>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="hover:bg-accent focus-visible:ring-2 focus-visible:ring-green-500/30 focus-visible:ring-offset-2 focus-visible:ring-offset-muted"
                            >
                                <Settings className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="specific-file"
                                checked={Boolean(item?.specificFile)}
                                onCheckedChange={(checked) => setData(prev => ({ ...prev, specificFile: checked }))}
                                className="data-[state=checked]:bg-green-500 focus-visible:ring-2 focus-visible:ring-green-500/30 focus-visible:ring-offset-2 focus-visible:ring-offset-muted"
                            />
                            <Label htmlFor="specific-file" className="text-sm text-card-foreground">
                                Restrict file types
                            </Label>
                        </div>

                        {item?.specificFile && (
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(fileTypes).map(([key, { label, value }]) => (
                                    <div key={key} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={key}
                                            checked={item?.fileType === value}
                                            onCheckedChange={() => setData(prev => ({ ...prev, fileType: value }))}
                                            className="focus-visible:ring-2 focus-visible:ring-green-500/30 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                                        />
                                        <Label htmlFor={key} className="text-sm cursor-pointer text-card-foreground">
                                            {label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <Label className="text-sm text-card-foreground">Maximum files</Label>
                            <Select
                                value={item?.maxFiles as string || '1'}
                                onValueChange={(value) => setData(prev => ({ ...prev, maxFiles: value }))}
                            >
                                <SelectTrigger className="w-20 bg-input/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border">
                                    <SelectItem value="1">1</SelectItem>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                            {!formData?.folderId ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCreateFolder}
                                    className="w-full border-green-500/40 text-green-500 hover:bg-green-500/10 hover:border-green-500/60 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-green-500/30 focus-visible:ring-offset-2 focus-visible:ring-offset-muted"
                                >
                                    <FolderOpen className="w-4 h-4 mr-2" />
                                    Create Google Drive Folder
                                </Button>
                            ) : (
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled
                                        className="border-gray-300 text-gray-500 bg-gray-50 cursor-not-allowed"
                                    >
                                        <FolderOpen className="w-4 h-4 mr-2" />
                                        Folder Created ✓
                                    </Button>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-red-500/40 text-red-500 hover:bg-red-500/10 hover:border-red-500/60 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-red-500/30 focus-visible:ring-offset-2 focus-visible:ring-offset-muted"
                                            >
                                                <FolderX className="w-4 h-4 mr-2" />
                                                Delete Folder
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="bg-card border-border">
                                            <AlertDialogHeader>
                                                <AlertDialogTitle className="text-foreground">Delete Google Drive Folder?</AlertDialogTitle>
                                                <AlertDialogDescription className="text-muted-foreground">
                                                    This will permanently delete the Google Drive folder "{formData?.title}" and all files uploaded to this form will no longer be organized in that folder. This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className="border-gray-300 text-foreground hover:bg-gray-100">
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={handleDeleteFolder}
                                                    className="bg-red-500 text-white hover:bg-red-600 focus-visible:ring-2 focus-visible:ring-red-500/30"
                                                >
                                                    Delete Folder
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            )}
                        </div>
                    </div>
                )
            case 'date':
                return <Input type="date" disabled className="mt-2 bg-input/30 border-gray-50" />
            case 'time':
                return <Input type="time" disabled className="mt-2 bg-input/30 border-gray-50" />
            default:
                return null
        }
    }

    const isSelected = currentSelectedField === index

    return (
        <Card
            className={`transition-all duration-300 cursor-pointer hover:shadow-lg bg-card group ${isSelected
                ? 'ring-2 ring-green-500/50 shadow-xl border-green-500/50 scale-[1.01]'
                : 'hover:border-green-300 shadow-sm hover:shadow-md'
                }`}
            onClick={handleClick}
        >
            <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 cursor-grab active:cursor-grabbing hover:bg-muted/80 focus-visible:ring-2 focus-visible:ring-green-500/30 focus-visible:ring-offset-2 focus-visible:ring-offset-card transition-all duration-200"
                        {...dragHandleProps}
                    >
                        <GripVertical className="w-4 h-4 text-muted-foreground group-hover:text-green-500/70 transition-colors duration-200" />
                    </Button>

                    <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                            <Input
                                name="name"
                                value={item.name as string || ''}
                                onChange={handleChange}
                                placeholder="Field name"
                                className="text-lg font-medium border-none px-0 focus-visible:ring-0 bg-transparent text-card-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-b-2 focus-visible:border-green-500 transition-all duration-200"
                            />
                            <div className="flex items-center space-x-2">
                                <Select value={types as string} onValueChange={handleTypeChange}>
                                    <SelectTrigger className="w-40 bg-input/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border-border">
                                        {fieldTypes.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                <div className="flex items-center space-x-2">
                                                    <span>{type.icon}</span>
                                                    <span>{type.label}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {isSelected && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            deleteField(index)
                                        }}
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10 focus-visible:ring-2 focus-visible:ring-destructive/30 focus-visible:ring-offset-2 focus-visible:ring-offset-card transition-all duration-200"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </div>

                        {renderFieldSpecificOptions()}

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id={`required-${index}`}
                                checked={item.required as boolean || false}
                                onCheckedChange={(checked) => {
                                    const syntheticEvent = {
                                        target: { name: 'required', checked }
                                    } as any
                                    handleChange(syntheticEvent)
                                }}
                                className="focus-visible:ring-2 focus-visible:ring-green-500/30 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 transition-all duration-200"
                            />
                            <Label htmlFor={`required-${index}`} className="text-sm cursor-pointer text-card-foreground">
                                Required field
                            </Label>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default page
