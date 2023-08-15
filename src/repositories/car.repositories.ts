import Car from "../models/Car.model";

export class CarRepository {
  static async getAveragePriceOfAllCars(): Promise<number> {
    const allCars = await Car.find();
    return (
      allCars.reduce((total, currentCar) => total + currentCar.price, 0) /
      allCars.length
    );
  }

  static async getAveragePriceByRegion(region: string): Promise<number> {
    const carsByRegion = await Car.find({ region });
    return (
      carsByRegion.reduce((total, currentCar) => total + currentCar.price, 0) /
      carsByRegion.length
    );
  }

  static async getPastWeekViews(viewEvents: any[]): Promise<number> {
    const oneWeekAgoTimestamp = new Date().getTime() - 7 * 24 * 60 * 60 * 1000;
    return viewEvents.filter(
      (event) => event.timestamp.getTime() >= oneWeekAgoTimestamp,
    ).length;
  }

  static async getPastMonthViews(viewEvents: any[]): Promise<number> {
    const oneMonthAgoTimestamp =
      new Date().getTime() - 30 * 24 * 60 * 60 * 1000;
    return viewEvents.filter(
      (event) => event.timestamp.getTime() >= oneMonthAgoTimestamp,
    ).length;
  }
}
