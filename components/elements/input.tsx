import '../../styles/components/input.module.scss';

export default function Input({ placeholder }) {
    return(
        <div>
            <input className={'input block'} placeholder={`${placeholder}`}></input>
        </div>
    )
}