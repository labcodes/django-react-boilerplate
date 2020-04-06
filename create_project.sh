# download, unpack and clean
wget https://github.com/labcodes/django-react-webpack/archive/feature/update.zip
unzip update.zip
rm update.zip
cd django-react-webpack-feature-update

# create the virtualenv and install python dependecies
python3 -m venv .
source bin/activate
pip install -r requirements.txt

# install nvm, correct node version and js dependencies
make node_setup
npm install yarn
npx yarn install -D

# set up basic configs for the django server
cp env.example .env
python manage.py migrate

# run the app
make run
