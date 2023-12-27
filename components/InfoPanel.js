import District from '/src/District';


export default function InfoPanel({ districtDict }) {
    let dist = new District(districtDict)
    return (
        <div>{dist.name}</div>
    )
}
