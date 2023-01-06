/**
 * Intended to help format params for multisender tool.
 * How to use:
 *  - yarn execute <NETWORK> ./scripts/parseWallets.ts
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

	// Write wallet together with id and amount to file
	const parsedWallets = [];
	for (const wallet of wallets) {
		parsedWallets.push(`${wallet},1,1`);
	}
	fs.writeFileSync(`./data/parsedWallets.json`, JSON.stringify(parsedWallets));
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
