'use client'

import type React from 'react'

import { useState } from 'react'
import type { Car, BookingData } from '@/types/car'
import { createBooking } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { DatePicker } from '../shared/date-picker'
import {
    ArrowLeft,
    Loader2,
    CarIcon,
    Calendar,
    User,
    Mail,
    CreditCard,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { endOfDay, format, isAfter, parseISO, startOfDay } from 'date-fns'

interface BookingFormProps {
    car: Car
    initialStartDate: string
    initialEndDate: string
    onBack: () => void
    onBookingComplete: () => void
}

export function BookingForm({
    car,
    initialStartDate,
    initialEndDate,
    onBack,
    onBookingComplete,
}: BookingFormProps) {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        licenseNumber: '',
        licenseValidUntil: '',
        startDate: initialStartDate,
        endDate: initialEndDate,
    })
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleDateChange = (
        field: 'licenseValidUntil',
        date: Date | undefined
    ) => {
        if (date) {
            setFormData((prev) => ({
                ...prev,
                [field]: format(date, 'yyyy-MM-dd'),
            }))
        }
    }

    const validateForm = (): boolean => {
        if (
            !formData.email ||
            !formData.name ||
            !formData.licenseNumber ||
            !formData.licenseValidUntil
        ) {
            toast({
                title: 'Missing information',
                description: 'Please fill in all required fields',
                variant: 'destructive',
            })
            return false
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            toast({
                title: 'Invalid email',
                description: 'Please enter a valid email address',
                variant: 'destructive',
            })
            return false
        }

        if (isAfter(formData.endDate, formData.licenseValidUntil)) {
            toast({
                title: 'Invalid license',
                description:
                    'Driving license must be valid through the entire booking period',
                variant: 'destructive',
            })
            return false
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setLoading(true)
        try {
            const bookingData: BookingData = {
                ...formData,
                carId: car.id,
                startDate: startOfDay(formData.startDate).toISOString(),
                endDate: endOfDay(formData.endDate).toISOString(),
            }

            await createBooking(bookingData)

            toast({
                title: 'Booking confirmed!',
                description: `Your ${car.brand} ${car.model} has been booked successfully.`,
            })

            onBookingComplete()
        } catch (error) {
            toast({
                title: 'Booking failed',
                description:
                    error instanceof Error
                        ? error.message
                        : 'Failed to create booking. Please try again.',
                variant: 'destructive',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center gap-4'>
                <Button variant='outline' size='icon' onClick={onBack}>
                    <ArrowLeft className='h-4 w-4' />
                </Button>
                <div>
                    <h1 className='text-3xl font-bold'>
                        Complete Your Booking
                    </h1>
                    <p className='text-muted-foreground'>
                        Fill in your details to confirm the reservation
                    </p>
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                {/* Booking Summary */}
                <Card className='lg:col-span-1'>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                            <CarIcon className='h-5 w-5' />
                            Booking Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='space-y-2'>
                            <div className='flex items-center justify-between'>
                                <span className='font-medium'>
                                    {car.brand} {car.model}
                                </span>
                            </div>
                            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                                <Calendar className='h-4 w-4' />
                                {format(
                                    formData.startDate,
                                    'MMM dd, yyyy'
                                )} - {format(formData.endDate, 'MMM dd, yyyy')}
                            </div>
                        </div>

                        <div className='border-t pt-4 space-y-2'>
                            <div className='flex justify-between'>
                                <span className='text-sm'>Price per day:</span>
                                <span>${car.avgPricePerDay.toFixed(2)}</span>
                            </div>
                            <div className='flex justify-between font-bold text-lg'>
                                <span>Total:</span>
                                <span className='text-primary'>
                                    ${car.totalPrice.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Booking Form */}
                <Card className='lg:col-span-2'>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                            <User className='h-5 w-5' />
                            Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className='space-y-6'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='space-y-2'>
                                    <Label
                                        htmlFor='name'
                                        className='flex items-center gap-2'
                                    >
                                        <User className='h-4 w-4' />
                                        Full Name *
                                    </Label>
                                    <Input
                                        id='name'
                                        type='text'
                                        value={formData.name}
                                        onChange={(e) =>
                                            handleInputChange(
                                                'name',
                                                e.target.value
                                            )
                                        }
                                        placeholder='Enter your full name'
                                        required
                                    />
                                </div>

                                <div className='space-y-2'>
                                    <Label
                                        htmlFor='email'
                                        className='flex items-center gap-2'
                                    >
                                        <Mail className='h-4 w-4' />
                                        Email Address *
                                    </Label>
                                    <Input
                                        id='email'
                                        type='email'
                                        value={formData.email}
                                        onChange={(e) =>
                                            handleInputChange(
                                                'email',
                                                e.target.value
                                            )
                                        }
                                        placeholder='Enter your email'
                                        required
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='space-y-2'>
                                    <Label
                                        htmlFor='licenseNumber'
                                        className='flex items-center gap-2'
                                    >
                                        <CreditCard className='h-4 w-4' />
                                        License Number *
                                    </Label>
                                    <Input
                                        id='licenseNumber'
                                        type='text'
                                        value={formData.licenseNumber}
                                        onChange={(e) =>
                                            handleInputChange(
                                                'licenseNumber',
                                                e.target.value
                                            )
                                        }
                                        placeholder='Enter your license number'
                                        required
                                    />
                                </div>

                                <div className='space-y-2'>
                                    <Label className='flex items-center gap-2'>
                                        <Calendar className='h-4 w-4' />
                                        License Valid Until *
                                    </Label>
                                    <DatePicker
                                        date={
                                            formData.licenseValidUntil
                                                ? parseISO(
                                                      formData.licenseValidUntil
                                                  )
                                                : undefined
                                        }
                                        onSelect={(date) =>
                                            handleDateChange(
                                                'licenseValidUntil',
                                                date
                                            )
                                        }
                                        placeholder='Select expiry date'
                                    />
                                </div>
                            </div>

                            <div className='pt-4'>
                                <Button
                                    type='submit'
                                    disabled={loading}
                                    className='w-full'
                                    size='lg'
                                >
                                    {loading && (
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    )}
                                    Confirm Booking - $
                                    {car.totalPrice.toFixed(2)}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
