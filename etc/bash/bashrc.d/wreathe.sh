#!/usr/bin/env bash
source ember_bash_setup

if { ! ((EUID)) } && -f ~/.bash_history.keep-public-mirror; then
    cp ~/.bash_history ~/.bash_history.public-mirror
    chmod +r ~/.bash_history.public-mirror
    emdate > ~/.bash_history.emdate
fi

# eval $(thefuck --alias)
