
export class ItemStatus {
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
  availableStatus: any; // <ItemStatus>
}