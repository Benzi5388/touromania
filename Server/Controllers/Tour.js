import TourModel from '../Models/Tour.js';
import { Cloudinaryupload } from '../Helpers/Cloudinary.js';
import mongoose from 'mongoose';

export const createTour = async (req, res) => {
  // const image = req.file.filename;
  const { title, description, tags, videoUrl, name, creator } = req.body;
  try {
    const image = [req.file.path]; // Assuming the uploaded image is stored in req.file

    // Upload images to Cloudinary
    const uploadedImage = await Cloudinaryupload(image);
    console.log(uploadedImage[0].url, "ttttttttttt");
    // const imageUrl = uploadedImage.secure_url
    const newTour = new TourModel({
      title,
      description,
      tags,
      image : uploadedImage[0].url,
      videoUrl,
      name,
      creator
    });
    newTour.save();
    res.json({ message: 'Tour added successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to add tour' });
  }
};




export const getTour = async (req, res) => {
  try {
    const tours = await TourModel.find()
    res.status(200).json(tours)
  } catch (err) {
    res.status(404).json({ message: "Something went wrong" })
  }
}

export const getSingleTour = async (req, res) => {
  const id = req.params.id
  console.log(id, "55555555555555555");
  try {
    const tour = await TourModel.findById(id)
    console.log(tour, "trip");
    res.status(200).json(tour)
  } catch (err) {
    res.status(404).json({ message: "Something went wrong" })
  }
}


// Controller method to list a tour
export const deleteTour = async (req, res) => {
  const id = req.params.id;
  try {
    // Find the tour by ID
    const tour = await TourModel.findById(id);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }
    // Delete the tour
    await TourModel.deleteOne({ _id: id });
    res.status(200).json({  message: 'Tour deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete tour', error: error.message });
  }
};

export const updateTour = async (req, res) => {
  const { title, description, tags, videoUrl, name, creator } = (req.body);
  console.log(req.body, " bbbbbbbbb");
  try {
    let image;
    if (req.file) {
      image = [req.file.path];
      const uploadedImage = await Cloudinaryupload(image);
      image = uploadedImage[0].url;
    }
    const tour = await TourModel.findById(req.params.id);
    console.log(tour, "ggggg");
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    tour.title = title;
    tour.description = description;
    tour.tags = tags;
    if (image) {
      tour.image = image;
    }
    tour.videoUrl = videoUrl;
    tour.name = name;
    tour.creator = creator;

    await tour.save();

    res.json({ message: 'Tour updated successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to update tour' });
  }
};


export const getToursByUser = async (req, res) =>{
  const id = req.params.id
  console.log(id, "iddddddddd");
  if(!mongoose.Types.ObjectId.isValid(id)){
    res.status(404).json({message : "user doesnt exist"})
  }
  const userTours = await TourModel.find({creator : id})
  res.status(200).json(userTours)
}
