// Images Configuration
// Path includes starting slash
// base-path/t/p/size{path}
// https://images.tmdb.org/t/p/original{path}
// Eg: https://images.tmdb.org/t/p/original/uO2yU3QiGHvVp0L5e5IatTVRkYk.jpg
// Possible Sizes: w92, w154, w185, w342, w500, w780, original

const imageBasePath = "https://image.tmdb.org/t/p/";
const imageSizes = {
  poster: ["w92", "w154", "w185", "w342", "w500", "w780", "original"],
  backdrop: ["w300", "w780", "w1280", "original"],
};

// Movie Response
/*
data = {
    "adult": boolean,
    "backdrop_path": string,
    "belongs_to_collection": {
        "id": number,
        "name": string,
        "poster_path": string,
        "backdrop_path": string
    },
    "budget": number,
    "genres": [
        {
            "id": number,
            "name": string
        }
    ],
    "homepage": string,
    "id": number,
    "imdb_id": string,
    "original_language": string,
    "original_title": string,
    "overview": string,
    "popularity": number,
    "poster_path": string,
    "production_companies": [
        {
            "id": number,
            "logo_path": string,
            "name": string,
            "origin_country": string
        }
    ],
    "production_countries": [
        {
            "iso_3166_1": string,
            "name": string
        }
    ],
    "release_date": string,
    "revenue": number,
    "runtime": number,
    "spoken_languages": [
        {
            "english_name": string,
            "iso_639_1": string,
            "name": string
        }
    ],
    "status": string,
    "tagline": string,
    "title": string,
    "video": boolean,
    "vote_average": number,
    "vote_count": number
}
    
    "budget": 237000000,
    "genres": [
    {
        "id": 28,
        "name": "Action"
    },
    {
        "id": 12,
        "name": "Adventure"
    },
    {
        "id": 14,
        "name": "Fantasy"
    },
    {
        "id": 878,
        "name": "Science Fiction"
    }
],
    "homepage": "https://www.avatar.com/movies/avatar",
    "id": 19995,
    "imdb_id": "tt0499549",
    "origin_country": [
    "US"
],
    "original_language": "en",
    "original_title": "Avatar",
    "overview": "In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora on a unique mission, but becomes torn between following orders and protecting an alien civilization.",
    "popularity": 104.055,
    "poster_path": "/kyeqWdyUXW608qlYkRqosgbbJyK.jpg",
    "production_companies": [
    {
        "id": 444,
        "logo_path": null,
        "name": "Dune Entertainment",
        "origin_country": "US"
    },
    {
        "id": 574,
        "logo_path": "/nLNW1TeFUYU0M5U0qmYUzOIwlB6.png",
        "name": "Lightstorm Entertainment",
        "origin_country": "US"
    },
    {
        "id": 25,
        "logo_path": "/qZCc1lty5FzX30aOCVRBLzaVmcp.png",
        "name": "20th Century Fox",
        "origin_country": "US"
    },
    {
        "id": 290,
        "logo_path": "/jrgCuaQsY9ouP5ILZf4Dq4ZOkIX.png",
        "name": "Ingenious Media",
        "origin_country": "GB"
    }
],
    "production_countries": [
    {
        "iso_3166_1": "US",
        "name": "United States of America"
    },
    {
        "iso_3166_1": "GB",
        "name": "United Kingdom"
    }
],
    "release_date": "2009-12-15",
    "revenue": 2923706026,
    "runtime": 162,
    "spoken_languages": [
    {
        "english_name": "English",
        "iso_639_1": "en",
        "name": "English"
    },
    {
        "english_name": "Spanish",
        "iso_639_1": "es",
        "name": "Español"
    }
],
    "status": "Released",
    "tagline": "Enter the world of Pandora.",
    "title": "Avatar",
    "video": false,
    "vote_average": 7.582,
    "vote_count": 31313
}*/
