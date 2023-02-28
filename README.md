# Blockchain Supplychain, NTUA ECE Diploma

## Stakeholders
1) Producer
2) Manufacturer (Owner)
3) Distributor
4) Retailer
5) Consumer

## Architecture and Network Details
![Architecture of the blockchain system](https://github.com/stefanostsolos/blockchain-supplychain/blob/main/imgs/architecture.png?raw=true)
- Five Orgs (Producer/Manufacturer/Distributor/Retailer/Consumer)
- 2 Peers Producer / 1 Peer Manufacturer / 1 Peer Distributor / 2 Peers Retailer / 2 Peers Consumer
- One Orderer
- One Channel
- Five Certificate Authorities

## Installation

### Prerequisities
> cURL

Install the latest version of cURL if it is not already installed:
```sudo apt-get install curl```

> Docker

Install the latest version of Docker if it is not already installed:
```sudo apt-get -y install docker-compose```

Make sure the Docker daemon is running:
```sudo systemctl start docker```

If you want the Docker daemon to start when the system starts, use the following:
```sudo systemctl enable docker```

Add your user to the Docker group:
```sudo usermod -a -G docker <username>```

> Fabric

```mkdir -p $HOME/hyperledger-fabric```

Get the install script:
```curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh && chmod +x install-fabric.sh```

Pull the Docker containers and binaries:
```./install-fabric.sh docker --fabric-version 1.4.6 binary```


### Application Setup
- ./stopNetwork.sh
- ./teardown.sh
- ./operate.sh up
