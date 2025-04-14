import imagePath from "@/assets/images/admin_login_bg.jpg";
import AdminLoginForm from "@/app/admin/login/admin-login-form";

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