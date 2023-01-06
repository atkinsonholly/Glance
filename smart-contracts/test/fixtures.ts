import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {ethers, deployments, getUnnamedAccounts} from 'hardhat';

export const setup = deployments.createFixture(async (hre: HardhatRuntimeEnvironment) => {
	const {deployments, getNamedAccounts} = hre;
	await deployments.fixture('Glance');
	const {deployer, admin} = await getNamedAccounts();
	const others = await getUnnamedAccounts();

	const contract = await ethers.getContract('Glance', deployer);

	const contractAsDeployer = await contract.connect(ethers.provider.getSigner(deployer));
	await contractAsDeployer.transferOwnership(admin);

	const contractAsUser = await contract.connect(ethers.provider.getSigner(others[0]));
	const contractAsApprovedAddress = await contract.connect(ethers.provider.getSigner(others[5]));

	const contractAsOwner = await contract.connect(ethers.provider.getSigner(admin));

	return {
		contract,
		contractAsOwner,
		contractAsUser,
		contractAsApprovedAddress,
		others,
		hre,
		admin,
		deployer,
	};
});
