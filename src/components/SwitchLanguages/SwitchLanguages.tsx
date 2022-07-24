//libs
import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

//styles
import './SwitchLanguages.styles.scss'

type SwitchLanguagesProps = {
    changeSourceAndTargetLanguages: () => void
}

const SwitchLanguages = ({changeSourceAndTargetLanguages}: SwitchLanguagesProps) => {
    return (
        <div className="switch-lang-container">
            <button className="switch-lang-btn" onClick={changeSourceAndTargetLanguages}><FontAwesomeIcon icon={faArrowRightArrowLeft} /></button>
        </div>
    );
};

export default SwitchLanguages;