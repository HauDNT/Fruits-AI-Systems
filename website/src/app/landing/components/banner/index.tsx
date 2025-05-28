import '@/app/landing/styles.scss';
import StartButton from "@/app/landing/components/banner/StartButton";

const Banner = () => {
    return (
        <div className='bg-image relative mb-30' id="home-section">
            <div className="mx-auto max-w-7xl pt-16 lg:pt-40 sm:pb-24 px-6">
                <div className='height-work'>
                    <div className='grid grid-cols-1 lg:grid-cols-12 my-4'>
                        <div className='col-span-7 relative z-1'>
                            <h1 className="text-4xl lg:text-7xl font-bold mb-5 text-black md:text-start text-center">
                                <span className="text-green-600">Fruits</span>Flow
                            </h1>
                            <p className='text-black md:text-lg font-normal mb-10 md:text-start text-center'>
                                FruitsFlow là nền tảng quản lý phân loại trái cây thông minh, giúp theo dõi và tối ưu hóa quy trình phân loại tự động mọi lúc, mọi nơi.
                                <br/>
                                Với công nghệ thị giác máy tính tiên tiến, giao diện thân thiện và khả năng thống kê thời gian thực,
                                FruitsFlow mang đến giải pháp hiệu quả để quản lý chất lượng trái cây một cách dễ dàng.
                            </p>
                            <StartButton/>
                        </div>

                        <div className='col-span-5 lg:-m-24'>
                            <img src="/images/Banner/banner.jpg" alt="nothing" width={"100%"}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Banner