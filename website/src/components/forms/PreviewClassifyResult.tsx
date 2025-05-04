import ComponentCard from "@/components/common/ComponentCard"
import { ClassifyResultInterface } from "@/interfaces"
import Image from "next/image";
import React from "react";
import Alert from "@/components/alert/Alert";

const PreviewClassifyResult = ({ data }: { data: ClassifyResultInterface }) => {
    console.log("PreviewClassifyResult data:", data);

    return (
        <ComponentCard title="Chi tiết kết quả phân loại" className="w-full">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                    <Image
                        src={process.env.NEXT_PUBLIC_URL_SERVER + data.image_url}
                        alt="Ảnh chụp phân loại"
                        className="w-full h-auto border border-gray-300 rounded-xl dark:border-gray-700 shadow-sm"
                        width={600}
                        height={600}
                    />
                </div>
                <div className="w-full md:w-1/2">
                    <Alert
                        variant="info"
                        title="Thông tin phân loại"
                        className="h-full"
                        message={
                            <div className="space-y-2 text-sm leading-relaxed text-gray-700 dark:text-gray-200">
                                <p><span className="font-semibold">Độ tin cậy:</span> {data.confidence_level}</p>
                                <p><span className="font-semibold">Khu vực:</span> {data.area}</p>
                                <p><span className="font-semibold">Mã lô:</span> {data.batch}</p>
                                <p><span className="font-semibold">Trái cây:</span> {data.fruit} - {data.fruitType}</p>
                                <p><span className="font-semibold">Thời gian:</span> {new Date(data.created_at).toLocaleString("vi-VN")}</p>
                            </div>
                        }
                        showLink={false}
                    />
                </div>
            </div>
        </ComponentCard>
    )
}

export default PreviewClassifyResult
