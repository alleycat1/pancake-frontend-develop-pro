import { useMemo } from 'react'
import styled from 'styled-components'
import { Box, Flex, Text, Skeleton } from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import { useTranslation } from '@pancakeswap/localization'
import BigNumber from 'bignumber.js'
import { useProfile } from 'state/profile/hooks'
import { DeserializedLockedCakeVault } from 'state/types'
import { getVaultPosition, VaultPosition } from 'utils/cakePool'
import { useCakeVault, useFetchIfo as useCakeVaultPool } from 'state/pools/hooks'
import { Incentives, Qualification, RewardInfo } from 'views/TradingReward/hooks/useAllTradingRewardPair'
import { UserCampaignInfoDetail } from 'views/TradingReward/hooks/useAllUserCampaignInfo'
import NoConnected from 'views/TradingReward/components/YourTradingReward/NoConnected'
import { floatingStarsLeft, floatingStarsRight } from 'views/Lottery/components/Hero'
import NoProfile from 'views/TradingReward/components/YourTradingReward/NoProfile'
import RewardPeriod from 'views/TradingReward/components/YourTradingReward/RewardPeriod'

const BACKGROUND_COLOR = 'radial-gradient(55.22% 134.13% at 57.59% 0%, #F5DF8E 0%, #FCC631 33.21%, #FF9D00 79.02%)'

const StyledBackground = styled(Flex)<{ showBackgroundColor: boolean }>`
  position: relative;
  flex-direction: column;
  padding-top: 48px;
  background: ${({ showBackgroundColor }) => (showBackgroundColor ? BACKGROUND_COLOR : '')};
  z-index: 0;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 88px;
  }
`

const StyledHeading = styled(Text)`
  position: relative;
  font-size: 40px;
  font-weight: 900;
  line-height: 98%;
  letter-spacing: 0.01em;
  background: linear-gradient(166.02deg, #ffb237 -5.1%, #ffeb37 75.24%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: auto;
  padding: 0 16px;
  text-align: center;

  &::after {
    content: attr(data-text);
    position: absolute;
    left: 0;
    top: 0;
    padding: 0 16px;
    z-index: -1;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke: 8px rgb(101, 50, 205, 1);
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 56px;
    padding: 0;

    &::after {
      padding: 0;
    }
  }
`

const Container = styled(Box)<{ showBackgroundColor: boolean }>`
  position: relative;
  z-index: 1;
  margin: 48px auto;
  width: 100%;
  padding: 0 16px;

  ${({ theme }) => theme.mediaQueries.xxl} {
    width: ${({ showBackgroundColor }) => (showBackgroundColor ? '760px' : '1140px')};
  }
`

const Decorations = styled(Box)<{ showBackgroundColor: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  display: none;
  pointer-events: none;
  overflow: hidden;
  > img {
    position: absolute;
  }
  & :nth-child(1) {
    top: 8%;
    left: 0%;
    animation: ${floatingStarsRight} 3.5s ease-in-out infinite;
  }
  & :nth-child(2) {
    bottom: 20%;
    right: 0;
    animation: ${floatingStarsRight} 2.5s ease-in-out infinite;
  }
  & :nth-child(3) {
    bottom: -5%;
    right: 5%;
    animation: ${floatingStarsLeft} 4.5s ease-in-out infinite;
  }
  & :nth-child(4) {
    top: -12%;
    left: 20%;
    animation: ${floatingStarsLeft} 3s ease-in-out infinite;
  }
  & :nth-child(5) {
    top: 2%;
    right: 0;
    animation: ${floatingStarsLeft} 3.5s ease-in-out infinite;
  }

  & :nth-child(4), & :nth-child(5) {
    display: ${({ showBackgroundColor }) => (showBackgroundColor ? 'block' : 'none')};
  }

  ${({ theme }) => theme.mediaQueries.xxl} {
    display: block;
  }

  @media screen and (min-width: 1440px) {
    & :nth-child(3) {
      right: 16%;
    }
  }
}`

const BaseContainer = styled(Flex)<{ showBackgroundColor: boolean }>`
  width: 100%;
  border-radius: 32px;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background: ${({ theme, showBackgroundColor }) => (showBackgroundColor ? theme.card.background : BACKGROUND_COLOR)};

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 48px 0;
  }
`

interface YourTradingRewardProps {
  isFetching: boolean
  incentives: Incentives
  campaignIds: Array<string>
  currentUserCampaignInfo: UserCampaignInfoDetail
  totalAvailableClaimData: UserCampaignInfoDetail[]
  qualification: Qualification
  rewardInfo: { [key in string]: RewardInfo }
  campaignIdsIncentive: Incentives[]
}

const YourTradingReward: React.FC<React.PropsWithChildren<YourTradingRewardProps>> = ({
  isFetching,
  incentives,
  campaignIds,
  qualification,
  totalAvailableClaimData,
  currentUserCampaignInfo,
  rewardInfo,
  campaignIdsIncentive,
}) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { profile } = useProfile()

  const { thresholdLockTime } = qualification

  useCakeVaultPool()

  const { userData } = useCakeVault() as DeserializedLockedCakeVault
  const vaultPosition = getVaultPosition(userData)

  const isLockPosition = useMemo(
    () => Boolean(userData?.locked) && vaultPosition === VaultPosition.Locked,
    [userData, vaultPosition],
  )

  const isValidLockDuration = useMemo(() => {
    const minLockTime = new BigNumber(incentives?.campaignClaimTime ?? 0).plus(thresholdLockTime)
    return new BigNumber(userData.lockEndTime).gte(minLockTime)
  }, [incentives, thresholdLockTime, userData])

  const isQualified = useMemo(
    () => account && profile?.isActive && isLockPosition && isValidLockDuration,
    [account, profile, isLockPosition, isValidLockDuration],
  )

  return (
    <StyledBackground showBackgroundColor={!!account}>
      <StyledHeading data-text={t('Your Trading Reward')}>{t('Your Trading Reward')}</StyledHeading>
      {isFetching && (
        <Skeleton
          height={380}
          borderRadius={16}
          margin="32px auto"
          width={['calc(100% - 32px)', 'calc(100% - 32px)', 'calc(100% - 32px)', 'calc(100% - 32px)', '900px']}
        />
      )}

      {!isFetching && !account && (
        <Container showBackgroundColor={false}>
          <BaseContainer showBackgroundColor={false}>
            <NoConnected />
          </BaseContainer>
        </Container>
      )}

      {!isFetching && account && !profile?.isActive && (
        <Container showBackgroundColor>
          <BaseContainer showBackgroundColor>
            <NoProfile />
          </BaseContainer>
        </Container>
      )}

      {!isFetching && account && profile?.isActive && (
        <Container showBackgroundColor>
          <RewardPeriod
            userData={userData}
            campaignIds={campaignIds}
            incentives={incentives}
            rewardInfo={rewardInfo}
            currentUserCampaignInfo={currentUserCampaignInfo}
            totalAvailableClaimData={totalAvailableClaimData}
            campaignClaimTime={incentives?.campaignClaimTime}
            isQualified={isQualified}
            isLockPosition={isLockPosition}
            isValidLockDuration={isValidLockDuration}
            thresholdLockTime={thresholdLockTime}
            qualification={qualification}
            campaignIdsIncentive={campaignIdsIncentive}
          />
        </Container>
      )}

      <Decorations showBackgroundColor={!!account}>
        <img src="/images/trading-reward/left-bunny.png" width="93px" height="242px" alt="left-bunny" />
        <img src="/images/trading-reward/right-bunny.png" width="161px" height="161px" alt="right-bunny" />
        <img src="/images/trading-reward/love-butter.png" width="306px" height="306px" alt="love-butter" />
        <img src="/images/trading-reward/butter.png" width="195px" height="191px" alt="butter" />
        <img src="/images/trading-reward/coin.png" width="183px" height="119px" alt="coin" />
      </Decorations>
    </StyledBackground>
  )
}

export default YourTradingReward
