import Message from "../models/Message.model";
import { IMessage } from "../types/message.types";

class MessageService {
  public async sendMessage(
    senderUserId: string,
    header: string,
    content: string,
    recipientUserId: string,
  ): Promise<IMessage> {
    const newMessage = await Message.create({
      header,
      content,
      send_to: recipientUserId,
      send_by: senderUserId,
    });

    return newMessage;
  }
}

export const messageService = new MessageService();
