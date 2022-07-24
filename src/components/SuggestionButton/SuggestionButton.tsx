//styles
import './SuggestionButton.styles.scss'

type SuggestionButtonProps = {
    suggestionLanguage: string
    translateBySuggestionLanguage: () => void
}

const SuggestionButton = ({ suggestionLanguage, translateBySuggestionLanguage }: SuggestionButtonProps) => {
    return (
        <div className="suggestion-container">
            <span className="suggestion-btn"
                onClick={translateBySuggestionLanguage}>traduzir do: <span className="lang-type">{suggestionLanguage}</span></span>
        </div>
    );
};

export default SuggestionButton;