import { useEffect } from "react";
import { io } from 'socket.io-client'

const socket = io(process.env.NEXT_PUBLIC_URL_SERVER)

export function useSocketFruitClassify(onNewResult: (result: any) => void) {
    useEffect(() => {
        socket.on('newFruitClassification', onNewResult)

        return () => {
            socket.off('newFruitClassification')
        }
    }, [onNewResult])
}