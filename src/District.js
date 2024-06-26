export default class District {
    constructor(districtDict) {
        const { props = {}, coordinates = {} } = districtDict;

        this.district = props.district ?? "Unnamed";
        this.county = props.county ?? "Unknown"
        this.metro_code = props.metro_code ?? "00"
        this.metro = props.metro ?? "No city";
        this.metro_id = props.metro_id ?? 0;
        this.state = props.state ?? "UN";
        this.year = props.year ?? "year unknown";
        this.coordinates = coordinates;
    }

    get name() {
        return `${this.metro_code}-${this.district}`
    }
}

export function districtDict(props, long, lat) {
    return ({ properties: props, coordinates: { longitude: long, latitude: lat } })
}
