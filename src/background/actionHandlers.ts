import { ActionItem, ExtQueueItem } from "../shared/actionQueue/types";
import { MessageType, waitForMessage } from "../shared/messages";
import { preAuthorize } from "../shared/preAuthorizations";
import { assertNever } from "../ui/services/assertNever";
import { analytics } from "./analytics";
import { BackgroundService } from "./background";
import { openUi } from "./openUi";
import { formatTransaction } from "../background/transaction/formatTransaction";

// import { executeTransaction } from "./transactions/transactionExecution";

export const handleActionApproval = async (
  action: ExtQueueItem<ActionItem>,
  background: BackgroundService,
  sendToTabAndUi: any
): Promise<MessageType | undefined> => {
  const { guild } = background;
  const actionHash = action.meta.hash;

  switch (action.type) {
    case "CONNECT_DAPP": {
      const { host } = action.payload;
      const selectedAccount = await guild.getSelectedAccount();

      if (!selectedAccount) {
        openUi();
        return;
      }

      analytics.track("preauthorizeDapp", {
        host,
        networkId: selectedAccount.networkId,
      });

      await preAuthorize(selectedAccount, host);

      return { type: "CONNECT_DAPP_RES", data: selectedAccount };
    }

    case "TRANSACTION": {
      const selectedAccount = await guild.getSelectedAccount();
      sendToTabAndUi({
        type: "GET_NONCE",
        data: {
          guildAddress: selectedAccount?.address,
          wallet: selectedAccount?.walletProvider,
        },
      });
      const nonce = await waitForMessage("GET_NONCE_RES");
      action.payload.transactions = formatTransaction(
        selectedAccount?.address,
        action.payload.transactions,
        selectedAccount?.walletProvider,
        nonce.result
      );
      try {
        sendToTabAndUi({
          type: "FORWARD_TRANSACTION",
          data: {
            wallet: selectedAccount?.walletProvider,
            payload: action.payload,
          },
        });

        const response = await waitForMessage("TRANSACTION_FORWARDED");

        return {
          type: "TRANSACTION_SUBMITTED",
          data: { txHash: response.transaction_hash, actionHash },
        };
      } catch (error: unknown) {
        return {
          type: "TRANSACTION_FAILED",
          data: { actionHash, error: `${error}` },
        };
      }
    }

    case "SIGN": {
      const typedData = action.payload;
      if (!(await wallet.isSessionOpen())) {
        throw Error("you need an open session");
      }
      const starknetAccount = await wallet.getSelectedStarknetAccount();

      const [r, s] = await starknetAccount.signMessage(typedData);

      return {
        type: "SIGNATURE_SUCCESS",
        data: {
          r: r.toString(),
          s: s.toString(),
          actionHash,
        },
      };
    }

    case "REQUEST_TOKEN": {
      return {
        type: "APPROVE_REQUEST_TOKEN",
        data: { actionHash },
      };
    }

    case "REQUEST_ADD_CUSTOM_NETWORK": {
      return {
        type: "APPROVE_REQUEST_ADD_CUSTOM_NETWORK",
        data: { actionHash },
      };
    }

    case "REQUEST_SWITCH_CUSTOM_NETWORK": {
      return {
        type: "APPROVE_REQUEST_SWITCH_CUSTOM_NETWORK",
        data: { actionHash },
      };
    }

    default:
      assertNever(action);
  }
};

export const handleActionRejection = async (
  action: ExtQueueItem<ActionItem>,
  _: BackgroundService
): Promise<MessageType | undefined> => {
  const actionHash = action.meta.hash;

  switch (action.type) {
    case "CONNECT_DAPP": {
      return {
        type: "REJECT_PREAUTHORIZATION",
        data: {
          host: action.payload.host,
          actionHash,
        },
      };
    }

    case "TRANSACTION": {
      return {
        type: "TRANSACTION_FAILED",
        data: { actionHash },
      };
    }

    case "SIGN": {
      return {
        type: "SIGNATURE_FAILURE",
        data: { actionHash },
      };
    }

    case "REQUEST_TOKEN": {
      return {
        type: "REJECT_REQUEST_TOKEN",
        data: { actionHash },
      };
    }

    case "REQUEST_ADD_CUSTOM_NETWORK": {
      return {
        type: "REJECT_REQUEST_ADD_CUSTOM_NETWORK",
        data: { actionHash },
      };
    }

    case "REQUEST_SWITCH_CUSTOM_NETWORK": {
      return {
        type: "REJECT_REQUEST_SWITCH_CUSTOM_NETWORK",
        data: { actionHash },
      };
    }

    default:
      assertNever(action);
  }
};
