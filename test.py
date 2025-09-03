import requests

API_KEY = "qgHYxv1XyGpEmgzlas7hp8QhesvIW7GDJYvD0QCc"
BASE_URL = "https://api.nasa.gov/neo/rest/v1/feed"

def get_neows_data(start_date, end_date):
    params = {
        "start_date": start_date,  # فرمت YYYY-MM-DD
        "end_date": end_date,      # حداکثر 7 روز بعد
        "api_key": API_KEY,
    }
    response = requests.get(BASE_URL, params=params)
    data = response.json()
    return data

if __name__ == "__main__":
    # تست: گرفتن داده‌های 3 روز آینده
    start_date = "2025-09-03"
    end_date = "2025-09-05"

    data = get_neows_data(start_date, end_date)

    # چاپ خلاصه اطلاعات
    for date, objects in data["near_earth_objects"].items():
        print(f"\n📅 Date: {date}")
        for obj in objects:
            name = obj["name"]
            diameter = obj["estimated_diameter"]["meters"]["estimated_diameter_max"]
            hazardous = obj["is_potentially_hazardous_asteroid"]
            approach = obj["close_approach_data"][0]["close_approach_date_full"]
            miss_distance = obj["close_approach_data"][0]["miss_distance"]["kilometers"]

            print(f"  ☄️ {name}")
            print(f"     Estimated Diameter: {diameter:.2f} m")
            print(f"     Hazardous: {hazardous}")
            print(f"     Closest Approach: {approach}")
            print(f"     Miss Distance: {miss_distance} km")
