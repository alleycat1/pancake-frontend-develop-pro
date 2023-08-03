import { useTranslation } from "@pancakeswap/localization";
import { useIsMounted } from "@pancakeswap/hooks";
import { PropsWithChildren, ReactNode } from "react";
import { AutoColumn, RowBetween, Text, TextProps, IconButton, PencilIcon } from "../../components";

type SwapInfoType = {
  price: ReactNode;
  allowedSlippage?: number;
  onSlippageClick?: () => void;
  allowedSlippageSlot?: React.ReactNode;
};

export const SwapInfoLabel = (props: PropsWithChildren<TextProps>) => (
  <Text fontSize="12px" bold color="secondary" {...props} />
);

export const SwapInfo = ({ allowedSlippage, price, onSlippageClick, allowedSlippageSlot }: SwapInfoType) => {
  const { t } = useTranslation();
  const isMounted = useIsMounted();

  return (
    <AutoColumn gap="sm" py="0px" px="16px">
      <RowBetween alignItems="center">{price}</RowBetween>
      {typeof allowedSlippage === "number" && (
        <RowBetween alignItems="center">
          <SwapInfoLabel>
            {t("Slippage Tolerance")}
            {onSlippageClick ? (
              <IconButton scale="sm" variant="text" onClick={onSlippageClick}>
                <PencilIcon color="primary" width="10px" />
              </IconButton>
            ) : null}
          </SwapInfoLabel>
          {isMounted &&
            (allowedSlippageSlot ?? (
              <Text bold color="primary">
                {allowedSlippage / 100}%
              </Text>
            ))}
        </RowBetween>
      )}
    </AutoColumn>
  );
};
