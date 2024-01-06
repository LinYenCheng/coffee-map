import { create } from 'zustand';
import axios from 'axios';
import calculateScore from '../util/calculateScore';

const { lunr } = window;
const indexSearch = lunr(function generateLunr() {
  this.field('name');
  this.field('address');
  this.field('strSocket');
  this.field('quietAways');
  this.field('wifiGood');
});

const useCafeShopsStore = create(() => ({
  coffeeShops: [],
}));

export const getShops = async (city) => {
  const res = await axios.get(`${import.meta.env.BASE_URL}cafedata/taiwan.json`);
  if (res.data) {
    res.data.forEach((shop) => {
      indexSearch.add({
        ...shop,
        strSocket: shop && shop.socket === 'yes' ? '插座' : '',
        quietAways: shop && shop.quiet > 3 ? '安靜' : '',
        wifiGood: shop && shop.wifi > 3 ? '網路' : '',
        score: calculateScore({ ...shop }),
      });
    });
    useCafeShopsStore.setState({ coffeeShops: res.data });
    return res.data;
  }
  return [];
};

export default useCafeShopsStore;
