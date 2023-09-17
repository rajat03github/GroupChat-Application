import Chat from "../models/ChatModel.js";
import User from "../models/UserModel.js";

const accessChatOnetoOne = async (req, res) => {
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
      .populate("users", "-password") //Chat will be populated
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

const fetchChatsforCurrentUser = async (req, res) => {
  try {
    //! check users array that the current user is part of
    //* then populate the Chat and sort with r.p.t updatedAt descending order/most recent

    const result = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    await User.populate(result, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    res.status(201).send(result);
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Some Error Occured !",
    });
  }
};

const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(401).send({
      success: false,
      message: "Oops ! All FIELDS are REQUIRED ",
    });
  }

  const users = JSON.parse(req.body.users); //users to add in group chat

  users.push(req.user); //all the users + current logged in user pushed in users array

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users,
      isGroupChat: true,
      groupAdmin: req.user, // Current Logged-in user
    });

    //fetch Created Group Chat and Send to user

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.status(200).json(fullGroupChat);
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Some Error Occured !",
    });
  }
};
const renameGroupChat = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true, //will return new Name
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      res.status(404).send("Chat not found !");
    } else {
      res.json(updatedChat);
    }
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Some Error Occured !",
    });
  }
};
const addToGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId }, //Push the new User to the users array
      },
      { new: true } //will return latest
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
      res.status(404).send("Chat not found !");
    } else {
      res.json(added);
    }
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Some Error Occured !",
    });
  }
};
const removeFromGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId }, //Pull the present User from thee users array
      },
      { new: true } //will return latest
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
      res.status(404).send("Chat not found !");
    } else {
      res.json(added);
    }
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Some Error Occured !",
    });
  }
};
export {
  accessChatOnetoOne,
  fetchChatsforCurrentUser,
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup,
};
