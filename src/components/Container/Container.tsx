import { useEffect, useState } from "react";
//Libs
// @ts-ignore
import { ValueType } from "react-select/lib/types";
//utils
import instance from "../../config/config";
import { Language } from "../../types/types";

//Components
import TranslatorTextArea from '../TranslatorTextArea/TranslatorTextArea';
import SuggestionButton from "../SuggestionButton/SuggestionButton";
import SwitchLanguages from "../SwitchLanguages/SwitchLanguages";
import SelectLanguage from "../SelectLanguage/SelectLanguage";
import TranslateType from '../TranslateType/TranslateType'
import FileTranslator from "../FileTranslator/FileTranslator";

//styles
import './Container.styles.scss';

type ReceivedLanguage = {
    code: string
    name: string
}

type SelectedLanguage = string

const Container = () => {

    const [languages, setLanguages] = useState<Language[] | null>(null)
    const [selectedTranslateLanguage, setSelectedTranslateLanguage] = useState<Language>({ value: 'en', label: 'English' })
    const [selectedLanguageToTranslate, setSelectedLanguageToTranslate] = useState<Language>({ value: 'pt', label: 'Portuguese' })
    const [suggestionLanguage, setSuggestionLanguage] = useState<SelectedLanguage>('')
    const [textToTranslate, setTextToTranslate] = useState<string>('')
    const [translatedText, setTranslatedText] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [isTranslateText, setIsTranslateText] = useState<boolean>(true)

    const callTranslate = (searchText: string, sourceLang?: SelectedLanguage, targetLang?: SelectedLanguage) => {
        instance.post('translate', {
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

    const translateBySuggestionLanguage = () => {
        setLoading(true)
        const newLanguageToTranslate = selectedTranslateLanguage
        const suggestedLanguage = languages?.find(language => language.value === suggestionLanguage)
        setSelectedTranslateLanguage(prev => suggestedLanguage ?? newLanguageToTranslate)
        if (suggestedLanguage?.value === selectedLanguageToTranslate.value) {
             setSelectedLanguageToTranslate(prev => newLanguageToTranslate)
        }
        setSuggestionLanguage('')
        callTranslate(textToTranslate, suggestionLanguage, newLanguageToTranslate.value)
    }

    const changeSourceAndTargetLanguages = () => {
        const newTranslateLanguage = selectedLanguageToTranslate
        const newLanguageToTranslate = selectedTranslateLanguage
        const newTextToTranslate = translatedText
        setLoading(true)
        setSelectedTranslateLanguage(newTranslateLanguage)
        setSelectedLanguageToTranslate(newLanguageToTranslate)
        setTextToTranslate(newTextToTranslate)
        setSuggestionLanguage('')
        callTranslate(translatedText, newTranslateLanguage.value, newLanguageToTranslate.value)
    }

    const selectTranslateLanguage = (option: ValueType<Language>) => {
        setSelectedTranslateLanguage(option)
    }

    const selectLanguageToTranslate = (option: ValueType<Language>) => {
        setSelectedLanguageToTranslate(option)
    }

    const returnSuggestionLanguageLabel = () => languages?.find((language: Language) => language.value === suggestionLanguage)?.label

    useEffect(() => {
        instance.get('languages')
            .then(res => {
                const newLanguages: Language[] = []
                res.data?.forEach((language: ReceivedLanguage) => {
                    newLanguages.push({ label: language.name, value: language.code })
                })
                setLanguages(newLanguages)
            })
    }, [])

    return (
        <div className="container">
            <TranslateType isTranslateText={isTranslateText} setIsTranslateText={setIsTranslateText} />
            <div className="lang-selectors">
                <SelectLanguage options={languages ?? []}
                    selectValue={selectedTranslateLanguage} handleChange={selectTranslateLanguage} />
                <SwitchLanguages changeSourceAndTargetLanguages={changeSourceAndTargetLanguages} />
                <SelectLanguage options={languages?.filter(language => language.value !== selectedTranslateLanguage.value) ?? []}
                    selectValue={selectedLanguageToTranslate} handleChange={selectLanguageToTranslate} />
            </div>
            {isTranslateText ?
                <div className="translators-container">
                    <div className="left-translator-container">
                        <TranslatorTextArea textToTranslate={textToTranslate} suggestionLanguage={suggestionLanguage} selectedTranslateLanguage={selectedTranslateLanguage} loading={loading}
                            placeholder={"Digitar algo"} setTextToTranslate={setTextToTranslate} setTranslatedText={setTranslatedText}
                            setSuggestionLanguage={setSuggestionLanguage} setLoading={setLoading} callTranslate={callTranslate} />
                        {suggestionLanguage && suggestionLanguage !== selectedTranslateLanguage.value &&
                            <SuggestionButton suggestionLanguage={returnSuggestionLanguageLabel() ?? ''} translateBySuggestionLanguage={translateBySuggestionLanguage} />
                        }
                    </div>
                    <div>
                        <TranslatorTextArea translatedText={translatedText} placeholder={loading ? 'Traduzindo...' : "Tradução"} loading={loading} />
                    </div>
                </div>
                :
                <FileTranslator selectedLanguages={[selectedTranslateLanguage, selectedLanguageToTranslate]} loading={loading} setLoading={setLoading} />
            }
        </div>
    );
};

export default Container;