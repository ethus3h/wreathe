#!/bin/bash
cd onscreen-keyboard
cp wreathe.onboard.template onboard-emoji/emoji.onboard.template
onboard-emoji/gen_layout.py
mv onboard-emoji/layout/emoji.onboard ../../usr/share/onboard/layouts/wreathe.onboard
