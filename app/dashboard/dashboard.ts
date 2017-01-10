
type Type = "item" | "action";

export class DashboardItem {
    key: string;
    type: Type;
}

export class DashboardCategory {
    name: string;
    items: DashboardItem[];
}
