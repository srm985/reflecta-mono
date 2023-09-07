sudo apt update

sudo apt install curl -y
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# Configure Git functionality in bash
sudo apt install bash-completion -y

curl https://raw.githubusercontent.com/git/git/master/contrib/completion/git-completion.bash -o ~/.git-completion.bash

echo "if [ -f ~/.git-completion.bash ]; then" >> ~/.bashrc
echo "  . ~/.git-completion.bash" >> ~/.bashrc
echo "fi" >> ~/.bashrc

# Refresh bash after adding nvm and Git changes
source ~.bashrc
source /tmp/.bashrc

nvm install 18

npm install -g npm@latest

npm ci

chmod ug+x .husky/*
chmod ug+x .git/hooks/*
