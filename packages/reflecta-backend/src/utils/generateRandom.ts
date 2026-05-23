import {
    randomUUID
} from 'node:crypto';

const generateRandom = (): string => randomUUID();

export default generateRandom;
