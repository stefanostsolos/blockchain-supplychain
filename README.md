# Blockchain Supplychain, NTUA ECE Diploma
This project showcases an application of blockchain technology, built on the Hyperledger Fabric platform, aimed at redefining how we view supply chain management in the ERP (Enterprise Resource Planning) landscape. The solution offers a decentralized, transparent and efficient system to manage various stages of a supply chain process. 

## Data
Our data comes from the Apache OFBiz test dataset. Using an SQL explorer, we can extract the selected data we need. Specifically, we extract the tables PRODUCT, INVENTORY_ITEM, ORDER_HEADER, ORDER_ITEM, SHIPMENT, SHIPMENT_ITEM. The JSON files of the above tables are included here to facilitate user testing of the application. In case we want to explore the database of Apache OFBiz, below is the connection profile that allows us to connect from RazorSQL to the database of Apache OFBiz, through a JDBC driver. Accordingly, we can connect another SQL explorer to our ERP system.

## System Design
![System design](https://github.com/stefanostsolos/blockchain-supplychain/blob/main/imgs/system.png?raw=true)

## Hyperledger Fabric Network Details
![Architecture of the blockchain system](https://github.com/stefanostsolos/blockchain-supplychain/blob/main/imgs/architecture.png?raw=true)
The stakeholders that are available on the system are five: Producer, Manufacturer (Owner of the business), Distributor, Retailer and Consumer. For our use case we focus on the order process of some items from the Manufacturer-Owner.
- Five Orgs (Producer / Manufacturer / Distributor / Retailer / Consumer)
- 2 Peers of type Producer, 1 Peer of type Manufacturer, 1 Peer of type Distributor, 2 Peers of type Retailer, 2 Peers of type Consumer
- One Orderer
- One Channel
- Five Certificate Authorities

## Installation

### Prerequisities
> cURL

Install the latest version of cURL if it is not already installed:
```sudo apt-get install curl```

> Go

Install Golang 1.14.15:
wget https://go.dev/dl/go1.14.15.linux-amd64.tar.gz
...

> Docker

Install the latest version of Docker if it is not already installed:
```sudo apt-get -y install docker-compose```

Make sure the Docker daemon is running:
```sudo systemctl start docker```

If you want the Docker daemon to start when the system starts, use the following:
```sudo systemctl enable docker```

Add your user to the Docker group:
```sudo usermod -a -G docker <username>```

> Hyperledger Fabric

```mkdir -p $HOME/hyperledger-fabric```

Get the install script:
```curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh && chmod +x install-fabric.sh```

Pull the Docker containers and binaries:
```./install-fabric.sh docker --fabric-version 1.4.12 binary```

### Network Setup and Run
Navigate to the main directory (~/src/github.com) and execute: 

```./stopNetwork.sh && ./teardown.sh``` to clear the Docker containers and network

```export CHANNEL_NAME=supplychainchannel ; export $(xargs <.env) ; export DOCKER_CLIENT_TIMEOUT=120 ; export COMPOSE_HTTP_TIMEOUT=120 ; source ~/.bashrc ; ./operate.sh up``` to start the blockchain network

### Frontend Setup
Navigate to the client directory (~/src/github.com/web-app/client) and execute:

```npm install``` to install the required packages

```npm start``` to start the client

### Server Setup
Navigate to the server directory (~/src/github.com/web-app/servers) and execute:
```node app.js```

Then you can navigate to http://localhost:3000 to login as an admin with Username: admin and Password: adminpw

You can continue with creating a user that will be able to use the application's functions.
