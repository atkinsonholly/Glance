/**
 * How to use:
 *  - yarn execute <NETWORK> ./scripts/mint.ts
 */

import {deployments, getNamedAccounts} from 'hardhat';
const {execute} = deployments;

async function main() {
	const {deployer} = await getNamedAccounts();
	await execute('First', {from: deployer, log: true}, 'mint', deployer, 1, 1000, '0x');
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
