
export class ItemStatus {
    id: string;
    status?: string | number;
    error?: any;
}

export class ItemAvailableStatus {
    type: string;
    value: string;
}

export class ItemBase {
  name: string;
  type: string = 'string';
}

export class ItemDefinition extends ItemBase {
  availableStatus: string[];
}

export class Item extends ItemBase {
  status: string;
  value: number;
  statusUrl: string;
  url: string;
  availableStatus: { [name: string]: ItemAvailableStatus };
}