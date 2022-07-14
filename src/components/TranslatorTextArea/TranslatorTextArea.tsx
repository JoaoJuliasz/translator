import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faXmark } from '@fortawesome/free-solid-svg-icons'

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
        <div style={{ position: 'relative', background: '#343434', boxShadow: '0 0 1em #1b1b18', borderRadius: '10px', }}>
            <textarea ref={textAreaRef} placeholder={placeholder} style={{ width: '450px', height: '250px', resize: 'none', border: 'none', background: 'transparent', outline: 'none', color: '#fff', fontSize: '20px', padding: '7px' }}
                value={textToTranslate ?? translating()}
                onChange={event => translate && translate(event)}
            />
            {textToTranslate &&
                <FontAwesomeIcon icon={faXmark} style={{ cursor: 'pointer', position: 'absolute', top: '10px', right: '20px', color: '#fff', fontSize: '23px' }} onClick={() => {
                    setTextToTranslate && setTextToTranslate('')
                    setTranslatedText && setTranslatedText('')
                    suggestionLanguage && setSuggestionLanguage && setSuggestionLanguage('')
                }} />}
            {translatedText &&
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    position: 'absolute',
                    bottom: '20px',
                    right: '10px',
                    width: '100px',
                    color: '#6e6e6e',
                    fontSize: '17px'
                }}>
                    <span>{copied ? 'copied' : 'copy'}</span>
                    {/* <Copy   /> */}
                    <FontAwesomeIcon onClick={copyLink} icon={faCopy} style={{ cursor: 'pointer' }} />
                </div>
            }
        </div >
    );
};

export default TranslatorTextArea;  