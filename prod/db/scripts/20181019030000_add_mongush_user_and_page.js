const { Users } = require('./helpers/users.js');
const { Pages } = require('./helpers/pages.js');

const users = [{
  id: 'MNG',
  body: {
    role: 'translator',
    login: 'mng',
    name: 'Монгуш Чеченбай Викторович',
    hash: 'sha1$0a96c41a$1$b2783ffefa98980eef97bfacc2ebe5f03aad41f6',
    language: 'ru',
    description: '/pages/MNG'
  }
}];

const pages = [{
  url: 'MongushChechenbai',
  title: 'Монгуш Чеченбай Викторович',
  author: 'MNG',
  bio: true,
  text: `
<p>
С 2006 по 2008 гг. изучал тибетский язык в Колледже Сара (Дхарамсала).
В 2017 г. окончил философский факультет Центрального университета тибетских дисциплин (Варанаси, Индия).
В настоящее время занимается устными переводами. Переводил учения Геше Еше Тхабке (2015), Геше Нгаванг Тукдже (с 2016 г.),
Чадо Тулку Ринпоче (2017, 2018 гг.), Геше Дакпа Джампа (с 2017 г.).
</p>
`
}];


const script = {
  title: `Add Mongush user and page`,
  run: (client) =>
    Users.run(client, users)
    .then(Pages.run(client, pages))
};

module.exports = script;
