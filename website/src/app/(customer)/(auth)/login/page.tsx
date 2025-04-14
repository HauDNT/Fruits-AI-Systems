import LoginForm from "@/app/(customer)/(auth)/login/login-form";
import imagePath from '../../../../assets/images/login_bg.jpg';

export default function LoginPage() {
    return (
        <div style={{
            backgroundImage: `url(${imagePath.src})`,
            backgroundSize: 'cover'
        }}
            className="flex justify-center items-center h-screen bg-cover bg-center">
            <LoginForm />
        </div>
    )
}
