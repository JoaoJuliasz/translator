//libs
import { SwapOutlined } from '@ant-design/icons';
//styles
import './SwitchLanguages.styles.scss'

type SwitchLanguagesProps = {
    changeSourceAndTargetLanguages: () => void
}

const SwitchLanguages = ({changeSourceAndTargetLanguages}: SwitchLanguagesProps) => {
    return (
        <div className="switch-lang-container">
            <button className="switch-lang-btn" onClick={changeSourceAndTargetLanguages}><SwapOutlined /></button>
        </div>
    );
};

export default SwitchLanguages;