# MapQaTor Frontend

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Project Setup

Follow the step by step installation procedure to install and run this on your machine.

## Prerequisites

Make sure you have node installed in your device.

**`NodeJs`**: Install Nodejs from [here](https://nodejs.org/en/download/)

## Installation <a name="configuration"></a>


1.  Clone the repo

```sh
git clone https://github.com/mapqator/mapqator.github.io.git
```

2.  If you don't have git installed in your device then download zip
3.  After installation or download go to the repository and open command line.

### Configuring


2. Install NPM packages

```sh
npm install
```

3.  Ensure backend is configured and running correctly on "http://localhost:5000" (note the port number)

#### Run the project

Go to your favourite code editor and run

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You should find that the project is working!

## Adding new Map APIs

Add or edit files in the `src/tools` and `src/mapServices` directories.


# Data Collection Tools

<!-- {
        "id": "ChIJLU7jZClu5kcR4PcOOO6p3I0",
        "displayName": {
          "text": "Eiffel Tower"
        },
        "shortFormattedAddress": "Eiffel Tower, Av. Gustave Eiffel, Paris",
        "location": {
          "latitude": 48.858370099999995,
          "longitude": 2.2944812999999997
        },
        "uuid": 1741455661378,
        "mapService": "googleMaps",
        "hidden": false
      } -->

## Text Search Object

| Field Name       | Description                                      |
|------------------|--------------------------------------------------|
| `id`          | A location identifier (e.g., a Place ID)                  |
| `displayName`   | Display name of the location.                           |
| `shortFormattedAddress` | Short address of the location.                  |
| `location`       | Latitude and longitude of the location.                |
| `mapService`     | Map service used for the search (e.g., googleMaps).    |

## Place Details Object

Attributes of the place details object are unique to the Map Service used. This need to be specified in the adapter. Attributes should be subset of the following:

`[  "location",
	"shortFormattedAddress",
	"accessibilityOptions",
	"businessStatus",
	"googleMapsUri",
	"primaryType",
	"internationalPhoneNumber",
	"nationalPhoneNumber",
	"priceLevel",
	"rating",
	"regularOpeningHours",
	"userRatingCount",
	"websiteUri",
	"allowsDogs",
	"curbsidePickup",
	"delivery",
	"dineIn",
	"editorialSummary",
	"evChargeOptions",
	"fuelOptions",
	"goodForChildren",
	"goodForGroups",
	"goodForWatchingSports",
	"liveMusic",
	"menuForChildren",
	"parkingOptions",
	"paymentOptions",
	"outdoorSeating",
	"reservable",
	"restroom",
	"servesBeer",
	"servesBreakfast",
	"servesBrunch",
	"servesCocktails",
	"servesCoffee",
	"servesDessert",
	"servesDinner",
	"servesLunch",
	"servesVegetarianFood",
	"servesWine",
	"takeout",
	"generativeSummary",
	"areaSummary"
]
` 

## Nearby Search Object

| Field Name       | Description                                      |
|------------------|--------------------------------------------------|
| `locationBias`   | A location identifier (e.g., a Place ID) specifying the place around which to search |
| `type`           | Type of places being searched (e.g., restaurant).                |
| `keyword`        | A keyword for refining the search (can be empty).          |
| `minRating`      | Minimum rating filter for the search (e.g., 4).        |
| `priceLevels`| List of price levels allowed (e.g., PRICE_LEVEL_MODERATE, PRICE_LEVEL_EXPENSIVE).                       |
| `rankPreference`     | Ranking preference for search results (RELEVANCE, DISTANCE, etc.).                     |
| `maxResultCount` | Maximum number of results to return.                |
| `places` | List of places matching the query criteria.  |
| `routingSummaries` | List of navigation details for reaching the places.                |

## Compute Routes Object

<!-- "origin": "ChIJD3uTd9hx5kcR1IQvGfr8dbk",
        "destination": "ChIJLU7jZClu5kcR4PcOOO6p3I0",
        "intermediates": [
          "ChIJOYNm1DBu5kcRZwdtKBzyq6k",
          "ChIJATr1n-Fx5kcRjQb6q6cdQDY"
        ],
        "travelMode": "DRIVE",
        "optimizeWaypointOrder": true,
        "routeModifiers": {
          "avoidTolls": true,
          "avoidHighways": true,
          "avoidFerries": false
        },
        "routes":  -->

| Field Name       | Description                                      |
|------------------|--------------------------------------------------|
| `origin`         | Origin location identifier.                  |
| `destination`    | Destination location identifier.                  |
| `intermediates`  | List of intermediate locations.                  |
| `travelMode`     | Mode of travel (e.g., DRIVE, WALK).                  |
| `optimizeWaypointOrder` | Optimize the order of waypoints.                  |
| `routeModifiers` | Modifiers for the route (e.g., avoidTolls).                  |
| `routes`         | List of routes from origin to destination.                  |

## Search Along Route Object

 <!-- "type": "restaurant",
        "minRating": 0,
        "priceLevels": [],
        "rankPreference": "RELEVANCE",
         "origin": "ChIJD3uTd9hx5kcR1IQvGfr8dbk",
        "destination": "ChIJLU7jZClu5kcR4PcOOO6p3I0",
        "travelMode": "DRIVE",
        "routeModifiers": {},
        "maxResultCount": 5,
        "places": [],
        "routes": [] -->

| Field Name       | Description                                      |
|------------------|--------------------------------------------------|
| `type`           | Type of places being searched (e.g., restaurant).                |
| `minRating`      | Minimum rating filter for the search (e.g., 4).        |
| `priceLevels`    | List of price levels allowed (e.g., PRICE_LEVEL_MODERATE, PRICE_LEVEL_EXPENSIVE).                       |
| `rankPreference` | Ranking preference for search results (RELEVANCE, DISTANCE, etc.).                     |
| `origin`         | Origin location identifier.                  |
| `destination`    | Destination location identifier.                  |
| `travelMode`     | Mode of travel (e.g., DRIVE, WALK).                  |
| `routeModifiers` | Modifiers for the route (e.g., avoidTolls).                  |
| `maxResultCount` | Maximum number of results to return.                |
| `places`         | List of places matching the query criteria.  |
| `routes`         | List of routes from origin to destination.                  |
