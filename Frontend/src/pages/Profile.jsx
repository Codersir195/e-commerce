import React, { useState } from 'react'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Label } from '@radix-ui/react-label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useParams } from 'react-router-dom'
import UserLogo from '../assets/usersicon.jpeg'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import { setUser } from '@/redux/userSlice'
import { Loader2 } from 'lucide-react'
import MyOrder from './MyOrder'

export default function Profile() {
    const { user } = useSelector(store => store.user)
    const params = useParams()
    const userId = params.userId;
    const [updateUser, setUpdateUser] = useState({
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        phoneNo: user?.phoneNo,
        address: user?.address,
        city: user?.city,
        zipCode: user?.zipCode,
        profilePic: user?.profilePic,
        role: user?.role
    })

    const [file, setFile] = useState(null);
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setUpdateUser({ ...updateUser, [e.target.name]: e.target.value })
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile)
        setUpdateUser({ ...updateUser, profilePic: URL.createObjectURL(selectedFile) }) // preview only
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const accessToken = localStorage.getItem("accessToken")
        try {
            setLoading(true)
            // use formData for text + file
            const formData = new FormData()
            formData.append("firstName", updateUser.firstName)
            formData.append("lastName", updateUser.lastName)
            formData.append("email", updateUser.email)
            formData.append("phoneNo", updateUser.phoneNo)
            formData.append("address", updateUser.address)
            formData.append("city", updateUser.city)
            formData.append("role", updateUser.role)

            if (file) {
                formData.append("file", file)   // image file for backend multer
            }
            const res = await axios.put(`${import.meta.env.VITE_URL}/api/user/update/${userId}`, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "multipart/form-data"
                }
            })
            if (res.data.success) {
                toast.success(res.data.message)
                dispatch(setUser(res.data.user))
            }
        } catch (error) {
            console.log(error)
            toast.error("Faild to Update Profile")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='pt-20 min-h-screen bg-gray-100'>
            <Tabs defaultValue="profile" className="max-w-7xl mx-auto items-center">
                <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                    <div>
                        <div className='flex flex-col justify-center items-cennter bg-gray-100'>
                            <h1 className='font-bold mb-7 text-2xl text-gray-800'>Update Profile</h1>
                            <div className='w-full flex gap-10 justify-between items-start px7 max-w-2xl'>
                                {/* profile picture  */}
                                <div className='flex flex-col items-center '>
                                    <img src={updateUser?.profilePic || UserLogo} alt="profile" className='w-32 h-32 rounded-full object-cover border-4 border-pink-800' />
                                    <Label className='mt-4 cursor-pointer bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700'>Change Picture <input type="file" accept='image/*' onChange={handleFileChange} className='hidden' /></Label>
                                </div>
                                {/* profile form  */}
                                <form onSubmit={handleSubmit} className='space-y-4 shadow-lg p-5 rounded-lg bg-white'>
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div>
                                            <Label className='block text-sm font-medium'>First Name</Label>
                                            <Input type='text'
                                                name='firstName'
                                                placeholder='Sachin'
                                                value={updateUser.firstName}
                                                onChange={handleChange}
                                                className='w-full border rounded-lg px-3 py-2 mt-1' />
                                        </div>
                                        <div>
                                            <Label className='block text-sm font-medium'>Last Name</Label>
                                            <Input type='text'
                                                name='lastName'
                                                placeholder='Chaupal'
                                                value={updateUser.lastName}
                                                onChange={handleChange}
                                                className='w-full border rounded-lg px-3 py-2 mt-1' />
                                        </div>
                                    </div>
                                    <div>
                                        <Label className='block text-sm font-medium'>Email</Label>
                                        <Input type='email'
                                            name='email'
                                            disabled
                                            value={updateUser.email}
                                            onChange={handleChange}
                                            className='w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed' />
                                    </div>
                                    <div>
                                        <Label className='block text-sm font-medium'>Phone Number</Label>
                                        <Input type='text'
                                            name='phoneNo'
                                            placeholder='Enter Your Contact No'
                                            value={updateUser.phoneNo}
                                            onChange={handleChange}
                                            className='w-full border rounded-lg px-3 py-2 mt-1' />
                                    </div>
                                    <div>
                                        <Label className='block text-sm font-medium'>Address</Label>
                                        <Input type='text'
                                            name='address'
                                            placeholder='Enter Your Address'
                                            value={updateUser.address}
                                            onChange={handleChange}
                                            className='w-full border rounded-lg px-3 py-2 mt-1' />
                                    </div>
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div>
                                            <Label className='block text-sm font-medium'>City</Label>
                                            <Input type='text'
                                                name='city'
                                                placeholder='Enter Your City'
                                                value={updateUser.city}
                                                onChange={handleChange}
                                                className='w-full border rounded-lg px-3 py-2 mt-1' />
                                        </div>
                                        <div>
                                            <Label className='block text-sm font-medium'>Zip Code</Label>
                                            <Input type='text'
                                                name='zipCode'
                                                placeholder='Enter Your Zip Code'
                                                value={updateUser.zipCode}
                                                onChange={handleChange}
                                                className='w-full border rounded-lg px-3 py-2 mt-1' />
                                        </div>
                                    </div>
                                    <Button type='submit' className='w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-lg'> {loading ? <><Loader2 className='h-4 w-4 amimate-spin mr-2' />Please wait</> : 'Update Profile'}</Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="orders">
                    <MyOrder/>
                </TabsContent>
            </Tabs>
        </div>
    )
}
