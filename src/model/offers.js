export default class Offers {
  static setOffers(offers) {
    this._offers = offers;
  }

  static getOffers() {
    return this._offers;
  }

  static getOffersForType(type) {
    const index = this._offers.findIndex((offer) => offer.type === type.toLowerCase());

    if (index === -1) {
      throw new Error(`Not found offers for "${type}"!`);
    }

    return this._offers[index].offers;
  }
}
