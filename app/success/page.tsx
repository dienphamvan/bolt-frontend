import Link from 'next/link'

export default function Success() {
    return (
        <div className='text-center space-y-6 py-12'>
            <div className='space-y-2'>
                <h1 className='text-4xl font-bold text-green-600'>
                    Booking Confirmed! 🎉
                </h1>
                <p className='text-xl text-muted-foreground'>
                    Your car rental has been successfully booked.
                </p>
                <p className='text-muted-foreground'>
                    You will receive a confirmation email shortly.
                </p>
            </div>
            <Link href='/' className='inline-flex items-center justify-center'>
                <button className='rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2'>
                    Book Another Car
                </button>
            </Link>
        </div>
    )
}
