import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faXmark } from '@fortawesome/free-solid-svg-icons'

//styles
import './TranslatorTextArea.styles.scss'

type TranslatorTextAreaProps = {
    textToTranslate?: string
    translatedText?: string
    suggestionLanguage?: string
    placeholder: string
    loading?: boolean
    setTextToTranslate?: (value: string) => void
    setTranslatedText?: (value: string) => void
    setSuggestionLanguage?: (value: string) => void
    translate?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
}

const TranslatorTextArea = ({ textToTranslate, translatedText, suggestionLanguage, placeholder, loading, setTextToTranslate, setTranslatedText, setSuggestionLanguage, translate }: TranslatorTextAreaProps) => {

    const [copied, setCopied] = useState<boolean>(false)

    const textAreaRef = useRef<HTMLTextAreaElement | null>(null)

    const translating = () => {
        if (loading && translatedText) {
            return translatedText + '...'
        }
        return translatedText
    }

    const copyLink = (e: any) => {
        textAreaRef.current?.select();
        document.execCommand("copy");
        e.target.focus();
        setCopied(true)
    }


    useEffect(() => {
        setCopied(false)
    }, [textToTranslate, translatedText])

    return (
        <div className="translator-text-area-container">
            <textarea ref={textAreaRef} placeholder={placeholder} className="translator-text-area"
                value={textToTranslate ?? translating()}
                onChange={event => translate && translate(event)}
            />
            {textToTranslate &&
                <FontAwesomeIcon icon={faXmark} className="close-icon" onClick={() => {
                    setTextToTranslate && setTextToTranslate('')
                    setTranslatedText && setTranslatedText('')
                    suggestionLanguage && setSuggestionLanguage && setSuggestionLanguage('')
                }} />}
            {translatedText &&
                <div onClick={copyLink} className="copy-container">
                    <span>{copied ? 'copied' : 'copy'}</span>
                    <FontAwesomeIcon icon={faCopy} className="copy-icon" />
                </div>
            }
        </div >
    );
};

export default TranslatorTextArea;  