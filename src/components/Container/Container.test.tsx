import { shallow } from 'enzyme'
import SelectLanguage from '../SelectLanguage/SelectLanguage'
import TranslatorTextArea from '../TranslatorTextArea/TranslatorTextArea';
import SuggestionButton from "../SuggestionButton/SuggestionButton";
import SwitchLanguages from "../SwitchLanguages/SwitchLanguages";
import TranslateType from '../TranslateType/TranslateType'
import Container from './Container'
import FileTranslator from '../FileTranslator/FileTranslator';

describe('Container', () => {
    let wrapper = shallow(<Container />)

    it('should render container div', () => {
        expect(wrapper.find('.container').length).toEqual(1)
    })

    it('should render the SelectLanguage Component', () => {
        expect(wrapper.find(SelectLanguage)).toHaveLength(2);
    });

    it('should render the TranslatorTextArea Component', () => {
        expect(wrapper.find(TranslatorTextArea)).toHaveLength(2);
    });

    it('should not render the SuggestionButton Component', () => {
        expect(wrapper.find(SuggestionButton)).toHaveLength(0);
    });
    it('should render the SwitchLanguages Component', () => {
        expect(wrapper.find(SwitchLanguages)).toHaveLength(1);
    });
    it('should render the TranslateType Component', () => {
        expect(wrapper.find(TranslateType)).toHaveLength(1);
    });
    it('should not render the FileTranslator Component', () => {
        expect(wrapper.find(FileTranslator)).toHaveLength(0);
    });
})