export default class District {
    constructor(districtDict) {
        const { props, coordinates } = districtDict;

        if (props && coordinates) {
            // console.log("props:", props)
            this.name = props.district ?? "Unnamed";
            this.city = props.city ?? "No city";
            this.year = props.year ?? "year unknown";
            this.coordinate = coordinates;
        }
    }
}
