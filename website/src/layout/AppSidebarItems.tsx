import {TbApple} from "react-icons/tb"
import {RiArchiveLine, RiHistoryLine, RiUser3Line, RiDashboard3Line} from "react-icons/ri"
import {LuCircuitBoard} from "react-icons/lu"
import { MdConveyorBelt } from "react-icons/md"

export const AdminSidebarItems = [
    {icon: <RiDashboard3Line size={25}/>, name: "Dashboard", path: "/admin/dashboard"},
    {
        name: "Nhân viên",
        icon: <RiUser3Line size={25}/>,
        path: "#"
    },
    {
        name: "Khu",
        icon: <MdConveyorBelt size={25}/>,
        path: "/admin/areas"
    },
    {
        name: "Trái cây",
        icon: <TbApple size={25}/>,
        subItems: [
            {name: "Trái cây", path: "/admin/fruits"},
            {name: "Tình trạng", path: "/admin/fruitTypes"},
        ],
    },
    {
        name: "Quản lý thiết bị",
        icon: <LuCircuitBoard size={25}/>,
        subItems: [
            {name: "Thiết bị", path: "/admin/devices"},
            {name: "Loại thiết bị", path: "/admin/deviceTypes"},
            {name: "Trạng thái thiết bị", path: "/admin/deviceStatuses"},
            {name: "Cấu hình máy chủ Raspberry", path: "/admin/raspberryConfig"},
        ],
    },
    {
        name: "Lịch sử phân loại",
        icon: <RiHistoryLine size={25}/>,
        path: "/admin/classification"
    },
];