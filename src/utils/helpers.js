//@ts-check
import { uuid } from "uuidv4";

export const createID = () => Math.floor(Math.random() * Date.now());

export const userID = () => uuid().replace(/-/g, "");
