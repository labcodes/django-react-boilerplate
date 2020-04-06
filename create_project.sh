echo ""
echo -e "--------------> \033[1mThank you for choosing our boilerplate! We'll begin installation right now :]\033[0m"
echo ""
echo "--------------> Downloading, unpacking and cleaning base code..."
echo ""
wget https://github.com/labcodes/django-react-webpack/archive/feature/update.zip
unzip -qq update.zip
rm update.zip
cd django-react-webpack-feature-update

echo ""
echo "--------------> Creating the virtualenv and installing python dependencies..."
echo ""
python3 -m venv .
source bin/activate
pip install -r requirements.txt

echo ""
echo "--------------> Installing nvm, node==lts and js dependencies..."
echo ""
make node_setup
npm install yarn
npx yarn install -D

echo ""
echo "--------------> Setting up basic configuration for the django server..."
echo ""
cp env.example .env
python manage.py migrate

echo ""
echo -e "--------------> \033[1mDone! Now we'll run the app to check everything is running smoothly :]\033[0m"
echo "--------------> Running the app for the first time! Hit Ctrl+C or Command+C to interrupt."
echo ""
make run
