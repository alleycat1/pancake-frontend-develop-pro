import { useEffect, useState } from 'react'
import { useMatchBreakpoints, ModalV2, useToast } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import { useSignMessage } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import { encodePacked, keccak256 } from 'viem'
import DesktopView from './DesktopView'
import MobileView from './MobileView'

export enum Views {
  STEP1,
  STEP2,
}

interface UserRegisterFeeResponse {
  error?: string
  status: 'success' | 'error'
}

const OnBoardingModal = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { toastSuccess, toastError } = useToast()
  const { isDesktop } = useMatchBreakpoints()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentView, setCurrentView] = useState(Views.STEP1)

  useEffect(() => {
    const { ref, user, discount, perps } = router.query
    if (ref && user && discount && perps) {
      setIsOpen(true)
    }
  }, [router])

  const handleStartNow = async () => {
    try {
      setIsLoading(true)

      const timestamp = Math.floor(new Date().getTime() / 1000)
      const message = keccak256(encodePacked(['string', 'uint256'], [router.query.ref as string, BigInt(timestamp)]))
      const signature = await signMessageAsync({ message })
      const response = await fetch('/api/affiliates-program/user-register-fee', {
        method: 'POST',
        body: JSON.stringify({
          user: {
            linkId: router.query.ref,
            address,
            signature,
            timestamp,
          },
        }),
      })

      const result: UserRegisterFeeResponse = await response.json()
      if (result.status === 'success') {
        setCurrentView(Views.STEP2)
        toastSuccess(t('Congratulations! You’re all set!'))
      } else {
        toastError(result?.error || '')
      }
    } catch (error) {
      console.error(`Submit Start Now Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const onDismiss = () => {
    setIsOpen(false)
  }

  return (
    <ModalV2 isOpen={isOpen} closeOnOverlayClick onDismiss={onDismiss}>
      {isDesktop ? (
        <DesktopView
          currentView={currentView}
          isLoading={isLoading}
          handleStartNow={handleStartNow}
          onDismiss={onDismiss}
        />
      ) : (
        <MobileView
          currentView={currentView}
          isLoading={isLoading}
          handleStartNow={handleStartNow}
          onDismiss={onDismiss}
        />
      )}
    </ModalV2>
  )
}

export default OnBoardingModal
