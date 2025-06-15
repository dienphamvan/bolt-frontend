export interface Car {
    id: string
    brand: string
    stock: number
    model: string
    availableStock: number
    avgPricePerDay: number
    totalPrice: number
}

export interface BookingData {
    email: string
    name: string
    licenseNumber: string
    licenseValidUntil: string
    startDate: string
    endDate: string
    carId: string
}

export interface AvailabilityParams {
    startDate: string
    endDate: string
}

export interface CarDetailParams {
    startDate?: string | null
    endDate?: string | null
}
