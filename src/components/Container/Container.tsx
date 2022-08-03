import { useEffect, useState, useRef } from "react";
//Libs
// @ts-ignore
import { ValueType } from "react-select/lib/types";
import { StarOutlined, HistoryOutlined, SwapRightOutlined } from '@ant-design/icons';
//utils
import instance from "../../config/config";
import { Language, ModalHandle, ModalMap } from "../../types/types";

//Components
import TranslatorTextArea from '../TranslatorTextArea/TranslatorTextArea';
import SuggestionButton from "../SuggestionButton/SuggestionButton";
import SwitchLanguages from "../SwitchLanguages/SwitchLanguages";
import SelectLanguage from "../SelectLanguage/SelectLanguage";
import TranslateType from '../TranslateType/TranslateType'
import FileTranslator from "../FileTranslator/FileTranslator";
import ButtonsModal from "../Modals/ButtonsModal/ButtonsModal";

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
    const [favorites, setFavorites] = useState<string | null>(null)
    const [translateHistory, setTranslateHistory] = useState<string | null>(null)

    const favoriteRef = useRef<ModalHandle>(null)
    const historyRef = useRef<ModalHandle>(null)

    const callTranslate = (searchText: string, sourceLang?: SelectedLanguage, targetLang?: SelectedLanguage) => {
        const source = sourceLang ?? selectedTranslateLanguage.value
        const target = targetLang ?? selectedLanguageToTranslate.value
        instance.post('translate', {
            q: searchText,
            source: source,
            target: target,
            format: "text"
        })
            .then(res => {
                const history = localStorage.getItem('history')
                const historyArr = history ? JSON.parse(history) : []
                const historyIndex = historyArr.findIndex((history: { translatedText: string }) => history.translatedText === translatedText)
                if (languages) {
                    const findSourceLanguage = languages?.findIndex(language => language.value === source)
                    const findTargetLanguage = languages?.findIndex(language => language.value === target)
                    historyIndex === -1 && languages && historyArr.unshift({ textToTranslate: searchText, translatedText: res.data.translatedText, sourceLang: languages[findSourceLanguage], targetLang: languages[findTargetLanguage] })
                }
                localStorage.setItem('history', JSON.stringify(historyArr))
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
        if (textToTranslate) {
            callTranslate(textToTranslate, suggestionLanguage, newLanguageToTranslate.value)
        }
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

    const openModal = (type: string, ref: React.RefObject<ModalHandle>) => {
        if (type === 'favorites') {
            setFavorites(localStorage.getItem('favorites'))
        } else {
            setTranslateHistory(localStorage.getItem('history'))
        }
        ref?.current?.openModal()
    }
    const openTranslateByModal = (type: string, typeMap: ModalMap, ref: React.RefObject<ModalHandle>) => {
        if (languages) {
            const findSourceLanguage = languages?.findIndex(language => language.value === typeMap.sourceLang.value)
            const findTargetLanguage = languages?.findIndex(language => language.value === typeMap.targetLang.value)
            setSelectedTranslateLanguage(languages[findSourceLanguage])
            setSelectedLanguageToTranslate(languages[findTargetLanguage])
            setTextToTranslate(typeMap.textToTranslate)
            callTranslate(typeMap.textToTranslate, typeMap.sourceLang.value, typeMap.targetLang.value)
        }
        ref.current?.close && ref.current?.close()
    }

    const clearModalInfos = (type: string, ref: React.RefObject<ModalHandle>) => {
        localStorage.setItem(type, '[]')
        if (type === 'favorites') {
            setFavorites('')
        } else {
            setTranslateHistory('')
        }
        ref.current?.close && ref.current?.close()
    }

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
                    selectValue={selectedLanguageToTranslate} handleChange={selectLanguageToTranslate} left={true} />
            </div>
            {isTranslateText ?
                <div className="translators-container">
                    <div className=" translator left-translator-container">
                        <TranslatorTextArea textToTranslate={textToTranslate} suggestionLanguage={suggestionLanguage} selectedTranslateLanguage={selectedTranslateLanguage} loading={loading}
                            placeholder={"Digitar algo"} setTextToTranslate={setTextToTranslate} setTranslatedText={setTranslatedText}
                            setSuggestionLanguage={setSuggestionLanguage} setLoading={setLoading} callTranslate={callTranslate} />
                        {suggestionLanguage && suggestionLanguage !== selectedTranslateLanguage.value &&
                            <SuggestionButton suggestionLanguage={returnSuggestionLanguageLabel() ?? ''} translateBySuggestionLanguage={translateBySuggestionLanguage} />
                        }
                    </div>
                    <div className="translator right-translator-container">
                        <TranslatorTextArea translatedText={translatedText} placeholder={loading ? 'Traduzindo...' : "Tradução"} loading={loading}
                            favorites={{ textToTranslate, translatedText, sourceLang: selectedTranslateLanguage, targetLang: selectedLanguageToTranslate }} />
                    </div>
                </div>
                :
                <FileTranslator selectedLanguages={[selectedTranslateLanguage, selectedLanguageToTranslate]} loading={loading} setLoading={setLoading} />
            }
            <div style={{ display: 'flex', justifyContent: 'space-around', width: '150px', margin: '10px auto' }}>
                <ButtonsModal modalType={favorites} type="favorites" openModal={openModal} openTranslateByModal={openTranslateByModal} clearModalInfos={clearModalInfos} />
                <ButtonsModal modalType={translateHistory} type="history" openModal={openModal} openTranslateByModal={openTranslateByModal} clearModalInfos={clearModalInfos} />
            </div>
        </div >
    );
};

export default Container;