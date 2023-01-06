import 'dotenv/config';
import {HardhatUserConfig} from 'hardhat/types';
import 'hardhat-deploy';
import '@nomiclabs/hardhat-ethers';
import 'hardhat-gas-reporter';
import '@typechain/hardhat';
import 'solidity-coverage';
import 'hardhat-deploy-tenderly';
import {node_url, accounts, addForkConfiguration} from './utils/network';

const config: HardhatUserConfig = {
	solidity: {
		compilers: [
			{
				version: '0.8.17',
				settings: {
					optimizer: {
						enabled: true,
						runs: 2000,
					},
				},
			},
		],
	},
	namedAccounts: {
		deployer: {
			default: 0, // here this will by default take the first account as deployer
			mumbai: 0,
			mainnet: '',
			polygon: 0,
		},
		admin: {
			default: 1, // here this will by default take the second account as admin
			mumbai: 1,
			mainnet: '',
			polygon: '0x7019523F9f04C4F4e084c39be1049718d48Ee833',
		},
	},
	networks: addForkConfiguration({
		hardhat: {
			deploy: ['deploy_polygon', 'deploy'],
			companionNetworks: {
				l1: 'hardhat',
				l2: 'hardhat',
			},
			initialBaseFeePerGas: 0, // to fix : https://github.com/sc-forks/solidity-coverage/issues/652, see https://github.com/sc-forks/solidity-coverage/issues/652#issuecomment-896330136
		},
		localhost: {
			url: node_url('localhost'),
			accounts: accounts(),
		},
		mainnet: {
			url: node_url('mainnet'),
			accounts: accounts('mainnet'),
		},
		goerli: {
			url: node_url('goerli'),
			accounts: accounts('goerli'),
		},
		mumbai: {
			url: node_url('mumbai'),
			accounts: accounts('mumbai'),
			tags: ['testnet', 'L2'],
			deploy: ['deploy_polygon'],
			//gasPrice: 600000000000,
		},
		polygon: {
			url: node_url('polygon'),
			accounts: accounts('polygon'),
			tags: ['mainnet', 'L2'],
			deploy: ['deploy_polygon'],
			// gasPrice: 2000000000000,
		},
	}),
	paths: {
		sources: 'src',
	},
	gasReporter: {
		currency: 'USD',
		gasPrice: 100,
		enabled: true,
		coinmarketcap: process.env.COINMARKETCAP_API_KEY,
		maxMethodDiff: 10,
	},
	typechain: {
		outDir: 'typechain',
		target: 'ethers-v5',
	},
	mocha: {
		timeout: 0,
	},
	external: process.env.HARDHAT_FORK
		? {
				deployments: {
					// process.env.HARDHAT_FORK will specify the network that the fork is made from.
					// these lines allow it to fetch the deployments from the network being forked from both for node and deploy task
					hardhat: ['deployments/' + process.env.HARDHAT_FORK],
					localhost: ['deployments/' + process.env.HARDHAT_FORK],
				},
		  }
		: undefined,

	tenderly: {
		project: 'template-ethereum-contracts',
		username: process.env.TENDERLY_USERNAME as string,
	},
};

export default config;
