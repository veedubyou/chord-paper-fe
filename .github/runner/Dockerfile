FROM tcardonne/github-runner:latest

# install lib-ssl to fix problem with missing OpenSSL
RUN apt-get update && \
    apt-get install -y \
        libssl-dev \
        pkg-config

# installing yarn to fix errors
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && \
    apt-get install -y yarn

# setting nodejs to v15.x or else it complains.
RUN curl -fsSL https://deb.nodesource.com/setup_15.x | sudo -E bash - && \
    apt-get install -y nodejs

