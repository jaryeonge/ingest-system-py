import geoip2.database

from properties import GEOIP_DB_PATH


class GeoipFilter:
    def __init__(self):
        self.db = geoip2.database.Reader(GEOIP_DB_PATH)

    def filtering(self, ip: str) -> dict:
        try:
            response = self.db.city(ip)
            geoip = {
                'city': response.city.name,
                'continent-code': response.continent.code,
                'continent': response.continent.name,
                'country-code': response.country.iso_code,
                'country': response.country.name,
                'ip': ip,
                'postal-code': response.postal.code,
                'latitude': response.location.latitude,
                'longitude': response.location.longitude,
                'location': [response.location.longitude, response.location.latitude],
            }
        except Exception as e:
            geoip = {
                'city': None,
                'continent-code': None,
                'continent': None,
                'country-code': None,
                'country': None,
                'ip': ip,
                'postal-code': None,
                'latitude': None,
                'longitude': None,
                'location': None,
            }
        return geoip
