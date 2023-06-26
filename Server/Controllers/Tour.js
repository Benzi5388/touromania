import TourModel from '../Models/Tour.js';

export const createTour = async (req, res) => {
  const image = req.file.filename;
  const { title, description, tags, videoUrl, name, creator } = req.body;
  try {
    const newTour = new TourModel({
      title,
      description,
      tags,
      image,
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
  const {id} = req.params
  try {
    const tour = await TourModel.findById(id)
    res.status(200).json(tour)
  } catch (err) {
    res.status(404).json({ message: "Something went wrong" })
  }
}



// Controller method to list a tour
export const listTour = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the tour by ID
    const tour = await TourModel.findById(id);

    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    // Update the listed property to true
    tour.listed = true;
    await tour.save();

    res.status(200).json({ message: 'Tour listed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to list tour', error: error.message });
  }
};

// Controller method to unlist a tour
export const unlistTour = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the tour by ID
    const tour = await TourModel.findById(id);

    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    // Update the listed property to false
    tour.listed = false;
    await tour.save();

    res.status(200).json({ message: 'Tour unlisted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to unlist tour', error: error.message });
  }
};
