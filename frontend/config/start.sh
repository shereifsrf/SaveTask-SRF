#!/bin/sh

# reference https://phase.dev/blog/nextjs-public-runtime-variables/

# Define a list of environment variables to check and replace
VARIABLES="NEXT_PUBLIC_TASK_API_URL NEXT_PUBLIC_TASK_BACKEND_URL NEXT_PUBLIC_USER_API_URL NEXT_PUBLIC_USER_BACKEND_URL"

echo "Starting the application..."

# Check if each variable is set
for VAR in $VARIABLES; do
    VALUE=$(eval echo \$$VAR)
    if [ -z "$VALUE" ]; then
        echo "$VAR is not set. Please set it and rerun the script."
        exit 1
    fi
done

# Find and replace SAVETASK values with real values
for FILE in $(find /app/public /app/.next -type f -name "*.js"); do
    for VAR in $VARIABLES; do
        VALUE=$(eval echo \$$VAR)
        sed -i "s|SAVETASK_$VAR|${VALUE}|g" "$FILE"
    done
done

node server.js
