#!/usr/bin/env bash
#!/bin/bash -e

NAME="$1"
ID="$2"
TITLE="$3"
EMAIL="$4"
PASSWORD="$5"
current_directory=$(pwd)

echo "Enter the name of the student: $NAME"
echo "$current_directory"

python3 "$current_directory/src/app/api/form/python/main.py" "$NAME" "$ID" "$TITLE" "$EMAIL" "$PASSWORD"