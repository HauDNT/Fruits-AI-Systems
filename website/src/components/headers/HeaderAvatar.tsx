'use client'
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {
    CreditCard,
    ShoppingCart,
    Heart,
    BookmarkCheck,
    BookOpen,
    LifeBuoy,
    LogOut,
    Settings,
    User,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import axiosInstance from "@/utils/axiosInstance"
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { removeReduxAuthToken } from '@/redux/authSlice';
import {useToast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";

const HeaderAvatar = ({uri}: { uri?: string }) => {
    const defaultAvatar = "https://img.freepik.com/premium-vector/businessman-avatar-illustration-cartoon-user-portrait-user-profile-icon_118339-5502.jpg?w=740";
    const { user, token } = useSelector((state: RootState) => state.auth)
    const dispatch = useDispatch()
    const {toast} = useToast()
    const router = useRouter()

    const handleLogout = async () => {
        const userIdentifier = user['username'] || user['email'];
        const userRole = user['role'];

        const logoutResult = await axiosInstance.post(
            '/auth/logout',
            {
                userIdentifier,
            }
        );

        if (logoutResult.status === 200) {
            dispatch(removeReduxAuthToken());
            userRole === 'Admin' ? router.push('/admin/login') : router.push('/login')
        } else {
            toast({
                title: "Đăng xuất thất bại",
                description: "Vui lòng thử lại sau",
                variant: "destructive",
            });
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar>
                    <AvatarImage src={uri || defaultAvatar} alt="User Avatar"/>
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-1 mr-2 z-999999">
                <DropdownMenuLabel>Tuỳ chọn</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <User/>
                        <span>Tài khoản</span>
                        {/*<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>*/}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <ShoppingCart/>
                        <span>Giỏ hàng của bạn</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <CreditCard/>
                        <span>Lịch sử mua hàng</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuGroup>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <BookOpen/>
                            <span>Khoá học</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem>
                                    <Heart/>
                                    <span>Yêu thích</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <BookmarkCheck/>
                                    <span>Đã lưu</span>
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator/>
                <DropdownMenuItem>
                    <LifeBuoy/>
                    <span>Hỗ trợ</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Settings/>
                    <span>Cài đặt</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut color={'red'}/>
                    <span className='text-error-600'>Đăng xuất</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default HeaderAvatar