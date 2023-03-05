
function getDistanceFromLatLonInMiles(lat1, lon1, lat2, lon2) {
    const R = 3959; // Radius of the earth in miles
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in miles
    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}
  
function sortByClosest(locations, targetLocation) {
    return locations.sort((a, b) => {
        const distA = getDistanceFromLatLonInMiles(
            a.lat,
            a.long,
            targetLocation.latitude,
            targetLocation.longitude
        );
        const distB = getDistanceFromLatLonInMiles(
            b.lat,
            b.long,
            targetLocation.latitude,
            targetLocation.longitude
        );
        return distA - distB;
    });
}

function convertChildObjectToArray(jsonObj) {
    const tafArray = jsonObj.TAF;
    for (let taf of tafArray) {
        for (let forecast of taf.forecast) {
            if (!Array.isArray(forecast.sky_condition)) {
                forecast.sky_condition = [forecast.sky_condition];
            }
        }
    }
    return tafArray; 
}

function convertMetarChildObjectToArray(result) {
    const metarArray = result;
    for (let metar of metarArray) {
        if (!Array.isArray(metar.sky_condition)) {
            metar.sky_condition = [metar.sky_condition];
        }
    }
    return metarArray; 
}

export { getDistanceFromLatLonInMiles, deg2rad, sortByClosest, convertChildObjectToArray, convertMetarChildObjectToArray };