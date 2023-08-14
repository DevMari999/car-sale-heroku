import mongoose, { Schema } from "mongoose";

import { IMessage } from "../types/message.types";

const messageSchema = new Schema<IMessage>(
  {
    header: { type: String, required: true },
    content: {
      type: String,
      required: true,
    },
    send_to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    send_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const Message = mongoose.model<IMessage>("Message", messageSchema);

export default Message;
