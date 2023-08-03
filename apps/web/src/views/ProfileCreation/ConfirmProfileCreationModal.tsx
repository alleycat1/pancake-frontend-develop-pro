import { useTranslation } from '@pancakeswap/localization'
import { Flex, Modal, Text, useToast } from '@pancakeswap/uikit'
import ApproveConfirmButtons from 'components/ApproveConfirmButtons'
import { ToastDescriptionWithTx } from 'components/Toast'
import { bscTokens } from '@pancakeswap/tokens'
import { formatUnits } from 'viem'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useProfileContract } from 'hooks/useContract'
import { useProfile } from 'state/profile/hooks'
import { REGISTER_COST } from './config'
import { State } from './contexts/types'

interface Props {
  userName: string
  selectedNft: State['selectedNft']
  teamId: number
  allowance: bigint
  onDismiss?: () => void
}

const ConfirmProfileCreationModal: React.FC<React.PropsWithChildren<Props>> = ({ teamId, selectedNft, onDismiss }) => {
  const { t } = useTranslation()
  const profileContract = useProfileContract()
  const { refresh: refreshProfile } = useProfile()
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()

  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
    useApproveConfirmTransaction({
      token: bscTokens.cake,
      spender: profileContract.address,
      minAmount: REGISTER_COST,
      onConfirm: () => {
        return callWithGasPrice(profileContract, 'createProfile', [
          BigInt(teamId),
          selectedNft.collectionAddress,
          BigInt(selectedNft.tokenId),
        ])
      },
      onSuccess: async ({ receipt }) => {
        refreshProfile()
        onDismiss()
        toastSuccess(t('Profile created!'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      },
    })

  return (
    <Modal title={t('Complete Profile')} onDismiss={onDismiss}>
      <Text color="textSubtle" mb="8px">
        {t('Submitting NFT to contract and confirming User Name and Team.')}
      </Text>
      <Flex justifyContent="space-between" mb="16px">
        <Text>{t('Cost')}</Text>
        <Text>{t('%num% CAKE', { num: formatUnits(REGISTER_COST, 18) })}</Text>
      </Flex>
      <ApproveConfirmButtons
        isApproveDisabled={isConfirmed || isConfirming || isApproved}
        isApproving={isApproving}
        isConfirmDisabled={!isApproved || isConfirmed}
        isConfirming={isConfirming}
        onApprove={handleApprove}
        onConfirm={handleConfirm}
      />
    </Modal>
  )
}

export default ConfirmProfileCreationModal
