import mongoose from 'mongoose';
import { PlayerSchema } from './player';
import { QuestionSchema } from './question';
import { ResponseSchema } from './response';
import { GameDocSchema } from '../utils/interfaces';

export const GameSchema = new mongoose.Schema({
  players: {
    type: [PlayerSchema],
    required: true,
  },
  hasStarted: {
    type: Boolean,
    required: true,
    default: false,
  },
  hasEnded: {
    type: Boolean,
    required: true,
    default: false,
  },
  rounds: {
    type: Number,
    required: true,
    default: 1,
  },
  roomId: {
    type: String,
    required: true,
  },
  creator: {
    type: String,
    required: true,
  },
  questions: {
    type: [QuestionSchema],
    // required: true,
  },
  responses: {
    type: [ResponseSchema],
    // required: true,
  },
});

export const GameModel = mongoose.model<GameDocSchema>('Game', GameSchema);
