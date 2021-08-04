"""Python JSON loader"""
import json


def load_json(directory):
    """Load json file"""
    with open(directory) as file:
        contents = json.load(file)

    """Return contents as dict."""
    return contents
