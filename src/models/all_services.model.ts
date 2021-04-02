export interface all_services {
    id?: number;
    documents?: any[];
    logo?: string;
    name?: string;
    slug?: string;
    rated?: boolean | RatedEnum;
    points?: any[];
}

export enum RatedEnum {
    A = "A",
    B = "B",
    C = "C",
    D = "D",
    E = "E",
}
