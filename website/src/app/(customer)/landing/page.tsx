import Banner from "@/app/(customer)/landing/components/banner";
import Carousel from "@/app/(customer)/landing/components/carousel";
import Courses from "@/app/(customer)/landing/components/courses";
import Feedbacks from "@/app/(customer)/landing/components/feedbacks";

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