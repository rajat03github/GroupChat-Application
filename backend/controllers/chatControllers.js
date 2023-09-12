import Chat from "../models/ChatModel.js";
import User from "../models/UserModel.js";

const accessChat = async (req, res) => {
  //TODO ~ In summary, this code is searching for a one-on-one chat where both the current logged-in user (req.user._id) and the user specified by userId are participants. It then populates the users and latestMessage fields for that chat and stores the result in the isChat variable.

  try {
    //take id of user that we want to chat with,
    const { userId } = req.body;

    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "UserId param not sent with Request",
      });
    }

    let isChat = await Chat.find({
      isGroupChat: false, //Single Chat

      //!users field in the chat document contains an element equals to =
      $and: [
        {
          users: { $elemMatch: { $eq: req.user._id } }, //It ensures that the current logged-in user is part of the Chat
        },
        {
          users: { $elemMatch: { $eq: userId } }, // It ensures that the user you want to chat with is also part of the Chat.
        },
      ],
    })
      .populate("users", "-password") //isChat object will include details about the users participating in the chat.
      .populate("latestMessage"); //isChat object will also include information about the latest message in the Chat

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    if (isChat.length > 0) {
      //* Checking if there are any chat records returned. If there are,sending the first chat record

      res.send(isChat[0]);
    } else {
      //create new Chat
      let newChat = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };
      try {
        const createdChat = await Chat.create(newChat);

        const FullChat = await Chat.findOne({
          _id: createdChat._id,
        }).populate("users", "-password");

        res.status(200).send(FullChat);
      } catch (error) {
        res.status(401).json({
          success: false,
          message: error.message,
        });
      }
    }
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Some Error Occured !",
    });
  }
};

export { accessChat };
