
export class ItemStatus {
    id: string;
    status: string | number;
}

export class ItemAvailableStatus {
    type: string;
    value: string;
}

export class Item {
  name: string;
  status: string;
  value: number;
  statusUrl: string;
  type: string;
  url: string;
  availableStatus: { [name: string]: ItemAvailableStatus };
}