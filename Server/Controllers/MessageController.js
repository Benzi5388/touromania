import MessageModel from "../Models/MessageModel.js";

export const addMessage = async (req, res) => {
    const { chatId, senderId, text } = req.body
    console.log(req.body, "chatttt");
    const message = new MessageModel({
        chatId,
        senderId,
        text
    })
    try {
        const result = await message.save()
        res.status(200).json(result)
    } catch (err) {
        res.status(500).json(err)
    }
}

export const getMessages = async (req, res) => {
    const { chatId } = req.params;
    console.log(chatId, "dffdfdfdsds");
    try {

        const searchQuery = req.query.search;
        const searchFilters = {};
    
        if (searchQuery) {
          searchFilters.$or = [
            { title: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive search on tour name
            { tags: { $elemMatch: { $regex: searchQuery, $options: 'i' } } }, // Case-insensitive search on tags
            { name: { $regex: searchQuery, $options: 'i' } }
          ];
        }
        const result = await MessageModel.find({chatId, ...searchQuery})
        res.status(200).json(result)
    } catch (err) {
        res.status(500).json(err)
    }
}