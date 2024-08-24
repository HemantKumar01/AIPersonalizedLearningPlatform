import axios from "axios";

function translate(text, toLang) {
  return new Promise((resolve, reject) => {
    axios.defaults.baseURL = "http://localhost:5000";

    axios({
      method: "POST",
      url: "/api/translate",
      data: { text, toLang },
      withCredentials: false,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        console.log("Error Translating:", err);
        resolve(text);
      });
  });
}

async function translateObj(obj, toLang, final_arr = []) {
  return new Promise(async (resolve, reject) => {
    resolve(obj);
  });
}

async function translateLocalStorage(key, toLang) {
  let itm = JSON.parse(localStorage.getItem(key)) || {};
  translateObj(itm, toLang).then((data) => {
    localStorage.setItem(key, data);
  });
}

export { translate, translateObj, translateLocalStorage };
