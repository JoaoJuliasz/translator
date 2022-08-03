export type Language = {
    label: string
    value: string
}

export type ModalHandle = {
    openModal: () => void,
    close?: () => void,
}

export type ModalMap = {
    textToTranslate: string,
    translatedText: string,
    sourceLang: Language,
    targetLang: Language
}