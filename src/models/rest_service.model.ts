export interface rest_service {
    error?: number;
    message?: string;
    parameters?: Parameters;
}

interface Parameters {
    _source?: Source;
    image?: string;
    documents?: Document[];
    points?: Point[];
    urls?: string[];
}

interface Source {
    id?: number;
    name?: string;
    url?: string;
    created_at?: Date;
    updated_at?: Date;
    wikipedia?: string;
    keywords?: string;
    related?: string;
    slug?: string;
    is_comprehensively_reviewed?: boolean;
    user_id?: null;
    rating?: string;
    status?: null;
    nice_service?: string;
    image?: string;
}

interface Document {
    id?: number;
    name?: string;
    url?: string;
    xpath?: string | null;
    text?: string;
    created_at?: Date;
    updated_at?: Date;
    service_id?: number;
    reviewed?: null;
    user_id?: null;
    status?: null;
    crawler_server?: null;
}



interface Point {
    discussion?: string;
    id?: number;
    needsModeration?: boolean;
    document?: Document | null;
    quote?: null | string;
    services?: string[];
    set?: string;
    slug?: null;
    title?: string;
    topics?: any[];
    case?: Case;
}

interface Case {
    id?: number;
    classification?: Classification;
    score?: number;
    title?: string;
    description?: string;
    topic_id?: number;
    created_at?: Date;
    updated_at?: Date;
    privacy_related?: boolean | null;
    docbot_regex?: null | string;
}

enum Classification {
    Bad = "bad",
    Blocker = "blocker",
    Good = "good",
    Neutral = "neutral",
}
