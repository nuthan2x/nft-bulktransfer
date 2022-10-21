// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";


 contract BulkTransfer {


    function transferall(address[] calldata contracts, uint[] calldata ids, address _target) external {

        for (uint i = 0; i < contracts.length; i++) {

            IERC721(contracts[i]).safeTransferFrom(msg.sender,_target,ids[i]);
        }
    }
}

