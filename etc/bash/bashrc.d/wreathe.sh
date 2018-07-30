#!/usr/bin/env bash
source ember_bash_setup

if ! ((EUID)); then
    if [[ -f ~/.bash_history.keep-public-mirror ]]; then
	mkdir -p ~/.bash_history.public-mirror-dir
	chmod +rx ~/.bash_history.public-mirror-dir
        cp ~/.bash_history ~/.bash_history.public-mirror-dir/.bash_history.public-mirror
        chmod +r ~/.bash_history.public-mirror-dir/.bash_history.public-mirror
        emdate > ~/.bash_history.public-mirror-dir/.bash_history.emdate
	chmod +r ~/.bash_history.public-mirror-dir/.bash_history.emdate
    fi
fi

# eval $(thefuck --alias)
