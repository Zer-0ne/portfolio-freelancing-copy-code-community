'use client'

import { RootState } from '@/store/store'
import { FormStructure } from '@/utils/Interfaces'
import { update } from '@/utils/ToastConfig'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import DeleteIcon from '@mui/icons-material/Delete'
import DrawIcon from '@mui/icons-material/Draw'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

const Page = () => {
  const { session } = useSelector((state: RootState) => state.session)
  const [data, setData] = useState<FormStructure[]>([])

  useEffect(() => {
    const fetchForms = async () => {
      const { get, child, ref } = await import('firebase/database')
      const { realTimeDatabase } = await import('@/utils/Firebase')
      const snapshot = await get(child(ref(realTimeDatabase), `forms/`))
      if (snapshot.exists()) {
        setData(Object.values(snapshot.val()) || [])
      }
    }
    fetchForms()
  }, [])

  return (
    <div className="min-h-screen text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-6 justify-center">
          {['admin', 'moderator'].includes(session[0]?.role) && (
            <Link
              href={`/forms/create/${Date.now()}`}
              className="flex items-center justify-center rounded-xl p-6 border-2 border-dashed border-green-500/40 bg-white/5 dark:bg-black/10 backdrop-blur-lg hover:bg-white/10 dark:hover:bg-black/20 transition-all duration-300 ease-in-out text-green-400 font-medium text-lg basis-[250px] grow-0 shrink-0 shadow-lg hover:shadow-xl"
            >
              Create a new form
            </Link>
          )}
          {data.map((item, index) => (
            <FormCard key={index} item={item} session={session} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Page

interface FormCardProps {
  item: FormStructure
  session: any
}

const FormCard: React.FC<FormCardProps> = ({ item, session }) => {
  const [isAccepting, setIsAccepting] = useState<boolean>(item['Accepting Response'])
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [confirmText, setConfirmText] = useState<string>('')

  const handleToggle = () => {
    setIsAccepting((prev) => !prev)
  }

  useEffect(() => {
    const write = async () => {
      if (!['admin', 'moderator'].includes(session[0]?.role)) return
      const { set, ref, get, child } = await import('firebase/database')
      const { realTimeDatabase } = await import('@/utils/Firebase')
      const snapshot = await get(child(ref(realTimeDatabase), `forms/${item._id}`))
      if (snapshot.exists()) {
        await set(ref(realTimeDatabase, `forms/${item._id}`), {
          ...snapshot.val(),
          'Accepting Response': isAccepting,
        })
      }
    }
    write()
  }, [isAccepting, item._id, session])

  const deleteForm = async () => {
    if (confirmText !== item.title) {
      toast.error('Form title does not match!')
      return
    }

    const Toast = toast.loading('Deleting form...')
    try {
      if (!['admin', 'moderator'].includes(session[0]?.role)) {
        throw new Error('You are not authorized')
      }

      const response = await fetch(`/api/sheet/${item?.sheetId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const errorMessage = await response.text()
        throw new Error(`Failed to delete sheet: ${errorMessage}`)
      }

      const { realTimeDatabase } = await import('@/utils/Firebase')
      const { ref, remove } = await import('firebase/database')
      const formsRef = ref(realTimeDatabase, `forms/${item._id}`)
      await remove(formsRef)

      toast.update(Toast, update('Form deleted successfully!', 'success'))
      setIsDialogOpen(false)
      setConfirmText('')
    } catch (error) {
      console.error(error)
      toast.update(Toast, update('Something went wrong!', 'error'))
    }
  }

  return (
    <div className="relative flex flex-col bg-white/5 dark:bg-black/10 backdrop-blur-lg hover:bg-white/10 dark:hover:bg-black/20 transition-all duration-300 ease-in-out basis-[250px] grow-0 shrink-0 shadow-lg hover:shadow-xl">
      {/* Header Section: Actions and Toggle */}
      <div className={`flex justify-between ${session[0] && ['admin', 'moderator'].includes(session[0]?.role) && 'rounded-xl border-2 border-dashed p-6 py-1 rounded-b-none '} items-center mb-4`}>
        {/* Actions for Admins/Moderators */}
        {session[0] && ['admin', 'moderator'].includes(session[0]?.role) && (
          <div className="flex gap-2 items-center">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-400 hover:text-red-500 dark:hover:text-red-300 transition-colors duration-200"
                >
                  <DeleteIcon className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white/10 dark:bg-black/20 backdrop-blur-lg border border-white/20 text-gray-200">
                <DialogHeader>
                  <DialogTitle>Delete Form</DialogTitle>
                  <DialogDescription>
                    To confirm, type the form title "{item.title}" below.
                  </DialogDescription>
                </DialogHeader>
                <Input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Enter form title"
                  className="bg-white/5 dark:bg-black/10 border-white/20 text-gray-200 placeholder-gray-400"
                />
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="bg-white/10 dark:bg-black/20 border-white/20 text-gray-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={deleteForm}
                    disabled={confirmText !== item.title}
                  >
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Link href={`/forms/create/${item._id}`}>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-gray-300 transition-colors duration-200"
              >
                <DrawIcon className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        )}
        {/* Toggle Switch */}
        {['admin', 'moderator'].includes(session[0]?.role) && (
          <Switch
            checked={isAccepting}
            onCheckedChange={handleToggle}
            className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-500"
          />
        )}
      </div>

      {/* Form Title Link */}
      <Link href={`forms/${item._id}`} className={`justify-center hover:text-green-400 transition-colors duration-200 flex-1 rounded-xl p-6 border-2 border-dashed border-white/20  ${session[0] && ['admin', 'moderator'].includes(session[0]?.role) && 'rounded-t-none'} w-full text-center`}>
        <div className="text-gray-100 font-semibold text-lg hover:text-green-400 transition-colors duration-200">
          {item.title as string}
        </div>
      </Link>
    </div>
  )
}