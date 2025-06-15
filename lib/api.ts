import type {
    Car,
    BookingData,
    AvailabilityParams,
    CarDetailParams,
} from '@/types/car'

export async function getAvailableCars(
    params: AvailabilityParams
): Promise<Car[]> {
    const searchParams = new URLSearchParams({
        startDate: params.startDate,
        endDate: params.endDate,
    })

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/car/availability?${searchParams}`
    )

    if (!response.ok) {
        throw new Error('Failed to fetch available cars')
    }

    return response.json()
}

export async function getCarDetails(
    carId: string,
    params?: CarDetailParams
): Promise<Car> {
    let searchParams: URLSearchParams | string = ''
    if (params && params.startDate && params.endDate) {
        searchParams = new URLSearchParams({
            startDate: params.startDate,
            endDate: params.endDate,
        })
    }

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/car/${carId}?${searchParams}`
    )
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to fetch car details')
    }
    return response.json()
}

export async function createBooking(
    bookingData: BookingData
): Promise<{ success: boolean; message: string }> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/customer/booking`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData),
        }
    )

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create booking')
    }

    return response.json()
}
