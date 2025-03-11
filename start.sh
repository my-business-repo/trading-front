#!/bin/sh

# Replace environment variables in index.html
envsubst < /app/build/index.html > /app/build/index.html.tmp && mv /app/build/index.html.tmp /app/build/index.html

# Serve the build directory
serve -s build -l 3000