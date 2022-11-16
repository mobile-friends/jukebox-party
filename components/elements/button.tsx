export default function Button({ text, type }) {
    return(
        <div>
            <button className={`btn ${type} block`}>{ text }</button>
        </div>
    )
}