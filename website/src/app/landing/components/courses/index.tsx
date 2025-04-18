"use client"
import Image from 'next/image';
import Link from "next/link";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface Course {
    icon: string;
    name: string;
    description: string;
    link: string;
}

const coursesData: Course[] = [
    {
        icon: '/images/courses/react.png',
        name: 'ReactJS',
        description: 'Khóa học ReactJS giúp bạn nắm vững thư viện JavaScript phổ biến nhất để xây dựng giao diện người dùng linh hoạt, hiệu quả. Học cách sử dụng các hooks, quản lý state và tối ưu hóa hiệu suất ứng dụng.',
        link: '/courses/reactjs',
    },
    {
        icon: '/images/courses/css.png',
        name: 'CSS',
        description: 'Tìm hiểu cách tạo giao diện đẹp mắt và chuyên nghiệp với CSS. Khóa học bao gồm các kỹ thuật như Flexbox, Grid, Animation và cách tối ưu hóa thiết kế responsive cho mọi thiết bị.',
        link: '/courses/css',
    },
    {
        icon: '/images/courses/sql.png',
        name: 'SQL',
        description: 'Nắm vững cách truy vấn, quản lý và tối ưu hóa dữ liệu với SQL. Khóa học giúp bạn làm chủ các lệnh SELECT, JOIN, GROUP BY và các kỹ thuật nâng cao để làm việc với cơ sở dữ liệu hiệu quả.',
        link: '/courses/sql',
    },
    {
        icon: '/images/courses/js.png',
        name: 'Javascript',
        description: 'Học JavaScript từ cơ bản đến nâng cao, giúp bạn hiểu rõ cách xây dựng các ứng dụng web động. Bao gồm ES6+, DOM Manipulation, Event Handling, Async/Await và nhiều nội dung thú vị khác.',
        link: '/courses/js',
    },
    {
        icon: '/images/courses/c-.png',
        name: 'C',
        description: 'Lập trình C là nền tảng của nhiều ngôn ngữ lập trình hiện đại. Khóa học này giúp bạn hiểu rõ cách sử dụng biến, hàm, con trỏ, quản lý bộ nhớ và cấu trúc dữ liệu trong C.',
        link: '/courses/c-',
    },
    {
        icon: '/images/courses/c-sharp.png',
        name: 'C Sharp',
        description: 'Khóa học C# dành cho những ai muốn phát triển ứng dụng Windows, game với Unity hoặc làm việc với .NET. Học cách sử dụng OOP, LINQ, Entity Framework và các công nghệ mới nhất.',
        link: '/courses/c-sharp',
    },
    {
        icon: '/images/courses/docker.png',
        name: 'Docker',
        description: 'Tìm hiểu về Docker - công nghệ container mạnh mẽ giúp bạn triển khai và quản lý ứng dụng dễ dàng. Khóa học hướng dẫn từ cơ bản đến nâng cao, bao gồm Docker Compose, Docker Swarm và Kubernetes.',
        link: '/courses/docker',
    },
    {
        icon: '/images/courses/laravel.png',
        name: 'Laravel',
        description: 'Laravel là framework PHP phổ biến giúp phát triển ứng dụng web nhanh chóng. Khóa học này hướng dẫn bạn cách xây dựng API, xác thực người dùng, quản lý cơ sở dữ liệu và triển khai dự án.',
        link: '/courses/laravel',
    },
    {
        icon: '/images/courses/html.png',
        name: 'HTML',
        description: 'Bắt đầu với HTML - ngôn ngữ đánh dấu quan trọng để xây dựng trang web. Khóa học cung cấp kiến thức về các thẻ, thuộc tính, cấu trúc tài liệu, SEO-friendly markup và cách tạo giao diện chuẩn.',
        link: '/courses/html',
    },
]

const Courses = () => {
    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        speed: 2000,
        autoplaySpeed: 2000,
        cssEase: "linear",
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 700,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 500,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            }
        ]
    };

    return (
        <div id="courses-section">
            <div className="mb-32 mx-auto max-w-7xl">
                <div className='col-span-12'>
                    <h3 className='text-center text-3xl md:text-5xl font-bold mb-9 pt-4'>Các khoá học của chúng tôi</h3>
                    <div className="slider-container">
                        <Slider {...settings}>
                            {
                                coursesData.map((course, index) => (
                                    <div key={index} style={{margin: "0 15px"}}>
                                        <div className='card-b p-8'>
                                            <div className='work-img-bg rounded-full flex justify-center absolute p-6'>
                                                <Image src={course.icon} alt={course.icon} width={44} height={44}/>
                                            </div>
                                            <h3 className='text-2xl text-offwhite font-semibold text-center mt-8'>{course.name}</h3>
                                            <p className='text-base font-normal text-bluish text-center mt-2'>{course.description}</p>
                                            <Link
                                                href={`/${course.link}`}
                                                className="block w-100 pt-5 text-center font-normal m-0 text-bluish text-blue-600"
                                            >
                                                Tìm hiểu thêm
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            }
                        </Slider>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Courses