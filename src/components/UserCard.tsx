'use client'

import { Delete, Done, NotInterested } from '@mui/icons-material'
import React, { useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Data } from '@/utils/Interfaces'
import { editPost } from '@/utils/FetchFromApi'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { roles } from '@/utils/constant'

// Define props interface for TypeScript
interface UserCardProps {
    item: Data
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    setIsUpdate: React.Dispatch<React.SetStateAction<Data | undefined>>
    fetchedUser: () => Promise<void>
}

const UserCard: React.FC<UserCardProps> = ({
    item,
    setOpen,
    setIsUpdate,
    fetchedUser,
}) => {
    const { session } = useSelector((state: RootState) => state.session)
    const [data, setData] = useState<Data | undefined>(undefined)

    const userRole = item.role as string

    // Sort roles with user's role at the top
    roles.sort((a, b) => {
        if (a === userRole) return -1
        if (b === userRole) return 1
        return roles.indexOf(a) - roles.indexOf(b)
    })

    // Handle edit action
    const handleEdit = async () => {
        if (!data) return
        const changedValues = Object.entries(data)
            .filter(([key, value]) => value !== item[key])
            .reduce((obj, [key, value]) => {
                obj[key] = value
                return obj
            }, {} as Data)
        await editPost(item.username as string, changedValues, 'user')
        await fetchedUser()
    }

    return (
        <>
            {/* Top Card Section with Glassmorphism */}
            <div
                className="flex justify-between gap-4 p-4 rounded-t-xl bg-white/10 dark:bg-black/20 backdrop-blur-lg border border-white/20 shadow-lg z-10 flex-wrap transition-all duration-300 hover:shadow-xl"
            >
                {/* Left Section: Avatar and Name */}
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={item.image as string} alt={item.name as string} />
                            <AvatarFallback>{(item.name as string)?.[0] as any}</AvatarFallback>
                        </Avatar>
                        {/* Ambient shadow effect */}
                        <div
                            className="absolute inset-0 -z-10 rounded-full blur-md bg-cover bg-center"
                            style={{ backgroundImage: `url('${item.image}')` }}
                        />
                    </div>
                    <span className="text-base font-medium text-gray-900 dark:text-white">
                        {item.name as string}
                    </span>
                </div>

                {/* Right Section: Actions */}
                {item.username !== session[0]?.username && (
                    <div className="flex items-center gap-3">
                        {/* Role Dropdown with Glassmorphism */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="bg-white/10 dark:bg-black/20 backdrop-blur-md border-white/20 text-gray-800 dark:text-gray-200 hover:bg-white/20 dark:hover:bg-black/30 transition-all duration-200"
                                >
                                    {data?.role as string || item?.role as string}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-white/10 dark:bg-black/20 backdrop-blur-lg border border-white/20 text-gray-800 dark:text-gray-200">
                                {roles.map((role) => (
                                    <DropdownMenuItem
                                        key={role}
                                        onClick={() => setData({ ...item, role })}
                                        className="p-2 hover:bg-white/20 dark:hover:bg-black/30 transition-colors duration-200"
                                    >
                                        {role}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Ban Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                        >
                            <NotInterested className="h-5 w-5" />
                        </Button>

                        {/* Edit Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-green-500 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                            onClick={handleEdit}
                        >
                            <Done className="h-5 w-5" />
                        </Button>

                        {/* Delete Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                            onClick={() => {
                                setOpen(true)
                                setIsUpdate(item)
                            }}
                        >
                            <Delete className="h-5 w-5" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Bottom Card Section with Glassmorphism */}
            <div
                className="flex justify-around gap-4 p-4 rounded-b-xl bg-white/10 dark:bg-black/20 backdrop-blur-lg border border-white/20 shadow-lg mb-5 flex-wrap transition-all duration-300 hover:shadow-xl"
            >
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {item.username as string}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {item.email as string}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {item.role as string}
                </span>
            </div>
        </>
    )
}

export default UserCard