import { NextFunction, Request, Response } from "express";

import { messageService } from "../services/message.service";
import { IMessage } from "../types/message.types";

class MessageController {
  public async sendMessage(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IMessage>> {
    try {
      const { header, content, recipientUserId } = req.body;
      const senderUserId = res.locals.decodedToken.userId;

      const newMessage = await messageService.sendMessage(
        senderUserId,
        header,
        content,
        recipientUserId,
      );

      return res.status(201).json({ message: newMessage });
    } catch (e) {
      res.status(500).json({ error: "Failed to send message" });
      next(e);
    }
  }
}

export const messageController = new MessageController();
