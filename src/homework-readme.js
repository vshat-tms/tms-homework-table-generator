import { DateTime } from "luxon";

export default function makeHomeworkReadme(homeworkMarkdownTable) {
    const dtInMinsk = DateTime.now().setZone('Europe/Minsk').toFormat('dd.LL.yyyy в HH:mm')
return `# Прогресс ДЗ

> *Обновлено ${dtInMinsk} по Минску*

${homeworkMarkdownTable}
    
### Условные обозначения

| статус          | значение        |
| :-------------: | --------------- |
| :white_circle:  | неизвестно      |
| :yellow_circle: | есть PR         |
| :green_circle:  | принято         |

<br>

> *Эта страничка сгенерирована с помощью [tms-homework-table-generator](https://github.com/vshat-tms/tms-homework-table-generator)*
`;

}