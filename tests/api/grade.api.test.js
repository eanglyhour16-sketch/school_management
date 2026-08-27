const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../../src/app");
const Grade = require("../../src/models/grade.model");

const { redisClient } = require("../../src/config/redis");

jest.mock("../../src/config/redis", () => ({
  redisClient: {
    get: jest.fn(),
    setEx: jest.fn(),
    del: jest.fn()
  }
}));

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();

  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
});

beforeEach(() => {
  jest.clearAllMocks();

  redisClient.get.mockResolvedValue(null);
  redisClient.setEx.mockResolvedValue("OK");
  redisClient.del.mockResolvedValue(1);
});

afterEach(async () => {
  await Grade.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();

  await mongoose.connection.close();

  await mongoServer.stop();
});

describe("Grade API Test", () => {

  test("POST /api/grades - create single grade", async () => {

    const response = await request(app)
      .post("/api/grades")
      .send({
        name: "Grade 10-A",
        grade: 10
      });

    expect(response.statusCode).toBe(201);

    expect(response.body.success).toBe(true);

    expect(response.body.data.name)
      .toBe("Grade 10-A");

    expect(response.body.data.grade)
      .toBe(10);
  });


  test("POST /api/grades - create multiple grades", async () => {

    const response = await request(app)
      .post("/api/grades")
      .send([
        {
          name: "Grade 10-A",
          grade: 10
        },
        {
          name: "Grade 10-B",
          grade: 10
        },
        {
          name: "Grade 11-A",
          grade: 11
        },
        {
          name: "Grade 11-B",
          grade: 11
        },
        {
          name: "Grade 12-A",
          grade: 12
        }
      ]);

    expect(response.statusCode).toBe(201);

    expect(response.body.success).toBe(true);

    expect(response.body.data).toHaveLength(5);

    expect(response.body.data[0].name)
      .toBe("Grade 10-A");

    expect(response.body.data[1].name)
      .toBe("Grade 10-B");

    expect(response.body.data[2].name)
      .toBe("Grade 11-A");

    expect(response.body.data[3].name)
      .toBe("Grade 11-B");

    expect(response.body.data[4].name)
      .toBe("Grade 12-A");

    expect(redisClient.del)
      .toHaveBeenCalledWith("grades");
  });


  test("GET /api/grades - get grades", async () => {

    await Grade.create({
      name: "Grade 10-A",
      grade: 10
    });

    const response = await request(app)
      .get("/api/grades");

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.length)
      .toBe(1);

    expect(response.body.data[0].name)
      .toBe("Grade 10-A");
  });


  test("GET /api/grades/:id - get grade by id", async () => {

    const grade = await Grade.create({
      name: "Grade 10-A",
      grade: 10
    });

    const response = await request(app)
      .get(`/api/grades/${grade._id}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.name)
      .toBe("Grade 10-A");

    expect(response.body.data.grade)
      .toBe(10);
  });


  test("PUT /api/grades/:id - update grade", async () => {

    const grade = await Grade.create({
      name: "Grade 10-A",
      grade: 10
    });

    const response = await request(app)
      .put(`/api/grades/${grade._id}`)
      .send({
        name: "Grade 10-A Updated",
        grade: 10
      });

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.name)
      .toBe("Grade 10-A Updated");

    expect(redisClient.del)
      .toHaveBeenCalledWith("grades");
  });


  test("DELETE /api/grades/:id - delete grade", async () => {

    const grade = await Grade.create({
      name: "Grade 10-A",
      grade: 10
    });

    const response = await request(app)
      .delete(`/api/grades/${grade._id}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(redisClient.del)
      .toHaveBeenCalledWith("grades");

    const deletedGrade = await Grade.findById(grade._id);

    expect(deletedGrade)
      .toBeNull();
  });

});