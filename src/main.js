import { toast } from "https://cdn.skypack.dev/wc-toast"
import countries from "./countries.json"
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill"
polyfillCountryFlagEmojis()

const $input = document.querySelector("#date")
const $result = document.querySelector("#result")

const setInitialDate = () => {
    const now = new Date()
    now.setMinutes(0, 0, 0)
    if (new Date().getMinutes() > 0) now.setHours(now.getHours() + 1)

    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16)

    $input.value = local
}
function changeTimeZone(date, timeZone) {
    const dateToUse = typeof date === "string" ? new Date(date) : date

    return new Date(
        dateToUse.toLocaleString("en-US", {
            timeZone,
        })
    )
}

const transformDateToString = (date) => {
    const localDate = date.toLocaleString("en-US", {
        weekday: "short",
        month: "2-digit",
        day: "numeric",
        hour12: false,
        hour: "numeric",
        minute: "numeric",
    })

    return localDate.replace(":00", " H")
}

const fillTextArea = () => {
    const date = $input.value

    const mainDate = new Date(date)

    const times = {}

    countries.forEach((country) => {
        const { country_code: code, emoji, timezones } = country
        const [timezone] = timezones

        const dateInTimezone = changeTimeZone(mainDate, timezone)
        const hour = dateInTimezone.getHours()

        times[hour] ??= []

        times[hour].push({
            date: dateInTimezone,
            code,
            emoji,
            timezones,
        })
    })

    const sortedTimesEntries = Object.entries(times).sort(
        ([timeA], [timeB]) => timeB + timeA
    )

    const html = sortedTimesEntries
        .map(([, countries]) => {
            const flags = countries
                .map((country) => `${country.emoji}`)
                .join(" ")
            const [country] = countries
            const { date } = country

            return `${transformDateToString(date)} | ${flags}`
        })
        .join("\n")

    $result.value = html
}

$input.addEventListener("change", () => {
    fillTextArea()

    if ($input.value === "") {
        const date = new Date(Date.now())
        $input.value = date.toISOString().slice(0, 16)
        fillTextArea()
    }

    toast("Ready to copy", {
        icon: {
            type: "custom",
            content: "📋",
        },
        theme: {
            type: "dark",
        },
    })
})

$result.addEventListener("click", () => {
    navigator.clipboard.writeText($result.value)
    toast("Copied to clipboard", { icon: { type: "success" } })
})

const onLoad = async () => {
    setInitialDate()
    fillTextArea()
    toast("Click on the result to copy", {
        icon: {
            type: "custom",
            content: "⌛",
        },
        duration: 2000,
    })
}

onLoad()
