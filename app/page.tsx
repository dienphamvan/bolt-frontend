'use client'

import { CarAvailability } from '@/components/feature/car-availability'
import type { Car } from '@/types/car'
import { useRouter } from 'next/navigation'

export default function Home() {
    const router = useRouter()

    const handleBookCar = (car: Car, startDate: string, endDate: string) => {
        router.push(
            `/booking?carId=${car.id}&startDate=${startDate}&endDate=${endDate}`
        )
    }

    return <CarAvailability onBookCar={handleBookCar} />
}
