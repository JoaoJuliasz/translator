import { useEffect, useState } from "react";
//Libs
// @ts-ignore
import { ValueType } from "react-select/lib/types";
import { faFile, faLanguage } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
    const [fileToTranslate, setFileToTranslate] = useState<File | null>(null)
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [isTranslateText, setIsTranslateText] = useState<boolean>(true)
    const [fileTranslated, setFileTranslated] = useState<string>('')

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

    const translateUploadedFile = () => {
        setLoading(true)
        let data = new FormData();
        fileToTranslate && data.append("file", fileToTranslate);
        data.append("source", selectedTranslateLanguage.value);
        data.append("target", selectedLanguageToTranslate.value);
        instance.post('translate_file', data)
            .then(res => {
                setFileTranslated(res.data.translatedFileUrl)
                setLoading(false)
            })
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
            <div>
                <h2>Translator</h2>
                <div style={{ width: '30%', display: 'flex', justifyContent: 'space-around', margin: 'auto' }}>
                    <button onClick={() => setIsTranslateText(true)} style={{ fontSize: '16px', background: isTranslateText ? '#e4ecfa' : '#fafafa', border: '1px solid #dadce0', color: '#1a73e8', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}><FontAwesomeIcon icon={faFile} /> Translate text</button>
                    <button onClick={() => setIsTranslateText(false)} style={{ fontSize: '16px', background: !isTranslateText ? '#e4ecfa' : '#fafafa', border: '1px solid #dadce0', color: '#1a73e8', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}><FontAwesomeIcon icon={faLanguage} /> Translate document</button>
                </div>
            </div>
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
                        <TranslatorTextArea textToTranslate={textToTranslate} suggestionLanguage={suggestionLanguage}
                            placeholder={"Digitar algo"} setTextToTranslate={setTextToTranslate} setTranslatedText={setTranslatedText}
                            setSuggestionLanguage={setSuggestionLanguage} translate={translate} />
                        {suggestionLanguage && suggestionLanguage !== selectedTranslateLanguage.value &&
                            <SuggestionButton suggestionLanguage={returnSuggestionLanguageLabel() ?? ''} translateBySuggestionLanguage={translateBySuggestionLanguage} />
                        }
                    </div>
                    <div>
                        <TranslatorTextArea translatedText={translatedText} placeholder={loading ? 'Traduzindo...' : "Tradução"} loading={loading} />
                    </div>
                </div>
                :
                <div style={{
                    border: '1px solid',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <p>Supported file formats: .txt, .odt, .odp, .docx, .pptx, .epub, .html</p>
                    <input onChange={(e) => {
                        if (e.target?.files && e.target.files[0]) {
                            setFileToTranslate(e?.target?.files[0])
                        }
                    }} type="file" name="" id="" accept=".txt, .odt, .odp, .docx, .pptx, .epub, .html" />
                    {!fileTranslated && !loading ? <button onClick={translateUploadedFile}>Translate</button> : (loading ? 'translanting....' : <a href={fileTranslated} target="_blank">Download</a>)}
                </div>
            }
        </div >
    );
};

export default Container;