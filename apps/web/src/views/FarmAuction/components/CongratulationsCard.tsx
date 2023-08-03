import styled from 'styled-components'
import { Text, Heading, Card, CardHeader, CardBody, Flex } from '@pancakeswap/uikit'
import { Auction, Bidder } from 'config/constants/types'
import { useTranslation } from '@pancakeswap/localization'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import useCongratulateAuctionWinner from '../hooks/useCongratulateAuctionWinner'
import WhitelistedBiddersButton from './WhitelistedBiddersButton'
import { HARD_CODED_START_AUCTION_ID, HARD_CODE_TOP_THREE_AUCTION_DATAS } from '../constants'

const StyledReclaimBidCard = styled(Card)`
  margin-top: 16px;
  flex: 1;
`

const CongratulationsCard: React.FC<React.PropsWithChildren<{ currentAuction: Auction; bidders: Bidder[] }>> = ({
  currentAuction,
  bidders,
}) => {
  const { t } = useTranslation()
  const wonAuction = useCongratulateAuctionWinner(currentAuction, bidders)
  const shouldUseV3Format = currentAuction?.id >= HARD_CODED_START_AUCTION_ID

  if (!wonAuction) {
    return null
  }

  const { auction, bidderData } = wonAuction
  const { amount, position } = bidderData
  return (
    <StyledReclaimBidCard mb={['24px', null, null, '0']}>
      <CardHeader>
        <Heading>{t('Congratulations!')}</Heading>
      </CardHeader>
      <CardBody>
        <Text mb="16px">{t('Your bid in Auction #%auctionId% was successful.', { auctionId: auction.id })}</Text>
        <Text>{t('Your Farm will be launched as follows:')}</Text>
        <Flex flexDirection="column" mb="24px">
          <Flex justifyContent="space-between" width="100%" pt="8px">
            <Text color="textSubtle">{t('Multiplier per farm')}</Text>
            <Text>
              {shouldUseV3Format
                ? `${HARD_CODE_TOP_THREE_AUCTION_DATAS.map((d) => d[1]).join('x,')}x`
                : `1x ${t('each')}`}
            </Text>
          </Flex>
          <Flex justifyContent="space-between" width="100%" pt="8px">
            <Text color="textSubtle">{t('Total whitelisted bidders')}</Text>
            <WhitelistedBiddersButton />
          </Flex>
        </Flex>

        <Flex justifyContent="space-between" mb="8px">
          <Text color="textSubtle">{t('Your total bid')}</Text>
          <Text>{getBalanceNumber(amount)} CAKE</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text color="textSubtle">{t('Your position')}</Text>
          <Text>#{position}</Text>
        </Flex>
      </CardBody>
    </StyledReclaimBidCard>
  )
}

export default CongratulationsCard
