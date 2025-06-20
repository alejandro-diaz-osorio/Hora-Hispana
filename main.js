import { toast } from "https://cdn.skypack.dev/wc-toast";
import { $, setInitialDate } from "./utils.js";
import countries from "./countries.json";
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";

polyfillCountryFlagEmojis();

const $input = document.querySelector("input");
const $result = document.querySelector("#result");

function changeTimeZone(date, timeZone) {
  const dateToUse = typeof date === "string" ? new Date(date) : date;
  return new Date(dateToUse.toLocaleString("en-US", { timeZone }));
}

const transformDateToString = (date) => {
  const localDate = date.toLocaleString("es-CO", {
    hour12: false,
    hour: "numeric",
    minute: "numeric",
  });

  return localDate.replace(":00", "H");
};
