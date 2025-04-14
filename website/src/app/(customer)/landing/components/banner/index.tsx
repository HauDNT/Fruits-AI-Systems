import '@/app/(customer)/landing/styles.scss';
import StartButton from "@/app/(customer)/landing/components/banner/StartButton";

const Banner = () => {
    return (
        <div className='bg-image relative mb-30' id="home-section">
            <div className="mx-auto max-w-7xl pt-16 lg:pt-40 sm:pb-24 px-6">
                <div className='height-work'>
                    <div className='grid grid-cols-1 lg:grid-cols-12 my-4'>
                        <div className='col-span-7 relative z-1'>
                            <h1 className="text-4xl lg:text-7xl font-bold mb-5 text-black md:text-start text-center">
                                <span className="text-blue-600">Edu</span>FlexHub
                            </h1>
                            <p className='text-black md:text-lg font-normal mb-10 md:text-start text-center'>
                                EduFlexHub là nền tảng học tập trực tuyến, cho phép bạn học mọi lúc mọi nơi,
                                chỉ cần kết nối internet.
                                <br/>
                                Với kho tài liệu phong phú, bài giảng chất lượng
                                từ các chuyên gia, cùng giao diện thân thiện, EduFlexHub sẽ giúp bạn nâng
                                cao kiến thức và kỹ năng một cách hiệu quả.
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