import './FileTranslator.styles.scss'

type FileTranslatorProps = {
    fileToTranslate: File | null
    fileTranslated: string
    loading: boolean
    translateUploadedFile: () => void
    setFileToTranslate: (value: File | null) => void
}

const FileTranslator = ({ fileToTranslate, fileTranslated, loading, translateUploadedFile, setFileToTranslate }: FileTranslatorProps) => {
    return (
        <div className="file-translator-container">
            <p>Supported file formats: .txt, .odt, .odp, .docx, .pptx, .epub, .html</p>
            <div className="upload-file-container">
                <label className="upload-button" htmlFor={'file-input'}>Select a file</label>
                <input id="file-input" onChange={(e) => {
                    if (e.target?.files && e.target.files[0]) {
                        setFileToTranslate(e?.target?.files[0])
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