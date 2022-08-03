import React, { useRef } from 'react';
import ModalContainer from '../Modal'
import { StarOutlined, StarFilled, HistoryOutlined, SwapRightOutlined } from '@ant-design/icons';

import { ModalHandle, ModalMap } from "../../../types/types";

import './ButtonsModal.styles.scss'


type FavoriteModalProps = {
    modalType: string | null
    type: string
    openModal: (type: string, ref: React.RefObject<ModalHandle>) => void
    openTranslateByModal: (type: string, typeMap: ModalMap, ref: React.RefObject<ModalHandle>) => void
    clearModalInfos: (type: string, ref: React.RefObject<ModalHandle>) => void
}

const Favorite = ({ modalType, type, openModal, openTranslateByModal, clearModalInfos }: FavoriteModalProps) => {

    const ref = useRef<ModalHandle>(null)

    const isTextFavorited = (translatedText: string) => {
        const savedType = localStorage.getItem('favorites')
        const savedArr = savedType && JSON.parse(savedType)
        const favoriteIndex = savedArr?.findIndex((savedType: { translatedText: string }) => savedType.translatedText === translatedText)
        return favoriteIndex > -1
    }

    // const addToFavorite = (translatedText: string) => {
    //     const savedFavorites = localStorage.getItem('favorites')
    //     const favoritesArr = savedFavorites ? JSON.parse(savedFavorites) : []
    //     const favoriteIndex = favoritesArr.findIndex((favorite: { translatedText: string }) => favorite.translatedText === translatedText)

    //     if (translatedText) {
    //         if (favoriteIndex > -1) {
    //             favoritesArr.splice(favoriteIndex, 1)
    //         } else {
    //             favoritesArr.push(favorites)
    //         }
    //         localStorage.setItem('favorites', JSON.stringify(favoritesArr))
    //     }
    //     isTextFavorited()
    // }

    return (
        <div className="btns-modal-container">
            <span className="btn" onClick={() => openModal(type, ref)}>{type === 'favorites' ? <StarOutlined /> : <HistoryOutlined />}</span>
            <ModalContainer ref={ref}>
                <div className="modal-container">
                    <div className="clear-container">
                        <span onClick={() => clearModalInfos(type, ref)}>Limpar {type === 'favorites' ? 'Favoritos' : 'Histórico'}</span>
                    </div>
                    {modalType && JSON.parse(modalType).map((typeMap: ModalMap) =>
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
                            <div className="favorite-icon" onClick={() => console.warn('entrei aq ó')}>
                                {isTextFavorited(typeMap.translatedText) ? <StarFilled className="yellow" /> : <StarOutlined />}
                            </div>
                        </div>)}
                </div>
            </ModalContainer >
        </div >
    );
};

export default Favorite;