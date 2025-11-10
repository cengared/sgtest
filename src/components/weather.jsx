import { f7 } from "framework7-react"
import { CapacitorHttp } from "@capacitor/core"
import { OPEN_WEATHER_API_KEY } from "../../keys"

const apiRoot = "https://api.openweathermap.org"
const apiKey = OPEN_WEATHER_API_KEY
const pcRegex = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/

export async function getLocation(data) {
    const url = `${apiRoot}/geo/1.0`
    if (data.toUpperCase().match(pcRegex)) {
        const res = await CapacitorHttp.get({
            url: url + "/zip",
            params: { zip: data.split(" ")[0] + ",GB", appid: apiKey },
        })
        if (res.status !== 200 || !res.data) {
            f7.dialog.alert("Location not found")
            return "error"
        }
        return { lat: res.data.lat, lon: res.data.lon, name: res.data.name }
    } else {
        const res = await CapacitorHttp.get({
            url: url + "/direct",
            params: { q: data + ",GB", limit: 1, appid: apiKey },
        })
        if (res.data.length === 0) {
            f7.dialog.alert("Location not found")
            return "error"
        }
        return {
            lat: res.data[0].lat,
            lon: res.data[0].lon,
            name: res.data[0].name,
        }
    }
}

export async function getWeatherForecast(location) {
    const res = await CapacitorHttp.get({
        url: apiRoot + "/data/3.0/onecall",
        params: {
            lat: location.lat,
            lon: location.lon,
            appid: apiKey,
            units: "metric",
        },
    })
    if (res.status !== 200 || !res.data) {
        console.error(res)
        f7.dialog.alert("Weather data not found")
        return "error"
    }
    return res.data.daily.slice(1, 6)
}

export async function getWeatherOverview(location) {
    const res = await CapacitorHttp.get({
        url: apiRoot + "/data/3.0/onecall/overview",
        params: {
            lat: location.lat,
            lon: location.lon,
            appid: apiKey,
            units: "metric",
        },
    })
    if (res.status !== 200 || !res.data) {
        console.error(res)
        f7.dialog.alert("Weather data not found")
        return "error"
    }
    return res.data
}
