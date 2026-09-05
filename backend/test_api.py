import requests

url = "http://127.0.0.1:5000/analyze"

data = {
    "text": "1234 $#."
}

response = requests.post(url, json=data)

print("Status Code:", response.status_code)
print("Response:")
print(response.json())