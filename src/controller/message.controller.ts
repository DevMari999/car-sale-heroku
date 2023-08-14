import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { configs } from "../configs/configs";
import Message from "../models/Message.model";
import { IMessage } from "../types/message.types";

class MessageController {
  public async sendMessage(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IMessage>> {
    try {
      const { header, content, recipientUserId } = req.body;

      const token = req.cookies.token;

      let decodedToken: {
        userId: string;
      };
      try {
        decodedToken = jwt.verify(token, configs.JWT_SECRET) as {
          userId: string;
        };
      } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }

      const senderUserId = decodedToken.userId;

      const newMessage = await Message.create({
        header,
        content,
        send_to: recipientUserId,
        send_by: senderUserId,
      });

      return res.status(201).json({ message: newMessage });
    } catch (e) {
      res.status(500).json({ error: "Failed to send message" });
      next(e);
    }
  }
}

export const messageController = new MessageController();
