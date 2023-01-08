// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {IERC5192} from "./IERC5192.sol";

/// @notice Account-bound Video NFT
/// @dev Token transfers may be locked and unlocked by the contract Owner
contract Glance is ERC721, ERC721URIStorage, Ownable, IERC5192 {
	using Strings for uint256;
	using Counters for Counters.Counter;

	uint256 public verificationValidityPeriod;

	Counters.Counter private _tokenIds;

	// Mapping tokenId to locked status
    mapping(uint256 => bool) private _locked;

	// Mapping tokenId to last verified timestamp
    mapping(uint256 => uint256) private _verified;

	// Mapping address to tokenId
    mapping(address => uint256) private _ownedId;

	event Mint(
        address indexed sender,
        address indexed owner,
        string tokenURI,
        uint256 tokenId
    );

	event Verified(uint256 tokenId, uint256 timestamp);

	event VerificationValidityPeriod(uint256 period);

	constructor(string memory name, string memory symbol) ERC721(name, symbol) {
		verificationValidityPeriod = 365 days;
	}

	/// @notice Owner function to lock the contract
	/// @param tokenId The tokenId to lock
	/// @dev By locking the tokenId, token owner is prevented from transferring their token
	function lock(uint256 tokenId) external onlyOwner {
		require(_locked[tokenId] == false, "Glance: tokenId is already locked");
		_locked[tokenId] = true;
		emit Locked(tokenId);
	}

	/// @notice Owner function to unlock the contract
	/// @param tokenId The tokenId to unlock
	/// @dev By unlocking the tokenId, token owner is allowed to transfer their token
	function unlock(uint256 tokenId) external onlyOwner {
		require(_locked[tokenId] == true, "Glance: tokenId is already unlocked");
		_locked[tokenId] = false;
		emit Unlocked(tokenId);
	}

	/// @notice Owner function to verify a tokenId
	/// @param tokenId The tokenId to verify
	/// @dev Intended that the tokenId can be verified when the verificationValidityPeriod has expired
	function verify(uint256 tokenId) external onlyOwner {
		require(_verified[tokenId] + verificationValidityPeriod <= block.timestamp, "Glance: tokenId is verified");
		_verified[tokenId] = block.timestamp;
		emit Verified(tokenId, block.timestamp);
	}

	/// @notice Owner function to set the verification validity period
	/// @param period The period of time before verification should be required again
	function setVerificationValidityPeriod(uint256 period) external onlyOwner {
		verificationValidityPeriod = period;
		emit VerificationValidityPeriod(period);
	}

	/// @notice User function for minting a new account-bound token
	/// @dev Intended that a user can mint only 1 account-bound token
	/// @param to Receiving address for the new token id
	/// @param tokenUri The token uri for the token id
	function mint(address to, string memory tokenUri) external returns (uint256) {
		require(balanceOf(to) == 0, "Glance: token already issued");
		_tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
		_locked[newItemId] = true;
		_ownedId[to] = newItemId;
        _mint(to, newItemId);
        _setTokenURI(newItemId, tokenUri);
        emit Mint(msg.sender, to, tokenUri, newItemId);
        return newItemId;
	}

	/// @notice Owner function to burn token with given `id`
    /// @dev Intended that Owner has the right to burn user tokens
    /// @param from Address whose token is to be burned
    /// @param id Token id which will be burned
    function burnFrom(address from, uint256 id) external onlyOwner {
        require(from == ERC721.ownerOf(id), "Glance: not owner");
		_ownedId[from] = 0;
        _burn(id);
    }

	/// @notice User function to burn token with given `id`
    /// @dev Intended that Owner has the right to burn user tokens
    /// @param id Token id which will be burned
    function burn(uint256 id) public {
		require(msg.sender == ERC721.ownerOf(id), "Glance: not owner");
		_ownedId[msg.sender] = 0;
        _burn(id);
    }

	/// @notice A distinct Uniform Resource Identifier (URI) for a given token.
    /// @param tokenId The tokenId to get the uri of.
    /// @return URI The token's full URI string.
    function uri(uint256 tokenId) public view  returns (string memory) {
        require(_exists(tokenId), "Glance: invalid tokenId");
        return tokenURI(tokenId);
    }

	/// @notice A distinct token Uniform Resource Identifier (URI) for a given token.
    /// @param tokenId The tokenId to get the uri of.
    /// @return tokenURI The token's full URI string.
    function tokenURI(uint256 tokenId) public view override (ERC721, ERC721URIStorage) returns (string memory) {
        require(_exists(tokenId), "Glance: invalid tokenId");
        return ERC721URIStorage.tokenURI(tokenId);
    }

	/// @notice Query if token exists with `id`.
    /// @param id the token ID to query.
    /// @return `true` if the token already exists.
    function exists(uint256 id) public view returns (bool) {
        return _exists(id);
    }

	/// @notice Query the token id owned by a given owner address.
    /// @param owner the owner address to query.
    /// @return tokenId if owned.
    function ownedId(address owner) public view returns (uint256) {
		require(owner != address(0), "Glance: invalid owner");
		require(_ownedId[owner] != 0, "Glance: owner does not own a token");
        return _ownedId[owner];
    }

	/// @notice Public function for viewing the contract's locked status (true or false)
	/// @param tokenId The tokenId to view the locked status of
	function locked(uint256 tokenId) external view override(IERC5192) returns (bool) {
		require(_exists(tokenId), "Glance: invalid tokenId");
		return _locked[tokenId];
	}

	/// @notice View if a token id is verified
	/// @param tokenId The tokenId to view the verification status of
	function isVerified(uint256 tokenId) external view returns (bool) {
		return block.timestamp <= _verified[tokenId] + verificationValidityPeriod;
	}

	/// @notice Query if a contract implements interface `id`.
    /// @param id the interface identifier, as specified in ERC-165.
    /// @return `true` if the contract implements `id`.
    function supportsInterface(bytes4 id)
        public
        view
        override(ERC721)
        returns (bool)
    {
        return super.supportsInterface(id);
    }

	/// @notice Internal override required because we use ERC721URIStorage
	/// @param tokenId The tokenId to burn
	function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
		ERC721URIStorage._burn(tokenId);
	}

	/**
	 * @dev See {ERC721-_beforeTokenTransfer}.
	 *
	 * Requirements:
	 *
	 * - tokens cannot be transferred after initial mint, unless tokenId is unlocked or owner is sender
	 * - contract can be locked and unlocked only by the contract owner
	 */
	function _beforeTokenTransfer(
		address _from,
        address _to,
        uint256 _id,  /* firstTokenId */
        uint256 _batchSize
	) internal virtual override(ERC721) {
		require(
			_from == address(0) || _to == address(0) || _locked[_id] == false || _from == owner(),
			"Glance: Tokens are non transferable"
		); // _beforeTokenTransfer is called in mint/burn too, we must allow it to pass

		super._beforeTokenTransfer(_from, _to, _id, _batchSize);
	}
}
