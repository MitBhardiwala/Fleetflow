import { vehicleRepository } from "../repository/vehicle.repository.ts";
import { tripRepository } from "../repository/trip.repository.ts";

type vehicleForFuelEfficiency = {
  id: string;
  name: string;
  trips: { startOdometerKm: number | null; endOdometerKm: number | null }[];
  fuelLogs: { liters: number }[];
};

type vehicleForROI = {
  id: string;
  name: string;
  acquisitionCost: number | null;
  trips: { revenue: number | null }[];
  maintenanceRecords: { cost: number | null }[];
  fuelLogs: { totalCost: number }[];
};

export const getDashboardStatsService = async () => {
  const [activeFleet, maintenanceAlerts, totalVehicles, pendingCargo] =
    await Promise.all([
      vehicleRepository.count({ status: "ON_TRIP" }),
      vehicleRepository.count({ status: "IN_SHOP" }),
      vehicleRepository.count({}),
      tripRepository.count({ status: "DRAFT" }),
    ]);

  const utilizationRate =
    totalVehicles === 0
      ? 0
      : Number(((activeFleet / totalVehicles) * 100).toFixed(2));

  return {
    activeFleet,
    maintenanceAlerts,
    utilizationRate,
    pendingCargo,
  };
};

export const getFuelEfficiencyService = async () => {
  const vehicles = await vehicleRepository.findMany({
    select: {
      id: true,
      name: true,
      trips: {
        where: { status: "COMPLETED" },
        select: { startOdometerKm: true, endOdometerKm: true },
      },
      fuelLogs: {
        select: { liters: true },
      },
    },
  });

  return (vehicles as unknown as vehicleForFuelEfficiency[]).map((vehicle) => {


    const totalDistanceKm = vehicle.trips.reduce((sum, t) => {
      if (t.startOdometerKm && t.endOdometerKm) {
        return sum + (Number(t.endOdometerKm) - Number(t.startOdometerKm));
      }
      return sum;
    }, 0);

    const totalLiters = vehicle.fuelLogs.reduce(
      (sum, f) => sum + Number(f.liters),
      0,
    );

    const fuelEfficiencyKmPerL =
      totalLiters === 0
        ? null
        : Number((totalDistanceKm / totalLiters).toFixed(2));

    return {
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      totalDistanceKm,
      totalLiters,
      fuelEfficiencyKmPerL,
    };
  });
};

export const getVehicleROIService = async () => {
  const vehicles = await vehicleRepository.findMany({
    select: {
      id: true,
      name: true,
      acquisitionCost: true,
      trips: {
        where: { status: "COMPLETED" },
        select: { revenue: true },
      },
      maintenanceRecords: {
        select: { cost: true },
      },
      fuelLogs: {
        select: { totalCost: true },
      },
    },
  });

  return (vehicles as unknown as vehicleForROI[]).map((vehicle) => {
    const totalRevenue = vehicle.trips.reduce(
      (sum, trip) => { if (trip?.revenue) { sum + Number(trip?.revenue) } return sum; },
      0,
    );

    const totalMaintenanceCost = vehicle.maintenanceRecords.reduce(
      (sum, record) => sum + Number(record?.cost),
      0,
    );

    const totalFuelCost = vehicle.fuelLogs.reduce(
      (sum, log) => sum + Number(log?.totalCost),
      0,
    );

    const netProfit = totalRevenue - (totalMaintenanceCost + totalFuelCost);

    const acquisitionCost = vehicle.acquisitionCost
      ? Number(vehicle.acquisitionCost)
      : null;

    // ROI = (Revenue - (Maintenance + Fuel)) / Acquisition Cost
    const roi =
      !acquisitionCost || acquisitionCost === 0
        ? null
        : Number((netProfit / acquisitionCost).toFixed(4));

    return {
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      totalRevenue,
      totalMaintenanceCost,
      totalFuelCost,
      netProfit,
      roi,
    };
  });
};
