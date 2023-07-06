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
      image: uploadedImage[0].url,
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
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const skip = (parseInt(page) - 1) * limit;

    const searchQuery = req.query.search;
    const searchFilters = {};
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    console.log(endDate, "enddate");
    console.log(startDate, "startdate");
    if (startDate && endDate) {
      // Convert the start and end dates to ISO format
      const isoStartDate = new Date(startDate).toISOString();
      const isoEndDate = new Date(endDate).toISOString();

      // Add the date filter to the search filters
      searchFilters.createdAt = { $gte: isoStartDate, $lte: isoEndDate };
    }
    if (searchQuery) {
      searchFilters.$or = [
        { title: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive search on tour name
        { tags: { $elemMatch: { $regex: searchQuery, $options: 'i' } } }, // Case-insensitive search on tags
        { name: { $regex: `^${searchQuery}`, $options: 'i' } }
      ];
    }

    const sortOption = req.query.sort || 'recent';
    const sortQuery = {};

    if (sortOption === 'recent') {
      sortQuery.createdAt = -1; // Sort by descending createdAt
    } else if (sortOption === 'likes') {
      sortQuery.likeCount = -1; // Sort by descending likeCount
    }

    const totalTours = await TourModel.countDocuments(searchFilters);
    const totalPages = Math.ceil(totalTours / limit);

    const tours = await TourModel.find(searchFilters)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .exec();

    res.status(200).json({
      tours,
      totalPages: totalPages,
      currentPage: page,
    });
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
    res.status(200).json({ message: 'Tour deleted successfully' });
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


export const getToursByUser = async (req, res) => {
  try {
    const id = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = 6; // Specify the desired limit per page
    const skip = (parseInt(page) - 1) * limit;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ message: "User doesn't exist" });
    }

    const searchQuery = req.query.search;
    const searchFilters = {};

    if (searchQuery) {
      searchFilters.$or = [
        { title: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive search on tour name
        { tags: { $elemMatch: { $regex: searchQuery, $options: 'i' } } }, // Case-insensitive search on tags
      ];
    }
    const totalTours = await TourModel.countDocuments({ creator: id, ...searchFilters });
    const totalPages = Math.ceil(totalTours / limit);

    const userTours = await TourModel.find({ creator: id, ...searchFilters })
      .skip(skip)
      .limit(limit)
      .exec();

    res.status(200).json({
      userTours,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    res.status(404).json({ message: "Something went wrong" });
  }
};
