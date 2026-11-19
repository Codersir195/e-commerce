import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setUser } from '@/redux/userSlice'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const res = await axios.post(`${import.meta.env.VITE_URL}/api/user/login`, formData, {
        headers: { "Content-Type": "application/json" }
      })

      if (res.data.success) {
        navigate('/')
        dispatch(setUser(res.data.user))
        localStorage.setItem("accessToken", res.data.accessToken)
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className='flex justify-center items-center min-h-screen bg-pink-100'>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login your account</CardTitle>
          <CardDescription>
            Enter given details below to create your Account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <div className='grid gap-2'>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name='email'
                type="email"
                placeholder="Enter Email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className='relative'>
                <Input
                  id="password"
                  name='password'
                  placeholder='Enter a Password'
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange} />

                {
                  showPassword ? <EyeOff onClick={() => setShowPassword(false)} className='w-5 h-5 text-gray-700 absolute  right-5 bottom-2 cursor-pointer' />
                    : <Eye onClick={() => setShowPassword(true)} className='w-5 h-5 text-gray-700 absolute  right-5 bottom-2 cursor-pointer' />
                }
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" onClick={submitHandler} className="w-full cursor-pointer">
            {loading ? <><Loader2 className='h-4 w-4 amimate-spin mr-2' />Please wait</> : 'Login'}
          </Button>
          <p className='text-gray-700 text-sm'>Create an New account? <Link to={'/signup'} className='hover:underline cursor-pointer text-blue-800' >Signup</Link></p>
        </CardFooter>
      </Card>
    </div>
  )
}
