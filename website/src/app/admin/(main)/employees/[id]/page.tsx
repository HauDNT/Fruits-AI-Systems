interface EmployeeProps {
    params: {
        id: string
    }
}

export default function EmployeeDetailPage({ params }: EmployeeProps) {
    const { id } = params

    return (
        <div>Trang thông tin của nhân viên {id}</div>
    )
}