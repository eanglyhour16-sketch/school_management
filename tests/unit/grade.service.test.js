const gradeService = require("../../src/services/grade.service");

const Grade = require("../../src/models/grade.model");

const { redisClient } = require("../../src/config/redis");

jest.mock("../../src/models/grade.model");

jest.mock("../../src/config/redis", () => ({
    redisClient: {
        get: jest.fn(),
        setEx: jest.fn(),
        del: jest.fn()
    }
}));

describe("Grade Service Unit Test", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should create multiple grades", async () => {
        const gradeData = [
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
            }
        ];

        Grade.insertMany.mockResolvedValue(
            gradeData.map((grade, index) => ({
                _id: `${index + 1}`,
                ...grade
            }))
        );

        const result = await gradeService.createGrade(gradeData);

        expect(Grade.insertMany).toHaveBeenCalledWith(gradeData);

        expect(redisClient.del).toHaveBeenCalledWith("grades");

        expect(result).toHaveLength(3);

        expect(result[0].name).toBe("Grade 10-A");
        expect(result[1].name).toBe("Grade 10-B");
        expect(result[2].name).toBe("Grade 11-A");
    });

    test("should return grades from Redis cache", async () => {

        const cachedData = [
            {
                _id: "123",
                name: "Grade 10-A",
                grade: 10
            }
        ];

        redisClient.get.mockResolvedValue(
            JSON.stringify(cachedData)
        );

        const result = await gradeService.getAllGrades();

        expect(redisClient.get).toHaveBeenCalledWith("grades");

        expect(Grade.find).not.toHaveBeenCalled();

        expect(result).toEqual(cachedData);
    });

    test("should delete grade", async () => {

        Grade.findByIdAndDelete.mockResolvedValue({
            _id: "123",
            name: "Grade 10-A",
            grade: 10
        });

        const result = await gradeService.deleteGrade("123");

        expect(
            Grade.findByIdAndDelete
        ).toHaveBeenCalledWith("123");

        expect(redisClient.del).toHaveBeenCalledWith("grades");

        expect(result.name).toBe("Grade 10-A");
    });

});