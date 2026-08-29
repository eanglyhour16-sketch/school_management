const Student = require("../../src/models/student.model");
const studentService = require("../../src/services/student.service");

jest.mock("../../src/models/student.model");

describe("Student Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createStudent", () => {
    it("should create student", async () => {
      const data = {
        code: "STU001",
        name: "Dara Sok",
        gender: "Male",
        class_id: 1,
        status: "Active",
      };
      const student = { _id: "1", ...data };

      Student.findOne.mockResolvedValue(null);
      Student.create.mockResolvedValue(student);

      const result = await studentService.createStudent(data);

      expect(Student.findOne).toHaveBeenCalledWith({ code: "STU001" });
      expect(Student.create).toHaveBeenCalledWith(data);
      expect(result).toEqual(student);
    });

    it("should reject duplicate code", async () => {
      Student.findOne.mockResolvedValue({ _id: "1", code: "STU001" });

      await expect(
        studentService.createStudent({
          code: "STU001",
          name: "Dara Sok",
          gender: "Male",
          class_id: 1,
        })
      ).rejects.toThrow("Student code already exists");

      expect(Student.create).not.toHaveBeenCalled();
    });
  });

  describe("getStudents", () => {
    it("should return students with pagination", async () => {
      const students = [
        { _id: "1", code: "STU001", name: "Dara Sok", gender: "Male", class_id: 1, status: "Active" },
        { _id: "2", code: "STU002", name: "Sopheak Kim", gender: "Female", class_id: 1, status: "Active" },
      ];

      const limitMock = jest.fn().mockResolvedValue(students);
      const skipMock = jest.fn().mockReturnValue({ limit: limitMock });
      const sortMock = jest.fn().mockReturnValue({ skip: skipMock });

      Student.find.mockReturnValue({ sort: sortMock });
      Student.countDocuments.mockResolvedValue(10);

      const result = await studentService.getStudents({ page: 1, limit: 2 });

      expect(Student.find).toHaveBeenCalledWith({});
      expect(sortMock).toHaveBeenCalledWith({ _id: -1 });
      expect(skipMock).toHaveBeenCalledWith(0);
      expect(limitMock).toHaveBeenCalledWith(2);
      expect(Student.countDocuments).toHaveBeenCalledWith({});
      expect(result.data).toHaveLength(2);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 2,
        total: 10,
        totalPages: 5,
      });
    });

    it("should search students", async () => {
      const students = [
        { _id: "1", code: "STU001", name: "Dara Sok", gender: "Male", class_id: 1, status: "Active" },
      ];

      const limitMock = jest.fn().mockResolvedValue(students);
      const skipMock = jest.fn().mockReturnValue({ limit: limitMock });
      const sortMock = jest.fn().mockReturnValue({ skip: skipMock });

      Student.find.mockReturnValue({ sort: sortMock });
      Student.countDocuments.mockResolvedValue(1);

      const result = await studentService.getStudents({
        page: 1,
        limit: 10,
        search: "Dara",
      });

      const expectedFilter = {
        $or: [
          { code: { $regex: "Dara", $options: "i" } },
          { name: { $regex: "Dara", $options: "i" } },
          { gender: { $regex: "Dara", $options: "i" } },
          { status: { $regex: "Dara", $options: "i" } },
        ],
      };

      expect(Student.find).toHaveBeenCalledWith(expectedFilter);
      expect(Student.countDocuments).toHaveBeenCalledWith(expectedFilter);
      expect(result.data).toHaveLength(1);
    });
  });

  describe("getStudentById", () => {
    it("should return student", async () => {
      const student = { _id: "1", code: "STU001", name: "Dara Sok" };
      Student.findById.mockResolvedValue(student);

      const result = await studentService.getStudentById("1");

      expect(Student.findById).toHaveBeenCalledWith("1");
      expect(result).toEqual(student);
    });

    it("should throw error when student not found", async () => {
      Student.findById.mockResolvedValue(null);

      await expect(studentService.getStudentById("999")).rejects.toThrow("Student not found");
    });
  });

  describe("updateStudent", () => {
    it("should update student", async () => {
      const oldStudent = { _id: "1", code: "STU001", name: "Dara Sok" };
      const updatedStudent = { ...oldStudent, name: "Dara Updated" };

      Student.findById.mockResolvedValue(oldStudent);
      Student.findByIdAndUpdate.mockResolvedValue(updatedStudent);

      const result = await studentService.updateStudent("1", { name: "Dara Updated" });

      expect(Student.findById).toHaveBeenCalledWith("1");
      expect(Student.findByIdAndUpdate).toHaveBeenCalledWith(
        "1",
        { name: "Dara Updated" },
        { new: true, runValidators: true }
      );
      expect(result).toEqual(updatedStudent);
    });

    it("should throw error when student not found", async () => {
      Student.findById.mockResolvedValue(null);

      await expect(studentService.updateStudent("999", { name: "Test" })).rejects.toThrow("Student not found");
    });
  });

  describe("deleteStudent", () => {
    it("should delete student", async () => {
      const student = { _id: "1", code: "STU001" };

      Student.findById.mockResolvedValue(student);
      Student.findByIdAndDelete.mockResolvedValue(student);

      const result = await studentService.deleteStudent("1");

      expect(Student.findById).toHaveBeenCalledWith("1");
      expect(Student.findByIdAndDelete).toHaveBeenCalledWith("1");
      expect(result).toEqual(student);
    });

    it("should throw error when student not found", async () => {
      Student.findById.mockResolvedValue(null);

      await expect(studentService.deleteStudent("999")).rejects.toThrow("Student not found");
      expect(Student.findByIdAndDelete).not.toHaveBeenCalled();
    });
  });
});