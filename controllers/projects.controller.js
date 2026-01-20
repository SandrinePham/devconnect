const { default: mongoose } = require("mongoose");
const Project = require("../models/project.model");

exports.getProjects = (req, res) => {
  //try {
  const projects = Project.find({}, "title description").sort({
    createdAt: -1,
  });

  res.status(200).json(projects);
  /* } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des projets" });
  } */
};

exports.getProject = (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "ID invalide" });
  }
  const project = Project.findById(id).select("title description skills image");

  if (!project) {
    return res.status(404).json({ error: "Projet non trouvé" });
  }

  res.status(200).json(project);
};

exports.createProject = async (req, res) => {
  try {
    const { title, description, skills } = req.body;
    const image = req.file.filename;
    if (!title) return res.status(400).json({ error: "Titre obligatoire" });

    const project = new Project({
      title,
      description,
      skills,
      image,
      author: req.user.userId,
      likes: [],
      comments: [],
    });
    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création du projet" });
  }
};
