export const actionStore = <any[]>[];

export function storeAction(action: any) {
  actionStore.push(action);
}
