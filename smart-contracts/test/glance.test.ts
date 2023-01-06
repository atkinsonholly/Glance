import {setup} from './fixtures';
import {expect} from './chai-setup';

describe('Glance', function () {
	describe('Name and symbol have been set', function () {
		it('Can view name', async function () {
			const setUp = await setup();
			const {contract} = setUp;
			const name = await contract.name();
			expect(name).to.be.equal('Glance');
		});
		it('Can view symbol', async function () {
			const setUp = await setup();
			const {contract} = setUp;
			const symbol = await contract.symbol();
			expect(symbol).to.be.equal('GLANCE');
		});
	});
	describe('Ownership', function () {
		it('Owner can transferOwnership to a new owner', async function () {
			const setUp = await setup();
			const {contractAsOwner, contract, others, admin} = setUp;
			let owner = await contract.owner();
			expect(owner).to.be.equal(admin);
			await contractAsOwner.transferOwnership(others[0]);
			owner = await contract.owner();
			expect(owner).to.be.equal(others[0]);
		});
		it('Cannot transferOwnership if not owner', async function () {
			const setUp = await setup();
			const {contractAsUser, others} = setUp;
			await expect(contractAsUser.transferOwnership(others[0])).to.be.revertedWith(
				'Ownable: caller is not the owner'
			);
		});
	});
	describe('Mint', function () {
		it('Owner can mint', async function () {
			const setUp = await setup();
			const {contractAsOwner, contract, others} = setUp;
			await contractAsOwner.mint(others[0], 1,);
			expect(await contract.balanceOf(others[0])).to.be.equal(1);
		});
		it('Cannot mint if not Owner', async function () {
			const setUp = await setup();
			const {contractAsUser, others} = setUp;
			await expect(contractAsUser.mint(others[0], 1)).to.be.revertedWith(
				'Ownable: caller is not the owner'
			);
		});
	});
	describe('Burn', function () {
		it('Owner cannot burn users tokens with burn', async function () {
			const setUp = await setup();
			const {contractAsOwner, contract, others} = setUp;
			await contractAsOwner.mint(others[0], 1);
			await expect(contractAsOwner.burn(1)).to.be.revertedWith(
				'ERC721: caller is not token owner or approved'
			);
			expect(await contract.balanceOf(others[0])).to.be.equal(1);
		});
		it('User can burn their own tokens', async function () {
			const setUp = await setup();
			const {contractAsOwner, contractAsUser, contract, others} = setUp;
			await contractAsOwner.mint(others[0], 1);
			expect(await contract.balanceOf(others[0])).to.be.equal(1);
			await contractAsUser.burn(1);
			expect(await contract.balanceOf(others[0])).to.be.equal(0);
		});
	});
	describe('BurnFrom', function () {
		it('Owner can burn a users token with burnFrom', async function () {
			const setUp = await setup();
			const {contractAsOwner, contract, others} = setUp;
			await contractAsOwner.mint(others[0], 1);
			await expect(contractAsOwner.burnFrom(others[0], 1)).to.not.be.reverted;
			expect(await contract.balanceOf(others[0])).to.be.equal(0);
		});
		it('Cannot burn a users token with burnFrom if not Owner', async function () {
			const setUp = await setup();
			const {contractAsOwner, others, contractAsUser} = setUp;
			await contractAsOwner.mint(others[2], 1);
			await expect(contractAsUser.burnFrom(others[2], 1)).to.be.revertedWith("Ownable: caller is not the owner");
		});
	});
	describe('Locking', function () {
		it('token is initially locked', async function () {
			const setUp = await setup();
			const {contract, contractAsOwner, others} = setUp;
			await contractAsOwner.mint(others[0], 1,);
			const isLocked = await contract.locked(1);
			expect(isLocked).to.be.true;
		});
		it('Owner can set a tokenId as unlocked', async function () {
			const setUp = await setup();
			const {contract, contractAsOwner, others} = setUp;
			await contractAsOwner.mint(others[0], 1,);
			let isLocked = await contract.locked(1);
			expect(isLocked).to.be.true;
			await contractAsOwner.unlock(1);
			isLocked = await contract.locked(1);
			expect(isLocked).to.be.false;
		});
		it('Owner cannot set contract as locked if contract is already locked', async function () {
			const setUp = await setup();
			const {contract, contractAsOwner, others} = setUp;
			await contractAsOwner.mint(others[0], 1,);
			let isLocked = await contract.locked(1);
			expect(isLocked).to.be.true;
			await expect(contractAsOwner.lock(1)).to.be.revertedWith('Glance: tokenId is already locked');
		});
		it('If not Owner cannot set a tokenId as unlocked', async function () {
			const setUp = await setup();
			const {contract, contractAsOwner, others, contractAsUser} = setUp;
			await contractAsOwner.mint(others[0], 1,);
			let isLocked = await contract.locked(1);
			expect(isLocked).to.be.true;
			await expect(contractAsUser.unlock(1)).to.be.revertedWith('Ownable: caller is not the owner');
		});
		it('If not Owner cannot set a tokenId as locked', async function () {
			const setUp = await setup();
			const {contract, contractAsOwner, others, contractAsUser} = setUp;
			await contractAsOwner.mint(others[0], 1,);
			let isLocked = await contract.locked(1);
			expect(isLocked).to.be.true;
			await contractAsOwner.unlock(1);
			isLocked = await contract.locked(1);
			expect(isLocked).to.be.false;
			await expect(contractAsUser.lock(1)).to.be.revertedWith('Ownable: caller is not the owner');
		});
		it('Owner can set a tokenId as unlocked', async function () {
			const setUp = await setup();
			const {contract, contractAsOwner, others} = setUp;
			await contractAsOwner.mint(others[0], 1,);
			let isLocked = await contract.locked(1);
			expect(isLocked).to.be.true;
			await contractAsOwner.unlock(1);
			isLocked = await contract.locked(1);
			expect(isLocked).to.be.false;
		});
		it('Owner cannot set tokenId as unlocked if tokenId is already unlocked', async function () {
			const setUp = await setup();
			const {contract, contractAsOwner, others} = setUp;
			await contractAsOwner.mint(others[0], 1,);
			let isLocked = await contract.locked(1);
			expect(isLocked).to.be.true;
			await contractAsOwner.unlock(1);
			await expect(contractAsOwner.unlock(1)).to.be.revertedWith('Glance: tokenId is already unlocked');
		});
		it('Owner cannot burn a user token when tokenId is locked', async function () {
			const setUp = await setup();
			const {contract, contractAsOwner, others} = setUp;
			await contractAsOwner.mint(others[0], 1);
			let isLocked = await contract.locked(1);
			expect(isLocked).to.be.true;
			expect(await contract.balanceOf(others[0])).to.be.equal(1);
			await expect(contractAsOwner.burn(1)).to.be.revertedWith(
				'ERC721: caller is not token owner or approved'
			);
			expect(await contract.balanceOf(others[0])).to.be.equal(1);
		});
		it('Owner cannot burn a user token when tokenId is unlocked', async function () {
			const setUp = await setup();
			const {contract, contractAsOwner, others} = setUp;
			await contractAsOwner.mint(others[0], 1);
			let isLocked = await contract.locked(1);
			expect(isLocked).to.be.true;
			expect(await contract.balanceOf(others[0])).to.be.equal(1);
			await contractAsOwner.unlock(1);
			await expect(contractAsOwner.burn(1)).to.be.revertedWith(
				'ERC721: caller is not token owner or approved'
			);
			expect(await contract.balanceOf(others[0])).to.be.equal(1);
		});
		it('User can burn even when tokenId is locked', async function () {
			const setUp = await setup();
			const {contract, contractAsOwner, others, contractAsUser} = setUp;
			await contractAsOwner.mint(others[0], 1);
			let isLocked = await contract.locked(1);
			expect(isLocked).to.be.true;
			expect(await contract.balanceOf(others[0])).to.be.equal(1);
			await contractAsUser.burn(1);
			expect(await contract.balanceOf(others[0])).to.be.equal(0);
		});
		it('User cannot transfer token to another user when tokenId is locked', async function () {
			const setUp = await setup();
			const {contract, contractAsOwner, others, contractAsUser} = setUp;
			await contractAsOwner.mint(others[0], 1);
			let isLocked = await contract.locked(1);
			expect(isLocked).to.be.true;
			expect(await contract.balanceOf(others[0])).to.be.equal(1);
			await expect(contractAsUser['safeTransferFrom(address,address,uint256)'](others[0], others[1], 1)).to.be.revertedWith(
				'Glance: Tokens are non transferable'
			);
		});
		it('User can transfer token to another user when tokenId is unlocked', async function () {
			const setUp = await setup();
			const {contract, contractAsOwner, others, contractAsUser} = setUp;
			await contractAsOwner.mint(others[0], 1);
			await contractAsOwner.unlock(1);
			await contractAsUser['safeTransferFrom(address,address,uint256)'](others[0], others[1], 1);
			expect(await contract.balanceOf(others[0])).to.be.equal(0);
			expect(await contract.balanceOf(others[1])).to.be.equal(1);
		});
		it('Owner can transfer their token to another user when tokenId is locked', async function () {
			const setUp = await setup();
			const {contractAsOwner, contract, others, admin} = setUp;
			await contractAsOwner.mint(admin, 1);
			let locked = await contract.locked(1);
			expect(locked).to.be.true;
			await contractAsOwner['safeTransferFrom(address,address,uint256)'](admin, others[1], 1);
			expect(await contract.balanceOf(admin)).to.be.equal(0);
			expect(await contract.balanceOf(others[1])).to.be.equal(1);
		});
		it('Approved address can transfer Owner token to another user when tokenId is locked', async function () {
			const setUp = await setup();
			const {contractAsOwner, contract, others, admin, contractAsApprovedAddress} = setUp;
			await contractAsOwner.mint(admin, 1);
			let locked = await contract.locked(1);
			expect(locked).to.be.true;
			await contractAsOwner.setApprovalForAll(others[5], true);
			await contractAsApprovedAddress['safeTransferFrom(address,address,uint256)'](admin, others[1], 1);
			expect(await contract.balanceOf(admin)).to.be.equal(0);
			expect(await contract.balanceOf(others[1])).to.be.equal(1);
		});
		it('Approved address cannot transfer Owner token to another user when tokenId is locked after approval is revoked', async function () {
			const setUp = await setup();
			const {contractAsOwner, contract, others, admin, contractAsApprovedAddress} = setUp;
			await contractAsOwner.mint(admin, 1);
			let locked = await contract.locked(1);
			expect(locked).to.be.true;
			await contractAsOwner.setApprovalForAll(others[5], true);
			await contractAsApprovedAddress['safeTransferFrom(address,address,uint256)'](admin, others[1], 1);
			expect(await contract.balanceOf(admin)).to.be.equal(0);
			expect(await contract.balanceOf(others[1])).to.be.equal(1);
			await contractAsOwner.setApprovalForAll(others[5], false);
			await expect(
				contractAsApprovedAddress['safeTransferFrom(address,address,uint256)'](admin, others[1], 1)
			).to.be.revertedWith('ERC721: caller is not token owner or approved');
		});
		it('User cannot transfer tokens from Owner to another user when tokenId is locked', async function () {
			const setUp = await setup();
			const {contractAsOwner, contractAsUser, contract, others, admin} = setUp;
			await contractAsOwner.mint(admin, 1);
			let locked = await contract.locked(1);
			expect(locked).to.be.true;
			await expect(contractAsUser['safeTransferFrom(address,address,uint256)'](admin, others[1], 1)).to.be.revertedWith(
				'ERC721: caller is not token owner or approved'
			);
		});
		it('User cannot transfer tokens from Owner to another user when tokenId is unlocked', async function () {
			const setUp = await setup();
			const {contractAsOwner, contractAsUser, others, admin} = setUp;
			await contractAsOwner.mint(admin, 1);
			await contractAsOwner.unlock(1);
			await expect(contractAsUser['safeTransferFrom(address,address,uint256)'](admin, others[1], 1)).to.be.revertedWith(
				'ERC721: caller is not token owner or approved'
			);
		});
		it('Owner cannot transfer tokens from a user to another user when tokenId is unlocked', async function () {
			const setUp = await setup();
			const {contractAsOwner, others} = setUp;
			await contractAsOwner.mint(others[1], 1);
			await contractAsOwner.unlock(1);
			await expect(contractAsOwner['safeTransferFrom(address,address,uint256)'](others[1], others[2], 1)).to.be.revertedWith(
				'ERC721: caller is not token owner or approved'
			);
		});
		it('Owner cannot transfer tokens from a user to another user when tokenId is locked', async function () {
			const setUp = await setup();
			const {contractAsOwner, others} = setUp;
			await contractAsOwner.mint(others[1], 1);
			await expect(contractAsOwner['safeTransferFrom(address,address,uint256)'](others[1], others[2], 1)).to.be.revertedWith(
				'ERC721: caller is not token owner or approved'
			);
		});
		it('Owner can transfer their token to another user when tokenId is unlocked', async function () {
			const setUp = await setup();
			const {contractAsOwner, contract, others, admin} = setUp;
			await contractAsOwner.mint(admin, 1);
			await contractAsOwner.unlock(1);
			await contractAsOwner['safeTransferFrom(address,address,uint256)'](admin, others[1], 1);
			expect(await contract.balanceOf(admin)).to.be.equal(0);
			expect(await contract.balanceOf(others[1])).to.be.equal(1);
		});
		it('Event is emitted when a tokenId is locked', async function () {
			const setUp = await setup();
			const {contractAsOwner, others} = setUp;
			await contractAsOwner.mint(others[0], 1);
			await contractAsOwner.unlock(1);
			const tx = await contractAsOwner.lock(1);
			const receipt = await tx.wait();
			expect(receipt.events.length).to.be.equal(1);
			expect(receipt.events[0].event).to.be.equal('Locked');
		});
		it('Event is emitted when contract is unlocked', async function () {
			const setUp = await setup();
			const {contractAsOwner, others} = setUp;
			await contractAsOwner.mint(others[0], 1);
			const tx = await contractAsOwner.unlock(1);
			const receipt = await tx.wait();
			expect(receipt.events.length).to.be.equal(1);
			expect(receipt.events[0].event).to.be.equal('Unlocked');
		});
	});
	describe('baseURI', function () {
		it('baseURI can be retrieved', async function () {
			const setUp = await setup();
			const {contractAsOwner, contract, others} = setUp;
			await contractAsOwner.mint(others[0], 1);
			expect(await contract.baseURI()).to.be.equal('testuri');
		});
		it('Owner can set a new base URI', async function () {
			const setUp = await setup();
			const {contractAsOwner, contract, others} = setUp;
			await contractAsOwner.mint(others[0], 1);
			await contractAsOwner.setBaseURI('newBaseURI');
			expect(await contract.baseURI()).to.be.equal('newBaseURI');
		});
		it('Cannot change base URI if not Owner', async function () {
			const setUp = await setup();
			const {contractAsUser} = setUp;
			await expect(contractAsUser.setBaseURI('newBaseURI')).to.be.revertedWith('Ownable: caller is not the owner');
		});
	});
	describe('tokenURI', function () {
		it('tokenURI can be retrieved', async function () {
			const setUp = await setup();
			const {contractAsOwner, contract, others} = setUp;
			await contractAsOwner.mint(others[0], 1);
			expect(await contract.tokenURI(1)).to.be.equal('testuri' + '1' + '.json');
		});
	});
	describe('exists', function () {
		it('Can view whether a token id exists', async function () {
			const setUp = await setup();
			const {contractAsOwner, contract, others} = setUp;
			await contractAsOwner.mint(others[0], 1,);
			expect(await contract.exists(1)).to.be.true;
			expect(await contract.exists(5)).to.be.false;
		});
	});
});
