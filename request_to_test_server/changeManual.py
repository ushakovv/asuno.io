import requests
from datetime import datetime, timedelta
import json


time = datetime.utcnow().isoformat()
data = {
    'tag': 'DPART_NIITM.PP7.IS_MANUAL',
    'ts': time, 'value': 0, 'qual': 192
}

headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
url = 'http://95.215.110.99/api/tagnet/event'

res = requests.post(url, data=json.dumps(data), headers=headers)
print(json.dumps(data))
print(res)