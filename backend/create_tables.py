from dotenv import load_dotenv
import os

load_dotenv()

from src import create_tables

app = create_tables()

if __name__ == "__main__":
    app.run(debug=True)