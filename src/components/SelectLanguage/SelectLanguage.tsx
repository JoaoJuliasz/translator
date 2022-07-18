//Libs
import Select from 'react-select';
//@ts-ignore
import { ValueType } from "react-select/lib/types";

//utils
import { Language } from "../../types/types";

//styles
import './SelectLanguage.styles.scss';

type SelectLanguageProps = {
    options: Language[]
    selectValue: Language
    handleChange: (option: ValueType<Language>) => void
}

const SelectLanguage = ({ options, selectValue, handleChange }: SelectLanguageProps) => {

    const selectStyle = {
        control: (styles: any) => ({ ...styles, background: '#343434' }),
        singleValue: (styles: any) => ({ ...styles, color: '#fff' }),
        menuList: (styles: any) => ({ ...styles, background: '#343434', color: '#fff' }),
        option: (styles: any, state: any) => ({ ...styles, background: state.isSelected ? '#525151' : (state.isFocused && '#676565') }),
    }

    return (
        <div className="select-language-container">
            <Select styles={selectStyle} options={options}
                value={selectValue}
                onChange={handleChange}
            />
        </div>
    );
};

export default SelectLanguage;