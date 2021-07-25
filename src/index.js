import './styles/_custom.scss';

async function start() {
  return await Promise.resolve('It works');
}

class Util {
    static id = Date.now()
}

console.log(Util.id);
