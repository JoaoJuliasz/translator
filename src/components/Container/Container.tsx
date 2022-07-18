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
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

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
            instance.post('detect', {
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
            <div className="left-translator-container">
                <SelectLanguage options={languages ?? []}
                    selectValue={selectedTranslateLanguage} handleChange={selectTranslateLanguage} />

                <TranslatorTextArea textToTranslate={textToTranslate} suggestionLanguage={suggestionLanguage}
                    placeholder={"Digitar algo"} setTextToTranslate={setTextToTranslate} setTranslatedText={setTranslatedText}
                    setSuggestionLanguage={setSuggestionLanguage} translate={translate} />
                {suggestionLanguage && suggestionLanguage !== selectedTranslateLanguage.value &&
                    <SuggestionButton suggestionLanguage={returnSuggestionLanguageLabel() ?? ''} translateBySuggestionLanguage={translateBySuggestionLanguage} />
                }
            </div>
            <SwitchLanguages changeSourceAndTargetLanguages={changeSourceAndTargetLanguages} />
            <div>
                <SelectLanguage options={languages?.filter(language => language.value !== selectedTranslateLanguage.value) ?? []}
                    selectValue={selectedLanguageToTranslate} handleChange={selectLanguageToTranslate} />
                <TranslatorTextArea translatedText={translatedText} placeholder={loading ? 'Traduzindo...' : "Tradução"} loading={loading} />
            </div>
        </div>
    );
};

export default Container;