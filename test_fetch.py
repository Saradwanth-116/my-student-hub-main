import urllib.request
import json
try:
    req = urllib.request.Request('http://localhost:8000/api/student/all-marks-with-profiles')
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode('utf-8'))
        print(json.dumps(data[0], indent=2))
except Exception as e:
    print('Error:', e)
