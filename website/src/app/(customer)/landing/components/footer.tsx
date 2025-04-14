const LandingPageFooter = () => {
    return (
        <>
            <div id='footer' className="bg-gray-100 h-1/2 w-full flex md:flex-row flex-col justify-between items-start py-20">
                <div className="p-5">
                    <ul>
                        <p className="text-gray-800 font-bold text-lg pb-4">Lập trình Web</p>
                        <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                            ReactJS
                        </li>
                        <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                            Laravel
                        </li>
                        <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                            VueJS
                        </li>
                        <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                            Spring boot
                        </li>
                    </ul>
                </div>
                <div className="p-5">
                    <ul>
                        <p className="text-gray-800 font-bold text-lg pb-4">Chứng chỉ CNTT</p>
                        <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                            Amazon AWS
                        </li>
                        <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                            AWS Certified Cloud Practitioner
                        </li>
                        <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                            AZ-900: Microsoft Azure Fundamentals
                        </li>
                        <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                            AWS Certified Solutions Architect - Associate
                        </li>
                        <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                            Kubernetes
                        </li>
                    </ul>
                </div>
                <div className="p-5">
                    <ul>
                        <p className="text-gray-800 font-bold text-lg pb-4">Chứng chỉ theo kỹ năng cụ thể</p>
                        <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                            Cyber security Certification
                        </li>
                        <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                            Project Management Certification
                        </li>
                        <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                            Cloud Certification
                        </li>
                        <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                            Data Analytics Certification
                        </li>
                        <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                            HR Management Certification
                        </li>
                    </ul>
                </div>
                <div className="p-5">
                    <ul>
                        <p className="text-gray-800 font-bold text-lg pb-4">Giao tiếp & Kỹ năng mềm</p>
                        <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                            Kỹ năng giao tiếp
                        </li>
                        <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                            Thuyết trình
                        </li>
                        <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                            Nói trước đám đông
                        </li>
                        <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                            Viết lách
                        </li>
                        <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                            Thiết kế Power Point
                        </li>
                    </ul>
                </div>
            </div>
            <div className="flex w-100 justify-between items-center text-center p-5 bg-gray-50">
                <h1 className="text-xl text-gray-800 font-semibold">
                    <span className="text-blue-600">Edu</span>FlexHub
                </h1>
                <h1 className="hover:text-blue-600 font-semibold cursor-pointer">
                    About us
                </h1>
            </div>
        </>
    )
}

export default LandingPageFooter