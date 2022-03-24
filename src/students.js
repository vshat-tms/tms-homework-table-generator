export const STUDENTS_DATA_COLUMN_NAME_INDEX = 0;
export const STUDENTS_DATA_COLUMN_NICK_INDEX = 1;

const STUDENTS_DATA = Object.freeze([
    ["Вадим Сергеевич", "UlasevichVadim"],
    ["Кирилл Олегович", "PolichF1"],
    ["Сергей Николаевич", "VovoZozo"],
    ["Дмитрий Валерьевич", "DmitriyGotovko"],
    ["Антон Вадимович", "antonfcss"],
    ["Илья Родионович", "GansA11es"],
    ["Пётр Валерьевич", "PetrGrebnev"],
    ["Виктория Максимовна", "fuchsjagd"],
    ["Степан Ярмошин", "KrasavaStep"],
    ["Мария Павловна", null]
]);

export function getStudentsData() {
    return JSON.parse(JSON.stringify(STUDENTS_DATA))
}

export function getStudentsDataNicknames() {
    return STUDENTS_DATA
        .map(row => row[STUDENTS_DATA_COLUMN_NICK_INDEX])
        .filter(nick => nick)
}

