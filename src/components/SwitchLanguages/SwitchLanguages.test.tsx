import { shallow } from 'enzyme'
import SwitchLanguages from './SwitchLanguages'

describe('SwitchLanguages', () => {

    const mockChangeSourceAndTargetLanguages = jest.fn()

    const wrapper = shallow(<SwitchLanguages changeSourceAndTargetLanguages={mockChangeSourceAndTargetLanguages}/>)

    it('should render switch-lang-container div', () => {
        expect(wrapper.find('.switch-lang-container').length).toEqual(1)
    })

    it('changeSourceAndTargetLanguages should be called', () => {
        const switchBtn = wrapper.find('.switch-lang-btn')
        switchBtn.simulate('click')
        expect(mockChangeSourceAndTargetLanguages).toBeCalled()
    })
})