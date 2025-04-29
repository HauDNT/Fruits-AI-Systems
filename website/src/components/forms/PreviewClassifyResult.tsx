import ComponentCard from "@/components/common/ComponentCard"
import { ClassifyResultInterface } from "@/interfaces"

const PreviewClassifyResult = ({ data }: { data: ClassifyResultInterface }) => {
    console.log("PreviewClassifyResult data:", data);

    return (
        <ComponentCard title="Chi tiết kết quả phân loại" className="w-full">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <img src={'http://localhost:8080' + data.image_url} alt="Ảnh phân loại" className="w-full rounded-lg" />
                <span>Độ tin cậy: {data.confidence_level}</span>
                <span>Khu vực: {data.area}</span>
                <span>Mã lô: {data.batch}</span>
                <span>Trái cây: {data.fruit} - {data.fruitType}</span>
                <span>Thời gian: {new Date(data.created_at).toLocaleString("vi-VN")}</span>
            </div>
        </ComponentCard>
    )
}

export default PreviewClassifyResult
