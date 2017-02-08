
export class ItemStatus {
    id: string;
    status?: string | number;
    error?: any;
}

export class ItemAvailableStatus {
    type: string;
    value: string;
}

export class ItemDefinition {
  name: string;
  key: string;
  values?: string[];
  number?: { min: number, max: number }
}

export class Item {
  name: string;
  type: string = 'string';  // we dont need this, just base on availableStatus, number, (url)
  status: string;
  statusUrl: string; // we could find a generic solution for exec
  url: string; // this should go in number or we have to implement string url http://url/:value
               // this could be use to set color
               // but would just work with url, not exec, so we need a generic solution, for exec as well
               // --> actually for color, we need a way to provide the info to the frontend
               // we could also even get rid of the url in availableStatus but it would remove some flexibility and would not work with exec... not sure it s a good idea
  availableStatus?: { [name: string]: ItemAvailableStatus };
  number?: { min: number, max: number };
  format?: string; // :value °C
}