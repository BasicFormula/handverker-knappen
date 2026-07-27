CRAFTSPEOPLE = [
    {"id": "craft-ida", "name": "Ida Nilsen", "company": "Nilsen Elektro AS", "trade": "Elektriker", "location": "Oslo", "rating": 4.9, "review_count": 87, "verified": True, "avatar": "IN", "bio": "Autorisert elektriker med ryddig kommunikasjon og presise avtaler."},
    {"id": "craft-jonas", "name": "Jonas Berg", "company": "Berg Rørservice", "trade": "Rørlegger", "location": "Bærum", "rating": 4.8, "review_count": 63, "verified": True, "avatar": "JB", "bio": "Fagbrev og over ti års erfaring med bad, kjøkken og lekkasjesøk."},
    {"id": "craft-sara", "name": "Sara Ødegård", "company": "Ødegård Tre & Bygg", "trade": "Tømrer", "location": "Oslo", "rating": 5.0, "review_count": 41, "verified": True, "avatar": "SØ", "bio": "Tømrer med sans for gjennomføring, detaljer og skandinaviske hjem."},
]

JOBS = [
    {"id": "job-kitchen", "title": "Elektriker til nytt kjøkken", "category": "Elektriker", "location": "Tøyen, Oslo", "budget": "15 000–25 000 kr", "description": "Trenger nye kurser, stikk og belysning til kjøkken som monteres i mai.", "status": "Åpen", "created_at": "I dag", "customer": "Kari Johansen", "verified": True, "offer_count": 3, "image": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=85"},
    {"id": "job-bathroom", "title": "Oppgradering av bad – rørarbeid", "category": "Rørlegger", "location": "Stabekk, Bærum", "budget": "40 000–65 000 kr", "description": "Ønsker befaring og tilbud for oppgradering av røropplegg på et bad på 5 m².", "status": "Åpen", "created_at": "I går", "customer": "Mats Haug", "verified": True, "offer_count": 2, "image": "https://images.unsplash.com/photo-1693382464372-fad822e7b38c?auto=format&fit=crop&w=800&q=85"},
    {"id": "job-deck", "title": "Bygge terrasse i hage", "category": "Tømrer", "location": "Nordstrand, Oslo", "budget": "60 000–90 000 kr", "description": "Terrasse på omtrent 35 m². Underlag er delvis klart. Ønsker arbeid i juni.", "status": "Åpen", "created_at": "For 2 dager siden", "customer": "Elin Berg", "verified": True, "offer_count": 5, "image": "https://images.pexels.com/photos/32357250/pexels-photo-32357250.jpeg?auto=compress&cs=tinysrgb&w=800"},
]

OFFERS = {"job-kitchen": [{"id": "offer-ida", "craftsperson_id": "craft-ida", "amount": "22 500 kr", "message": "Jeg kan ta befaring denne uken og planlegge arbeidet rundt kjøkkenleveransen.", "date": "I dag"}]}

AFFILIATE_PRODUCTS = [
    {"id": "product-1", "title": "LED downlights", "shop": "Elektroimportøren", "price": "Fra 279 kr", "category": "Elektriker"},
    {"id": "product-2", "title": "Baderomsinnredning", "shop": "Megaflis", "price": "Fra 4 990 kr", "category": "Rørlegger"},
    {"id": "product-3", "title": "Terrassebord", "shop": "Maxbo", "price": "Fra 44 kr/m", "category": "Tømrer"},
]