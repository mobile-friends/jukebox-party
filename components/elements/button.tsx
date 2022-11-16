export default function Button({ text, type }) {
    return(
        <div>
            <button className={`btn ${type}`}>{ text }</button>
        </div>
    )
}