const Grade = require("../models/grade.model");
const { redisClient } = require("../config/redis");

const CACHE_KEY = "grades";

const getAllGrades = async () => {
  const cached = await redisClient.get(CACHE_KEY);

  if (cached) {
    console.log("GET /grades -> Redis cache");

    return JSON.parse(cached);
  }

  const grades = await Grade.find().sort({ grade: 1, name: 1 }).lean();

  await redisClient.setEx(
    CACHE_KEY,
    60,
    JSON.stringify(grades)
  );

  console.log("GET /grades -> MongoDB");

  return grades;
};

const getGradeById = async (id) => {
  return await Grade.findById(id).lean();
};

const createGrade = async (data) => {
  let grades;

  if (Array.isArray(data)) {
    grades = await Grade.insertMany(data);
  } else {
    grades = await Grade.create(data);
  }

  await redisClient.del(CACHE_KEY);

  return grades;
};

const updateGrade = async (id, data) => {
  const grade = await Grade.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true
    }
  ).lean();

  if (grade) {
    await redisClient.del(CACHE_KEY);
  }

  return grade;
};

const deleteGrade = async (id) => {
  const grade = await Grade.findByIdAndDelete(id);

  if (grade) {
    await redisClient.del(CACHE_KEY);
  }

  return grade;
};

module.exports = {
  getAllGrades,
  getGradeById,
  createGrade,
  updateGrade,
  deleteGrade
};