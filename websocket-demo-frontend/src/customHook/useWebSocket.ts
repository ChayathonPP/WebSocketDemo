import Stomp from "stompjs";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import SockJS from "sockjs-client/dist/sockjs";
import {useAppDispatch, useAppSelector} from "../store/hooks.ts";
import {setIsConnected, appendMessage,setStompClient} from "../store/Slices/webSocketSlice.ts";
import {selectWebSocket} from "../store/Slices/webSocketSlice.ts";
import { setUserCount } from "../store/Slices/userCountSlice.ts";

function useWebSocket(){
    const dispatch = useAppDispatch()
    const webSocket = useAppSelector(selectWebSocket)

    function connect(username : string){
        try {
            const socket: WebSocket = new SockJS(`http://localhost:8080/ws`);
            const stompClient: Stomp.Client = Stomp.over(socket);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            stompClient.connect({}, () =>onConnected(stompClient,username), onError);
        } catch (e) {
            console.log(e);
        }
    }

    function sendMessage(message : string, username : string){
        if (webSocket.stompClient && webSocket.stompClient.connected) {
            const chatMessage = {
                sender: username,
                content: message,
                timestamp: new Date().toLocaleTimeString(),
                type: 'CHAT'
            };
            webSocket.stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        }
    }

    const onConnected = (stompClient : Stomp.Client, username : string) => {
        stompClient.subscribe('/topic/public', onMessageReceived);
        stompClient.subscribe('/topic/userCount', onUserCountReceived);
        stompClient.send("/app/chat.addUser", {}, JSON.stringify({ sender: username, type: 'JOIN', timestamp: new Date().toLocaleTimeString() }));
        dispatch(setIsConnected(true))
        dispatch(setStompClient(stompClient))
    }

    const onUserCountReceived = (payload : Stomp.Message) => {
            dispatch(setUserCount(JSON.parse(payload.body)))
    }

    const onMessageReceived = (payload : Stomp.Message) => {
        dispatch(appendMessage(JSON.parse(payload.body)))
    }
    return {connect,sendMessage}
}

export default useWebSocket;

const onError = (err: Stomp.Message) => {
    console.log(err);
}