import { getHomeworkStatus } from "./github-tms.js"
import { getStudentsData, STUDENTS_DATA_COLUMN_NICK_INDEX } from "./students.js"
import { markdownTable } from "markdown-table";
import * as constants from './constants.js'

const PRE_GITHUB_HOMEWORKS = {
    first: 13,
    lastInclusive: 15
}

const GITHUB_HOMEWORKS = {
    first: 16,
    lastInclusive: constants.LAST_GITHUB_HOMEWORK
}

async function getGithubHomeworksData() {
    const list = []
    for (let i = GITHUB_HOMEWORKS.first; i <= GITHUB_HOMEWORKS.lastInclusive; i++) {
        list.push({
            number: i,
            result: await getHomeworkStatus(`lesson${i}-homework`, { cache: constants.ENABLE_CACHE })
        });
    }
    return list;
}

function toGithubProfileLink(text) {
    if (!text) return ""
    return `[@${text}](https://github.com/${text})`
}

function getEmojiForHomeworkResult(homeworkResult) {
    let emoji = "⚪"
    if (homeworkResult && homeworkResult.status) {
        if (homeworkResult.status == 'pending') {
            emoji = "🟡"
        } else if (homeworkResult.status == 'accepted') {
            emoji = "🟢"
        }
    }
    return emoji
}

function toPRLink(homeworkResult) {
    const emoji = getEmojiForHomeworkResult(homeworkResult)
    if (!homeworkResult || !homeworkResult.pull_url) return emoji
    return `[${emoji}](${homeworkResult.pull_url})`
}

function toHomeworkUrl(number) {
    return `[${number}](https://github.com/vshat-tms/lesson${number}-homework)`
}

export default async function buildHomeworkTable() {
    const studentsData = getStudentsData()
    const table = [
        ['Студент', 'Аккаунт']
    ];
    const tableHeaderRow = table[0];
    table.slice(1);

    studentsData.forEach(row => table.push(row))

    for (let i = PRE_GITHUB_HOMEWORKS.first; i <= PRE_GITHUB_HOMEWORKS.lastInclusive; i++) {
        tableHeaderRow.push(i)
        table.slice(1).forEach(row => {
            let emoji = "🟢"
            if (row[0] == "Мария Павловна") {
                emoji = "⚪"
            }
            row.push(emoji)
        })
    }

    const homeworksData = await getGithubHomeworksData()
    homeworksData.forEach(homeworkData => {
        tableHeaderRow.push(toHomeworkUrl(homeworkData.number))
        table.slice(1).forEach(row => {
            const nickname = row[STUDENTS_DATA_COLUMN_NICK_INDEX]
            const result = homeworkData.result[nickname]
            row.push(toPRLink(result))
        })
    })

    table.slice(1).forEach(row => {
        row[STUDENTS_DATA_COLUMN_NICK_INDEX]
            = toGithubProfileLink(row[STUDENTS_DATA_COLUMN_NICK_INDEX])
    })

    return markdownTable(table)
}