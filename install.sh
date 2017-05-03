#!/bin/bash

# Get absolute path of the directory this file beeing run from
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)" || { echo "Could not get the directory of this script. Exiting... "; exit 1; }
echo "installing for directory: $DIR"

# Get username of the user running this script, even if it uses sudo
CURRENT_USER="$(logname)" || { echo "Could not get name of current user. Exiting... "; exit 1; }
echo "Installing for user: $CURRENT_USER"

# Get the home directory of the current user to find the ~/.Xauthority file
CURRENT_USER_DIR=$(eval echo "~$CURRENT_USER") || { echo "Could not get current users directory. Exiting... "; exit 1; }
echo "Current users home directory: $CURRENT_USER_DIR"

# Copy systemd unit files to correct locaion
cp -v $DIR/nibble-server.service /lib/systemd/system/ || { echo "Could not copy server unit file. Exiting... "; exit 1; }
cp -v $DIR/nibble-client.service /lib/systemd/system/ || { echo "Could not copy client unit file. Exiting... "; exit 1; }

# Inject directories for nibble into systemd unit files
sed -i \
    -e "s@\$NIBBLE_USER_DIR@$CURRENT_USER_DIR@" \
    -e "s@\$NIBBLE_USER@$CURRENT_USER@" \
    -e "s@\$NIBBLE_DIR@$DIR@" /lib/systemd/system/nibble-client.service \
    || { echo "Could not inject directories into client unit file. Exiting... "; exit 1; }

sed -i \
    -e "s@\$NIBBLE_DIR@$DIR@" /lib/systemd/system/nibble-server.service \
    || { echo "Could not inject directories into server unit file. Exiting... "; exit 1; }

# reload the systemd daemon
systemctl daemon-reload || { echo "Could not restart systemd daemon. Exiting... "; exit 1; }
echo "systemd daemon reloaded"

# Create constants.js
cp -v $DIR/app/src/common/constants.example.js $DIR/app/src/common/constants.js

read -p "Enter NIBBLE_CLIENT_ID: " NIBBLE_CLIENT_ID
read -p "Enter NIBBLE_CLIENT_SECRET: " NIBBLE_CLIENT_SECRET

echo "NIBBLE_CLIENT_ID: $NIBBLE_CLIENT_ID"
echo "NIBBLE_CLIENT_SECRET: $NIBBLE_CLIENT_SECRET"

# inject secrets into constants.js
sed -i \
    -e "s@CLIENT_SECRET\ =\ '';@CLIENT_SECRET\ =\ '$NIBBLE_CLIENT_SECRET';@" \
    -e "s@CLIENT_ID\ =\ '';@CLIENT_ID\ =\ '$NIBBLE_CLIENT_ID';@" $DIR/app/src/common/constants.js \
    || { echo "Could not inject directories into constants.js. Exiting... "; exit 1; }

# Install dependencies for Nibble with npm
npm install --silent --depth=0 --prefix $CURRENT_DIR

# ask if Nibble2 should load on system start
read -p "Should Nibble2 be enabled on startup? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    systemctl enable nibble-server.service | { echo "Could not enable Nibble2 server on startup. Exiting... "; exit 1; }
    systemctl enable nibble-client.service | { echo "Could not enable Nibble2 client on startup. Exiting... "; exit 1; }
    echo "Nibble2 server and client enabled on startup"
fi

# ask if Nibble2 should be started right now, if Y or y, start Nibble2
read -p "Nibble2 is now installed to your system, should it be started now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    systemctl start nibble-server.service || { echo "Could not start Nibble2 server. Exiting... "; exit 1; }
    echo "Started Nibble2 server"
    systemctl start nibble-client.service || { echo "Could not start Nibble2 client. Exiting... "; exit 1; }
    echo "Started Nibble2 client"
fi

