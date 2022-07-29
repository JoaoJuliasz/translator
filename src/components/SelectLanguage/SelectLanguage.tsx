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

    const defaultBorder = '1px solid #dbdbdb'
    const textColor = '#6e6e6e'

    let width = window.screen.width;

    const selectStyle = {
        container: (styles: any) => ({ ...styles, position: 'inherit' }),
        control: (styles: any) => ({ ...styles, width: '100%', border: defaultBorder }),
        singleValue: (styles: any) => ({ ...styles, color: textColor }),
        input: (styles: any) => ({ ...styles, color: textColor }),
        indicatorSeparator: (styles: any) => ({ ...styles, display: 'none' }),
        valueContainer: (styles: any) => ({ ...styles, padding: 'auto' }),
        menu: (styles: any) => ({ ...styles, border: defaultBorder, right: '0', left: '0' }),
        menuList: (styles: any) => ({ ...styles, color: textColor, minWidth: '150px', display: "grid", gridTemplateColumns: width <= 410 ? 'auto auto auto' : 'auto auto auto auto' }),
        option: (styles: any, state: any) => ({ ...styles, cursor: 'pointer', background: state.isSelected ? '#525151' : (state.isFocused && '#676565'), color: (state.isSelected || state.isFocused) && '#fff' }),
    }

    return (
        <div className="select-language-container">
            <Select className="select-language" classNamePrefix="react-language" styles={selectStyle} options={options}
                value={selectValue}
                onChange={handleChange}
            />
        </div>
    );
};

export default SelectLanguage;