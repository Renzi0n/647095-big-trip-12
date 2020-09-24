export default class PlacesInfo {
  static setPlacesInfo(placesInfo) {
    this._placesInfo = placesInfo;
  }

  static getPlacesInfo() {
    return this._placesInfo;
  }

  static getPlacesInfoForCity(city) {
    const index = this._placesInfo.findIndex((item) => item.name === city);

    if (index === -1) {
      throw new Error(`Not found info about "${city}"!`);
    }

    return this._placesInfo[index];
  }
}
