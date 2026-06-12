import os

SERVERCHAN_KEY = os.getenv("SERVERCHAN_KEY", "your_key_here")


def send_wechat(title: str, content: str):
    # TODO: uncomment when key is configured
    # import requests
    # url = f"https://sctapi.ftqq.com/{SERVERCHAN_KEY}.send"
    # requests.post(url, data={"title": title, "desp": content})
    pass
