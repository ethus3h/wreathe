#!/usr/bin/env bash
source ember_bash_setup
#set -x
if [[ -z "$GUIX_PROFILE" ]]; then
    export GUIX_PROFILE="$HOME/.config/guix/current"
    source "$GUIX_PROFILE/etc/profile"
    export GUIX_PROFILE="$HOME/.guix-profile"
    source "$GUIX_PROFILE/etc/profile"
fi
#set +x
source "$GUIX_PROFILE/etc/profile"
    export GUIX_LOCPATH="$GUIX_PROFILE/lib/locale"
    export PATH="$GUIX_PROFILE/bin:$PATH"
    export INFOPATH="$HOME/.config/guix/current/share/info:$INFOPATH"

if ! ((EUID)); then
    if [[ -f ~/.bash_history.keep-public-mirror ]]; then
        mkdir -p /.bash_history.public-mirror-dir
        chmod +rx /.bash_history.public-mirror-dir
            cp ~/.bash_history /.bash_history.public-mirror-dir/.bash_history.public-mirror
            chmod +r /.bash_history.public-mirror-dir/.bash_history.public-mirror
            emdate > /.bash_history.public-mirror-dir/.bash_history.emdate
        chmod +r /.bash_history.public-mirror-dir/.bash_history.emdate
    fi
fi
