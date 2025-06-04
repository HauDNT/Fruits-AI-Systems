import os
import json
import requests
import API

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RASPBERRY_CONFIG_FILE = os.path.join(BASE_DIR, "raspberry.config.json")

def load_raspberry_config_in_memory():
    with open(RASPBERRY_CONFIG_FILE, 'r') as file:
        return json.load(file)
    
def save_raspberry_config_to_memory(new_config):
    try:
        if os.path.exists(RASPBERRY_CONFIG_FILE):
            with open(RASPBERRY_CONFIG_FILE, 'r') as file:
                current_config = json.load(file)
        else:
            current_config = {}
            
        merged_config = {**current_config, **new_config}
        
        with open(RASPBERRY_CONFIG_FILE, 'w') as file:
            json.dump(merged_config, file, indent=2)

        print("Đã lưu config vào bộ nhớ Raspberry.")
    except Exception as e:
        print("Lỗi khi lưu config:", e)
 
async def load_remote_config_from_server_and_update():
    try:
        local_config = load_raspberry_config_in_memory()
        api = API.ApiRaspberryCall(base_url=local_config["api_endpoint"])
        
        response = await api.GET(
            "/raspberry/config", 
            params={
                "device_code": local_config["device_code"], 
                "isRaspberry": "true"
            }
        )

        if "error" not in response:
            model_filename = os.path.basename(response["model_path"])
            local_model_path = os.path.join("/home/dell/Workspace/svm/models/", model_filename)
            response["model_path"] = local_model_path
            
            save_raspberry_config_to_memory(response)
            return response

        return local_config 
    except Exception as e:
        print("Could not fetch from server:", e)
    return None
