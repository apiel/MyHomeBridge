import { ItemStatus } from './../item/item';

type ActionType = "item" | "action";

export class Action {
    type: ActionType;
    itemStatus?: ItemStatus;
    actionName?: string;
    timer: number;
}

export class ActionBase {
    name: string;
    actions: Action[];
}

export class ActionDefinition {
    name: string;
    key: string;
}