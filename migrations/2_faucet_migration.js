// eslint-disable-next-line no-undef
const FaucetContract = artifacts.require("FaucetContract");

module.exports = function (deployer) {
    deployer.deploy(FaucetContract);
}
