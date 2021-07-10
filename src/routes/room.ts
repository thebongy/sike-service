import express, { Response, Request } from 'express';
import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';
import { GameModel } from '../models/game';
import { PlayerModel } from '../models/player';
import roomJoinSchema from '../utils/roomJoinSchema';

const router = express.Router();

router.post('/create', async (req: Request, res: Response) => {
  try {
    const USERNAME_REGEX = /^\S*$/;
    const { username } = req.body;
    const { rounds } = req.body ? req.body : 3;

    if (!username) {
      res.json({ success: false, message: 'Username cannot be empty' });
      return;
    }
    if (!(USERNAME_REGEX.test(username))) {
      res.json({ success: false, message: 'Username cannot have whitespaces' });
      return;
    }
    const roomId: string = uuidv4();
    const player = await PlayerModel.create({
      username,
    });
    const game = await GameModel.create({
      players: [player],
      hasStarted: true,
      hasEnded: false,
      rounds,
      roomId,
      creator: username,
    });
    res.json({ success: true, message: `Game created successfully: ${game}` });
  } catch (e) {
    res.json({ succes: false, message: e });
  }
});

router.post('/join/:roomId', async (req: Request, res: Response) => {
  try {
    const USERNAME_REGEX = /^\S*$/;
    const { username, roomId } = Joi.attempt({
      username: req.body.username,
      roomId: req.params,
    }, roomJoinSchema);

    if (!username) {
      res.json({ success: false, message: 'Username cannot be empty' });
      return;
    }
    if (!(USERNAME_REGEX.test(username))) {
      res.json({ success: false, message: 'Username cannot have whitespaces' });
    }

    const room = await GameModel.findOne({ roomId });
    if (!room) {
      res.json({ succes: false, message: 'Room cannot be found' });
      return;
    }
    if (room.players.find((player) => player.username === username)) {
      res.json({ success: false, message: 'Username already exists' });
      return;
    }

    const player = new PlayerModel({
      username,
    });

    room.players.push(player);
    room.markModified('Game');
    res.json({ success: true, message: `Room joined successfully ${room}` });
  } catch (e) {
    res.json({ succes: false, message: e });
  }
});

export default router;
