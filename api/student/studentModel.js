const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project"
    },
    image: {
      type: String,
      //TODO: definir imagem default
      default: "https://res.cloudinary.com/lsm/image/upload/v1572448108/lynx-students/perfil-icon.png.png"
    },
    //* Série
    classRoom: {
      type: String,
      required: true
    },
    //* Turma
    grade: {
      type: String,
      required: true
    },
    classNumber: Number,
    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institution",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Student", studentSchema);
