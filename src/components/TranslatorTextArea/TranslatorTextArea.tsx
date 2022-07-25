import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faXmark } from '@fortawesome/free-solid-svg-icons'

import instance from "../../config/config";

//styles
import './TranslatorTextArea.styles.scss'
import { Language } from '../../types/types';

type TranslatorTextAreaProps = {
    textToTranslate?: string
    translatedText?: string
    suggestionLanguage?: string
    selectedTranslateLanguage?: Language
    placeholder: string
    loading?: boolean
    setTextToTranslate?: (value: string) => void
    setTranslatedText?: (value: string) => void
    setSuggestionLanguage?: (value: string) => void
    setLoading?: (value: boolean) => void
    callTranslate?: (searchText: string, sourceLang?: string, targetLang?: string) => void
}

const TranslatorTextArea = ({ textToTranslate, translatedText, suggestionLanguage, selectedTranslateLanguage,
    placeholder, loading, setTextToTranslate, setTranslatedText, setSuggestionLanguage, setLoading, callTranslate }: TranslatorTextAreaProps) => {

    const [copied, setCopied] = useState<boolean>(false)
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

    const textAreaRef = useRef<HTMLTextAreaElement | null>(null)

    const translate = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLoading && setLoading(true)
        let searchText = event.target.value;
        if (timer) {
            clearTimeout(timer);
        }

        const newTimer = setTimeout(() => {
            detectLanguage()
            callTranslate && callTranslate(searchText)
        }, 500)

        setTimer(newTimer)
        setTextToTranslate && setTextToTranslate(searchText)

        const detectLanguage = () => {
            instance.post('detect', {
                q: searchText,
            })
                .then(res => {
                    const { language, confidence } = res.data[0]
                    if (language !== selectedTranslateLanguage && confidence > 70) {
                        setSuggestionLanguage && setSuggestionLanguage(language)
                    }
                })
        }
    }

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
                onChange={event => callTranslate && translate(event)}
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