// TODO: aptos merge
import { LinkExternal, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { useActiveChainId } from 'hooks/useNetwork'
import { getBlockExploreLink } from '../../utils'

interface DescriptionWithTxProps {
  description?: string
  txHash?: string
}

const DescriptionWithTx: React.FC<React.PropsWithChildren<DescriptionWithTxProps>> = ({ txHash, children }) => {
  const chainId = useActiveChainId()
  const { t } = useTranslation()

  return (
    <>
      {typeof children === 'string' ? <Text as="p">{children}</Text> : children}
      {txHash && (
        <LinkExternal isAptosScan href={getBlockExploreLink(txHash, 'transaction', chainId)}>
          {t('View on %site%', { site: 'Explorer' })}: {truncateHash(txHash, 8, 0)}
        </LinkExternal>
      )}
    </>
  )
}

export default DescriptionWithTx
