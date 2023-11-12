export async function getMetarData(id) {
    const response = await fetch(`https://aviationweather.gov/api/data/metar?ids=${id}&format=json`);
    const json = await response.json();
    return json;
}

export async function getTafData(id) {
    const response = await fetch(`https://aviationweather.gov/api/taf?ids=${id}&format=json`);
    const json = await response.json();
    return json;
}

(async function () {
    const json = await getMetarData('KCRG');
    console.log(json);
})();
