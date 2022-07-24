import { shallow } from 'enzyme'
import TranslatorTextArea from './TranslatorTextArea'

describe('TranslatorTextArea', () => {

    const mockTextToTranslate = ''
    const mockTranslatedText = ''
    const mockSuggestionLanguage = ''
    const mockPlaceholder = 'Digitar algo'
    const mockLoading = false
    const mockSetTranslatedText = jest.fn()
    const mockSetTextToTranslate = jest.fn()
    const mockSetSuggestionLanguage = jest.fn()
    const mockTranslate = jest.fn()

    const wrapperTextToTranslate = shallow(<TranslatorTextArea textToTranslate={mockTextToTranslate} suggestionLanguage={mockSuggestionLanguage}
        placeholder={mockPlaceholder} loading={mockLoading} setTextToTranslate={mockSetTextToTranslate} setSuggestionLanguage={mockSetSuggestionLanguage} translate={mockTranslate} />)

    const wrapperTranslatedText = shallow(<TranslatorTextArea translatedText={mockTranslatedText} suggestionLanguage={mockSuggestionLanguage}
        placeholder={mockPlaceholder} setTranslatedText={mockSetTranslatedText} />)

    it('should render TranslatorTextArea translator-text-area-container text to translate', () => {
        expect(wrapperTextToTranslate.find('.translator-text-area-container').length).toEqual(1)
    })
    it('should render TranslatorTextArea translator-text-area-container translated text', () => {
        expect(wrapperTranslatedText.find('.translator-text-area-container').length).toEqual(1)
    })

    it('trigger translate function', () => {
        const textAreaTextToTranslate = wrapperTextToTranslate.find('.translator-text-area')
        const textAreaTranslatedText = wrapperTranslatedText.find('.translator-text-area')
        textAreaTextToTranslate.simulate('change', {target: {value: 'good morning'}})
        expect(mockTranslate).toBeCalled()
        setTimeout(() => {
            expect(textAreaTranslatedText.prop('value')).toStrictEqual("bom dia")
        }, 500)

    })
})