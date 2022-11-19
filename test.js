const sovChain = require('./utils/chain/index')
const sinon = require('sinon');

const { Context } = require('fabric-contract-api');
const { ChaincodeStub } = require('fabric-shim');

const Chain = new sovChain.AssetTransfer()

let transactionContext, chaincodeStub;
transactionContext = new Context();
chaincodeStub = sinon.createStubInstance(ChaincodeStub);
transactionContext.setChaincodeStub(chaincodeStub);

async function create() {
    console.log(await Chain.CreateAsset(transactionContext, '123456', 'asdasdas', '21-10-2022', '1000', 'TRY', '1241243', '1241243'))
}

async function get() {
    console.log(await Chain.ReadAsset(transactionContext, '123456'))
}

async function exists() {
    console.log(await Chain.AssetExists(transactionContext, '123456'))
}

create()
get()