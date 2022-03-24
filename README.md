# tms-homework-table-generator

##  Описание
Этот инструмент создает [табличку с прогрессом домашних заданий](https://github.com/vshat-tms/homework-all) курса `TMS AN07-onl`, на основании пулл реквестов в репозиториях с домашним заданием.

### Отказ от ответсвенности
> Код в этом репозитории является рабочим решением, а не примером для подражания


## Инструкция по запуску
1. Установить [`node.js`](https://nodejs.org/en/download/)

2. Установить `yarn`:
```shell
npm install --global yarn
```
3. Установить зависимости:
```shell
yarn
```
4. Получить [access token](https://github.com/settings/tokens) в github

5. Создать в корне репозитория файл `.env` и прописать туда токен:
```env
GITHUB_ACCESS_TOKEN=token
```

6. Задать правильные значения константам в `index.js`:

7. Запустить:
```shell
node index.js
```
