import React from "react"
import { CapacitorHttp } from "@capacitor/core"

const apiRoot = "http://api.openweathermap.org"
const apiKey = "f0b167ecf74a4ffedec09cb0ca81cafa"
const pcRegex = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/

export async function getLocation(data) {
    const url = `${apiRoot}/geo/1.0`
    if (data.toUpperCase().match(pcRegex)) {
        const res = await CapacitorHttp.get({
            url: url + "/zip",
            params: { zip: data.split(" ")[0] + ",GB", appid: apiKey },
        })
        return { lat: res.data.lat, lon: res.data.lon }
    } else {
        const res = await CapacitorHttp.get({
            url: url + "/direct",
            params: { q: data, limit: 1, appid: apiKey },
        })
        return { lat: res.data[0].lat, lon: res.data[0].lon }
    }
}

export async function getWeather(location) {
    console.log(location)
    const res = await CapacitorHttp.get({
        url: apiRoot + "/data/3.0/onecall",
        params: { lat: location.lat, lon: location.lon, appid: apiKey },
    })
    console.log(res)
}

export async function getDeviceLocation() {}
