#!/usr/bin/env bash
#set -x

((EUID)) && exec sudo -- "$0" "$@"
trap 'printf '\''%b'\'' '\''\033[1;31m'\'' >&2; echo "A fatal error was reported on ${BASH_SOURCE[0]} line ${LINENO} in $(pwd)." >&2; printf '\''%b'\'' '\''\033[0m'\'' >&2; exit 1' ERR

apt-get update
apt-get --yes upgrade
apt-get --yes install aptitude git ranger python3-pip kde-full wget
apt-get --yes remove compiz compiz-bcop compiz-core compiz-dev compiz-gnome compiz-mate compiz-plugins compiz-plugins-default compiz-plugins-experimental compiz-plugins-extra compiz-plugins-main compizconfig-settings-manager libcompizconfig0 libcompizconfig0-dev python-compizconfig
mkdir -p crystallize-git-wreathe-setup
(
    cd crystallize-git-wreathe-setup
    rm -r ./crystallize
    git clone https://github.com/ethus3h/crystallize.git
)
mv crystallize-git-wreathe-setup/crystallize crystallize-git-wreathe-setup-b
(
    cd crystallize-git-wreathe-setup-b
    make autodep
)
pip3 install internetarchive
mkdir -p /var/ember-wreathe-packages-repository
cd /var/ember-wreathe-packages-repository
ia download Wreathe-GNU-Linux-Multisystem-Packages --glob='*.deb' || { echo "Could not fetch packages."; exit 1 }
dpkg -i ./Wreathe-GNU-Linux-Multisystem-Packages/Wreathe-GNU-Linux-Multisystem-Packages/deb-output/*.deb
aptitude hold compizconfig-python compiz-boxmenu compiz-manager fusion-icon compiz-bcop libcompizconfig ccsm compiz-debug-utils simple-ccsm compicc compiz-extra-snowflake-textures compiz-plugins-community compiz-plugins-experimental compiz-plugins-extra compiz-plugins-main compiz-plugins-meta emerald-themes compiz compiz-meta emerald
echo "compizconfig-python hold" | dpkg --set-selections
echo "compiz-boxmenu hold" | dpkg --set-selections
echo "compiz-manager hold" | dpkg --set-selections
echo "fusion-icon hold" | dpkg --set-selections
echo "compiz-bcop hold" | dpkg --set-selections
echo "libcompizconfig hold" | dpkg --set-selections
echo "ccsm hold" | dpkg --set-selections
echo "compiz-debug-utils hold" | dpkg --set-selections
echo "simple-ccsm hold" | dpkg --set-selections
echo "compicc hold" | dpkg --set-selections
echo "compiz-extra-snowflake-textures hold" | dpkg --set-selections
echo "compiz-plugins-community hold" | dpkg --set-selections
echo "compiz-plugins-experimental hold" | dpkg --set-selections
echo "compiz-plugins-extra hold" | dpkg --set-selections
echo "compiz-plugins-main hold" | dpkg --set-selections
echo "compiz-plugins-meta hold" | dpkg --set-selections
echo "emerald-themes hold" | dpkg --set-selections
echo "compiz hold" | dpkg --set-selections
echo "compiz-meta hold" | dpkg --set-selections
echo "emerald hold" | dpkg --set-selections
