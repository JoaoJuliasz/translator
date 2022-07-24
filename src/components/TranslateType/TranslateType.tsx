import { faFile, faLanguage } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './TranslateType.styles.scss'

type TranslateTypeProps = {
    isTranslateText: boolean
    setIsTranslateText: (value: boolean) => void
}

const TranslateType = ({isTranslateText, setIsTranslateText}: TranslateTypeProps) => {
    return (
        <div className="translate-type-container">
            <h2 className="title">Translator</h2>
            <div className="type-container">
                <button id="text-btn" className={`type-btn ${isTranslateText && 'translate-text'}`} onClick={() => setIsTranslateText(true)} ><FontAwesomeIcon icon={faLanguage} /> Translate text</button>
                <button id="file-btn" className={`type-btn ${!isTranslateText && 'translate-text'}`} onClick={() => setIsTranslateText(false)} ><FontAwesomeIcon icon={faFile} /> Translate document</button>
            </div>
        </div>
    );
};

export default TranslateType;