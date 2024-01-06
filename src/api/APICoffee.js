/* eslint-disable no-param-reassign */
import calculateScore from '../util/calculateScore';

async function searchWithKeyWord({ coffeeShops, bounds, keyWord }) {
  let finalResult = [];
  if (keyWord.toString().trim() !== '') {
    const results = await indexSearch.search(keyWord);
    if (results && results.length) {
      const searchResults = results.map((result) => result.ref);

      let tempShops = coffeeShops;

      tempShops = tempShops.filter((coffeeShop) => {
        if (bounds) {
          const { southWest, northEast } = bounds;
          const { latitude, longitude } = coffeeShop;
          return (
            parseFloat(latitude) > southWest.lat &&
            parseFloat(longitude) > southWest.lng &&
            parseFloat(latitude) < northEast.lat &&
            parseFloat(longitude) < northEast.lng &&
            searchResults.indexOf(coffeeShop.id) !== -1
          );
        }
        return searchResults.indexOf(coffeeShop.id) !== -1;
      });
      finalResult = tempShops;
    }
  } else {
    let tempShops = coffeeShops;

    tempShops = tempShops.filter((coffeeShop) => {
      if (bounds) {
        const { southWest, northEast } = bounds;
        const { latitude, longitude } = coffeeShop;
        return (
          parseFloat(latitude) > southWest.lat &&
          parseFloat(longitude) > southWest.lng &&
          parseFloat(latitude) < northEast.lat &&
          parseFloat(longitude) < northEast.lng
        );
      }
    });
    finalResult = tempShops;
  }

  finalResult = finalResult
    .map((shop) => ({
      ...shop,
      strSocket: shop && shop.socket === 'yes' ? '插座' : '',
      quietAways: shop && shop.quiet > 3 ? '安靜' : '',
      wifiGood: shop && shop.wifi > 3 ? '網路' : '',
      score: calculateScore({ ...shop }),
    }))
    .sort((a, b) => b.score - a.score);
  return finalResult;
}

const APICoffee = {
  searchWithKeyWord,
};

export default APICoffee;
