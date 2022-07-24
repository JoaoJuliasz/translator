import { shallow } from 'enzyme'
import TranslateType from './TranslateType'

describe('TranslateType', () => {

    const mockIsTranslateText = true
    const mockSetIsTranslateText = jest.fn()

    const wrapper = shallow(<TranslateType isTranslateText={mockIsTranslateText} setIsTranslateText={mockSetIsTranslateText}/>)

    it('should render translate-type-container div', () => {
        expect(wrapper.find('.translate-type-container').length).toEqual(1)
    })

    it('changeSourceAndTargetLanguages should be called', () => {
        const switchBtn = wrapper.find('[id="file-btn"]')
        switchBtn.simulate('click')
        expect(mockSetIsTranslateText).toBeCalled()
    })
})