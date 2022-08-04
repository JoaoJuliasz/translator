import React, { useRef } from 'react';
import ModalContainer from '../Modal'
import { StarOutlined, StarFilled, HistoryOutlined, SwapRightOutlined } from '@ant-design/icons';

import { ModalHandle, ModalMap } from "../../../types/types";

import './ButtonsModal.styles.scss'


type FavoriteModalProps = {
    modalType: string | null
    type: string
    setFavorites: (value: string) => void
    openModal: (type: string, ref: React.RefObject<ModalHandle>) => void
    openTranslateByModal: (type: string, typeMap: ModalMap, ref: React.RefObject<ModalHandle>) => void
    clearModalInfos: (type: string, ref: React.RefObject<ModalHandle>) => void
}

const Favorite = ({ modalType, type, setFavorites, openModal, openTranslateByModal, clearModalInfos }: FavoriteModalProps) => {

    const ref = useRef<ModalHandle>(null)

    const modalTypeArr = modalType ? JSON.parse(modalType) : []

    const isTextFavorited = (translatedText: string) => {
        const savedType = localStorage.getItem('favorites')
        const savedArr = savedType && JSON.parse(savedType)
        const favoriteIndex = savedArr?.findIndex((savedType: { translatedText: string }) => savedType.translatedText === translatedText)
        return favoriteIndex > -1
    }

    const addToFavorite = (translatedText: string, typeMap: ModalMap) => {
        const savedFavorites = localStorage.getItem('favorites')
        const favoritesArr = savedFavorites ? JSON.parse(savedFavorites) : []
        const favoriteIndex = favoritesArr.findIndex((favorite: { translatedText: string }) => favorite.translatedText === translatedText)

        if (translatedText) {
            if (favoriteIndex > -1) {
                favoritesArr.splice(favoriteIndex, 1)
            } else {
                favoritesArr.push(typeMap)
            }
            localStorage.setItem('favorites', JSON.stringify(favoritesArr))
            setFavorites(JSON.stringify(favoritesArr))
        }
        isTextFavorited(translatedText)
    }

    return (
        <div className="btns-modal-container">
            <span className="btn" onClick={() => openModal(type, ref)}>{type === 'favorites' ? <StarOutlined /> : <HistoryOutlined />}</span>
            <ModalContainer ref={ref}>
                <div className="modal-container">
                    <div className="clear-container">
                        <span onClick={() => clearModalInfos(type, ref)}>Limpar {type === 'favorites' ? 'Favoritos' : 'Histórico'}</span>
                    </div>
                    {modalTypeArr.length > 0 ? modalTypeArr.map((typeMap: ModalMap) =>
                        <div className="modal-values-container" onClick={() => openTranslateByModal(type, typeMap, ref)}>
                            <div className="lang-container">
                                <span>{typeMap?.sourceLang?.label}</span>
                                <SwapRightOutlined />
                                <span>{typeMap?.targetLang?.label}</span>
                            </div>
                            <div className="values-container">
                                <span className="values to-translate">{typeMap.textToTranslate}</span>
                                <span className="values translated">{typeMap.translatedText}</span>
                            </div>
                            <div className="favorite-icon" onClick={(e) => {
                                console.warn('entrei aq ó')
                                addToFavorite(typeMap.translatedText, typeMap)
                                if (e.stopPropagation) e.stopPropagation();
                            }}>
                                {isTextFavorited(typeMap.translatedText) ? <StarFilled className="yellow" /> : <StarOutlined />}
                            </div>
                        </div>) :
                        <div className="no-content-container">
                            <h2>There is no translations</h2>
                            <div />
                        </div>}
                </div>
            </ModalContainer>
        </div >
    );
};

export default Favorite;