"use client"
import { useRouter } from "next/navigation";

const StartButton = () => {
    const router = useRouter();

    return (
        <div className='flex align-middle justify-center md:justify-start'>
            <button
                className='text-xl font-semibold text-white py-4 px-6 lg:px-12 started-button mr-6'
                onClick={() => router.push('/login')}
            >
                Bắt đầu
            </button>
        </div>
    )
}

export default StartButton