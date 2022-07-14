import axios from "axios";
import { useEffect, useState } from "react";
//Libs
//@ts-ignore
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons'
// @ts-ignore
import { ValueType } from "react-select/lib/types";
import Select from 'react-select'

//Components
import Loader from "../Loader/Loader";
import TranslatorTextArea from '../TranslatorTextArea/TranslatorTextArea';

type ReceivedLanguage = {
    code: string
    name: string
}

type Language = {
    label: string
    value: string
}

type SelectedLanguage = string

const Container = () => {

    const [languages, setLanguages] = useState<Language[] | null>(null)
    const [selectedTranslateLanguage, setSelectedTranslateLanguage] = useState<Language>({ value: 'en', label: 'English' })
    const [selectedLanguageToTranslate, setSelectedLanguageToTranslate] = useState<Language>({ value: 'pt', label: 'Portuguese' })
    const [suggestionLanguage, setSuggestionLanguage] = useState<SelectedLanguage>('')
    const [textToTranslate, setTextToTranslate] = useState<string>('')
    const [translatedText, setTranslatedText] = useState<string>('')
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const callTranslate = (searchText: string, sourceLang?: SelectedLanguage, targetLang?: SelectedLanguage) => {
        axios.post('https://libretranslate.de/translate', {
            q: searchText,
            source: sourceLang ?? selectedTranslateLanguage.value,
            target: targetLang ?? selectedLanguageToTranslate.value,
            format: "text"
        })
            .then(res => {
                setTranslatedText(res.data.translatedText)
                setLoading(false)
            })
            .catch(err => {
                setTranslatedText('')
                setTextToTranslate('')
                suggestionLanguage && setSuggestionLanguage('')
                setLoading(false)
            })
    }


    const translate = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLoading(true)
        let searchText = event.target.value;
        if (timer) {
            clearTimeout(timer);
        }

        const newTimer = setTimeout(() => {
            detectLanguage()
            callTranslate(searchText)
        }, 500)

        setTimer(newTimer)
        setTextToTranslate(searchText)

        const detectLanguage = () => {
            axios.post('https://libretranslate.de/detect', {
                q: searchText,
            })
                .then(res => {
                    const { language, confidence } = res.data[0]
                    if (language !== selectedTranslateLanguage && confidence > 70) {
                        setSuggestionLanguage(language)
                    }
                })
        }
    }

    const translateBySuggestionLanguage = () => {
        setLoading(true)
        const newLanguageToTranslate = selectedTranslateLanguage
        const suggestedLanguage = languages?.find(language => language.value === suggestionLanguage)
        setSelectedTranslateLanguage(prev => suggestedLanguage ?? newLanguageToTranslate)
        setSelectedLanguageToTranslate(prev => newLanguageToTranslate)
        callTranslate(textToTranslate, suggestionLanguage, newLanguageToTranslate.value)
        setSuggestionLanguage('')
    }

    const changeSourceAndTargetLanguages = () => {
        const newTranslateLanguage = selectedLanguageToTranslate
        const newLanguageToTranslate = selectedTranslateLanguage
        const newTextToTranslate = translatedText
        setLoading(true)
        setSelectedTranslateLanguage(newTranslateLanguage)
        setSelectedLanguageToTranslate(newLanguageToTranslate)
        setTextToTranslate(newTextToTranslate)
        callTranslate(translatedText, newTranslateLanguage.value, newLanguageToTranslate.value)
    }

    const selectTranslateLanguage = (option: ValueType<Language>) => {
        setSelectedTranslateLanguage(option)
    }

    const selectLanguageToTranslate = (option: ValueType<Language>) => {
        setSelectedLanguageToTranslate(option)
    }

    const selectStyle = {
        control: (styles: any) => ({ ...styles, background: '#343434' }),
        singleValue: (styles: any) => ({ ...styles, color: '#fff' }),
        menuList: (styles: any) => ({ ...styles, background: '#343434', color: '#fff' }),
        option: (styles: any, state: any) => ({ ...styles, background: state.isSelected ? '#525151' : (state.isFocused && '#676565') }),
    }


    useEffect(() => {
        axios.get('https://libretranslate.de/languages')
            .then(res => {
                const newLanguages: Language[] = []
                res.data?.forEach((language: ReceivedLanguage) => {
                    newLanguages.push({ label: language.name, value: language.code })
                })
                setLanguages(newLanguages)
            })
    }, [])

    return (
        <div style={{ display: 'flex', justifyContent: 'space-around', margin: 'auto', width: '80%' }}>
            <div style={{ position: 'relative' }}>
                <div style={{ margin: '15px' }}>
                    <Select styles={selectStyle} options={languages ?? []}
                        value={selectedTranslateLanguage}
                        onChange={selectTranslateLanguage}
                    />
                </div>
                <div style={{ position: 'relative', background: '#343434', boxShadow: '0 0 1em #1b1b18', borderRadius: '10px', }}>
                    <TranslatorTextArea textToTranslate={textToTranslate} suggestionLanguage={suggestionLanguage} placeholder={"Digitar algo"} setTextToTranslate={setTextToTranslate} setTranslatedText={setTranslatedText} setSuggestionLanguage={setSuggestionLanguage} translate={translate} />
                </div>
                {suggestionLanguage && <div>
                    <span
                        style={{
                            position: 'absolute',
                            bottom: '20px',
                            left: '12px',
                            cursor: 'pointer',
                            color: '#fff',
                            borderRadius: '25px',
                            background: '#4a4949',
                            padding: '10px',
                            fontSize: '13px'
                        }}
                        onClick={translateBySuggestionLanguage}>traduzir do: <span style={{ fontWeight: 'bold' }}>{suggestionLanguage}</span></span>
                </div>}
            </div>
            <div>
                <button style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    top: '20px',
                    fontSize: '18px'
                }} onClick={changeSourceAndTargetLanguages}><FontAwesomeIcon icon={faArrowRightArrowLeft} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ margin: '15px' }}>
                    <Select styles={selectStyle} options={languages?.filter(language => language.value !== selectedTranslateLanguage.value) ?? []}
                        value={selectedLanguageToTranslate} onChange={selectLanguageToTranslate} />
                </div>
                <div style={{ position: 'relative', background: '#343434', boxShadow: '0 0 1em #1b1b18', borderRadius: '10px', }}>
                    <TranslatorTextArea translatedText={translatedText} placeholder={loading ? 'Traduzindo...' : "Tradução"} loading={loading} />
                </div>
            </div>
        </div>
    );
};

export default Container;