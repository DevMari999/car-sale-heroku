import mongoose, { Document } from "mongoose";

export interface IMessage extends Document {
  header: string;
  content: string;
  send_by: mongoose.Types.ObjectId;
  send_to: mongoose.Types.ObjectId;
}
