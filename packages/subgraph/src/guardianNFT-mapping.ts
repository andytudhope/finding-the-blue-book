import { BigInt, log } from '@graphprotocol/graph-ts'
import {
  Approval,
  ApprovalForAll,
  Transfer,
} from '../generated/GUARD/GUARD'
import { Account, GuardianNFT } from '../generated/schema'
import { getOrCreateAccount } from './utils/helpers'

export function handleApproval(event: Approval): void {}

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleSafeMint(event: Transfer): void {
  const guardian = event.params.to.toHexString();
  const tokenId = event.params.tokenId.toString();

  const guardianAccount: Account = getOrCreateAccount(guardian);

  let nft = GuardianNFT.load(tokenId);
  if (nft == null) {
    nft = new GuardianNFT(tokenId);
  }
  nft.guardian = guardianAccount.id;
  nft.createdAtTimestamp = event.block.timestamp;
  nft.save();

  guardianAccount.save();
}

export function handleTransfer(event: Transfer): void {}