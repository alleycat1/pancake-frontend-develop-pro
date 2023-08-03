import BigNumber from 'bignumber.js'
import { formatUnits } from 'viem'
import { getLanguageCodeFromLS } from '@pancakeswap/localization'
import _trimEnd from 'lodash/trimEnd'
import { getFullDecimalMultiplier } from './getFullDecimalMultiplier'

/**
 * Take a formatted amount, e.g. 15 BNB and convert it to full decimal value, e.g. 15000000000000000
 */
export const getDecimalAmount = (amount: BigNumber, decimals = 18) => {
  return new BigNumber(amount).times(getFullDecimalMultiplier(decimals))
}

export const getBalanceAmount = (amount: BigNumber, decimals: number | undefined = 18) => {
  return new BigNumber(amount).dividedBy(getFullDecimalMultiplier(decimals))
}

/**
 * This function is not really necessary but is used throughout the site.
 */
export const getBalanceNumber = (balance: BigNumber, decimals = 18) => {
  return getBalanceAmount(balance, decimals).toNumber()
}

export const getFullDisplayBalance = (balance: BigNumber, decimals = 18, displayDecimals?: number): string => {
  const stringNumber = getBalanceAmount(balance, decimals).toFixed(displayDecimals as number)

  return displayDecimals ? _trimEnd(_trimEnd(stringNumber, '0'), '.') : stringNumber
}

/**
 * Don't use the result to convert back to number.
 * It uses undefined locale which uses host language as a result.
 * Languages have different decimal separators which results in inconsistency when converting back this result to number.
 */
export const formatNumber = (number: number, minPrecision = 2, maxPrecision = 2) => {
  const options = {
    minimumFractionDigits: minPrecision,
    maximumFractionDigits: maxPrecision,
  }
  return number.toLocaleString(undefined, options)
}

export const formatBigInt = (value: bigint, displayDecimals = 18, decimals = 18): string => {
  const remainder = value % 10n ** BigInt(decimals - displayDecimals)

  const formatted = formatUnits(value - remainder, decimals)
  return formatted
}

/**
 * Method to format the display of wei given an bigint object with toFixed
 * Note: rounds
 */
export const formatBigIntToFixed = (number: bigint, displayDecimals = 18, decimals = 18) => {
  const formattedString = formatUnits(number, decimals)
  return (+formattedString).toFixed(displayDecimals)
}

export const formatLocalisedCompactNumber = (number: number): string => {
  const codeFromStorage = getLanguageCodeFromLS()

  const isClient = typeof window === 'object'
  const isSupported = window?.Intl

  // For clients do not support Intl, just return number
  if (isClient && !isSupported) {
    return `${number}`
  }

  return new Intl.NumberFormat(codeFromStorage, {
    notation: 'compact',
    compactDisplay: 'long',
    maximumSignificantDigits: 2,
  }).format(number)
}

export default formatLocalisedCompactNumber

export const formatLpBalance = (balance: BigNumber, decimals: number) => {
  const stakedBalanceBigNumber = getBalanceAmount(balance, decimals)
  if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.00001)) {
    return '< 0.00001'
  }
  return stakedBalanceBigNumber.toFixed(5, BigNumber.ROUND_DOWN)
}
