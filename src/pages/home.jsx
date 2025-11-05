import { useEffect, useState } from "react"
import {
    Block,
    BlockTitle,
    Button,
    List,
    ListInput,
    Navbar,
    Page,
} from "framework7-react"
import { getLocation, getWeather } from "../components/weather"

const HomePage = () => {
    const [address, setAddress] = useState("")
    const [location, setLocation] = useState(null)
    const [forecast, setForecast] = useState(null)

    useEffect(() => {
        if (location && !forecast) {
            getWeather(location).then((r) => setForecast(r))
        }
        if (forecast) console.log(forecast)
    }, [forecast, location])

    return (
        <Page name="home">
            <Navbar title="Weather App" sliding="{false}"></Navbar>
            {/* Page content */}
            <Block>
                <p>How is the weather where you are today?</p>
            </Block>

            <BlockTitle>Enter location</BlockTitle>
            <List strongIos outlineIos>
                <ListInput
                    type="text"
                    placeholder="Enter town, city or postcode"
                    onChange={(e) => setAddress(e.target.value)}
                ></ListInput>
                <Block outlineIos className="grid grid-cols-4 grid-gap">
                    <Button
                        small
                        round
                        fill
                        onClick={() => {
                            getLocation(address).then((r) => setLocation(r))
                        }}
                        disabled={!address}
                    >
                        Submit
                    </Button>
                    <Button
                        small
                        round
                        outline
                        onClick={() => {
                            setAddress("")
                            setLocation(null)
                            setForecast(null)
                        }}
                    >
                        Clear
                    </Button>
                    {/* <Button small round>
                        Auto
                    </Button> */}
                </Block>
            </List>
        </Page>
    )
}
export default HomePage
