import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { addAddress, deleteAddress, setCard, setSelectedAddress } from '@/redux/productSlice'
import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

function AddressForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: ""
  })
  const { card, addresses, selectedAddress } = useSelector((store) => store.product)
  const [showForm, setShowForm] = useState(addresses?.length > 0 ? false : true)
  const dispatch = useDispatch()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    dispatch(addAddress(formData))
    setShowForm(false)
  }

  const subtotal = card.totalPrice;
  const shipping = subtotal > 50 ? 0 : 10
  const tax = parseFloat((subtotal * 0.05).toFixed(2))
  const total = subtotal + shipping + tax
  const accessToken = localStorage.getItem("accessToken")
  const navigate = useNavigate()

  const handlePayment = async () => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_URL}/api/orders/create-order`, {
        products: card?.items?.map(item => ({
          productId: item.productId._id,
          quantity: item.quantity
        })),
        tax,
        shipping,
        amount: total,
        currency: "INR"
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (!data.success) {
        return toast.error("Something went wrong")
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        order_id: data.order.id,
        name: "ECard",
        discription: "Order Payment",
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(`${import.meta.env.VITE_URL}/api/orders/verify-payment`,
              response, {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            })

            if (verifyRes.data.success) {
              toast.success("✅ Payment Successfull!")
              dispatch(setCard({ items: [], totalPrice: 0 }))
              navigate("/order-success")
            } else {
              toast.error("❌ Payment verifaction faild")
            }
          } catch (error) {
            console.log(error);
            
            toast.error("Error verifying Payment")
          }
        },
        module: {
          ondismiss: async function () {
            // handle user closing the pop
            await axios.post(`${import.meta.env.VITE_URL}/api/orders/verify-payment`, {
              razorpay_order_id: data.order.id,
              paymentFailed: true,
            }, {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            })
            toast.error("Payment cancelled or failed")
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone
        },
        theme: { color: "#F472B6" }
      };

      const rzp = new window.Razorpay(options)

      //listen for payment failed
      rzp.on("Payment.failed", async function (response) {
        await axios.post(`${import.meta.env.VITE_URL}/api/orders/verify-payment`, {
          razorpay_order_id: data.order.id,
          paymentFailed: true
        }, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })

        toast.error("Payment Failed. Please try again")
      })

      rzp.open()
    } catch (error) {
      console.error(error)
      toast.error("Something went Wrong while processing payment")
    }
  }

  return (
    <div className='max-w-7xl mx-auto grid place-items-center p-10'>
      <div className='grid grid-cols-2 items-start gap-20 mt-10 max-w-7xl mx-auto'>
        <div className='space-y-4 p-6 bg-white'>
          {
            showForm ? (
              <>
                <div>
                  <Label htmlFor='fullName'>Full Name</Label>
                  <Input
                    id='fullName'
                    name='fullName'
                    placeholder='Sachin Chaupal'
                    required
                    value={formData.fullName}
                    onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor='phone'>Phone Number</Label>
                  <Input
                    id='phone'
                    name='phone'
                    placeholder='+19 7894589612'
                    value={formData.phone}
                    onChange={handleChange}
                    required />
                </div>
                <div>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    name='email'
                    placeholder='sachin@gmail.com'
                    value={formData.email}
                    onChange={handleChange}
                    required />
                </div>
                <div>
                  <Label htmlFor='address'>Address</Label>
                  <Input
                    id='address'
                    name='address'
                    placeholder='123 State, Area'
                    value={formData.address}
                    onChange={handleChange}
                    required />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='city'>City</Label>
                    <Input
                      id='city'
                      name='city'
                      placeholder='Madhubani'
                      value={formData.city}
                      onChange={handleChange}
                      required />
                  </div>
                  <div>
                    <Label htmlFor='state'>State</Label>
                    <Input
                      id='state'
                      name='state'
                      placeholder='Bihar'
                      value={formData.state}
                      onChange={handleChange}
                      required />
                  </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='zip'>Zip Code</Label>
                    <Input
                      id='zip'
                      name='zip'
                      placeholder='847236'
                      value={formData.zip}
                      onChange={handleChange}
                      required />
                  </div>
                  <div>
                    <Label htmlFor='country'>Country</Label>
                    <Input
                      id='country'
                      name='country'
                      placeholder='India'
                      value={formData.country}
                      onChange={handleChange}
                      required />
                  </div>
                </div>
                <Button onClick={handleSave} className='w-full'>Save & Continue</Button>
              </>
            ) : (
              <div className='space-y-4'>
                <h2 className='text-lg font-semibold'>Saved Addresses</h2>
                {
                  addresses.map((addr, idx) => {
                    return <div onClick={() => dispatch(setSelectedAddress(idx))} key={idx} className={`border p-4 rounded-md cursor-pointer relative ${selectedAddress === idx ? "border-pink-600 bg-pink-50" : "border-gray-300"}`}>
                      <p className='font-medium'>{addr.fullName}</p>
                      <p>{addr.phone}</p>
                      <p>{addr.email}</p>
                      <p>{addr.address}, {addr.city}, {addr.state}, {addr.zip}, {addr.country}</p>
                      <button onClick={(e) => dispatch(deleteAddress(idx))} className='absolute top-2 right-2 text-red-700 hover:text-red-700 text-sm'>Delete</button>
                    </div>
                  })
                }
                <Button variant='outline' className='w-full' onClick={() => setShowForm(true)}> + Add New Address</Button>
                <Button disabled={selectedAddress === null}  onClick={handlePayment} className='w-full bg-pink-600'>Proceed To Checkout</Button>
              </div>
            )
          }
        </div>

        {/* right side order summary  */}
        <div>
          <Card className='w-100'>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex justify-between'>
                <span>Subtotal ({card?.items?.length}) items</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className='flex justify-between'>
                <span>Shipping</span>
                <span>₹{shipping}</span>
              </div>
              <div className='flex justify-between'>
                <span>Tax(5%)</span>
                <span>₹{tax}</span>
              </div>
              <Separator />
              <div className='flex justify-between font-bold text-lg'>
                <span>Total</span>
                <span>₹{total}</span>
              </div>
              <div className='text-sm text-muted-foreground pt-4'>
                <p>* Free shipping on Order 299</p>
                <p>* 30-days return policy</p>
                <p>* Secure checkout with SSL encryption</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AddressForm;