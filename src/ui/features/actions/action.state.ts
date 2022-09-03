import { useArrayStorage } from "../../../shared/storage/hooks";
import { globalActionQueueStore } from "../../../shared/actionQueue/store";

export const useActions = () => useArrayStorage(globalActionQueueStore);
