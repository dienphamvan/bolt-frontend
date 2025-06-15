'use client'

import { useToast } from '@/hooks/use-toast'
import { getCarDetails } from '@/lib/api'
import { Car } from '@/types/car'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BookingForm } from '../../components/feature/booking-form'
import { endOfDay, startOfDay } from 'date-fns'

export default function Booking() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const carId = searchParams.get('carId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const { toast } = useToast()
    const [selectedCar, setSelectedCar] = useState<Car | null>(null)

    const handleBackToAvailability = () => {
        router.back()
    }

    const handleBookingComplete = () => {
        router.replace('/success')
    }

    const fetchCarDetails = async (carId: string) => {
        try {
            const car = await getCarDetails(carId, {
                startDate: startOfDay(startDate!).toISOString(),
                endDate: endOfDay(endDate!).toISOString(),
            })
            setSelectedCar(car)
        } catch (error: any) {
            toast({
                title: 'Error fetching car details',
                description:
                    error instanceof Error
                        ? error.message
                        : 'Failed to fetch car details. Please try again.',
                variant: 'destructive',
            })
        }
    }

    useEffect(() => {
        if (!carId || !startDate || !endDate) {
            router.push('/')
        } else {
            fetchCarDetails(carId)
        }
    }, [carId, startDate, endDate, router])

    return (
        <>
            {selectedCar && startDate && endDate && (
                <BookingForm
                    car={selectedCar}
                    initialStartDate={startDate}
                    initialEndDate={endDate}
                    onBack={handleBackToAvailability}
                    onBookingComplete={handleBookingComplete}
                />
            )}
        </>
    )
}
