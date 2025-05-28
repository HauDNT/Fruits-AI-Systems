import imagePath from "@/assets/images/admin_login_bg.jpg";
import AdminLoginForm from "@/app/admin/login/admin-login-form";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "FruitsFlow - Đăng nhập",
    description: "Đăng nhập vào hệ thống quản trị FruitsFlow",
};

const AdminLogin = () => {
    return (
        <div style={{
            backgroundImage: `url(${imagePath.src})`,
            backgroundSize: 'cover'
        }}
             className="flex justify-center items-center h-screen bg-cover bg-center">
            <AdminLoginForm />
        </div>
    )
}

export default AdminLogin