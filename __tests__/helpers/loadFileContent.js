import { readFileSync } from 'fs';

export default (path) => readFileSync(path).toString().trim();
