import re
from datetime import datetime
from typing import Union

timestamp_pattern = re.compile('^\d{10}\d{0,3}')
date_pattern = re.compile('^\d{4}[\-\/]\d{2}[\-\/]\d{2}[T\s]\d{2}\:\d{2}\:\d{2}\.?\d{0,3}')


def date_filtering(value) -> Union[str, None]:
    if re.search(timestamp_pattern, str(value)):
        if len(str(value)) == 10:
            pass
        elif len(str(value)) == 13:
            value /= 1000
        else:
            return None
        date = datetime.fromtimestamp(int(value))
        date = date.isoformat(timespec='milliseconds')
        date = date + 'Z'

    elif re.search(date_pattern, str(value)):
        result = re.findall(date_pattern, str(value))
        date = datetime.fromisoformat(result[0])
        date = date.isoformat(timespec='milliseconds')
        date = date + 'Z'
    else:
        date = None
    return date
