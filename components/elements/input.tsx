export default function Input({ placeholder }) {
    return(
        <div>
            <input placeholder={`${placeholder}`} className="block"></input>
        </div>
    )
}