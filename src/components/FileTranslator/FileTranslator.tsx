import { useState } from 'react'
import instance from "../../config/config";
import { Language } from '../../types/types';

import './FileTranslator.styles.scss'

type FileTranslatorProps = {
    selectedLanguages: Language[]
    loading: boolean
    setLoading: (value: boolean) => void
}

const FileTranslator = ({ selectedLanguages, loading, setLoading }: FileTranslatorProps) => {
    const [fileToTranslate, setFileToTranslate] = useState<File | null>(null)
    const [fileTranslated, setFileTranslated] = useState<string>('')

    const translateUploadedFile = () => {
        if (fileToTranslate) {
            setLoading(true)
            let data = new FormData();
            fileToTranslate && data.append("file", fileToTranslate);
            data.append("source", selectedLanguages[0].value);
            data.append("target", selectedLanguages[1].value);
            instance.post('translate_file', data)
                .then(res => {
                    setFileTranslated(res.data.translatedFileUrl)
                    setLoading(false)
                })
        }
    }

    return (
        <div className="file-translator-container">
            <p>Supported file formats: .txt, .odt, .odp, .docx, .pptx, .epub, .html</p>
            <div className="upload-file-container">
                <label className="upload-button" htmlFor={'file-input'}>Select a file</label>
                <input id="file-input" onChange={(e) => {
                    if (e.target?.files && e.target.files[0]) {
                        setFileToTranslate(e?.target?.files[0])
                        setFileTranslated('')
                    }
                }} type="file" name="" accept=".txt, .odt, .odp, .docx, .pptx, .epub, .html" />
                <p>{fileToTranslate?.name}</p>
            </div>
            {!fileTranslated && !loading ?
                <button className="file-translator-btn" onClick={translateUploadedFile}>Translate</button> :
                (loading ? <span>translanting....</span> : <a className="file-translator-btn remove-decoration" href={fileTranslated} target="_blank">Download</a>)}
        </div>
    );
};

export default FileTranslator;