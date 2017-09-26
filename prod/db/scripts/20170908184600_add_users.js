const passwordHash = require('password-hash');
const config = require('../config.js');

const users = [{
  id: 'ADMIN',
  body: {
    role: 'admin',
    login: 'admin',
    name: 'Администратор',
    hash: 'sha1$e0ef0f22$1$d1931026965efb48a9d28b1fee6970a0e9983baf',
    description: ''
  }
}, {
  id: 'USER',
  body: {
    role: 'user',
    login: 'user',
    name: 'Пользователь',
    hash: 'sha1$b860d9c2$1$36010684ad559eb7f7e039fb01839ce2b52b4880',
    description: ''
  }
}, {
  id: 'MK',
  body: {
    role: 'translator',
    login: 'mk',
    name: 'М.Н. Кожевникова',
    hash: 'sha1$ce4a9ca0$1$ef1aabb5804cf7e7b397344720224f33a5a788c6',
    language: 'rus',
    description: ''
  }
}, {
  id: 'AKT',
  body: {
    role: 'translator',
    login: 'akt',
    name: 'А. Кугявичус - А.А. Терентьев',
    hash: 'sha1$b4089de2$1$3fc5af2bf791224f1316fe2e2b0a530dc8aa4ba0',
    language: 'rus',
    description: ''
  }
}, {
  id: 'ZAG',
  body: {
    role: 'translator',
    login: 'zag',
    name: 'Б.И. Загуменнов',
    hash: 'sha1$26f87429$1$af2f2de31509fc6da7432f70773ed529288c1daa',
    language: 'rus',
    description: ''
  }
}, {
  id: 'DON',
  body: {
    role: 'translator',
    login: 'don',
    name: 'А.М. Донец',
    hash: 'sha1$81db2f3b$1$8580e47f134905fbe6885f6e7aed31ac283d21a6',
    language: 'rus',
    description: ''
  }
}, {
  id: 'HOP',
  body: {
    role: 'translator',
    login: 'hop',
    name: 'J. Hopkins',
    hash: 'sha1$7c4a6e42$1$1fe059bfe474c38bcc74f6d44f54928d12fa27d5',
    language: 'eng',
    description: ''
  }
}, {
  id: 'BRZ',
  body: {
    role: 'translator',
    login: 'brz',
    name: 'A. Berzin',
    hash: 'sha1$ec042dac$1$e88e2babfc1730d1ba4ae8da16fc5f624f9bc858',
    language: 'eng',
    description: ''
  }
}, {
  id: 'MM',
  body: {
    role: 'translator',
    login: 'mm',
    name: 'М. Малыгина',
    hash: 'sha1$18cbc60d$1$48da07d81b01164028c0eb727df7fa2b6ed57b3a',
    language: 'rus',
    description: ''
  }
}];

const script = {
  title: `Add users`,
  run: (client) => new Promise((resolve, reject) => {

    let count = 0, countError = 0, lastError;
    const _done = (error) => {
      if (error) {
        countError++;
        lastError = error;
      }
      else {
        count++;
      }
      if (count + countError === users.length) {
        if (countError) {
          lastError.text = countError + ' errors have been occurred. Last error:';
          reject(lastError);
        }
        else {
          resolve({text: count + ' users have been added'});
        }
      }
    };

    users.forEach(user => {
      client.index({
        index: config.index,
        type: 'users',
        id: user.id,
        body: user.body
      })
        .then(() => _done(), error => _done(error || true))
    });
  })
};

module.exports = script;
