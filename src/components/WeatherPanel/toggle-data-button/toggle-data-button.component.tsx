import { InputSwitch } from "primereact/inputswitch";
import { useDispatch, useSelector } from "react-redux";
import { selectToggleDataButtonChecked } from "../../../store/settings/settings.selector";
import { updateToggleDataButtonChecked } from "../../../store/settings/settings.action";

const ToggleDataButton = () => {
    const toggleDataButtonChecked = useSelector(selectToggleDataButtonChecked);
    const dispatch = useDispatch<any>();
    
    const onToggleChange = (e: any) => {
        dispatch(updateToggleDataButtonChecked(e.value));
    }

    return (
        <div style={{ display: 'flex', flex: 1, textAlign: 'left' }}>
            <InputSwitch inputId="input-metakey" checked={toggleDataButtonChecked} onChange={(e) => onToggleChange(e)} />
            <span style={{ marginLeft: "5px", fontSize: '11px'}}> Mostrar selecionados</span>
        </div>
    )
}

export default ToggleDataButton;