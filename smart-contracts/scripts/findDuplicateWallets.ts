/**
 * How to use:
 *  - yarn execute <NETWORK> ./scripts/findDuplicateWallets.ts
 */

import fs from 'fs-extra';

async function main() {
	let wallets;
	try {
		wallets = fs.readJSONSync(`data/wallets.json`);
	} catch (e) {
		console.log('Error', e);
		return;
	}

	const parsedWallets: any = {};
	const duplicateWallets = [];
	let counter = 0;
	for (const wallet of wallets) {
		if (parsedWallets[wallet] === undefined) {
			parsedWallets[wallet] = true;
		} else {
			duplicateWallets.push(wallet);
		}
		counter++;
	}
	console.log('Duplicate wallets: ');
	console.log(duplicateWallets);
	console.log(`${counter} wallets total`);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
