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
        path: "#"
    },
    {
        name: "Trái cây",
        icon: <TbApple size={25}/>,
        path: "/admin/fruits",
    },
    {
        name: "Lô",
        icon: <RiArchiveLine size={25}/>,
        path: "#"
    },
    {
        name: "Thiết bị",
        icon: <LuCircuitBoard size={25}/>,
        path: "#"
    },
    {
        name: "Lịch sử phân loại",
        icon: <RiHistoryLine size={25}/>,
        path: "#"
    },
];