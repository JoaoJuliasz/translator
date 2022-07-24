import { shallow } from 'enzyme'
import SelectLanguage from './SelectLanguage'

describe('SelectLanguage', () => {

    const mockOptions = [{ value: 'en', label: 'English' }, { value: 'pt', label: 'Portuguese' }]
    const mockSelectValue = { value: 'en', label: 'English' }
    const mockHandleChange = jest.fn()

    const wrapper = shallow(<SelectLanguage options={mockOptions} selectValue={mockSelectValue} handleChange={mockHandleChange} />)

    it('should render select-language-container div', () => {
        expect(wrapper.find('.select-language-container').length).toEqual(1)
    })

    it('should trigger select change', () => {
        const select = wrapper.find('.select-language')
        select.simulate('change', { target: { value: { value: 'pt', label: 'Portuguese' } } })
        expect(mockHandleChange).toHaveBeenCalled()
        setTimeout(() => {
            expect(select.props().value).toStrictEqual({ value: 'pt', label: 'Portuguese' })
        }, 500)
    })
})