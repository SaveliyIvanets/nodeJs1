const fs = require("fs");
const path = require("path");
async function dataToJson(params) {}

fs.readFile("data.html", (error, data) => {
  if (error) {
    console.log("Ошибка! Файл data.html не найден!");
    return;
  }
  let ndArray = data
    .toString()
    .match(/nd=(\d+)(.*?)>/gs)
    .map((td) => +td.slice(3, -2));
  let dataArray = data
    .toString()
    .match(/<td class="table_body_text">(.*?)<\/td>/gs)
    .map((td) => td.replace(/<[^>]+>/g, "").trim());
  let jsonArray = [];
  for (let i = 0; i < dataArray.length; i += 5) {
    jsonArray.push(
      dataToJSON(
        ndArray[i / 5],
        dataArray[i],
        dataArray[i + 1]
          .split("\r\n")
          .map((elem) => `${elem.trim()} `)
          .join("")
          .slice(0, -1),
        dataArray[i + 2],
        dataArray[i + 3],
        dataArray[i + 4]
          .split("\r\n")
          .map((elem) => `${elem.trim()} `)
          .join("")
          .slice(0, -1)
      )
    );
  }

  fs.stat(path.resolve("result"), (err) => {
    if (err) {
      console.log("Ошибка каталог result не найден!");
      fs.mkdir("result", (err) => {
        if (err) {
          console.log("Ошибка! каталог result не создан!");
        } else {
          console.log("Каталог result создан!");
        }
        loadData(jsonArray);
      });
    } else {
      loadData(jsonArray);
    }
  });
});

function loadData(jsonArray) {
  let jsonPath;
  let fileName;
  let k = -1;
  for (let json of jsonArray) {
    k++;
    fileName = `${k}_${new Date()
      .toLocaleString("ru-Ru")
      .replace(", ", "_")
      .replaceAll(":", "-")}.json`;
    jsonPath = path.resolve("result", fileName);
    fs.writeFile(jsonPath, JSON.stringify(json), (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
}
function dataToJSON(
  nd,
  valNum,
  name,
  orderNum,
  dateImplementation,
  responsible
) {
  let result = {};
  result.nd = nd;
  result.valNum = valNum;
  result.name = name;
  result.orderNum = orderNum;
  result.dateImplementation = dateImplementation;
  result.responsible = responsible;
  return result;
}
