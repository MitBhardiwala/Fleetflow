import { Prisma } from "../../generated/prisma/client";
import { userRepository } from "../repository/user.repository";
import { STATUS_CODES, TEMP_PASSWORD } from "../utils/constants";
import { AppError } from "../utils/error";
import { hashPassword } from "../utils/utils";
import {
  CreateUserSchemaType,
  ListUserQuerySchemaType,
  UpdateUserSchemaType,
} from "../utils/validations";

export const listUser = async (query: ListUserQuerySchemaType) => {
  const { page, perPage, search, sortOn, sortOrder, status } = query;

  //skip
  const skipQuery = (page - 1) * perPage;

  // prepare where obj
  let whereObj: Prisma.UserWhereInput = { isActive: true };

  if (search) {
    whereObj.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ]
  };

  if (status === "active" || status === "inactive") {
    whereObj.isActive = status === "active";
  }

  //prepare sort obj
  const sortByObj: Prisma.UserOrderByWithRelationInput = {
    [sortOn]: sortOrder,
  };

  //Fields to be selected
  const fieldsToBeSelected: Prisma.UserSelect = {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    role: true,
    isActive: true,
    createdAt: true,
  };

  const [users, totalCount] = await userRepository.findManyWithCount({
    where: whereObj,
    orderBy: sortByObj,
    select: fieldsToBeSelected,
    skip: skipQuery,
    take: perPage,
  });

  // prepare meta deta
  const totalPages = Math.ceil(totalCount / perPage);
  const meta = {
    currentPage: page,
    perPage,
    totalItems: totalCount,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };

  return {
    result: users,
    meta,
  };
};

export const getUser = async (id: string) => {
  // check if user  exists
  const existingUser = await userRepository.findUnique({
    id,
  });

  if (!existingUser) {
    throw new AppError(STATUS_CODES.NOT_FOUND, "No user found");
  }

  return existingUser;
};

export const createuser = async (user: CreateUserSchemaType) => {
  const { firstName, lastName, email, role, isActive } = user;

  // Find if user already exists
  const existingUser = await userRepository.findUnique({
    email: email,
  });

  if (existingUser) {
    throw new AppError(
      STATUS_CODES.CONFLICT,
      "User with same email already exists",
    );
  }

  //prepare user create
  const data = {
    firstName,
    lastName,
    email,
    passwordHash: await hashPassword(TEMP_PASSWORD),
    role,
    ...(isActive !== undefined && { isActive: isActive }),
  };

  return await userRepository.create(data);
};


export const updateUserService = async (userId: string, data: UpdateUserSchemaType) => {
  const { email } = data;

  //verify if user exists
  const existingUser = await userRepository.findFirst({ id: userId, });

  if (!existingUser) {
    throw new AppError(STATUS_CODES.NOT_FOUND, "User does not exist")
  }

  if (email) {
    //check if any other user with same email exists or not
    const userWithexistingEmail = await userRepository.findFirst({ email, id: { not: userId }, })


    if (userWithexistingEmail) {
      throw new AppError(STATUS_CODES.CONFLICT, "User with this email already exist")
    }
  }



  const updatedUser = await userRepository.update({ id: userId }, data);

  return updatedUser;
};

export const deleteUserService = async (userId: string) => {
  // verify if user exists
  const existingUser = await userRepository.findUnique({ id: userId });

  if (!existingUser) {
    throw new AppError(STATUS_CODES.NOT_FOUND, "User does not exist");
  }

  // soft delete — set isActive to false
  const deletedUser = await userRepository.update({ id: userId }, { isActive: false });

  return deletedUser;
};