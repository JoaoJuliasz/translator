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
    left?: boolean
}


const SelectLanguage = ({ options, selectValue, handleChange, left }: SelectLanguageProps) => {

    const defaultBorder = '1px solid #dbdbdb'
    const textColor = '#6e6e6e'

    let width = window.screen.width;

    const selectStyle = {
        container: (styles: any) => ({ ...styles, position: 'inherit' }),
        control: (styles: any) => ({ ...styles, width: '100%', border: defaultBorder, borderRadius: '4px 4px 0px 0', borderBottom: 'none' }),
        singleValue: (styles: any) => ({ ...styles, color: textColor }),
        input: (styles: any) => ({ ...styles, color: textColor }),
        indicatorSeparator: (styles: any) => ({ ...styles, display: 'none' }),
        valueContainer: (styles: any) => ({ ...styles, padding: 'auto' }),
        menu: (styles: any) => ({ ...styles, border: defaultBorder, right: '0', left: '0', width:  width <= 719 ? '100%' : '80%', margin: '8px auto' }),
        menuList: (styles: any) => ({ ...styles, color: textColor, minWidth: '150px', display: "grid", gridTemplateColumns: width <= 410 ? 'auto auto auto' : 'auto auto auto auto' }),
        option: (styles: any, state: any) => ({ ...styles, cursor: 'pointer', padding: '8px 11px', background: state.isSelected ? '#525151' : (state.isFocused && '#676565'), color: (state.isSelected || state.isFocused) && '#fff' }),
    }

    console.warn(width <= 410 ? '100%' : '80%')

    return (
        <div className={`select-language-container ${left ? 'left' : 'right'}`}>
            <Select className='select-language' classNamePrefix="react-language" styles={selectStyle} options={options}
                value={selectValue}
                onChange={handleChange}
            />
        </div>
    );
};

export default SelectLanguage;