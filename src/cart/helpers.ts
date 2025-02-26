export const getPriceByCount = (priceList, count) => {
  return priceList.reduce((prev, curr) => {
    return count >= curr.amount ? curr.cost : prev;
  }, priceList[0].cost);
};
