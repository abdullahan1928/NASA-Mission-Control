const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');

const habitalPlantets = [];

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true
            }))
            .on('data', (chunk) => {
                if (isHabitablePlanet(chunk)) {
                    habitalPlantets.push(chunk);
                }
            })
            .on('error', (err) => {
                console.log(err);
                reject(err);
            })
            .on('end', () => {
                console.log(`${habitalPlantets.length} habitable planets found!`);
                resolve();
            });
    });
}

module.exports = {
    planets: habitalPlantets,
    loadPlanetsData
}