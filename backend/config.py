from dotenv import load_dotenv,dotenv_values
import os

load_dotenv() # Loading all enV variables from .env file


# config = {
#     **dotenv_values(".env"),  #For Loading all ENV variables as dict
# }
# print(config)

SUPABASE_DIRECT_URI = os.getenv('CONNECTION')  # For Loading Single ENV variableS
SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')
TOKEN_EXPIRES = int(os.getenv('TOKEN_EXPIRES'))

