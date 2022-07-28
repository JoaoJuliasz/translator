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
        control: (styles: any) => ({ ...styles, width: '100%', border: '1px solid #c5bcbc' }),
        // control: (styles: any) => ({ ...styles, background: '#343434', width: '100%' }),
        singleValue: (styles: any) => ({ ...styles, color: '#6e6e6e' }),
        input: (styles: any) => ({ ...styles, color: '#6e6e6e' }),
        indicatorSeparator: (styles: any) => ({ ...styles, display: 'none' }),
        valueContainer: (styles: any) => ({ ...styles, padding: 'auto' }),
        menuList: (styles: any) => ({ ...styles, color: '#6e6e6e', minWidth: '150px' }),
        // menuList: (styles: any) => ({ ...styles, background: '#343434', color: '#fff', minWidth: '150px' }),
        option: (styles: any, state: any) => ({ ...styles, background: state.isSelected ? '#525151' : (state.isFocused && '#676565'), color: (state.isSelected || state.isFocused) && '#fff'}),
    }

    return (
        <div className="select-language-container">
            <Select className="select-language" styles={selectStyle} options={options}
                value={selectValue}
                onChange={handleChange}
            />
        </div>
    );
};

export default SelectLanguage;