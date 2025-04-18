"use client"
import React from "react";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface CarouselData {
    imgSrc: string;
}

const carouselData: CarouselData[] = [
    {
        imgSrc: "/images/carousels/css.png"
    },
    {
        imgSrc: "/images/carousels/docker.png"
    },
    {
        imgSrc: "/images/carousels/html.png"
    },
    {
        imgSrc: "/images/carousels/js.png"
    },
    {
        imgSrc: "/images/carousels/laravel.png"
    },
    {
        imgSrc: "/images/carousels/react.png"
    },
    {
        imgSrc: "/images/carousels/sql.png"
    },
    {
        imgSrc: "/images/carousels/c-.png"
    },
    {
        imgSrc: "/images/carousels/c-sharp.png"
    },
]

const Carousel = () => {
    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 5,
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
        <div className='mb-20 text-center bg-lightpink'>
            <div className="mx-auto max-w-2xl py-16 px-4s sm:px-6 lg:max-w-7xl lg:px-8">
                <div className="slider-container">
                    <Slider {...settings}>
                        {
                            carouselData.map((item, index) => (
                                <div key={index}>
                                    <img src={item.imgSrc} alt={`Slide ${index + 1}`} width={'40%'}/>
                                </div>
                            ))
                        }
                    </Slider>
                </div>
            </div>
        </div>
    )
}

export default Carousel