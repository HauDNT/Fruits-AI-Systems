import {
    UserCircle,
    Apple,
    Cpu,
    Users,
    ScanEye,
    Computer,
    BrainCircuit,
    Gauge
} from "lucide-react";

export const AdminSidebarItems = [
    {icon: <Gauge size={25}/>, name: "Bảng điều khiển", path: "/admin/dashboard"},
    {
        name: "Tài khoản",
        icon: <UserCircle size={25}/>,
        path: "/admin/users"
    },
    {
        name: "Nhân viên",
        icon: <Users size={25}/>,
        path: "/admin/users"
    },
    {
        name: "Khu",
        icon: <Computer size={25}/>,
        path: "/admin/areas"
    },
    {
        name: "Trái cây",
        icon: <Apple size={25}/>,
        subItems: [
            {name: "Trái cây", path: "/admin/fruits"},
            {name: "Tình trạng", path: "/admin/fruitTypes"},
        ],
    },
    {
        name: "Quản lý thiết bị",
        icon: <Cpu size={25}/>,
        subItems: [
            {name: "Thiết bị", path: "/admin/devices"},
            {name: "Loại thiết bị", path: "/admin/deviceTypes"},
            {name: "Trạng thái thiết bị", path: "/admin/deviceStatuses"},
        ],
    },
    {
        name: "Cấu hình học máy",
        icon: <BrainCircuit size={25}/>,
        subItems: [
            {name: "Máy chủ Raspberry", path: "/admin/raspberryConfig"},
            {name: "Mô hình máy học", path: "#"},
        ],
    },
    {
        name: "Lịch sử phân loại",
        icon: <ScanEye size={25}/>,
        path: "/admin/classification"
    },
];