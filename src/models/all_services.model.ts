export interface all_services {
    error?: number;
    message?: string;
    parameters?: APIParameters;
}

interface APIParameters {
    version?: number;
    services?: Service[];
}

interface Service {
    id?: number;
    name?: string;
    url?: string;
    created_at?: Date;
    updated_at?: Date;
    wikipedia?: null | string;
    keywords?: string[] | null;
    related?: null | string;
    slug?: string;
    is_comprehensively_reviewed?: boolean;
    user_id?: number | null;
    rating?: Rating | null;
    status?: null;
    urls?: string[];
    nice_service?: string;
    has_image?: boolean;
    logo?: string;
}

enum Rating {
    A = "A",
    B = "B",
    C = "C",
    D = "D",
    E = "E",
    NA = "N/A",
}