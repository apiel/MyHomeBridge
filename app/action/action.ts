import { ItemStatus } from './../item/item';

type ActionType = "item" | "action";

export class Action {
    type: ActionType;
    itemStatus?: ItemStatus;
    actionName?: string;
    timer: number;
}