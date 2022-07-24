import { shallow } from 'enzyme'
import SuggestionButton from './SuggestionButton'

describe('SuggestionButton', () => {

    const mockSuggestionLanguage = 'Portuguese'
    const mockTranslateBySuggestionLanguage = jest.fn()

    const wrapper = shallow(<SuggestionButton suggestionLanguage={mockSuggestionLanguage} translateBySuggestionLanguage={mockTranslateBySuggestionLanguage} />)

    it('should render suggestion-container div', () => {
        expect(wrapper.find('.suggestion-container').length).toEqual(1) 
    })

    it('translateBySuggestionLanguage should be called', () => {
        const suggestionBtn = wrapper.find('.suggestion-btn')
        suggestionBtn.simulate('click')
        expect(mockTranslateBySuggestionLanguage).toBeCalled()
    })
})