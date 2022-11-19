const sovChain = require('./chain/index')
const sinon = require('sinon');

const { Context } = require('fabric-contract-api');
const { ChaincodeStub } = require('fabric-shim');

const Chain = new sovChain.AssetTransfer()

let transactionContext, chaincodeStub;
transactionContext = new Context();
chaincodeStub = sinon.createStubInstance(ChaincodeStub);
transactionContext.setChaincodeStub(chaincodeStub);

module.exports.ctx = transactionContext;
module.exports.Chain = Chain;