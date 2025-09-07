'use client'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import useSession from '@/hooks/useSession'
import Image from 'next/image'
import admin from '@/assests/svg/admin.svg'



const page = () => {
  const { user } = useSession()
  // console.log(user,isAdmin)

  return (
    <div
      className="flex h-screen max-w-[1200px] mx-auto flex-wrap container  items-center justify-center "

    >
      <div
        className='flex flex-wrap gap-4 justify-center items-stretch w-full'
      >
        <div
          className='flex relative flex-1 basis-[500px] items-center justify-center gap-5 '
        >
          <Avatar>
            <AvatarImage src={user?.image} />
            <AvatarFallback
              className='text-black bg-[grey] font-bold'
            >{user?.name.split(' ').map((letter) => letter.charAt(0)).join('').toUpperCase()}</AvatarFallback>
          </Avatar>
          <h1 className='text-4xl text-[green] font-bold'>
            {user?.name}
          </h1>
          <Image
            className="overflow-clip opacity-[.9] hover:opacity-100 cursor-pointer transition-all duration-500 ease-in-out"
            style={{
              overflowClipMargin: "content-box",
            }}
            alt=""
            src={admin}
            width={30}
            height={30}
          />
        </div>
        {data.map((item, idx) => <Cards key={idx}>
          <div className='flex justify-between h-full items-center w-full'>
            <div className='flex flex-[2] basis-[350px] items-start flex-col justify-between h-full'>
              <div>
                <h1
                  className='text-4xl font-bold text-[green] mb-2'
                >{item.title}</h1>
                <p
                  className='capitalize font-bold text-[1.5rem] text-[grey] mb-2'
                >{item.subtitle}</p>
                {/* dynamic items */}
                <div
                  className='min-h-[100px] flex-grow'
                ></div>
              </div>
              {/* btns */}
              <div
                className='flex mt-7 flex-wrap gap-2 justify-start items-center'
              >
                {item.buttons?.map((button, index) => (
                  <button
                    key={index}
                    onClick={button.onClick}
                    className='bg-[#1D1D1D] text-[#ffffff77] px-3 py-1 rounded-md hover:bg-[darkgreen] transition-all duration-300 ease-in-out'
                  >
                    {button.href ? (
                      <a href={button.href} className='text-[#ffffff77]'>
                        {button.label}
                      </a>
                    ) : (
                      button.label
                    )}
                  </button>
                ))}
              </div>
            </div>
            {/* icons */}
            <div
              className='flex flex-1 basis-[100px] justify-center items-center'
            >
              <Image
                className="overflow-clip opacity-[.9] hover:opacity-100 cursor-pointer transition-all duration-500 ease-in-out"
                style={{
                  overflowClipMargin: "content-box",
                }}
                alt=""
                src={item.image}
                width={180}
                height={180}
              />
            </div>
          </div>
        </Cards>)}
      </div>
    </div>
  )
}

export default page

const data = [
  {
    title: 'Forms',
    description: 'Manage all the forms here',
    image: require('@/assests/svg/google-form.svg'),
    subtitle: 'recent forms',
    buttons: [
      {
        label: 'New Form',
        href: '/admin/forms/new',
      }, {
        label: 'View All',
        href: '/admin/forms'
      }, {
        label: 'Delete Forms',
        onClick: () => alert('Delete functionality not implemented yet')
      }
    ]
  }, {
    title: 'Users',
    description: 'Manage all the users here',
    image: require('@/assests/svg/users.svg'),
    subtitle: 'System Admin Users',
    buttons: [
      {
        label: 'All User',
        href: '/admin/users/',
      }, {
        label: 'Delete User',
        onClick: () => alert('Delete functionality not implemented yet')
      }, {
        label: 'Ban User',
        onClick: () => alert('Ban functionality not implemented yet')
      }, {
        label: 'Add User',
        href: '/admin/users/new'
      }
    ]
  }, {
    title: 'Events',
    description: 'Manage all the events here',
    image: require('@/assests/svg/events.svg'),
    subtitle: 'recent events',
    buttons: [
      {
        label: 'New Event',
        href: '/admin/events/new',
      }, {
        label: 'View All',
        href: '/admin/events'
      }, {
        label: 'Delete Events',
        onClick: () => alert('Delete functionality not implemented yet')
      }
    ]
  }, {
    title: 'Blogs',
    description: 'Manage all the blogs here',
    image: require('@/assests/svg/blog.svg'),
    subtitle: 'recent blogs',
    buttons: [
      {
        label: 'New Blog',
        href: '/admin/blogs/new'
      }, {
        label: 'View All Blogs',
        href: '/admin/blogs'
      }, {
        label: 'Delete Blogs',
        onClick: () => alert('Delete functionality not implemented yet')
      }
    ]
  }, {
    title: 'Contacts',
    description: 'Manage all the contacts here',
    image: require('@/assests/svg/contact.svg'),
    subtitle: 'recent contacts messages',
    buttons: [
      {
        label: 'View Contacts Messages',
        href: '/admin/contacts'
      }
    ]
  }, {
    title: 'Certificates',
    description: 'Manage all the certificates here',
    image: require('@/assests/svg/certificate.svg'),
    subtitle: 'recent certificates',
  }
]

const Cards = ({ children }: {
  children: React.ReactNode
}) => {
  return (
    <div
      className='flex min-h-[300px] bg-[#141313] basis-[500px] rounded-[12px] p-6 m-2 flex-1 flex-col justify-start items-stretch'
    >
      {children}
    </div>
  )
}