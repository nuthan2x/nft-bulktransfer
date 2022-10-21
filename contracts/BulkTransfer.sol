// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";


 contract BulkTransfer {

    // struct Tokeninfo {
    //     address contract_address;
    //     address creator_address;
    //     uint token_id;
    // }

    function transferall(address[] calldata contracts, uint[] calldata ids, address _target) external {

        for (uint i = 0; i < contracts.length; i++) {

            IERC721(contracts[i]).transferFrom(msg.sender,_target,ids[i]);
        }
    }
}

// 0x8133747B650ED3f8CA592d8293145E89f1f05485   target 0xD5fba05dE4b2d303D03052e8aFbF31a767Bd908e
// 0xD223EC434234ee5Bb945Ab8DE9d3564b6098ACba 
// ["0x086bc4180939dac707208e40b784daf3b719842c","0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85","0xc36442b4a4522e871399cd717abdd847ab11fe88"]
// ["0","60424815809592771163624659339297660106761497641737465453892855020715246344808","330097"]