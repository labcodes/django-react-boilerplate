#!/usr/bin/env bash

echo ""
echo -e "--------------> \033[1mThank you for choosing our boilerplate! We'll begin installation right now :]\033[0m"
read -p "--------------> Project folder name: " mainmenuinput
echo ""
echo "--------------> Downloading, unpacking and cleaning base code..."
echo ""
wget https://github.com/labcodes/django-react-boilerplate/archive/master.zip -P /tmp/
unzip -qq /tmp/master.zip
rm /tmp/master.zip
mv django-react-boilerplate-master "$mainmenuinput"
cd "$mainmenuinput"

echo ""
echo "--------------> Activating the poetry python virtualenv..."
echo ""
source $(poetry env info --path)/bin/activate

echo ""
echo "--------------> Installing python and js dependencies..."
echo ""
make install_dependencies

echo ""
echo "--------------> Setting up basic configuration for the django server..."
echo ""
cp env.example .env
python manage.py migrate

echo ""
echo -e "--------------> \033[1mDone! Now we'll run the app to check everything is running smoothly :]\033[0m"
sleep 2
echo "--------------> Running the app for the first time! Hit Ctrl+C or Command+C to interrupt."
echo ""
make run
