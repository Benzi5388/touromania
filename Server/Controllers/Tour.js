
import TourModel from '../Models/Tour.js';


export const createTour = async (req, res) => {
  console.log(req.body, "title");
  console.log(req.file)
  const image = req.file.filename
  const { title, description } = req.body
  try {
    const newTour = new TourModel({
      title,
      description,
      image
    })
    newTour.save()
    res.json({ message: 'tour added successfully' })
  } catch (err) {
    console.log(err)
  }
}



export const getTour = async (req, res) => {
  try {
    const tours = await TourModel.find()
    res.status(200).json(tours)
  } catch (err) {
    res.status(404).json({ message: "Something went wrong" })
  }
}