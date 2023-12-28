export default class District {
    constructor(districtDict) {
        const { props = {}, coordinates = {} } = districtDict;

        this.district = props.district ?? "Unnamed";
        this.metro_code = props.metro_code ?? "00"
        this.metro = props.city ?? "No city";
        this.year = props.year ?? "year unknown";
        this.coordinates = coordinates;
    }

    get name() {
        return `${this.metro_code}-${this.district}`
    }
}
