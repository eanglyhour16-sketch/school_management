const gradeService = require("../services/grade.service");

const getAll = async (req, res) => {
  try {
    const grades = await gradeService.getAllGrades();

    res.status(200).json({
      success: true,
      data: grades
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getById = async (req, res) => {
  try {
    const grade = await gradeService.getGradeById(req.params.id);

    if (!grade) {
      return res.status(404).json({
        success: false,
        message: "Grade not found"
      });
    }

    res.status(200).json({
      success: true,
      data: grade
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const create = async (req, res) => {
  try {
    const grade = await gradeService.createGrade(req.body);

    res.status(201).json({
      success: true,
      data: grade
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const update = async (req, res) => {
  try {
    const grade = await gradeService.updateGrade(
      req.params.id,
      req.body
    );

    if (!grade) {
      return res.status(404).json({
        success: false,
        message: "Grade not found"
      });
    }

    res.status(200).json({
      success: true,
      data: grade
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const remove = async (req, res) => {
  try {
    const grade = await gradeService.deleteGrade(req.params.id);

    if (!grade) {
      return res.status(404).json({
        success: false,
        message: "Grade not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Grade deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};