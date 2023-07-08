const fs = require('fs');
const path = require('path');
const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');

const producerCcpPath = path.join(process.cwd(), process.env.PRODUCER_CONN);
const producerCcpFile = fs.readFileSync(producerCcpPath, 'utf8');
const producerCcp = JSON.parse(producerCcpFile);

const manufacturerCcpPath = path.join(process.cwd(), process.env.MANUFACTURER_CONN);
const manufacturerCcpFile = fs.readFileSync(manufacturerCcpPath, 'utf8');
const manufacturerCcp = JSON.parse(manufacturerCcpFile);

const distributorCcpPath = path.join(process.cwd(), process.env.DISTRIBUTOR_CONN);
const distributorCcpFile = fs.readFileSync(distributorCcpPath, 'utf8');
const distributorCcp = JSON.parse(distributorCcpFile);

const retailerCcpPath = path.join(process.cwd(), process.env.RETAILER_CONN);
const retailerCcpFile = fs.readFileSync(retailerCcpPath, 'utf8');
const retailerCcp = JSON.parse(retailerCcpFile);

const consumerCcpPath = path.join(process.cwd(), process.env.CONSUMER_CONN);
const consumerCcpFile = fs.readFileSync(consumerCcpPath, 'utf8');
const consumerCcp = JSON.parse(consumerCcpFile);

function getConnectionMaterial(isProducer, isManufacturer, isDistributor, isRetailer, isConsumer) {
    const connectionMaterial = {};

    if (isProducer) {
        connectionMaterial.walletPath = path.join(process.cwd(), process.env.PRODUCER_WALLET);
        connectionMaterial.connection = producerCcp;
        connectionMaterial.orgMSPID = process.env.PRODUCER_MSP;
        connectionMaterial.caURL = process.env.PRODUCER_CA_ADDR;
    }

    if (isManufacturer) {
        connectionMaterial.walletPath = path.join(process.cwd(), process.env.MANUFACTURER_WALLET);
        connectionMaterial.connection = manufacturerCcp;
        connectionMaterial.orgMSPID = process.env.MANUFACTURER_MSP;
        connectionMaterial.caURL = process.env.MANUFACTURER_CA_ADDR;
    }
    
    if (isDistributor) {
        connectionMaterial.walletPath = path.join(process.cwd(), process.env.DISTRIBUTOR_WALLET);
        connectionMaterial.connection = distributorCcp;
        connectionMaterial.orgMSPID = process.env.DISTRIBUTOR_MSP;
        connectionMaterial.caURL = process.env.DISTRIBUTOR_CA_ADDR;
    }

    if (isRetailer) {
        connectionMaterial.walletPath = path.join(process.cwd(), process.env.RETAILER_WALLET);
        connectionMaterial.connection = retailerCcp;
        connectionMaterial.orgMSPID = process.env.RETAILER_MSP;
        connectionMaterial.caURL = process.env.RETAILER_CA_ADDR;
    }

    if (isConsumer) {
        console.log(process.env.CONSUMER_WALLET);
        connectionMaterial.walletPath = path.join(process.cwd(), process.env.CONSUMER_WALLET);
        connectionMaterial.connection = consumerCcp;
        connectionMaterial.orgMSPID = process.env.CONSUMER_MSP;
        connectionMaterial.caURL = process.env.CONSUMER_CA_ADDR;
    }

    return connectionMaterial;
}

exports.connect = async (isProducer, isManufacturer, isDistributor, isRetailer, isConsumer, userID) => {
    const gateway = new Gateway();

    try {
        const { walletPath, connection } = getConnectionMaterial(isProducer, isManufacturer, isDistributor, isRetailer, isConsumer);

        const wallet = new FileSystemWallet(walletPath);
        const userExists = await wallet.exists(userID);
        if (!userExists) {
            console.error(`An identity for the user ${userID} does not exist in the wallet. Register ${userID} first`);
            return { status: 401, error: 'User identity does not exist in the wallet.' };
        }

        await gateway.connect(connection, {
            wallet,
            identity: userID,
            discovery: { enabled: true, asLocalhost: Boolean(process.env.AS_LOCALHOST) },
        });
        const network = await gateway.getNetwork(process.env.CHANNEL);
        const contract = await network.getContract(process.env.CONTRACT);
        console.log('Connected to fabric network successfully.');

        const networkObj = { gateway, network, contract };

        return networkObj;
    } catch (err) {
        console.error(`Fail to connect network: ${err}`);
        await gateway.disconnect();
        return { status: 500, error: err.toString() };
    }
};

exports.query = async (networkObj, ...funcAndArgs) => {
    try {
        console.log(`Query parameter: ${funcAndArgs}`);
        const funcAndArgsStrings = funcAndArgs.map(elem => String(elem));
        const response = await networkObj.contract.evaluateTransaction(...funcAndArgsStrings);
        console.log(`Transaction ${funcAndArgs} has been evaluated: ${response}`);

        return JSON.parse(response);
    } catch (err) {
        console.error(`Failed to evaluate transaction: ${err}`);
        return { status: 500, error: err.toString() };
    } finally {
        if (networkObj.gatway) {
            await networkObj.gateway.disconnect();
        }
    }
};

exports.invoke = async (networkObj, ...funcAndArgs) => {
    try {
        console.log(`Invoke parameter: ${funcAndArgs}`);
        const funcAndArgsStrings = funcAndArgs.map(elem => String(elem));
        console.log(funcAndArgsStrings);
        const response = await networkObj.contract.submitTransaction(...funcAndArgsStrings);
        console.log(response);
        console.log(`Transaction ${funcAndArgs} has been submitted: ${response}`);

        return JSON.parse(response);
    } catch (err) {
        console.error(`Failed to submit transaction: ${err}`);
        return { status: 500, error: err.toString() };
    } finally {
        if (networkObj.gatway) {
            await networkObj.gateway.disconnect();
        }
    }
};

exports.enrollAdmin = async (isProducer, isManufacturer, isDistributor, isRetailer, isConsumer) => {
    try {
        const { walletPath, orgMSPID, caURL } = getConnectionMaterial(isProducer, isManufacturer, isDistributor, isRetailer, isConsumer);

        const wallet = new FileSystemWallet(walletPath);
        const adminExists = await wallet.exists(process.env.ADMIN);
        if (adminExists) {
            console.error('Admin user identity already exists in the wallet');
            return;
        }

        const ca = new FabricCAServices(caURL);
        const enrollment = await ca.enroll({
            enrollmentID: process.env.ADMIN,
            enrollmentSecret: process.env.ADMIN_SECRET,
        });
        const identity = X509WalletMixin.createIdentity(orgMSPID, enrollment.certificate, enrollment.key.toBytes());
        await wallet.import(process.env.ADMIN, identity);
        console.log(`Successfully enrolled admin user and imported it into the wallet`);
    } catch (err) {
        console.error(`Failed to enroll admin user: ${err}`);
        process.exit(1);
    }
};

exports.registerUser = async (isProducer, isManufacturer, isDistributor, isRetailer, isConsumer, userID) => {
    const gateway = new Gateway();

    try {
        const { walletPath, connection, orgMSPID } = getConnectionMaterial(isProducer, isManufacturer, isDistributor, isRetailer, isConsumer);

        console.log(walletPath);
        console.log(orgMSPID);

        const wallet = new FileSystemWallet(walletPath);
        const userExists = await wallet.exists(userID);
        if (userExists) {
            console.error(`An identity for the user ${userID} already exists in the wallet`);
            return { status: 400, error: 'User identity already exists in the wallet.' };
        }

        await gateway.connect(connection, {
            wallet,
            identity: process.env.ADMIN,
            discovery: { enabled: true, asLocalhost: Boolean(process.env.AS_LOCALHOST) },
        });
        const ca = gateway.getClient().getCertificateAuthority();
        const adminIdentity = gateway.getCurrentIdentity();

        const secret = await ca.register({ affiliation: 'org1', enrollmentID: userID, role: 'client' }, adminIdentity);
        const enrollment = await ca.enroll({ enrollmentID: userID, enrollmentSecret: secret });
        const userIdentity = X509WalletMixin.createIdentity(orgMSPID, enrollment.certificate, enrollment.key.toBytes());
        await wallet.import(userID, userIdentity);

        console.log(`Successfully registered user. Use userID ${userID} to login`);
        return userIdentity;
    } catch (err) {
        console.error(`Failed to register user ${userID}: ${err}`);
        return { status: 500, error: err.toString() };
    } finally {
        await gateway.disconnect();
    }
};

exports.checkUserExists = async (isProducer, isManufacturer, isDistributor, isRetailer, isConsumer, userID) => {
    try {
        const { walletPath } = getConnectionMaterial(isProducer, isManufacturer, isDistributor, isRetailer, isConsumer);
        const wallet = new FileSystemWallet(walletPath);
        const userExists = await wallet.exists(userID);
        return userExists;
    } catch (err) {
        console.error(`Failed to check that user exists ${userID}: ${err}`);
        return { status: 500, error: err.toString() };
    }
};