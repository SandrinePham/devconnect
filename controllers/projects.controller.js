const { default: mongoose } = require("mongoose");
const Project = require("../models/project.model");
const Comment = require("../models/comment.model");

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({}, "title description").sort({
      createdAt: -1,
    });

    return res.status(200).json(projects);
  } catch (error) {
    console.error("GET PROJECTS ERROR:", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la récupération des projets" });
  }

  /* } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des projets" });
  } */
};

exports.getProject = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "ID invalide" });
  }
  const project = await Project.findById(id);

  if (!project) {
    return res.status(404).json({ error: "Projet non trouvé" });
  }

  res.status(200).json(project);
};

exports.createProject = async (req, res) => {
  try {
    const { title, description, skills } = req.body;
    const image = req.file ? req.file.filename : null;
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

exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, skills } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: "Projet non trouvé" });
    }

    if (project.author.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "Accés refusé: vous n'êtes pas l'auteur" });
    }
    if (title) project.title = title;
    if (description) project.description = description;
    if (skills) project.skills = skills;
    if (image) project.image = image;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la modification" });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: "Projet non trouvé" });
    }

    if (project.author.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "Accés refusé: vous n'êtes pas l'auteur" });
    }

    await Project.deleteOne({ _id: id });
    res.json({ message: "Projet supprimé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la suppression" });
  }
};

exports.likeProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: "Projet non trouvé" });
    }

    const alreadyLiked = project.likes.includes(userId);
    if (alreadyLiked) {
      project.likes = project.likes.filter((uid) => uid.toString() !== userId);
    } else {
      project.likes.push(userId);
    }

    await project.save();
    res.json({ likes: project.likes, liked: !alreadyLiked });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors du like" });
  }
};

exports.commentProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { content } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: "Projet non trouvé" });
    }

    if (!content) {
      return res.status(400).json({ error: "Contenu obligatoire" });
    }

    const comment = new Comment({
      content,
      author: userId,
      project: id,
    });
    const savedComment = await comment.save();

    project.comments.push(savedComment._id);
    await project.save();

    res.status(201).json(savedComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de l'ajout du commentaire" });
  }
};
