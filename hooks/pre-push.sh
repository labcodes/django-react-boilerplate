#!/usr/bin/env bash

run_eslint () {
  echo "--------------> Running ESLint"
  if npm run lint
  then
    return
  else
    echo ""
    echo "--------------> ESLint detected some errors. Please fix them then try again."
    exit 1
  fi
}

run_black () {
  echo "--------------> Running Black"
  echo ""

  if git diff --name-status | grep ".py"
  then
    echo ""
    read -p "We detected these unstaged python files. Continue with them unstaged? (y/N) " git_diff_confirm < /dev/tty
    case $git_diff_confirm in
      [Yy]* ) ;;
      [Nn]* )
        echo ""
        echo "Please, commit your changes manually then try again."
        exit 1
      ;;
      * )
        echo ""
        echo "Please, commit your changes manually then try again."
        exit 1
      ;;
    esac
  fi

  if black --check . -q
  then
    if git diff --name-status | grep ".py" > /dev/null
    then
      echo ""
      create_commit
    fi
    return
  else

    read -p "Black has detected files to be formatted. Format them? (Y/n) " black_confirm < /dev/tty
    case $black_confirm in
      [Yy]* ) black . -q;;
      [Nn]* ) echo "Exiting..."; exit 1;;
      * ) black . -q;;
    esac

    create_commit

    return
  fi
}

create_commit () {
  read -p "Create commit with all changes? ANY UNSTAGED FILES WILL ALSO BE COMMITED (y/N) " commit_confirm < /dev/tty
  case $commit_confirm in
    [Yy]* )
      git add .
      git commit -m 'Black'
      git push --no-verify
      echo ""
      echo "Because of implementation details on git hooks, it will seem like the push failed. It didn't. Ignore any messages related to it and check manually, if it's the case."
      echo ""
      exit 1;;
    [Nn]* )
      echo ""
      echo "Please, commit your changes manually then try again."
      exit 1
    ;;
    * )
      echo ""
      echo "Please, commit your changes manually then try again."
      exit 1
    ;;
  esac
}

if run_eslint && run_black
then
  echo "--------------> Checks done, continuing..."
else
  exit 1
fi
