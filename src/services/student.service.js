const Student = require("../models/student.model");

const createStudent = async (data) => {
  const existingStudent = await Student.findOne({ code: data.code });
  if (existingStudent) {
    throw new Error("Student code already exists");
  }
  const student = await Student.create(data);
  return student;
};

const getStudents = async ({ page = 1, limit = 10, search = "" }) => {
  page = Number(page);
  limit = Number(limit);
  if (page < 1) page = 1;
  if (limit < 1) limit = 10;

  const skip = (page - 1) * limit;
  const filter = {};

  if (search) {
    filter.$or = [
      { code: { $regex: search, $options: "i" } },
      { name: { $regex: search, $options: "i" } },
      { gender: { $regex: search, $options: "i" } },
      { status: { $regex: search, $options: "i" } },
    ];
  }

  const [students, total] = await Promise.all([
    Student.find(filter).sort({ _id: -1 }).skip(skip).limit(limit),
    Student.countDocuments(filter),
  ]);

  return {
    data: students,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getStudentById = async (id) => {
  const student = await Student.findById(id);
  if (!student) {
    throw new Error("Student not found");
  }
  return student;
};

const updateStudent = async (id, data) => {
  const student = await Student.findById(id);
  if (!student) {
    throw new Error("Student not found");
  }

  if (data.code && data.code !== student.code) {
    const existingStudent = await Student.findOne({
      code: data.code,
      _id: { $ne: id },
    });
    if (existingStudent) {
      throw new Error("Student code already exists");
    }
  }

  const updatedStudent = await Student.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  return updatedStudent;
};

const deleteStudent = async (id) => {
  const student = await Student.findById(id);
  if (!student) {
    throw new Error("Student not found");
  }
  await Student.findByIdAndDelete(id);
  return student;
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};