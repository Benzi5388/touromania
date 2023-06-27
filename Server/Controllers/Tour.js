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
export const deleteTour = async (req, res) => {
  const id = req.params.id;
 console.log(id, 3333333333);
  try {
    // Find the tour by ID
    const tour = await TourModel.findById(id);
    console.log(tour, 222222222);

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
