#!/bin/bash

sudo apt-get update && sudo apt-get install -y libssl-dev pkg-config \
        && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - \
        && echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list \
        && sudo apt-get update \
        && sudo apt-get install -y yarn \
        && curl -fsSL https://deb.nodesource.com/setup_15.x | sudo -E bash - \
        && sudo apt-get install -y nodejs \

