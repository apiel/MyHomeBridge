import { ItemStatus } from './../item/item';

type ActionType = "item" | "action";

export class Action {
    type: ActionType;
    value: ItemStatus;
    timer: number;
}