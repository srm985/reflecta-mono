sudo apt update

# Install nvm
sudo apt install curl -y
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash

# Configure nvm
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

# Install the latest version of NodeJS LTS
nvm install --lts

# Update NPM
npm install -g npm@latest

# Install package dependencies
npm ci

# Allow execution
chmod ug+x .husky/*
chmod ug+x .git/hooks/*
find ./scripts/ -type f -regex '.*\.\(py\|sh\|bash\)$' -exec chmod +x {} +
