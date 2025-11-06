import { useEffect, useState } from "react"
import {
    f7,
    Block,
    BlockTitle,
    Button,
    Link,
    List,
    ListInput,
    Navbar,
    NavRight,
    Page,
    Popup,
} from "framework7-react"
import {
    getLocation,
    getWeatherForecast,
    getWeatherOverview,
} from "../components/weather"

const HomePage = () => {
    const [address, setAddress] = useState("")
    const [location, setLocation] = useState(null)
    const [forecast, setForecast] = useState(null)
    const [overview, setOverview] = useState(null)
    const [popupOpened, setPopupOpened] = useState(false)

    useEffect(() => {
        if (location && location !== "error" && !forecast) {
            getWeatherForecast(location).then((r) => {
                setForecast(r)
            })
            getWeatherOverview(location).then((r) => {
                setOverview(r)
            })
        }
        if (forecast || overview || location === "error") {
            f7.dialog.close()
        }
    }, [forecast, location, overview])

    return (
        <Page name="home">
            <Navbar title="Weather App" sliding="{false}"></Navbar>
            {/* Page content */}

            {overview && overview.weather_overview ? (
                <Block>
                    <BlockTitle>{`Weather for ${location.name}`}</BlockTitle>
                    <p>{overview.weather_overview}</p>
                </Block>
            ) : (
                <Block>
                    <p>How is the weather where you are today?</p>
                </Block>
            )}

            {forecast && (
                <Block className="grid grid-cols-2 grid-gap">
                    <Button round fill popupOpen=".forecast-popup">
                        5 Day Forecast
                    </Button>
                </Block>
            )}

            <BlockTitle>Enter location</BlockTitle>
            <List strongIos form formStoreData>
                <ListInput
                    id="addressInput"
                    type="text"
                    placeholder="Enter town, city or postcode"
                    onChange={(e) => setAddress(e.target.value)}
                    clearButton
                ></ListInput>
                <Block className="grid grid-cols-4 grid-gap">
                    <Button
                        round
                        fill
                        onClick={() => {
                            f7.dialog.preloader()
                            getLocation(address).then((r) => setLocation(r))
                        }}
                        disabled={!address}
                    >
                        Submit
                    </Button>
                    <Button
                        round
                        outline
                        onClick={() => {
                            setAddress("")
                            setLocation(null)
                            setForecast(null)
                            setOverview(null)
                        }}
                    >
                        Clear
                    </Button>
                </Block>
            </List>

            <Popup
                className="forecast-popup"
                opened={popupOpened}
                onPopupClosed={() => setPopupOpened(false)}
            >
                <Page>
                    <Navbar title="Next 5 Days Summary">
                        <NavRight>
                            <Link popupClose>Close</Link>
                        </NavRight>
                    </Navbar>
                    <Block>
                        {forecast &&
                            forecast.map((f, id) => {
                                return (
                                    <Block key={id} strongIos>
                                        <p>
                                            {new Date(
                                                f.dt * 1000
                                            ).toLocaleDateString()}
                                        </p>
                                        <p>{`High: ${f.temp.max.toFixed(0)}°C; 
                                        Low: ${f.temp.min.toFixed(0)}°C; 
                                        Feels like: ${f.feels_like.day.toFixed(
                                            0
                                        )}°C`}</p>
                                        <p>{f.summary}</p>
                                    </Block>
                                )
                            })}
                    </Block>
                </Page>
            </Popup>
        </Page>
    )
}
export default HomePage
