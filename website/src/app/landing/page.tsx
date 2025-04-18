import Banner from "@/app/landing/components/banner";
import Carousel from "@/app/landing/components/carousel";
import Courses from "@/app/landing/components/courses";
import Feedbacks from "@/app/landing/components/feedbacks";

export default function LandingPage() {
    return (
        <>
            <Banner/>
            <Carousel/>
            <Courses/>
            <Feedbacks/>
        </>
    )
}