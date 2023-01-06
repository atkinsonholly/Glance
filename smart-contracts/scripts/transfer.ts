/**
 * How to use:
 *  - yarn execute <NETWORK> ./scripts/transfer.ts
 */

import fs from 'fs-extra';
import {deployments, getNamedAccounts} from 'hardhat';
const {execute, read} = deployments;

async function main() {
	const {deployer} = await getNamedAccounts();
	const executed = [];

	let wallets;
	try {
		wallets = fs.readJSONSync(`data/wallets.json`);
	} catch (e) {
		console.log('Error', e);
		return;
	}

	for (const wallet of wallets) {
		const balance = await read('First', 'balanceOf', wallet, 1);
		if (balance == 0) {
			await execute('First', {from: deployer, log: true}, 'safeTransferFrom', deployer, wallet, 1, 1, '0x');
			executed.push(wallet);
			console.log(`Transfer executed to ${wallet}`);
		}
	}
	fs.writeFileSync(`./data/executedTransfers.json`, JSON.stringify(executed));
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
