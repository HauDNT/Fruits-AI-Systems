import socketio

class SocketClient:
    def __init__(self, server_address: str, device_code: str, on_classification_callback=None):
        """
        Khởi tạo client WebSocket.
            :param server_address: Địa chỉ server WebSocket (ví dụ: 'http://192.168.1.100:3000')
            :param on_classification_callback: Hàm callback khi nhận sự kiện 'newFruitClassification'
        """
        self.server_address = server_address
        self.device_code = device_code
        self.socket_io = socketio.Client(reconnection=True)
        self.on_classification_callback = on_classification_callback
        self._setup_socket_events()
        
    def _setup_socket_events(self):
        @self.socket_io.event
        def connect():
            print("[RPI] Đã kết nối WebSocket")
            self.socket_io.emit("raspberry_connect", {"device_code": self.device_code})
            
        @self.socket_io.event
        def disconnect():
            print("[RPI] Mất kết nối WebSocket")
            
        @self.socket_io.on("new_config")
        def handle_update_config(data):
            print("[RPI] Nhận cấu hình mới:", data)
            if self.on_classification_callback:
                self.on_classification_callback(data)
                
    def connect(self):
        try:
            print(f"[RPI] 🔌 Đang kết nối tới {self.server_address}...")
            self.socket_io.connect(self.server_address)
        except Exception as e:
                print('[RPI] - Lỗi khi kết nối:', e)
                
    def disconnect(self):
        self.socket_io.disconnect()
        
    def wait_forever(self):
        """Giữ kết nối cho đến khi dừng chương trình."""
        self.socket_io.wait()