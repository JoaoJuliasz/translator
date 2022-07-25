import { shallow } from 'enzyme'
import FileTranslator from './FileTranslator'

describe('FileTranslator', () => {
    const mockOptions = [{ value: 'en', label: 'English' }, { value: 'pt', label: 'Portuguese' }]
    const mockLoading = false
    const mockSetLoading = jest.fn()

    const wrapper = shallow(<FileTranslator selectedLanguages={mockOptions} loading={mockLoading} setLoading={mockSetLoading} />)

    it('should render file-translator-container div', () => {
        expect(wrapper.find('.file-translator-container').length).toEqual(1)
    })

    it('should not render download button', () => {
        expect(wrapper.find('.remove-decoration').length).toEqual(0)
    })

    it('shoud simulate input change', () => {
        wrapper.find('[id="file-input"]').simulate('change', {
            target: {
                files: [
                    'dummyValue.something'
                ]
            }
        });
        wrapper.find('.file-translator-btn').simulate('click')
        expect(mockSetLoading).toBeCalled()
    })

})