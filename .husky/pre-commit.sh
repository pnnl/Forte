#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
npm --no-git-tag-version version patch && git add .