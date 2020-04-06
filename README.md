# django-react-webpack

This is Labcodes' boilerplate for django apps with frontend SPAs. We're currently using React and Webpack to manage the frontend.

The boilerplate is PWA, HMR and code splitting ready (and a couple of other acronyms as well).

It's still on beta, so expect little bugs to happen. They shouldn't, but if they pop up, add an issue and we'll get right to it!

## Setup

The easiest way to get started with this boilerplate is to run the following script. It downloads the current code, unpacks it, then sets up nvm and dependencies. We require wget, make, python>=3.6 and nodejs>=lts. On Ubuntu 18.04, you need libpq-dev and python3-dev too.

```sh
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
```

If everything went right, you should have a server running at `localhost:8000`. Visit that on your browser to make sure everything is working <3

## Running it

If you want to run the project locally, be sure to have your virtualenv active (running `source bin/activate` from the project folder) and nvm set to the correct node version (by running `nvm use` on the project folder).

Then, to run django and webpack in parallel for development, just run:

`make run`

If you have any issues with nvm, like "Command not found", [try reading their documentation](https://github.com/nvm-sh/nvm#installing-and-updating) on how to use it. On the worst case scenario, you may need to run `make node_setup` again.

## Postinstall

There are a couple of things we suggest you do after installing the boilerplate.

You may want to:

- rename the folder to match your project name;
- move the folder to your preferred folder;
- start a new git repository;
- check `project/settings.py` for variables that need to be customized (PWA related, for example).
