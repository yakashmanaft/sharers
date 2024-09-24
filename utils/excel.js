import LAY_EXCEL from "lay-excel";
import { TinyColor } from "@ctrl/tinycolor";

// Преобразование шестнадцатеричного числа в десятичное
var ConvertNum = function (str) {
  var n = 0;
  var s = str.match(/./g); // Найти массив символов
  var j = 0;
  for (var i = str.length - 1, j = 1; i >= 0; i--, j *= 26) {
    var c = s[i].toUpperCase();
    if (c < "A" || c > "Z") {
      return 0;
    }
    n += (c.charCodeAt(0) - 64) * j;
  }
  return n;
};

// Преобразовать десятичное число в шестнадцатеричное
var Convert26 = function (num) {
  var str = "";
  while (num > 0) {
    var m = num % 26;
    if (m == 0) {
      m = 26;
    }
    str = String.fromCharCode(m + 64) + str;
    num = (num - m) / 26;
  }
  return str;
};

// Обработать шестнадцатеричное сокращенное значение цвета и вернуть 6 цифр.
const transColor = (val) => {
  const color = new TinyColor(val).toHexString();
  return color.substring(1);
};

export function exportExcel(
  file,
  rangeDate,
  list,
  dateText = "",
  itemText = ""
) {
  const { fileName = "数据" } = file;
  console.log("导出excel", rangeDate, list);
  // Первые три строки диапазона дат
  let data = [];
  const headArr = [{ name: `${dateText}-${itemText}` }, {}, {}];
  const headKeys = ["name"];
  let monthMerageConfig = [];
  const templateLine = { name: "" };
  rangeDate.forEach((item) => {
    item.forEach((day) => {
      headArr[0][
        `${day.year}-${day.month}-${day.day}`
      ] = `${day.year}-${day.month}`;
      headArr[1][`${day.year}-${day.month}-${day.day}`] = day.day;
      headArr[2][`${day.year}-${day.month}-${day.day}`] = day.week;
      headKeys.push(`${day.year}-${day.month}-${day.day}`);

      templateLine[`${day.year}-${day.month}-${day.day}`] = "";
    });
    // Рассчитать верхний диапазон месяца
    const prev = monthMerageConfig.at(-1)
      ? Convert26(ConvertNum(monthMerageConfig.at(-1).at(-1)))
      : "A";
    const end = Convert26(ConvertNum(prev) + item.length);
    monthMerageConfig.push([Convert26(ConvertNum(prev) + 1), end]);
  });
  // Обработать индекс диапазона верхнего месяца
  monthMerageConfig = monthMerageConfig.map((item) => {
    item = item.map((index) => index + 1);
    return item;
  });
  data = data.concat(headArr);

  const totalDays = headKeys.length - 1;

  // Перебирать столбцы данных
  list.forEach((item) => {
    const tmp = JSON.parse(JSON.stringify(templateLine));
    tmp.name = item.name;
    tmp.type = item.type;
    tmp.renderWorks = item.renderWorks;
    data.push(tmp);
  });

  const dataMergeConfig = [];
  /**
   * Запишите стиль ячейки, который необходимо установить.
   * {
   *  type: 1,  // 1 Установить цвет фона, цвет текста
   *  backgroundColor, textColor: установленное значение
   *  range: Диапазон настройки
   * }
   */
  const setStyleList = [];
  data.forEach((item, index) => {
    // excel количество строк в
    const currentLine = index + 1;
    // Данные, которые по умолчанию занимают всю строку
    if (item.type === "alike") {
      dataMergeConfig.push([
        `B${currentLine}`,
        `${Convert26(totalDays + 1)}${currentLine}`,
      ]);
      // Установить цвет фона ячейки
      setStyleList.push({
        type: 1,
        backgroundColor: "F6F6F6",
        range: `A${currentLine}:${Convert26(totalDays + 1)}${currentLine}`,
      });
    } else if (item.renderWorks) {
      item.renderWorks.forEach((renderItem) => {
        if (renderItem.type === "works") {
          // Начальная позиция текущего расписания
          const startFindIndex = headKeys.findIndex(
            (headItem) => headItem === renderItem.days[0]
          );
          const startIndex = Convert26(
            (startFindIndex < 1 ? 1 : startFindIndex) + 1
          );
          // Конечная позиция текущего расписания
          const endFIndIndex = headKeys.findIndex(
            (headItem) => headItem === renderItem.days.at(-1)
          );
          const endIndex = Convert26(
            (endFIndIndex < 1 ? headKeys.length - 1 : endFIndIndex) + 1
          );
          // Обработка слияния ячеек
          dataMergeConfig.push([
            `${startIndex}${currentLine}`,
            `${endIndex}${currentLine}`,
          ]);
          // Установить цвет фона ячейки
          setStyleList.push({
            type: 1,
            backgroundColor: renderItem.backgroundColor.replace("#", ""),
            textColor: renderItem.textColor.replace("#", ""),
            range: `${startIndex}${currentLine}:${endIndex}${currentLine}`,
          });
          // Установить содержимое ячейки
          renderItem.days.forEach((day) => {
            data[currentLine - 1][day] = renderItem.name;
          });
        }
      });
    }
  });

  const merageConfig = [["A1", "A3"], ...monthMerageConfig, ...dataMergeConfig];
  // console.log('merageConfig--->', merageConfig, dataMergeConfig)
  // console.log('data--->', data)
  const resultData = LAY_EXCEL.filterExportData(data, headKeys);
  const mergeConf = LAY_EXCEL.makeMergeConfig(merageConfig);
  const colConf = LAY_EXCEL.makeColConfig({ A: 120, ZZZZ: 60 }, 60);
  const rowConf = LAY_EXCEL.makeRowConfig({ 1: 40, 99999: 40 }, 40);

  LAY_EXCEL.setExportCellStyle(resultData, null, {
    s: {
      alignment: { horizontal: "center", vertical: "center", wrapText: true },
      border: {
        top: { style: "thin", color: { rgb: "E2E4E8" } },
        left: { style: "thin", color: { rgb: "E2E4E8" } },
        right: { style: "thin", color: { rgb: "E2E4E8" } },
        bottom: { style: "thin", color: { rgb: "E2E4E8" } },
      },
    },
  });

  // Пакетное применение стилей ячеек
  setStyleList.forEach((item) => {
    if (item.type === 1) {
      LAY_EXCEL.setExportCellStyle(resultData, item.range, {
        s: {
          fill: {
            bgColor: { indexed: 64 },
            fgColor: { rgb: transColor(item.backgroundColor || "FFFFFF") },
          },
          font: { color: { rgb: transColor(item.textColor || "000000") } },
          border: {
            top: { style: "thin", color: { rgb: "E2E4E8" } },
            left: { style: "thin", color: { rgb: "E2E4E8" } },
            right: { style: "thin", color: { rgb: "E2E4E8" } },
            bottom: { style: "thin", color: { rgb: "E2E4E8" } },
          },
          alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true,
          },
        },
      });
    }
  });

  // console.log(resultData)
  // return
  LAY_EXCEL.exportExcel({ sheet1: resultData }, `${fileName}.xlsx`, "xlsx", {
    extend: {
      "!cols": colConf,
      "!rows": rowConf,
      "!merges": mergeConf,
    },
  });
}
