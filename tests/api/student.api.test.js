const request = require("supertest");
const app = require("../../src/app");
const studentService = require("../../src/services/student.service");

jest.mock("../../src/services/student.service");

describe("Student API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/students", () => {
    it("should create student", async () => {
      const data = {
        code: "STU011",
        name: "New Student",
        gender: "Male",
        class_id: 1,
        status: "Active",
      };

      studentService.createStudent.mockResolvedValue({
        _id: "11",
        ...data,
      });

      const response = await request(app)
        .post("/api/students")
        .send(data);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Student created successfully");
      expect(response.body.data.code).toBe("STU011");
      expect(studentService.createStudent).toHaveBeenCalledWith(data);
    });

    it("should return 400 when code already exists", async () => {
      studentService.createStudent.mockRejectedValue(
        new Error("Student code already exists")
      );

      const response = await request(app)
        .post("/api/students")
        .send({
          code: "STU001",
          name: "Dara Sok",
          gender: "Male",
          class_id: 1,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Student code already exists");
    });
  });

  describe("GET /api/students", () => {
    it("should return students", async () => {
      studentService.getStudents.mockResolvedValue({
        data: [
          {
            _id: "1",
            code: "STU001",
            name: "Dara Sok",
            gender: "Male",
            class_id: 1,
            status: "Active",
          },
          {
            _id: "2",
            code: "STU002",
            name: "Sopheak Kim",
            gender: "Female",
            class_id: 1,
            status: "Active",
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
      });

      const response = await request(app).get("/api/students");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination.total).toBe(2);
      expect(studentService.getStudents).toHaveBeenCalledWith({
        page: undefined,
        limit: undefined,
        search: undefined,
      });
    });

    it("should search students", async () => {
      studentService.getStudents.mockResolvedValue({
        data: [
          {
            _id: "1",
            code: "STU001",
            name: "Dara Sok",
            gender: "Male",
            class_id: 1,
            status: "Active",
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      });

      const response = await request(app)
        .get("/api/students")
        .query({
          search: "Dara",
          page: 1,
          limit: 10,
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe("Dara Sok");
      expect(studentService.getStudents).toHaveBeenCalledWith({
        search: "Dara",
        page: "1",
        limit: "10",
      });
    });
  });

  describe("GET /api/students/:id", () => {
    it("should return student", async () => {
      studentService.getStudentById.mockResolvedValue({
        _id: "1",
        code: "STU001",
        name: "Dara Sok",
        gender: "Male",
        class_id: 1,
        status: "Active",
      });

      const response = await request(app).get("/api/students/1");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.code).toBe("STU001");
      expect(studentService.getStudentById).toHaveBeenCalledWith("1");
    });

    it("should return 404 when not found", async () => {
      studentService.getStudentById.mockRejectedValue(
        new Error("Student not found")
      );

      const response = await request(app).get("/api/students/999");

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Student not found");
    });
  });

  describe("PUT /api/students/:id", () => {
    it("should update student", async () => {
      const data = {
        name: "Dara Updated",
        status: "Inactive",
      };

      studentService.updateStudent.mockResolvedValue({
        _id: "1",
        code: "STU001",
        name: "Dara Updated",
        gender: "Male",
        class_id: 1,
        status: "Inactive",
      });

      const response = await request(app)
        .put("/api/students/1")
        .send(data);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Student updated successfully");
      expect(response.body.data.name).toBe("Dara Updated");
      expect(studentService.updateStudent).toHaveBeenCalledWith("1", data);
    });

    it("should return 404 when student not found", async () => {
      studentService.updateStudent.mockRejectedValue(
        new Error("Student not found")
      );

      const response = await request(app)
        .put("/api/students/999")
        .send({ name: "Test" });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe("DELETE /api/students/:id", () => {
    it("should delete student", async () => {
      studentService.deleteStudent.mockResolvedValue({
        _id: "1",
        code: "STU001",
      });

      const response = await request(app).delete("/api/students/1");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Student deleted successfully");
      expect(studentService.deleteStudent).toHaveBeenCalledWith("1");
    });

    it("should return 404 when student not found", async () => {
      studentService.deleteStudent.mockRejectedValue(
        new Error("Student not found")
      );

      const response = await request(app).delete("/api/students/999");

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Student not found");
    });
  });
});