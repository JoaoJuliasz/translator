import React, { useState, useRef, useEffect } from 'react';
import { StarOutlined, CloseOutlined, CopyOutlined, StarFilled } from '@ant-design/icons';

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
    favorites?: { textToTranslate: string, translatedText: string, sourceLang: Language, targetLang: Language }
    setTextToTranslate?: (value: string) => void
    setTranslatedText?: (value: string) => void
    setSuggestionLanguage?: (value: string) => void
    setLoading?: (value: boolean) => void
    callTranslate?: (searchText: string, sourceLang?: string, targetLang?: string) => void
}

const TranslatorTextArea = ({ textToTranslate, translatedText, suggestionLanguage, selectedTranslateLanguage,
    placeholder, loading, favorites, setTextToTranslate, setTranslatedText, setSuggestionLanguage, setLoading, callTranslate }: TranslatorTextAreaProps) => {

    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)
    const [favorited, setFavorited] = useState<boolean>(false)

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
    }

    const addToFavorite = () => {
        const savedFavorites = localStorage.getItem('favorites')
        const favoritesArr = savedFavorites ? JSON.parse(savedFavorites) : []
        const favoriteIndex = favoritesArr.findIndex((favorite: { translatedText: string }) => favorite.translatedText === translatedText)

        if (translatedText) {
            if (favoriteIndex > -1) {
                favoritesArr.splice(favoriteIndex, 1)
            } else {
                favoritesArr.push(favorites)
            }
            localStorage.setItem('favorites', JSON.stringify(favoritesArr))
        }
        isTextFavorited()
    }

    const isTextFavorited = () => {
        const savedFavorites = localStorage.getItem('favorites')
        const favoritesArr = savedFavorites && JSON.parse(savedFavorites)
        const favoriteIndex = favoritesArr?.findIndex((favorite: { translatedText: string }) => favorite.translatedText === translatedText)
        setFavorited(favoriteIndex > -1 ? true : false)
    }

    useEffect(() => {
        isTextFavorited()
    }, [translatedText])

    return (
        <div className={`translator-text-area-container ${callTranslate ? 'right' : 'left'}`}>
            <textarea ref={textAreaRef} placeholder={placeholder} className="translator-text-area"
                value={textToTranslate ?? translating()}
                onChange={event => callTranslate && translate(event)}
            />
            {textToTranslate &&
                <CloseOutlined className="close-icon" onClick={() => {
                    setTextToTranslate && setTextToTranslate('')
                    setTranslatedText && setTranslatedText('')
                    suggestionLanguage && setSuggestionLanguage && setSuggestionLanguage('')
                }} />}
            {translatedText &&
                <div className="buttons-container">
                    <div onClick={copyLink} className="copy-container">
                        <CopyOutlined className="icon" />
                    </div>
                    <div>
                        {!favorited ? <StarOutlined onClick={addToFavorite} className="icon" />
                            :
                            <StarFilled style={{color: 'yellow'}} onClick={addToFavorite} className="icon" />
                        }
                    </div>
                </div>
            }
        </div >
    );
};

export default TranslatorTextArea;  