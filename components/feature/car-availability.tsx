'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { getAvailableCars } from '@/lib/api'
import type { AvailabilityParams, Car } from '@/types/car'
import { endOfDay, format, isAfter, isValid, parse, startOfDay } from 'date-fns'
import { CarIcon, Loader2, Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DatePicker } from '../shared/date-picker'

interface CarAvailabilityProps {
    onBookCar: (car: Car, startDate: string, endDate: string) => void
}

export function CarAvailability({ onBookCar }: CarAvailabilityProps) {
    const searchParams = useSearchParams()
    const startDateParam = searchParams.get('startDate')
    const endDateParam = searchParams.get('endDate')
    const router = useRouter()
    const [cars, setCars] = useState<Car[]>([])
    const [loading, setLoading] = useState(false)
    const [startDate, setStartDate] = useState<Date>()
    const [endDate, setEndDate] = useState<Date>()
    const { toast } = useToast()

    const handleSearch = async () => {
        if (!startDate || !endDate) {
            toast({
                title: 'Missing dates',
                description: 'Please select both start and end dates',
                variant: 'destructive',
            })
            return
        }

        if (isAfter(startDate, endDate)) {
            toast({
                title: 'Invalid date range',
                description: 'End date must be after start date',
                variant: 'destructive',
            })
            return
        }

        const params: AvailabilityParams = {
            startDate: format(startDate, 'yyyy-MM-dd'),
            endDate: format(endDate, 'yyyy-MM-dd'),
        }

        router.push(`/?startDate=${params.startDate}&endDate=${params.endDate}`)
    }

    const fetchAvailableCars = async (params: AvailabilityParams) => {
        setLoading(true)
        try {
            const availableCars = await getAvailableCars(params)
            setCars(availableCars)

            if (availableCars.length === 0) {
                toast({
                    title: 'No cars available',
                    description: 'No cars are available for the selected dates',
                })
            }
        } catch (error) {
            toast({
                title: 'Error',
                description:
                    'Failed to fetch available cars. Please try again.',
                variant: 'destructive',
            })
            console.error('Error fetching cars:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!startDateParam || !endDateParam) {
            return
        }

        const start = parse(startDateParam, 'yyyy-MM-dd', new Date())
        const end = parse(endDateParam, 'yyyy-MM-dd', new Date())

        if (!isValid(start) || !isValid(end)) {
            router.push('/')
        } else {
            setStartDate(start)
            setEndDate(end)

            fetchAvailableCars({
                startDate: startOfDay(start).toISOString(),
                endDate: endOfDay(end).toISOString(),
            })
        }
    }, [startDateParam, endDateParam])

    return (
        <div className='space-y-6'>
            <div className='text-center space-y-2'>
                <h1 className='text-3xl font-bold'>Car Rental Barcelona</h1>
                <p className='text-muted-foreground'>
                    Find and book your perfect car
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <Search className='h-5 w-5' />
                        Search Available Cars
                    </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium'>
                                Start Date
                            </label>
                            <DatePicker
                                date={startDate}
                                onSelect={setStartDate}
                                placeholder='Select start date'
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium'>
                                End Date
                            </label>
                            <DatePicker
                                date={endDate}
                                onSelect={setEndDate}
                                placeholder='Select end date'
                            />
                        </div>
                        <div className='flex items-end'>
                            <Button
                                onClick={handleSearch}
                                disabled={loading}
                                className='w-full'
                            >
                                {loading && (
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                )}
                                Search Cars
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {cars.length > 0 && (
                <div className='space-y-4'>
                    <h2 className='text-2xl font-semibold'>Available Cars</h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {cars.map((car) => (
                            <Card
                                key={car.id}
                                className='hover:shadow-lg transition-shadow'
                            >
                                <CardHeader>
                                    <div className='flex items-center justify-between'>
                                        <CardTitle className='flex items-center gap-2'>
                                            <CarIcon className='h-5 w-5' />
                                            {car.brand} {car.model}
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className='space-y-4'>
                                    <div className='space-y-2'>
                                        <div className='flex justify-between'>
                                            <span className='text-sm text-muted-foreground'>
                                                Available:
                                            </span>
                                            <span className='font-medium'>
                                                {car.availableStock}/{car.stock}{' '}
                                                cars
                                            </span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='text-sm text-muted-foreground'>
                                                Per day:
                                            </span>
                                            <span className='font-medium'>
                                                ${car.avgPricePerDay.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='text-sm text-muted-foreground'>
                                                Total price:
                                            </span>
                                            <span className='text-lg font-bold text-primary'>
                                                ${car.totalPrice.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                    <Button
                                        className='w-full'
                                        onClick={() =>
                                            onBookCar(
                                                car,
                                                startDateParam!,
                                                endDateParam!
                                            )
                                        }
                                    >
                                        Book Now
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
