#!/usr/bin/bash

rm release -rf

cp -r ./build ./release
cd release

exists() {
    [ -x "$(command -v $1)" ]
}

running() {
    PACKAGEMAN=$2
    echo "you're running $1..."
}

if ! $(exists sd); then
    echo 'Hey! `sd` is not installed!'
    echo -n "It seems that "
    if $(exists apk); then
        running Alpine apk
    elif $(exists pacman); then
        running Arch pacman
    elif $(exists emerge); then
        running Gentoo emerge
    elif $(exists dnf); then
        running Fedora dnf
    elif $(exists pkg); then
        running FreeBSD pkg
    elif $(exists brew); then
        running macOS brew
    elif $(exists xbps-install); then
        running Void xbps-install
    elif $(exists cargo); then
        running "The Cargo build system" cargo
    else
        echo "your operating system isn't supported by the auto-installer. Please install manually!"
        PACKAGEMAN="NONE"
    fi

    if ! [ $PACKAGEMAN == "NONE" ]; then
        echo
        read -p "Install using automatic installer? [y/N] " -n 1 -r; echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            read -p "Use sudo? [y/N] " -n 1 -r; echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                if [ $PACKAGEMAN == apk ]; then
                    sudo apk add sd
                elif [ $PACKAGEMAN == pacman ]; then
                    sudo pacman -S sd
                elif [ $PACKAGEMAN == emerge ]; then
                    sudo emerge -av sys-apps/sd
                else
                    sudo $PACKAGEMAN install sd
                fi
            else
                if [ $PACKAGEMAN == apk ]; then
                    apk add sd
                elif [ $PACKAGEMAN == pacman ]; then
                    pacman -S sd
                elif [ $PACKAGEMAN == emerge ]; then
                    emerge -av sys-apps/sd
                else
                    $PACKAGEMAN install sd
                fi
            fi
        else
            echo "Operation cancelled."
        fi
    fi
fi

# Compatibility translations from p5.js to legacy Processing.js
sd 'console\.log' 'println' ./*.js
sd 'createCanvas' '// createCanvas' ./*.js
sd '[^\.]push' 'pushMatrix' ./*.js
sd '[^\.]pop' 'popMatrix' ./*.js
sd 'print[^l]\s*?' 'println\(' ./*.js
sd 'new\s*?Array\s*?\(\)' 'new Array(0)' ./*.js
sd 'createVector' 'new PVector' ./*.js
sd 'function\sdraw' '\nsetup();\nfunction draw' ./*.js
sd 'windowWidth' 'width' ./*.js
sd 'windowHeight' 'height' ./*.js
sd 'resizeCanvas' '// resizeCanvas' ./*.js
sd 'textFont(.*);' 'textFont(createFont$1);' ./*.js

prepend() {
    echo -e "$2\n$(cat $1)" > $1
}

packageattr() {
    cat ../package.json | jq -r .$1
}

prepend build.js "/*jshint sub:true*/ // This lets JSHint forgive absence of dot notation"
prepend build.js "//"
prepend build.js "// This projects' source is available at $(packageattr homepage)"
prepend build.js "//"
prepend build.js "//   https://opensource.org/licenses/BSD-3-Clause"
prepend build.js "//   made available under the BSD-3-Clause License"
prepend build.js "// This project uses the p5.ts legacy parser by Carter Reeb"
prepend build.js "//"
prepend build.js "// \"$(packageattr description)\""
prepend build.js "// ----------- $(packageattr name) v$(packageattr version) -----------"

echo "Successfully built ./release/build.js!"