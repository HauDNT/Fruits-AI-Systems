import Link from "next/link";

const LandingPageHeader = () => {
    return (
        <header className="flex justify-between p-4 shadow-md">
            <h1 className="text-xl font-bold">EduFlexHub</h1>
            <nav>
                <ul className="flex gap-4">
                    <li>
                        <Link href={"#home-section"}>Trang chủ</Link>
                    </li>
                    <li>
                        <Link href={"#courses-section"}>Khoá học</Link>
                    </li>
                    <li>
                        <Link href={"#feedbacks"}>Đánh giá</Link>
                    </li>
                    <li>
                        <Link href={"#footer"}>Thêm</Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default LandingPageHeader