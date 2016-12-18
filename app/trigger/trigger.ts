export class Trigger {
    name: string;
    url: string;
    trigger: {
        item: string;
        operator: string;
        value: string;
    }[];
}
