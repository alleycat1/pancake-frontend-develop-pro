import styled from 'styled-components'
import { useEffect, useState } from 'react'
import {
  Flex,
  Text,
  Card,
  Box,
  CopyIcon,
  copyText,
  PaginationButton,
  ChevronDownIcon,
  ChevronUpIcon,
  Table,
  Td,
  Th,
  useMatchBreakpoints,
  useToast,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { InfoDetail, FeeType } from 'views/AffiliatesProgram/hooks/useAuthAffiliate'
import BigNumber from 'bignumber.js'

const MobileLinks = styled('div')`
  margin: 0 -24px;
  padding: 16px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

interface AffiliateLinksProps {
  affiliate: InfoDetail
}

const MAX_PER_PAGE = 5

const AffiliateLinks: React.FC<React.PropsWithChildren<AffiliateLinksProps>> = ({ affiliate }) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { isDesktop } = useMatchBreakpoints()
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [maxPage, setMaxPages] = useState(1)
  const [feeList, setFeeList] = useState<FeeType[]>([])

  useEffect(() => {
    if (affiliate.fees.length > 0) {
      const max = Math.ceil(affiliate.fees.length / MAX_PER_PAGE)
      setMaxPages(max)
    }

    return () => {
      setMaxPages(1)
      setCurrentPage(1)
      setFeeList([])
    }
  }, [affiliate])

  useEffect(() => {
    const getActivitySlice = () => {
      const slice = affiliate.fees.slice(MAX_PER_PAGE * (currentPage - 1), MAX_PER_PAGE * currentPage)
      setFeeList(slice)
    }
    if (affiliate.fees.length > 0) {
      getActivitySlice()
      setIsExpanded(true)
    }
  }, [affiliate, currentPage])

  const generateLink = ({ linkId, percentage }: { linkId: string; percentage: number }) => {
    const hostname = window?.location?.origin
    const name = affiliate.nickName ? affiliate.nickName : affiliate.name
    const displayName = name.replaceAll(' ', '_')
    const discount = new BigNumber(percentage).gt(0) ? new BigNumber(percentage).times(3).div(100).toFixed(2) : 0
    return `${hostname}/affiliates-program?ref=${linkId}&user=${displayName}&discount=${discount}&perps=${affiliate.ablePerps}`
  }

  const handleCopyText = ({ linkId, percentage }: { linkId: string; percentage: number }) => {
    const link = generateLink({ linkId, percentage })
    copyText(link)
    toastSuccess(t('Link'), t('Copied!'))
  }

  return (
    <Flex width="100%" mt="16px" flexDirection="column">
      <Card>
        <Box padding="24px">
          <Flex justifyContent="space-between" onClick={() => setIsExpanded(!isExpanded)}>
            <Text style={{ alignSelf: 'center' }} textTransform="uppercase" bold color="secondary" fontSize="12px">
              {t('affiliate links')}
            </Text>
            <Box>
              {isExpanded ? (
                <ChevronUpIcon cursor="pointer" width={24} height={24} />
              ) : (
                <ChevronDownIcon cursor="pointer" width={24} height={24} />
              )}
            </Box>
          </Flex>
          {isExpanded && (
            <>
              {isDesktop ? (
                <Card style={{ marginTop: '24px' }}>
                  <Flex flexDirection="column">
                    <Table>
                      <thead>
                        <tr>
                          <Th width="60%">
                            <Text fontSize="12px" bold textTransform="uppercase" color="textSubtle" textAlign="left">
                              {t('link')}
                            </Text>
                          </Th>
                          <Th width="30%">
                            <Text fontSize="12px" bold textTransform="uppercase" color="textSubtle" textAlign="right">
                              {t('profit sharing %')}
                            </Text>
                          </Th>
                          <Th />
                        </tr>
                      </thead>
                      <tbody>
                        {feeList.map((fee, index) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <tr key={`${fee.id}-${index}`}>
                            <Td>
                              <Text style={{ wordBreak: 'break-word' }} fontSize="14px">
                                {generateLink({ linkId: fee.linkId, percentage: fee.v2SwapFee })}
                              </Text>
                            </Td>
                            <Td>
                              <Text textAlign="right" fontSize="14px">{`${fee.v2SwapFee}%`}</Text>
                            </Td>
                            <Td>
                              <Box width="24px" ml="auto">
                                <CopyIcon
                                  color="textSubtle"
                                  cursor="pointer"
                                  width={24}
                                  height={24}
                                  onClick={() => handleCopyText({ linkId: fee.linkId, percentage: fee.v2SwapFee })}
                                />
                              </Box>
                            </Td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <PaginationButton
                      showMaxPageText
                      currentPage={currentPage}
                      maxPage={maxPage}
                      setCurrentPage={setCurrentPage}
                    />
                  </Flex>
                </Card>
              ) : (
                <Flex flexDirection="column">
                  {feeList.map((fee, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <MobileLinks key={`${fee.id}-${index}`}>
                      <Flex justifyContent="space-between" mb="10px">
                        <Text style={{ wordBreak: 'break-word' }} mr="4px" fontSize="14px">
                          {generateLink({ linkId: fee.linkId, percentage: fee.v2SwapFee })}
                        </Text>
                        <CopyIcon
                          color="textSubtle"
                          cursor="pointer"
                          width={24}
                          height={24}
                          onClick={() => copyText(generateLink({ linkId: fee.linkId, percentage: fee.v2SwapFee }))}
                        />
                      </Flex>
                      <Flex justifyContent="space-between">
                        <Text fontSize="12px" bold textTransform="uppercase" color="textSubtle">
                          {t('profit sharing %')}
                        </Text>
                        <Text bold>{`${fee.v2SwapFee}%`}</Text>
                      </Flex>
                    </MobileLinks>
                  ))}
                  <PaginationButton
                    showMaxPageText
                    currentPage={currentPage}
                    maxPage={maxPage}
                    setCurrentPage={setCurrentPage}
                  />
                </Flex>
              )}
            </>
          )}
        </Box>
      </Card>
    </Flex>
  )
}

export default AffiliateLinks
