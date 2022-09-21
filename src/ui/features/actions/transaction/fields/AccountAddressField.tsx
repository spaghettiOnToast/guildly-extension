import { FC, ReactNode } from "react";

import {
  Field,
  FieldKey,
  LeftPaddedField,
} from "../../../../components/Fields";
import { P, H1, H2 } from "../../../../components/Typography";
import { useDisplayName } from "../../../../utils/address";

import { PrettyAccountAddress } from "../../../accounts/PrettyAccountAddress";

interface IAccountAddressField {
  title: string;
  accountAddress: string;
  networkId: string;
  fallbackValue?: (accountAddress: string) => ReactNode;
}

export const AccountAddressField: FC<IAccountAddressField> = ({
  title,
  accountAddress,
  networkId,
  fallbackValue,
}) => {
  return (
    <Field>
      <FieldKey>{title}</FieldKey>
      <LeftPaddedField>
        {/* <PrettyAccountAddress
          small
          accountAddress={accountAddress}
          networkId={networkId}
          fallbackValue={fallbackValue}
        /> */}
        <P>{useDisplayName(accountAddress)}</P>
      </LeftPaddedField>
    </Field>
  );
};
