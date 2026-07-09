import { vehicleRepository } from "../repository/vehicle.repository";
import { STATUS_CODES } from "../utils/constants";
import { AppError } from "../utils/error";
import { CreateVehicleSchemaType } from "../utils/validations";

export const creacreateVehicleServicete = async (
  data: CreateVehicleSchemaType,
) => {

  //check if any vehicle if same licenPlate exists or not
  const { licensePlate } = data;

  const existingVehicle = await vehicleRepository.findUnique({ licensePlate });

  if (existingVehicle) {
    throw new AppError(
      STATUS_CODES.BAD_REQUEST,
      "Vehicle with same number plate exists",
    );
  }

  const newVehicle = await vehicleRepository.create(data);

  return newVehicle;
};
