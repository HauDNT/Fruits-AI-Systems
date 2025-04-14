import imagePath from '../../../../assets/images/login_bg.jpg'
import styles from './styles.module.css'
import ForgotPasswordForm from "@/app/(customer)/(auth)/forgot-password/forgot-password-form"

export default function ForgotPasswordPage() {
    return (
        <div style={{
            backgroundImage: `url(${imagePath.src})`,
            backgroundSize: 'cover'
        }}
             className={styles.pageContainer}>
            <ForgotPasswordForm />
        </div>
    )
}