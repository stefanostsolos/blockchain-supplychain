#!/bin/bash

# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
#

echo
echo " ____    _____      _      ____    _____ "
echo "/ ___|  |_   _|    / \    |  _ \  |_   _|"
echo "\___ \    | |     / _ \   | |_) |   | |  "
echo " ___) |   | |    / ___ \  |  _ <    | |  "
echo "|____/    |_|   /_/   \_\ |_| \_\   |_|  "
echo
echo "Welcome to SupplyChain Blockchain"
echo
CHANNEL_NAME="supplychainchannel"
LANGUAGE="go"
DELAY=5
COUNTER=1
MAX_RETRY=5

CC_NAME="supplycc"
CC_SRC_PATH="github.com/chaincode"
echo "Channel name : "$CHANNEL_NAME

# import utils
. scripts/utils.sh

createChannel() {
    setGlobals 0 1

    if [ -z $CORE_PEER_TLS_ENABLED -o $CORE_PEER_TLS_ENABLED = "false" ]; then
        set -x
        peer channel create -o orderer.example.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx >&log.txt
        res=$?
        set +x
    else
        set -x
        peer channel create -o orderer.example.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA >&log.txt
        res=$?
        set +x
    fi
    cat log.txt
    verifyResult $res "Channel creation failed"
    echo "===================== Channel '$CHANNEL_NAME' was created ===================== "
    echo
}

joinChannel() {
    joinChannelWithRetry 0 1
    joinChannelWithRetry 1 1
    joinChannelWithRetry 0 2
    joinChannelWithRetry 0 3
    joinChannelWithRetry 0 4
    joinChannelWithRetry 1 4
    joinChannelWithRetry 0 5
    joinChannelWithRetry 1 5
}

## Create channel
echo "Creating channel..."
createChannel

## Join all the peers to the channel
echo "Making peers join the channel..."
joinChannel

## Set the anchor peers for each org in the channel
echo "Updating anchor peers for producer..."
updateAnchorPeers 0 1
#updateAnchorPeers 1 1
echo "Updating anchor peers for manufacturer..."
updateAnchorPeers 0 2
echo "Updating anchor peers for distributor..."
updateAnchorPeers 0 3
echo "Updating anchor peers for retailer..."
updateAnchorPeers 0 4
#updateAnchorPeers 1 4
echo "Updating anchor peers for consumer..."
updateAnchorPeers 0 5
#updateAnchorPeers 1 5

## Install chaincode on peer0.manufacturer etc
echo "Install chaincode on peer0.manufacturer..."
installChaincode 0 1
installChaincode 1 1
installChaincode 0 2
installChaincode 0 3
installChaincode 0 4
installChaincode 1 4
installChaincode 0 5
installChaincode 1 5

# Instantiate chaincode on peer0.manufacturer
echo "Instantiating chaincode on peer0.manufacturer..."
instantiateChaincode 0 2

# Invoke chaincode on peer0.manufacturer
echo "Sending invoke transaction on peer0.manufacturer"
chaincodeInvoke "manufacturer" 0 2

echo
echo "========= All good, execution was successfully completed =========== "
echo

echo
echo " _____   _   _   ____   "
echo "| ____| | \ | | |  _ \  "
echo "|  _|   |  \| | | | | | "
echo "| |___  | |\  | | |_| | "
echo "|_____| |_| \_| |____/  "
echo

exit 0