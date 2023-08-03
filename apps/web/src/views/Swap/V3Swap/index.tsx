import { SmartRouter } from '@pancakeswap/smart-router/evm'
import throttle from 'lodash/throttle'
import { useMemo } from 'react'
import { shouldShowMMLiquidityError } from 'views/Swap/MMLinkPools/utils/exchange'
import { Box, Row, Text } from '@pancakeswap/uikit'
import { MMLiquidityWarning } from 'views/Swap/MMLinkPools/components/MMLiquidityWarning'
import InternalLink from 'components/Links'
import { useTranslation } from '@pancakeswap/localization'

import { SUPPORTED_ONRAMP_TOKENS } from 'views/BuyCrypto/constants'
import { useDerivedBestTradeWithMM } from '../MMLinkPools/hooks/useDerivedSwapInfoWithMM'
import { useCheckInsufficientError } from './hooks/useCheckSufficient'
import { FormHeader, FormMain, MMTradeDetail, PricingAndSlippage, SwapCommitButton, TradeDetails } from './containers'
import { MMCommitButton } from './containers/MMCommitButton'
import { useSwapBestTrade } from './hooks'

export function V3SwapForm() {
  const { isLoading, trade, refresh, syncing, isStale, error } = useSwapBestTrade()
  const { t } = useTranslation()
  const mm = useDerivedBestTradeWithMM(trade)
  const throttledHandleRefresh = useMemo(
    () =>
      throttle(() => {
        refresh()
      }, 3000),
    [refresh],
  )

  const finalTrade = mm.isMMBetter ? mm?.mmTradeInfo?.trade : trade

  const tradeLoaded = !isLoading
  const price = useMemo(() => trade && SmartRouter.getExecutionPrice(trade), [trade])

  const insufficientFundCurrency = useCheckInsufficientError(trade)

  return (
    <>
      <FormHeader onRefresh={throttledHandleRefresh} refreshDisabled={!tradeLoaded || syncing || !isStale} />
      <FormMain
        tradeLoading={mm.isMMBetter ? false : !tradeLoaded}
        pricingAndSlippage={<PricingAndSlippage priceLoading={isLoading} price={price} showSlippage={!mm.isMMBetter} />}
        inputAmount={finalTrade?.inputAmount}
        outputAmount={finalTrade?.outputAmount}
        swapCommitButton={
          mm?.isMMBetter ? (
            <MMCommitButton {...mm} />
          ) : (
            <SwapCommitButton trade={trade} tradeError={error} tradeLoading={!tradeLoaded} />
          )
        }
      />

      {insufficientFundCurrency && SUPPORTED_ONRAMP_TOKENS.includes(insufficientFundCurrency.symbol) ? (
        <Row alignItems="center" justifyContent="center" mb="4px">
          <Text fontSize="14px">
            Insufficent Funds?{' '}
            <InternalLink href={`/buy-crypto?inputCurrency=${insufficientFundCurrency.symbol}`}>
              {t('Buy Crypto here.')}
            </InternalLink>
          </Text>
        </Row>
      ) : null}

      {mm.isMMBetter ? (
        <MMTradeDetail loaded={!mm.mmOrderBookTrade.isLoading} mmTrade={mm.mmTradeInfo} />
      ) : (
        <TradeDetails loaded={tradeLoaded} trade={trade} />
      )}
      {(shouldShowMMLiquidityError(mm?.mmOrderBookTrade?.inputError) || mm?.mmRFQTrade?.error) && !trade && (
        <Box mt="5px">
          <MMLiquidityWarning />
        </Box>
      )}
    </>
  )
}
