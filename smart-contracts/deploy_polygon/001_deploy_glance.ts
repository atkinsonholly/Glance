import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

// File used for Mumbai and Polygon deployments

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const {deployments, getNamedAccounts} = hre;
	const {deploy} = deployments;

	const {deployer} = await getNamedAccounts();
	await deploy('PolygonGlance', {
		from: deployer,
		contract: 'Glance',
		args: ['Glance', 'GLANCE'],
		log: true,
		skipIfAlreadyDeployed: true,
	});
};
export default func;
func.tags = ['PolygonGlance', 'PolygonGlance_deploy'];
