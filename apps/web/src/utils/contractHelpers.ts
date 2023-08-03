import { CAKE } from '@pancakeswap/tokens'

// Addresses
import {
  getAffiliateProgramAddress,
  getBCakeFarmBoosterAddress,
  getBCakeFarmBoosterProxyFactoryAddress,
  getBCakeFarmBoosterV3Address,
  getBunnyFactoryAddress,
  getCakeFlexibleSideVaultAddress,
  getCakeVaultAddress,
  getCrossFarmingReceiverAddress,
  getCrossFarmingSenderAddress,
  getFarmAuctionAddress,
  getLotteryV2Address,
  getMasterChefV2Address,
  getMasterChefV3Address,
  getNftMarketAddress,
  getNftSaleAddress,
  getNonBscVaultAddress,
  getPancakeProfileAddress,
  getPancakeSquadAddress,
  getPointCenterIfoAddress,
  getPotteryDrawAddress,
  getPredictionsV1Address,
  getStableSwapNativeHelperAddress,
  getTradingCompetitionAddressEaster,
  getTradingCompetitionAddressFanToken,
  getTradingCompetitionAddressMoD,
  getTradingCompetitionAddressMobox,
  getTradingRewardAddress,
  getV3AirdropAddress,
  getV3MigratorAddress,
} from 'utils/addressHelpers'

// ABI
import { cakePredictionsABI } from 'config/abi/cakePredictions'
import { crossFarmingProxyABI } from 'config/abi/crossFarmingProxy'
import { crossFarmingSenderABI } from 'config/abi/crossFarmingSender'
import { nftSaleABI } from 'config/abi/nftSale'
import { nonBscVaultABI } from 'config/abi/nonBscVault'
import { pointCenterIfoABI } from 'config/abi/pointCenterIfo'
import { predictionsV1ABI } from 'config/abi/predictionsV1'
import { stableSwapNativeHelperABI } from 'config/abi/stableSwapNativeHelper'

import {
  cakeFlexibleSideVaultV2ABI,
  cakeVaultV2ABI,
  getIfoCreditAddressContract as getIfoCreditAddressContract_,
} from '@pancakeswap/pools'
import { ChainId } from '@pancakeswap/sdk'
import { masterChefV3ABI } from '@pancakeswap/v3-sdk'
import { sidABI } from 'config/abi/SID'
import { SIDResolverABI } from 'config/abi/SIDResolver'
import { affiliateProgramABI } from 'config/abi/affiliateProgram'
import { bCakeFarmBoosterABI } from 'config/abi/bCakeFarmBooster'
import { bCakeFarmBoosterProxyFactoryABI } from 'config/abi/bCakeFarmBoosterProxyFactory'
import { bCakeFarmBoosterV3ABI } from 'config/abi/bCakeFarmBoosterV3'
import { bCakeProxyABI } from 'config/abi/bCakeProxy'
import { bunnyFactoryABI } from 'config/abi/bunnyFactory'
import { chainlinkOracleABI } from 'config/abi/chainlinkOracle'
import { crossFarmingReceiverABI } from 'config/abi/crossFarmingReceiver'
import { farmAuctionABI } from 'config/abi/farmAuction'
import { lotteryV2ABI } from 'config/abi/lotteryV2'
import { lpTokenABI } from 'config/abi/lpTokenAbi'
import { masterChefV2ABI } from 'config/abi/masterchefV2'
import { nftMarketABI } from 'config/abi/nftMarket'
import { pancakeProfileABI } from 'config/abi/pancakeProfile'
import { pancakeSquadABI } from 'config/abi/pancakeSquad'
import { potteryDrawABI } from 'config/abi/potteryDrawAbi'
import { potteryVaultABI } from 'config/abi/potteryVaultAbi'
import { predictionsV2ABI } from 'config/abi/predictionsV2'
import { tradingCompetitionEasterABI } from 'config/abi/tradingCompetitionEaster'
import { tradingCompetitionFanTokenABI } from 'config/abi/tradingCompetitionFanToken'
import { tradingCompetitionMoDABI } from 'config/abi/tradingCompetitionMoD'
import { tradingCompetitionMoboxABI } from 'config/abi/tradingCompetitionMobox'
import { tradingRewardABI } from 'config/abi/tradingReward'
import { v3AirdropABI } from 'config/abi/v3Airdrop'
import { v3MigratorABI } from 'config/abi/v3Migrator'
import { getViemClients, viemClients } from 'utils/viem'
import { Abi, PublicClient, WalletClient, getContract as viemGetContract } from 'viem'
import { Address, erc20ABI, erc721ABI } from 'wagmi'

export const getContract = <TAbi extends Abi | unknown[], TWalletClient extends WalletClient>({
  abi,
  address,
  chainId = ChainId.BSC,
  publicClient,
  signer,
}: {
  abi: TAbi
  address: Address
  chainId?: ChainId
  signer?: TWalletClient
  publicClient?: PublicClient
}) => {
  const c = viemGetContract({
    abi,
    address,
    publicClient: publicClient ?? viemClients[chainId],
    walletClient: signer,
  })
  return {
    ...c,
    account: signer?.account,
    chain: signer?.chain,
  }
}

export const getBep20Contract = (address: Address, signer?: WalletClient) => {
  return getContract({ abi: erc20ABI, address, signer })
}

export const getErc721Contract = (address: Address, walletClient?: WalletClient) => {
  return getContract({
    abi: erc721ABI,
    address,
    signer: walletClient,
  })
}
export const getLpContract = (address: Address, chainId?: number, signer?: WalletClient) => {
  return getContract({ abi: lpTokenABI, address, signer, chainId })
}

export const getPointCenterIfoContract = (signer?: WalletClient) => {
  return getContract({ abi: pointCenterIfoABI, address: getPointCenterIfoAddress(), signer })
}
export const getCakeContract = (chainId?: number) => {
  return getContract({
    abi: erc20ABI,
    address: chainId ? CAKE[chainId]?.address : CAKE[ChainId.BSC].address,
    chainId,
  })
}

export const getProfileContract = (signer?: WalletClient) => {
  return getContract({ abi: pancakeProfileABI, address: getPancakeProfileAddress(), signer })
}

export const getBunnyFactoryContract = (signer?: WalletClient) => {
  return getContract({ abi: bunnyFactoryABI, address: getBunnyFactoryAddress(), signer })
}
export const getLotteryV2Contract = (signer?: WalletClient) => {
  return getContract({ abi: lotteryV2ABI, address: getLotteryV2Address(), signer })
}

export const getTradingCompetitionContractEaster = (signer?: WalletClient) => {
  return getContract({
    abi: tradingCompetitionEasterABI,
    address: getTradingCompetitionAddressEaster(),
    signer,
  })
}

export const getTradingCompetitionContractFanToken = (signer?: WalletClient) => {
  return getContract({
    abi: tradingCompetitionFanTokenABI,
    address: getTradingCompetitionAddressFanToken(),
    signer,
  })
}
export const getTradingCompetitionContractMobox = (signer?: WalletClient) => {
  return getContract({
    abi: tradingCompetitionMoboxABI,
    address: getTradingCompetitionAddressMobox(),
    signer,
  })
}

export const getTradingCompetitionContractMoD = (signer?: WalletClient) => {
  return getContract({
    abi: tradingCompetitionMoDABI,
    address: getTradingCompetitionAddressMoD(),
    signer,
  })
}

export const getCakeVaultV2Contract = (signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: cakeVaultV2ABI, address: getCakeVaultAddress(chainId), signer, chainId })
}

export const getCakeFlexibleSideVaultV2Contract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: cakeFlexibleSideVaultV2ABI,
    address: getCakeFlexibleSideVaultAddress(chainId),
    signer,
    chainId,
  })
}

export const getPredictionsV2Contract = (address: Address, signer?: WalletClient) => {
  return getContract({ abi: predictionsV2ABI, address, signer })
}

export const getPredictionsV1Contract = (signer?: WalletClient) => {
  return getContract({ abi: predictionsV1ABI, address: getPredictionsV1Address(), signer })
}

export const getCakePredictionsContract = (address: Address, signer?: WalletClient) => {
  return getContract({ abi: cakePredictionsABI, address, signer })
}

export const getChainlinkOracleContract = (address: Address, signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: chainlinkOracleABI, address, signer, chainId })
}

export const getFarmAuctionContract = (signer?: WalletClient) => {
  return getContract({ abi: farmAuctionABI, address: getFarmAuctionAddress(), signer })
}

export const getNftMarketContract = (signer?: WalletClient) => {
  return getContract({ abi: nftMarketABI, address: getNftMarketAddress(), signer })
}
export const getNftSaleContract = (signer?: WalletClient) => {
  return getContract({ abi: nftSaleABI, address: getNftSaleAddress(), signer })
}
export const getPancakeSquadContract = (signer?: WalletClient) => {
  return getContract({ abi: pancakeSquadABI, address: getPancakeSquadAddress(), signer })
}

export const getPotteryVaultContract = (address: Address, walletClient?: WalletClient) => {
  return getContract({ abi: potteryVaultABI, address, signer: walletClient })
}

export const getPotteryDrawContract = (walletClient?: WalletClient) => {
  return getContract({ abi: potteryDrawABI, address: getPotteryDrawAddress(), signer: walletClient })
}

export const getIfoCreditAddressContract = (signer?: WalletClient) => {
  return getIfoCreditAddressContract_(ChainId.BSC, getViemClients, signer)
}

export const getBCakeFarmBoosterContract = (signer?: WalletClient) => {
  return getContract({ abi: bCakeFarmBoosterABI, address: getBCakeFarmBoosterAddress(), signer })
}

export const getBCakeFarmBoosterV3Contract = (signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: bCakeFarmBoosterV3ABI, address: getBCakeFarmBoosterV3Address(chainId), signer, chainId })
}

export const getBCakeFarmBoosterProxyFactoryContract = (signer?: WalletClient) => {
  return getContract({
    abi: bCakeFarmBoosterProxyFactoryABI,
    address: getBCakeFarmBoosterProxyFactoryAddress(),
    signer,
  })
}

export const getBCakeProxyContract = (proxyContractAddress: Address, signer?: WalletClient) => {
  return getContract({ abi: bCakeProxyABI, address: proxyContractAddress, signer })
}

export const getNonBscVaultContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: nonBscVaultABI, address: getNonBscVaultAddress(chainId), chainId, signer })
}

export const getSidContract = (address: Address, chainId: number) => {
  return getContract({ abi: sidABI, address, chainId })
}

export const getUnsContract = (address: Address, chainId?: ChainId, publicClient?: PublicClient) => {
  return getContract({
    abi: [
      {
        inputs: [
          {
            internalType: 'address',
            name: 'addr',
            type: 'address',
          },
        ],
        name: 'reverseNameOf',
        outputs: [
          {
            internalType: 'string',
            name: 'reverseUri',
            type: 'string',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ] as const,
    chainId,
    address,
    publicClient,
  })
}

export const getSidResolverContract = (address: Address, signer?: WalletClient) => {
  return getContract({ abi: SIDResolverABI, address, signer })
}

export const getCrossFarmingSenderContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: crossFarmingSenderABI,
    address: getCrossFarmingSenderAddress(chainId),
    chainId,
    signer,
  })
}

export const getCrossFarmingReceiverContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: crossFarmingReceiverABI,
    address: getCrossFarmingReceiverAddress(chainId),
    chainId,
    signer,
  })
}

export const getCrossFarmingProxyContract = (
  proxyContractAddress: Address,
  signer?: WalletClient,
  chainId?: number,
) => {
  return getContract({ abi: crossFarmingProxyABI, address: proxyContractAddress, chainId, signer })
}

export const getStableSwapNativeHelperContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: stableSwapNativeHelperABI,
    address: getStableSwapNativeHelperAddress(chainId),
    chainId,
    signer,
  })
}

export const getMasterChefContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: masterChefV2ABI,
    address: getMasterChefV2Address(chainId),
    chainId,
    signer,
  })
}
export const getMasterChefV3Contract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: masterChefV3ABI,
    address: getMasterChefV3Address(chainId),
    chainId,
    signer,
  })
}

export const getV3MigratorContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: v3MigratorABI,
    address: getV3MigratorAddress(chainId),
    chainId,
    signer,
  })
}

export const getTradingRewardContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: tradingRewardABI,
    address: getTradingRewardAddress(chainId),
    signer,
    chainId,
  })
}

export const getV3AirdropContract = (walletClient?: WalletClient) => {
  return getContract({
    abi: v3AirdropABI,
    address: getV3AirdropAddress(),
    signer: walletClient,
  })
}

export const getAffiliateProgramContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: affiliateProgramABI,
    address: getAffiliateProgramAddress(chainId),
    signer,
    chainId,
  })
}
