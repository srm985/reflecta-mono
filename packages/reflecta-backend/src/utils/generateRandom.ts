import {
    v4
} from 'uuid';

const generateRandom = (): string => v4();

export default generateRandom;
